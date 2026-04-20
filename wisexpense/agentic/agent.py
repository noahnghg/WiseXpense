import os
from typing import Annotated, Literal, TypedDict
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain_core.tools import tool
try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    from langchain_openai import ChatOpenAI
    from langchain_anthropic import ChatAnthropic
except ImportError:
    pass

from wisexpense.core.config import get_settings
from wisexpense.transactions.repository import get_spending_summary
from wisexpense.core.database import SessionLocal

class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]

@tool
def check_spending_summary() -> str:
    """Check the user's spending summary across all time."""
    db = SessionLocal()
    try:
        summary = get_spending_summary(db)
        return (
            f"Total Spending: ${summary['total_spending']}\n"
            f"Total Income: ${summary['total_income']}\n"
            f"Net: ${summary['net']}\n"
            f"Total Transactions: {summary['transaction_count']}"
        )
    except Exception as e:
        return f"Error fetching summary: {str(e)}"
    finally:
        db.close()


tools = [check_spending_summary]


def get_llm():
    settings = get_settings()
    provider = settings.AI_PROVIDER.lower()
    api_key = settings.AI_API_KEY
    
    if provider == "openai":
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(model="gpt-4o", api_key=api_key).bind_tools(tools)
    elif provider == "claude":
        from langchain_anthropic import ChatAnthropic
        return ChatAnthropic(model="claude-3-haiku-20240307", api_key=api_key).bind_tools(tools)
    elif provider == "gemini":
        from langchain_google_genai import ChatGoogleGenerativeAI
        if "GOOGLE_API_KEY" not in os.environ:
            os.environ["GOOGLE_API_KEY"] = api_key
        return ChatGoogleGenerativeAI(model="gemini-1.5-flash").bind_tools(tools)
    elif provider == "ollama":
        try:
            from langchain_community.chat_models import ChatOllama
            return ChatOllama(model="llama3").bind_tools(tools)
        except ImportError:
            raise ImportError("Please install langchain-community to use Ollama")
    else:
        # Default to Gemini if not proper
        from langchain_google_genai import ChatGoogleGenerativeAI
        if "GOOGLE_API_KEY" not in os.environ:
            os.environ["GOOGLE_API_KEY"] = api_key
        return ChatGoogleGenerativeAI(model="gemini-1.5-flash").bind_tools(tools)


def chatbot(state: AgentState):
    llm = get_llm()
    response = llm.invoke(state["messages"])
    return {"messages": [response]}


def create_graph():
    graph_builder = StateGraph(AgentState)
    graph_builder.add_node("chatbot", chatbot)
    try:
        from langgraph.prebuilt import ToolNode
        tool_node = ToolNode(tools=tools)
        graph_builder.add_node("tools", tool_node)
        
        from langgraph.prebuilt import tools_condition
        graph_builder.add_conditional_edges("chatbot", tools_condition)
        graph_builder.add_edge("tools", "chatbot")
    except Exception:
        pass
    
    graph_builder.add_edge(START, "chatbot")
    return graph_builder.compile()

graph = create_graph()

def invoke_agent(user_input: str) -> str:
    try:
        response = graph.invoke({"messages": [HumanMessage(content=user_input)]})
        return response["messages"][-1].content
    except Exception as e:
        return f"Agent error: {str(e)}"
