export type Transaction = {
  /** Two-letter category chip, e.g. "GR" for groceries. */
  abbr: string;
  name: string;
  /** Time + category line under the merchant, e.g. "9:12 AM · Coffee & cafés". */
  meta: string;
  amount: string;
  income?: boolean;
  chip: ChipTone;
};

/** Background/foreground pair for a transaction's category chip. */
export type ChipTone = { bg: string; fg: string };

export type InsightTone = "positive" | "caution" | "alert";

export type Insight = {
  title: string;
  body: string;
  tone: InsightTone;
};

export type Day = {
  label: string;
  total: string;
  /** Income days print their total in green. */
  totalIsIncome?: boolean;
  items: Transaction[];
  insight?: Insight;
};

export type Budget = {
  name: string;
  /** Bar fill width, clamped at 100% even when overspent. */
  pct: string;
  /** Bar + "over" text colour. */
  tone: "over" | "near" | "fine";
  note: string;
  spent: string;
  cap: string;
  left: string;
  tip: string;
};

export type Month = {
  label: string;
  amt: string;
  /** Bar height as a share of the chart body. */
  h: string;
  current?: boolean;
};

export type Goal = {
  name: string;
  pct: number;
  saved: string;
  target: string;
  monthly: string;
  eta: string;
  /** Sidebar one-liner, e.g. "$2,600 of $5,000 · Feb 2027". */
  sub: string;
};

export type Account = {
  name: string;
  inst: string;
  bal: string;
  sub: string;
  /** Card treatment: navy, gold gradient, or plain paper. */
  variant: "navy" | "gold" | "paper";
};

export type DashboardTab = "overview" | "budgets" | "goals" | "accounts";
