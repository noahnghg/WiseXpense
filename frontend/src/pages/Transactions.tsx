import { useEffect, useState, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, Trash2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getTransactions, deleteTransaction, type Transaction } from "../api";
import "./Transactions.css";

const formatCategory = (cat: string) =>
  cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const formatCurrency = (amount: number, currency?: string) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currency || "CAD",
    minimumFractionDigits: 2,
  }).format(amount);

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const pageSize = 25;

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTransactions({
        page,
        page_size: pageSize,
        search: search || undefined,
        category: category || undefined,
      });
      setTransactions(data.transactions);
      setTotal(data.total);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => {
    fetchTransactions();
    const handleSync = () => fetchTransactions();
    window.addEventListener("wisexpense:sync", handleSync);
    return () => window.removeEventListener("wisexpense:sync", handleSync);
  }, [fetchTransactions]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [search, category]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      fetchTransactions();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  // Extract unique categories from transactions
  const categories = [...new Set(
    transactions
      .map((t) => t.category_primary)
      .filter(Boolean) as string[]
  )].sort();

  return (
    <div className="transactions-page animate-fade-in">
      <div className="transactions-header">
        <div>
          <h1>Transactions</h1>
          <p className="transactions-subtitle">{total} total transactions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or merchant..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="category-filter"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{formatCategory(cat)}</option>
          ))}
        </select>
      </div>

      {/* Transactions Table */}
      <div className="txn-table-wrap">
        {loading ? (
          <div className="table-loading">
            <div className="status-spinner" style={{ width: 24, height: 24 }} />
          </div>
        ) : transactions.length === 0 ? (
          <div className="table-empty">
            <p>No transactions found.</p>
          </div>
        ) : (
          <table className="txn-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Category</th>
                <th>Date</th>
                <th>Channel</th>
                <th className="text-right">Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id}>
                  <td>
                    <div className="txn-cell">
                      {txn.logo_url ? (
                        <img src={txn.logo_url} alt="" className="txn-logo-sm" />
                      ) : (
                        <div className="txn-logo-sm-placeholder">
                          {(txn.merchant_name || txn.name).charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="txn-cell-info">
                        <span className="txn-cell-name">{txn.merchant_name || txn.name}</span>
                        {txn.merchant_name && txn.merchant_name !== txn.name && (
                          <span className="txn-cell-sub">{txn.name}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    {txn.category_primary ? (
                      <span className="category-badge">
                        {formatCategory(txn.category_primary)}
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="text-muted">
                    {new Date(txn.date).toLocaleDateString("en-CA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="text-muted" style={{ textTransform: "capitalize" }}>
                    {txn.payment_channel || "—"}
                  </td>
                  <td className="text-right">
                    <span className={`amount-cell ${txn.amount < 0 ? "income" : "expense"}`}>
                      {txn.amount < 0 ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                      {formatCurrency(Math.abs(txn.amount), txn.iso_currency_code || undefined)}
                    </span>
                    {txn.pending && <span className="pending-badge">Pending</span>}
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(txn.id)} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <span className="page-info">
            Page {page} of {totalPages}
          </span>
          <button
            className="page-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
