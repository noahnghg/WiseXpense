from fastapi import APIRouter
from pydantic import BaseModel
from wisexpense.agentic.agent import invoke_agent

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def chat_with_agent(req: ChatRequest):
    response = invoke_agent(req.message)
    return {"response": response}
