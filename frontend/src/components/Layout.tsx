import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, ArrowLeftRight, RefreshCw } from "lucide-react";
import { useState } from "react";
import { syncTransactions } from "../api";
import "./Layout.css";

export default function Layout() {
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage("");
    try {
      const result = await syncTransactions();
      setSyncMessage(`Synced: +${result.added_count} added, ${result.modified_count} modified, ${result.removed_count} removed`);
      // Trigger page reload to show new data
      window.dispatchEvent(new Event("wisexpense:sync"));
      setTimeout(() => setSyncMessage(""), 4000);
    } catch (err) {
      setSyncMessage("Sync failed. Try again.");
      setTimeout(() => setSyncMessage(""), 4000);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">💰</span>
            <span className="logo-text">WiseXpense</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/transactions" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <ArrowLeftRight size={18} />
            <span>Transactions</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className={`sync-btn ${syncing ? "syncing" : ""}`} onClick={handleSync} disabled={syncing}>
            <RefreshCw size={16} className={syncing ? "spin" : ""} />
            <span>{syncing ? "Syncing..." : "Sync Transactions"}</span>
          </button>
          {syncMessage && <p className="sync-message">{syncMessage}</p>}
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
