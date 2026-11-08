import type { Account, Budget, InsightTone } from "./types";

export const PALETTE = {
  navy: "#0C2340",
  gold: "#B58900",
  sand: "#E9C46A",
  danger: "#DC322F",
  success: "#5B7C00",
  muted: "#8A94A6",
} as const;

/** Insight callout styling by severity. */
export const INSIGHT_TONE: Record<
  InsightTone,
  { bg: string; border: string; tag: string }
> = {
  positive: { bg: "#EFF3E6", border: "rgba(91,124,0,.3)", tag: PALETTE.success },
  caution: { bg: "#F6EDCF", border: "rgba(181,137,0,.3)", tag: PALETTE.gold },
  alert: { bg: "#FBEFEF", border: "rgba(220,50,47,.3)", tag: PALETTE.danger },
};

/**
 * A budget's bar colour escalates with pressure — navy while there's room,
 * gold as it tightens, red once it's blown.
 */
export function budgetTone(tone: Budget["tone"]) {
  switch (tone) {
    case "over":
      return { bar: PALETTE.danger, note: PALETTE.danger, left: PALETTE.danger };
    case "near":
      return { bar: PALETTE.gold, note: PALETTE.muted, left: PALETTE.success };
    default:
      return { bar: PALETTE.navy, note: PALETTE.muted, left: PALETTE.success };
  }
}

/** Account card treatments — navy, gold foil, or plain paper. */
export function accountTone(variant: Account["variant"]) {
  switch (variant) {
    case "navy":
      return {
        background: PALETTE.navy,
        color: "#FDF6E3",
        sub: PALETTE.sand,
        frame: "rgba(233,196,106,.45)",
      };
    case "gold":
      return {
        background: "linear-gradient(135deg,#E9C46A,#D4A93C)",
        color: PALETTE.navy,
        sub: "#6B5410",
        frame: "rgba(12,35,64,.35)",
      };
    default:
      return {
        background: "#FFFDF5",
        color: PALETTE.navy,
        sub: PALETTE.danger,
        frame: "rgba(12,35,64,.18)",
      };
  }
}

/** Progress ring built from a conic gradient, as in the design source. */
export function ring(pct: number, track = "rgba(12,35,64,.08)") {
  return `conic-gradient(${PALETTE.gold} 0 ${pct}%, ${track} ${pct}% 100%)`;
}
