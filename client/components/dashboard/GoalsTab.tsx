import { goals } from "@/lib/data";
import { ring } from "@/lib/tone";

export function GoalsTab() {
  return (
    <main className="mx-auto max-w-[1180px] px-11 pt-10 pb-20">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((g) => (
          <div
            key={g.name}
            className="card-lift-lg flex flex-col items-center gap-3.5 rounded-[22px] border border-navy/9 bg-panel p-7 text-center"
          >
            <div
              className="grid size-28 place-items-center rounded-full"
              style={{ background: ring(g.pct) }}
              role="img"
              aria-label={`${g.name}: ${g.pct}% funded`}
            >
              <div className="grid size-21 place-items-center rounded-full bg-panel font-serif text-[23px] font-semibold">
                {g.pct}%
              </div>
            </div>
            <div>
              <div className="font-serif text-[22px] font-semibold">
                {g.name}
              </div>
              <div className="mt-1 text-[13.5px] text-muted">
                {g.saved} <span className="text-[#B0A98F]">{g.target}</span>
              </div>
            </div>
            <div className="rounded-full border border-gold/25 bg-band px-3.5 py-1.5 text-[12.5px] font-semibold text-gold">
              {g.monthly}
            </div>
            <div className="text-[13px] text-ink-muted">{g.eta}</div>
          </div>
        ))}

        <button
          type="button"
          className="grid min-h-[280px] cursor-pointer place-items-center rounded-[22px] border-2 border-dashed border-navy/20 text-[15px] font-semibold text-muted transition-all duration-250 hover:border-gold hover:bg-gold/4 hover:text-gold"
        >
          + New goal
        </button>
      </div>
    </main>
  );
}
