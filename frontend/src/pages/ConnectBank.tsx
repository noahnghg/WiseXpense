import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useNavigate } from "react-router-dom";
import { createLinkToken, exchangePublicToken, syncTransactions } from "../api";
import "./ConnectBank.css";

interface ConnectBankProps {
  onConnected: () => void;
}

export default function ConnectBank({ onConnected }: ConnectBankProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "linking" | "syncing" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await createLinkToken();
        setLinkToken(token);
      } catch (err) {
        setErrorMsg("Failed to initialize Plaid. Make sure you ran 'wisexpense setup'.");
        setStatus("error");
      }
    };
    fetchToken();
  }, []);

  const onSuccess = useCallback(async (publicToken: string) => {
    setStatus("linking");
    try {
      await exchangePublicToken(publicToken);
      setStatus("syncing");
      await syncTransactions();
      setStatus("done");
      onConnected();
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setErrorMsg("Failed to connect bank. Please try again.");
      setStatus("error");
    }
  }, [navigate, onConnected]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  return (
    <div className="connect-page">
      <div className="connect-container animate-slide-up">
        {/* Decorative elements */}
        <div className="connect-glow connect-glow-1" />
        <div className="connect-glow connect-glow-2" />

        <div className="connect-card">
          <div className="connect-icon">🏦</div>
          <h1 className="connect-title">Connect Your Bank</h1>
          <p className="connect-description">
            Link your bank account to automatically track your spending,
            categorize transactions, and get financial insights.
          </p>

          <div className="connect-features">
            <div className="connect-feature">
              <span className="feature-icon">🇺🇸</span>
              <span>US Banks</span>
            </div>
            <div className="connect-feature">
              <span className="feature-icon">🇨🇦</span>
              <span>Canadian Banks</span>
            </div>
            <div className="connect-feature">
              <span className="feature-icon">🔒</span>
              <span>Bank-level Security</span>
            </div>
          </div>

          {status === "error" && (
            <div className="connect-error">
              ⚠️ {errorMsg}
            </div>
          )}

          {status === "linking" && (
            <div className="connect-status">
              <div className="status-spinner" />
              <span>Connecting your bank...</span>
            </div>
          )}

          {status === "syncing" && (
            <div className="connect-status">
              <div className="status-spinner" />
              <span>Syncing transactions...</span>
            </div>
          )}

          {status === "done" && (
            <div className="connect-status connect-success">
              ✅ Connected! Redirecting to dashboard...
            </div>
          )}

          {(status === "idle" || status === "error") && (
            <button
              className="connect-btn"
              onClick={() => open()}
              disabled={!ready || !linkToken}
            >
              {!ready || !linkToken ? "Initializing..." : "Connect Bank Account"}
            </button>
          )}

          <p className="connect-footer">
            Powered by Plaid · Your credentials are never stored
          </p>
        </div>
      </div>
    </div>
  );
}
