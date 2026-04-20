import "./ConnectBank.css";

export default function ConnectBank() {
  return (
    <div className="connect-bank-container">
      <div className="connect-card">
        <h1>Welcome to WiseXpense</h1>
        <p>Your agentic financial manager is ready to go.</p>
        <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>
          Please complete setup in your terminal:
        </p>
        <pre style={{ 
          background: "var(--bg-secondary)", 
          padding: "1rem", 
          borderRadius: "8px",
          marginTop: "1rem",
          textAlign: "left"
        }}>
          <code>
            wisexpense setup<br/>
            wisexpense start
          </code>
        </pre>
        <button 
          className="btn-primary" 
          style={{ marginTop: "2rem" }}
          onClick={() => window.location.reload()}
        >
          I've completed setup
        </button>
      </div>
    </div>
  );
}
