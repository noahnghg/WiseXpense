import { useEffect, useState, useCallback } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getTransactionSummary, getTransactions, type TransactionSummaryResponse, type Transaction } from "../api";
import AgentChat from "../components/AgentChat";
import "./Dashboard.css";

const CATEGORY_COLORS: Record<string, string> = {
  FOOD_AND_DRINK: "#00d68f",
  TRANSPORTATION: "#4d8eff",
  SHOPPING: "#9d6eff",
  ENTERTAINMENT: "#ff4d6a",
  RENT_AND_UTILITIES: "#ffb84d",
  TRAVEL: "#4dd4e6",
  PERSONAL_CARE: "#ff6eb4",
  GENERAL_SERVICES: "#7b8cff",
  GENERAL_MERCHANDISE: "#ff9f43",
  TRANSFER: "#636e72",
};

const formatCategory = (cat: string) =>
  cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const formatCurrency = (amount: number, currency?: string) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currency || "CAD",
    minimumFractionDigits: 2,
  }).format(amount);

export default function Dashboard() {
  const [summary, setSummary] = useState<TransactionSummaryResponse | null>(null);
  const [recentTxns, setRecentTxns] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [summaryData, txnData] = await Promise.all([
        getTransactionSummary(),
        getTransactions({ page: 1, page_size: 10 }),
      ]);
      setSummary(summaryData);
      setRecentTxns(txnData.transactions);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const handleSync = () => fetchData();
    window.addEventListener("wisexpense:sync", handleSync);
    return () => window.removeEventListener("wisexpense:sync", handleSync);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="status-spinner" style={{ width: 32, height: 32 }} />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!summary || summary.transaction_count === 0) {
    return (
      <div className="dashboard-empty animate-fade-in">
        <div className="empty-icon">📊</div>
        <h2>No transactions yet</h2>
        <p>Click "Sync Transactions" in the sidebar to pull your latest bank data.</p>
      </div>
    );
  }

  const pieData = (summary.category_breakdown || []).slice(0, 8).map((cat) => ({
    name: formatCategory(cat.category),
    value: Math.round(cat.total * 100) / 100,
    color: CATEGORY_COLORS[cat.category] || "#636e72",
  }));

  return (
    <div className="dashboard animate-fade-in">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Your financial overview</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card spending">
          <div className="card-icon-wrap spending-icon">
            <TrendingDown size={20} />
          </div>
          <div className="card-content">
            <span className="card-label">Total Spending</span>
            <span className="card-value">{formatCurrency(summary.total_spending)}</span>
          </div>
        </div>

        <div className="summary-card income">
          <div className="card-icon-wrap income-icon">
            <TrendingUp size={20} />
          </div>
          <div className="card-content">
            <span className="card-label">Total Income</span>
            <span className="card-value">{formatCurrency(summary.total_income)}</span>
          </div>
        </div>

        <div className="summary-card net">
          <div className="card-icon-wrap net-icon">
            <DollarSign size={20} />
          </div>
          <div className="card-content">
            <span className="card-label">Net</span>
            <span className={`card-value ${summary.net >= 0 ? "positive" : "negative"}`}>
              {formatCurrency(summary.net)}
            </span>
          </div>
        </div>

        <div className="summary-card count">
          <div className="card-icon-wrap count-icon">
            <CreditCard size={20} />
          </div>
          <div className="card-content">
            <span className="card-label">Transactions</span>
            <span className="card-value">{summary.transaction_count}</span>
          </div>
        </div>
      </div>

      {pieData.length > 0 && (
      <div className="charts-row">
        {/* Category Breakdown Pie */}
        <div className="chart-card">
          <h3 className="chart-title">Spending by Category</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                    fontSize: "0.85rem",
                  }}
                  formatter={(value: any) => formatCurrency(Number(value))}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            {pieData.map((entry, i) => (
              <div key={i} className="legend-item">
                <span className="legend-dot" style={{ background: entry.color }} />
                <span className="legend-label">{entry.name}</span>
                <span className="legend-value">{formatCurrency(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Bar Chart */}
        <div className="chart-card">
          <h3 className="chart-title">Top Categories</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={(summary.category_breakdown || []).slice(0, 6).map((cat) => ({
                  name: formatCategory(cat.category).split(" ").slice(0, 2).join(" "),
                  amount: Math.round(cat.total * 100) / 100,
                  fill: CATEGORY_COLORS[cat.category] || "#636e72",
                }))}
                layout="vertical"
                margin={{ left: 10, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "var(--text-muted)", fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <YAxis type="category" dataKey="name" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} width={100} />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                    fontSize: "0.85rem",
                  }}
                  formatter={(value: any) => formatCurrency(Number(value))}
                />
                <Bar dataKey="amount" radius={[0, 6, 6, 0]} barSize={24}>
                  {(summary.category_breakdown || []).slice(0, 6).map((cat, i) => (
                    <Cell key={i} fill={CATEGORY_COLORS[cat.category] || "#636e72"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      )}

      {/* Agent & Recent Transactions Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginTop: "2rem" }}>
        
        {/* Agent Chat */}
        <div className="agent-section" style={{ minWidth: 0 }}>
          <AgentChat />
        </div>

        {/* Recent Transactions */}
        <div className="recent-section" style={{ marginTop: 0, minWidth: 0 }}>
          <div className="section-header">
            <h3>Recent Transactions</h3>
            <a href="/transactions" className="view-all">View all →</a>
          </div>
          <div className="txn-list">
            {recentTxns.map((txn) => (
              <div key={txn.id} className="txn-row">
                <div className="txn-left">
                  <div className="txn-logo-placeholder">
                    {(txn.payee || txn.description).charAt(0).toUpperCase()}
                  </div>
                  <div className="txn-info">
                    <span className="txn-name">{txn.payee || txn.description}</span>
                  </div>
                </div>
                <div className="txn-right">
                  <span className={`txn-amount ${txn.amount > 0 ? "income" : "expense"}`}>
                    {txn.amount > 0 ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}
                    {formatCurrency(Math.abs(txn.amount), txn.currency || undefined)}
                  </span>
                  <span className="txn-date">{new Date(txn.date).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
