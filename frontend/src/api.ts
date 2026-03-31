const API_BASE = "/api";

export interface Transaction {
  id: number;
  plaid_transaction_id: string;
  name: string;
  merchant_name: string | null;
  amount: number;
  date: string;
  authorized_date: string | null;
  category_primary: string | null;
  category_detailed: string | null;
  payment_channel: string | null;
  iso_currency_code: string | null;
  pending: boolean;
  logo_url: string | null;
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

export interface PlaidStatus {
  configured: boolean;
  connected: boolean;
  environment: string;
}

export interface SyncResult {
  added_count: number;
  modified_count: number;
  removed_count: number;
  next_cursor: string;
}

// --- Plaid ---

export async function getPlaidStatus(): Promise<PlaidStatus> {
  const res = await fetch(`${API_BASE}/plaid/status`);
  if (!res.ok) throw new Error("Failed to get Plaid status");
  return res.json();
}

export async function createLinkToken(): Promise<string> {
  const res = await fetch(`${API_BASE}/plaid/create_link_token`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to create link token");
  const data = await res.json();
  return data.link_token;
}

export async function exchangePublicToken(publicToken: string): Promise<void> {
  const res = await fetch(`${API_BASE}/plaid/exchange_public_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ public_token: publicToken }),
  });
  if (!res.ok) throw new Error("Failed to exchange token");
}

export async function syncTransactions(): Promise<SyncResult> {
  const res = await fetch(`${API_BASE}/plaid/transactions/sync`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to sync transactions");
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
  if (params?.category) searchParams.set("category", params.category);
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
