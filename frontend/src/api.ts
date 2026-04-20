const API_BASE = "/api";

export interface Transaction {
  id: number;
  provider_transaction_id: string;
  account_id: string;
  description: string;
  payee: string | null;
  amount: number;
  date: string;
  currency: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  page_size: number;
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  count: number;
}

export interface TransactionSummaryResponse {
  total_spending: number;
  total_income: number;
  net: number;
  transaction_count: number;
  category_breakdown: CategoryBreakdown[];
  start_date: string | null;
  end_date: string | null;
}

export interface SimpleFINStatus {
  configured: boolean;
  connected: boolean;
}

export interface SyncResult {
  sync_count: number;
  upserted_count: number;
}

// --- SimpleFIN ---

export async function getSimpleFINStatus(): Promise<SimpleFINStatus> {
  const res = await fetch(`${API_BASE}/simplefin/status`);
  if (!res.ok) throw new Error("Failed to get SimpleFIN status");
  return res.json();
}

export async function syncTransactions(): Promise<SyncResult> {
  const res = await fetch(`${API_BASE}/simplefin/transactions/sync`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to sync transactions");
  return res.json();
}

// --- Agent ---

export async function chatWithAgent(message: string): Promise<{response: string}> {
  const res = await fetch(`${API_BASE}/agent/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error("Failed to chat with agent");
  return res.json();
}

// --- Transactions ---

export async function getTransactions(params?: {
  page?: number;
  page_size?: number;
  start_date?: string;
  end_date?: string;
  category?: string;
  search?: string;
}): Promise<TransactionListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.page_size) searchParams.set("page_size", String(params.page_size));
  if (params?.start_date) searchParams.set("start_date", params.start_date);
  if (params?.end_date) searchParams.set("end_date", params.end_date);
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  const res = await fetch(`${API_BASE}/transactions/${query ? `?${query}` : ""}`);
  if (!res.ok) throw new Error("Failed to get transactions");
  return res.json();
}

export async function getTransactionSummary(params?: {
  start_date?: string;
  end_date?: string;
}): Promise<TransactionSummaryResponse> {
  const searchParams = new URLSearchParams();
  if (params?.start_date) searchParams.set("start_date", params.start_date);
  if (params?.end_date) searchParams.set("end_date", params.end_date);

  const query = searchParams.toString();
  const res = await fetch(`${API_BASE}/transactions/summary${query ? `?${query}` : ""}`);
  if (!res.ok) throw new Error("Failed to get summary");
  return res.json();
}

export async function deleteTransaction(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/transactions/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete transaction");
}

// --- Health ---

export async function healthCheck(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
