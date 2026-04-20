import { useState } from "react";
import { chatWithAgent } from "../api";
import "./AgentChat.css";

export default function AgentChat() {
  const [messages, setMessages] = useState<{ role: "user" | "agent"; text: string }[]>([
    { role: "agent", text: "Hello! I am your AI financial agent. Ask me anything about your spending." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await chatWithAgent(userMsg);
      setMessages(prev => [...prev, { role: "agent", text: res.response }]);
    } catch {
      setMessages(prev => [...prev, { role: "agent", text: "Sorry, I ran into an error." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="agent-chat-container">
      <div className="chat-header">
        <h3>🧠 Agentic Assistant</h3>
      </div>
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-message ${m.role}`}>
            <div className="message-bubble">{m.text}</div>
          </div>
        ))}
        {loading && <div className="chat-message agent"><div className="message-bubble typing">Thinking...</div></div>}
      </div>
      <div className="chat-input-area">
        <input 
          type="text" 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Ask about your finances..."
        />
        <button onClick={handleSend} disabled={loading || !input.trim()}>Send</button>
      </div>
    </div>
  );
}
