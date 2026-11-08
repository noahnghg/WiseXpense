import type {
  Account,
  Budget,
  ChipTone,
  Day,
  DashboardTab,
  Goal,
  Month,
} from "./types";

/** Category chip tones, keyed by the kind of spending they mark. */
export const CHIP: Record<string, ChipTone> = {
  default: { bg: "#F6EDCF", fg: "#7A6520" },
  groceries: { bg: "#E3EBDA", fg: "#4A6318" },
  neutral: { bg: "#E2E8F0", fg: "#3D4F66" },
  housing: { bg: "#E2E8F0", fg: "#3D4F66" },
  dining: { bg: "#FBE4E3", fg: "#B0322F" },
  income: { bg: "#EFF3E6", fg: "#4A6318" },
};

export const USER_NAME = "Maya";

/** The narrated feed — each day is one entry in the story. */
export const days: Day[] = [
  {
    label: "Today · Wednesday, July 2",
    total: "−$58.89",
    items: [
      {
        abbr: "CF",
        name: "Blue Bottle Coffee",
        meta: "9:12 AM · Coffee & cafés",
        amount: "−$6.75",
        chip: CHIP.default,
      },
      {
        abbr: "GR",
        name: "Trader Joe's",
        meta: "6:38 PM · Groceries",
        amount: "−$52.14",
        chip: CHIP.groceries,
      },
    ],
    insight: {
      title: "Nice pacing",
      body: "Groceries are 4% under budget with four days left in the week. Keep this up and July ends $63 ahead.",
      tone: "positive",
    },
  },
  {
    label: "Yesterday · Tuesday, July 1",
    total: "−$1,461.99",
    items: [
      {
        abbr: "HM",
        name: "Rent — Maple & 5th",
        meta: "8:00 AM · Housing",
        amount: "−$1,450.00",
        chip: CHIP.housing,
      },
      {
        abbr: "SB",
        name: "Spotify Premium",
        meta: "Renewal · Subscriptions",
        amount: "−$11.99",
        chip: CHIP.neutral,
      },
    ],
    insight: {
      title: "Subscription cluster",
      body: "Four subscriptions renew within five days of payday. Moving them mid-month would smooth your cash flow.",
      tone: "caution",
    },
  },
  {
    label: "Monday, June 30",
    total: "−$104.60",
    items: [
      {
        abbr: "DN",
        name: "Dinner — Casa Lupe",
        meta: "8:41 PM · Dining out",
        amount: "−$86.20",
        chip: CHIP.dining,
      },
      {
        abbr: "UB",
        name: "Uber",
        meta: "11:03 PM · Transport",
        amount: "−$18.40",
        chip: CHIP.neutral,
      },
    ],
    insight: {
      title: "Dining is running hot",
      body: "3rd dinner out this week — $296 against a $220 budget. Skipping two takeout orders saves ≈$46.",
      tone: "alert",
    },
  },
  {
    label: "Saturday, June 28",
    total: "+$2,840.00",
    totalIsIncome: true,
    items: [
      {
        abbr: "NS",
        name: "Paycheck — Northlight Studio",
        meta: "Direct deposit · Income",
        amount: "+$2,840.00",
        income: true,
        chip: CHIP.income,
      },
    ],
    insight: {
      title: "Auto-save swept",
      body: "$180 moved to your Emergency fund the moment payday landed — before you could spend it.",
      tone: "caution",
    },
  },
  {
    label: "Friday, June 27",
    total: "−$63.30",
    items: [
      {
        abbr: "EN",
        name: "Cinema Nights",
        meta: "7:20 PM · Entertainment",
        amount: "−$24.50",
        chip: CHIP.neutral,
      },
      {
        abbr: "GR",
        name: "Farmers market",
        meta: "5:05 PM · Groceries",
        amount: "−$38.80",
        chip: CHIP.groceries,
      },
    ],
  },
];

export const budgets: Budget[] = [
  {
    name: "Dining out",
    pct: "100%",
    tone: "over",
    note: "$296 / $220 · over",
    spent: "$296",
    cap: "$220",
    left: "$76 over",
    tip: "Three dinners out this week. Two home-cooked swaps gets you back under.",
  },
  {
    name: "Groceries",
    pct: "96%",
    tone: "near",
    note: "$384 / $400",
    spent: "$384",
    cap: "$400",
    left: "$16 left",
    tip: "Right on pace — farmers-market runs are cheaper than delivery.",
  },
  {
    name: "Shopping",
    pct: "71%",
    tone: "fine",
    note: "$142 / $200",
    spent: "$142",
    cap: "$200",
    left: "$58 left",
    tip: "Comfortable headroom. No impulse purchases in 12 days.",
  },
  {
    name: "Transport",
    pct: "79%",
    tone: "fine",
    note: "$118 / $150",
    spent: "$118",
    cap: "$150",
    left: "$32 left",
    tip: "Late-night rides are 40% of this. Earlier trains are basically free money.",
  },
  {
    name: "Entertainment",
    pct: "77%",
    tone: "fine",
    note: "$92 / $120",
    spent: "$92",
    cap: "$120",
    left: "$28 left",
    tip: "One cinema night left in the budget this month.",
  },
  {
    name: "Subscriptions",
    pct: "100%",
    tone: "over",
    note: "$64 / $60 · over",
    spent: "$64",
    cap: "$60",
    left: "$4 over",
    tip: "Two overlapping streaming services — cancelling one saves $144/yr.",
  },
];

export const months: Month[] = [
  { label: "Feb", amt: "2.4k", h: "72%" },
  { label: "Mar", amt: "2.7k", h: "80%" },
  { label: "Apr", amt: "2.3k", h: "70%" },
  { label: "May", amt: "2.7k", h: "82%" },
  { label: "Jun", amt: "2.5k", h: "74%" },
  { label: "Jul", amt: "1.5k", h: "45%", current: true },
];

export const goals: Goal[] = [
  {
    name: "Emergency fund",
    pct: 52,
    saved: "$2,600",
    target: "of $5,000",
    monthly: "$180 / mo auto-save",
    eta: "Fully funded by Feb 2027",
    sub: "$2,600 of $5,000 · Feb 2027",
  },
  {
    name: "Japan trip",
    pct: 38,
    saved: "$1,150",
    target: "of $3,000",
    monthly: "$140 / mo auto-save",
    eta: "On pace for April — flights book in Jan",
    sub: "$1,150 of $3,000 · on pace for April",
  },
  {
    name: "Camera upgrade",
    pct: 40,
    saved: "$640",
    target: "of $1,600",
    monthly: "$80 / mo auto-save",
    eta: "In your hands by Nov 2026",
    sub: "$640 of $1,600 · Nov 2026",
  },
];

export const accounts: Account[] = [
  {
    name: "Everyday Checking",
    inst: "Meridian Bank ·· 4821",
    bal: "$2,318.44",
    sub: "+$412 vs last month",
    variant: "navy",
  },
  {
    name: "High-Yield Savings",
    inst: "Meridian Bank ·· 7702",
    bal: "$4,390.00",
    sub: "4.10% APY · auto-save $180/mo",
    variant: "gold",
  },
  {
    name: "Rewards Credit",
    inst: "Meridian Visa ·· 3310",
    bal: "−$486.12",
    sub: "Due Jul 18 · autopay on",
    variant: "paper",
  },
];

export const TABS: {
  id: DashboardTab;
  label: string;
  kicker: string;
  title: string;
}[] = [
  { id: "overview", label: "Overview", kicker: "", title: "" },
  {
    id: "budgets",
    label: "Budgets",
    kicker: "July · 6 categories",
    title: "Where the month is going",
  },
  {
    id: "goals",
    label: "Goals",
    kicker: "3 goals · $400/mo auto-save",
    title: "What you're building toward",
  },
  {
    id: "accounts",
    label: "Accounts",
    kicker: "3 linked · Meridian Bank",
    title: "Everything in one place",
  },
];

export const ticker = [
  "You spend 2.3× more on weekends",
  "4 subscriptions renew near payday",
  "Skipping two takeout orders saves ≈$46",
  "Auto-save swept $180 on payday",
  "Groceries: 4% under budget",
];
