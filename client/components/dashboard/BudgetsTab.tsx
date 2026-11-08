import { budgets } from "@/lib/data";
import { budgetTone } from "@/lib/tone";

export function BudgetsTab() {
  return (
    <main className="mx-auto max-w-[1180px] px-11 pt-10 pb-20">
      <div className="mb-[34px] flex animate-rise flex-wrap items-baseline gap-12 [animation-duration:.5s]">
        <Stat label="July budget" value="$2,300" />
        <Stat label="Spent so far" value="$1,521" />
        <Stat label="Left to spend" value="$779" accent />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((b) => {
          const tone = budgetTone(b.tone);
          return (
            <div
              key={b.name}
              className="card-lift-lg flex flex-col gap-3.5 rounded-[20px] border border-navy/9 bg-panel px-[26px] py-6"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold">{b.name}</span>
                <span
                  className="text-[12.5px] font-bold"
                  style={{ color: tone.left }}
                >
                  {b.left}
                </span>
              </div>
              <div className="font-serif text-[34px] leading-none font-medium">
                {b.spent}{" "}
                <span className="text-base text-muted">of {b.cap}</span>
              </div>
              <div className="h-[9px] overflow-hidden rounded-full bg-navy/8">
                <div
                  className="h-full rounded-full"
                  style={{ width: b.pct, background: tone.bar }}
                />
              </div>
              <div className="text-[13px] leading-[1.5] text-ink-muted">
                {b.tip}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="mb-1.5 text-[11.5px] font-bold tracking-[.16em] text-muted uppercase">
        {label}
      </div>
      <div
        className={`font-serif text-[38px] font-medium ${accent ? "text-gold" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}
