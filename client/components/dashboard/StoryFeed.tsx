import { days } from "@/lib/data";
import { INSIGHT_TONE, PALETTE } from "@/lib/tone";
import type { Day } from "@/lib/types";

/** The narrated transaction timeline — one card per day, plus its insight. */
export function StoryFeed({ showInsights }: { showInsights: boolean }) {
  return (
    <section>
      <h2 className="mb-[22px] font-serif text-[27px] font-medium tracking-[-.01em]">
        The story so far
      </h2>
      <div className="flex flex-col gap-[30px]">
        {days.map((day) => (
          <DayEntry key={day.label} day={day} showInsight={showInsights} />
        ))}
      </div>
    </section>
  );
}

function DayEntry({ day, showInsight }: { day: Day; showInsight: boolean }) {
  const insight = showInsight ? day.insight : undefined;

  return (
    <div className="grid grid-cols-[20px_1fr] gap-[18px]">
      {/* timeline rail */}
      <div
        aria-hidden="true"
        className="flex flex-col items-center gap-1.5 pt-[5px]"
      >
        <span className="size-[11px] rounded-full border-[2.5px] border-cream bg-gold shadow-[0_0_0_1.5px_#B58900]" />
        <span className="w-[1.5px] flex-1 bg-navy/14" />
      </div>

      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-[13px] font-bold tracking-[.1em] text-ink-soft uppercase">
            {day.label}
          </span>
          <span
            className="font-serif text-[17px] font-semibold"
            style={{ color: day.totalIsIncome ? PALETTE.success : PALETTE.navy }}
          >
            {day.total}
          </span>
        </div>

        <div className="card-lift flex flex-col rounded-[18px] border border-navy/9 bg-panel px-[22px] py-1.5">
          {day.items.map((it) => (
            <div
              key={it.name}
              className="flex items-center justify-between border-b border-navy/6 py-[15px] last:border-b-0"
            >
              <div className="flex items-center gap-3.5">
                <span
                  aria-hidden="true"
                  className="grid size-[38px] place-items-center rounded-xl text-[12.5px] font-bold"
                  style={{ background: it.chip.bg, color: it.chip.fg }}
                >
                  {it.abbr}
                </span>
                <div>
                  <div className="text-[14.5px] font-semibold">{it.name}</div>
                  <div className="mt-px text-[12.5px] text-muted">{it.meta}</div>
                </div>
              </div>
              <div
                className="font-serif text-lg font-semibold"
                style={{ color: it.income ? PALETTE.success : PALETTE.navy }}
              >
                {it.amount}
              </div>
            </div>
          ))}
        </div>

        {insight && (
          <div
            className="mt-3 rounded-2xl border px-5 py-4"
            style={{
              background: INSIGHT_TONE[insight.tone].bg,
              borderColor: INSIGHT_TONE[insight.tone].border,
            }}
          >
            <div
              className="mb-1.5 text-[11px] font-bold tracking-[.14em] uppercase"
              style={{ color: INSIGHT_TONE[insight.tone].tag }}
            >
              {insight.title}
            </div>
            <div className="font-serif text-[16.5px] leading-[1.45] text-navy">
              {insight.body}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
