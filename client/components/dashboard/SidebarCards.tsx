import { budgets, goals, months } from "@/lib/data";
import { budgetTone, PALETTE } from "@/lib/tone";

const CARD =
  "card-lift rounded-[20px] border border-navy/9 bg-panel px-[26px] py-6";

export function BudgetsCard() {
  return (
    <div className={CARD}>
      <div className="mb-[18px] flex items-baseline justify-between">
        <h3 className="font-serif text-xl font-semibold">Budgets</h3>
        <span className="text-xs text-muted">July</span>
      </div>
      <div className="flex flex-col gap-[15px]">
        {budgets.slice(0, 4).map((b) => {
          const tone = budgetTone(b.tone);
          return (
            <div key={b.name}>
              <div className="mb-1.5 flex items-baseline justify-between text-[13px]">
                <span className="font-semibold">{b.name}</span>
                <span className="font-semibold" style={{ color: tone.note }}>
                  {b.note}
                </span>
              </div>
              <div className="h-[7px] overflow-hidden rounded-full bg-navy/8">
                <div
                  className="h-full rounded-full"
                  style={{ width: b.pct, background: tone.bar }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Six-month spend bars; the current month is called out in gold. */
export function CashFlowCard() {
  return (
    <div className={CARD}>
      <h3 className="mb-1 font-serif text-xl font-semibold">Cash flow</h3>
      <div className="mb-[18px] text-[12.5px] text-muted">
        Monthly spending vs. $2,840 income
      </div>
      <div className="flex h-[120px] items-end gap-3">
        {months.map((m) => (
          <div
            key={m.label}
            className="flex h-full flex-1 flex-col items-center justify-end gap-[7px]"
          >
            <span className="text-[11px] font-semibold text-ink-muted">
              {m.amt}
            </span>
            <div
              className="w-full animate-grow-bar rounded-t-[7px] rounded-b-[3px] origin-bottom"
              style={{
                height: m.h,
                background: m.current ? PALETTE.gold : "rgba(12,35,64,.75)",
              }}
            />
            <span className="text-[11.5px] font-semibold text-muted">
              {m.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GoalsCard() {
  return (
    <div className="card-lift-navy rounded-[20px] bg-navy px-[26px] py-6 text-cream">
      <h3 className="mb-4 font-serif text-xl font-semibold">Savings goals</h3>
      <div className="flex flex-col gap-4">
        {goals.map((g) => (
          <div key={g.name}>
            <div className="mb-1.5 flex items-baseline justify-between text-[13px]">
              <span className="font-semibold">{g.name}</span>
              <span className="font-semibold text-sand">{g.pct}%</span>
            </div>
            <div className="h-[7px] overflow-hidden rounded-full bg-cream/14">
              <div
                className="h-full rounded-full bg-sand"
                style={{ width: `${g.pct}%` }}
              />
            </div>
            <div className="mt-[5px] text-xs text-on-navy">{g.sub}</div>
          </div>
        ))}
      </div>
      <div className="mt-[18px] border-t border-cream/12 pt-4 font-serif text-[14.5px] text-on-navy italic">
        Auto-save moved $180 on payday — you didn&apos;t even notice.
      </div>
    </div>
  );
}
