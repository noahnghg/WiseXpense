import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPlaidStatus } from "./api";
import ConnectBank from "./pages/ConnectBank";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Layout from "./components/Layout";

function App() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const checkStatus = async () => {
    try {
      const status = await getPlaidStatus();
      setConnected(status.connected);
    } catch {
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        color: "var(--text-secondary)",
        fontSize: "1.1rem",
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        connected ? <Navigate to="/dashboard" replace /> : <Navigate to="/connect" replace />
      } />
      <Route path="/connect" element={<ConnectBank onConnected={() => { setConnected(true); }} />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
      </Route>
    </Routes>
  );
}

export default App;
