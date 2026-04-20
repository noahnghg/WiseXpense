import { useEffect, useState, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, Trash2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getTransactions, deleteTransaction, type Transaction } from "../api";
import "./Transactions.css";

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
  const [loading, setLoading] = useState(true);
  const pageSize = 25;

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTransactions({
        page,
        page_size: pageSize,
        search: search || undefined,
      });
      setTransactions(data.transactions);
      setTotal(data.total);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchTransactions();
    const handleSync = () => fetchTransactions();
    window.addEventListener("wisexpense:sync", handleSync);
    return () => window.removeEventListener("wisexpense:sync", handleSync);
  }, [fetchTransactions]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [search]);

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
            placeholder="Search by description or payee..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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
                <th>Date</th>
                <th className="text-right">Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id}>
                  <td>
                    <div className="txn-cell">
                      <div className="txn-logo-sm-placeholder">
                        {(txn.payee || txn.description).charAt(0).toUpperCase()}
                      </div>
                      <div className="txn-cell-info">
                        <span className="txn-cell-name">{txn.payee || txn.description}</span>
                        {txn.payee && txn.payee !== txn.description && (
                          <span className="txn-cell-sub">{txn.description}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="text-muted">
                    {new Date(txn.date).toLocaleDateString("en-CA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="text-right">
                    <span className={`amount-cell ${txn.amount > 0 ? "income" : "expense"}`}>
                      {txn.amount > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {formatCurrency(Math.abs(txn.amount), txn.currency || undefined)}
                    </span>
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
