import { ring } from "@/lib/tone";

/** Navy greeting band: the month's headline plus the safe-to-spend dial. */
export function OverviewHeader({ userName }: { userName: string }) {
  return (
    <header className="bg-navy px-11 pt-10 pb-13 text-cream">
      <div className="mx-auto grid max-w-[1180px] items-center gap-12 lg:grid-cols-[1fr_auto]">
        <div className="animate-rise [animation-duration:.6s]">
          <div className="mb-3 text-xs font-bold tracking-[.18em] text-sand uppercase">
            Wednesday, July 2
          </div>
          <h1 className="mb-3.5 font-serif text-[clamp(32px,4.5vw,44px)] leading-[1.1] font-medium tracking-[-.02em]">
            Good morning, {userName}.
          </h1>
          <p className="max-w-[560px] text-base leading-[1.6] text-on-navy text-pretty">
            You&apos;ve spent <strong className="text-cream">$1,521</strong> of
            your <strong className="text-cream">$2,300</strong> July budget.
            Rent&apos;s paid, groceries are on pace — but{" "}
            <strong className="text-sand">dining out is running 35% hot</strong>.
          </p>
        </div>

        <div className="flex animate-rise items-center gap-[22px] rounded-[20px] border border-cream/14 bg-cream/6 px-7 py-[22px] [animation-delay:.15s] [animation-duration:.6s]">
          <div
            className="grid size-[88px] place-items-center rounded-full"
            style={{ background: ring(66, "rgba(253,246,227,.12)") }}
            role="img"
            aria-label="66% of the July budget spent"
          >
            <div className="grid size-[66px] place-items-center rounded-full bg-navy font-serif text-[19px] font-semibold">
              66%
            </div>
          </div>
          <div>
            <div className="text-[11.5px] font-bold tracking-[.16em] text-sand uppercase">
              Safe to spend
            </div>
            <div className="font-serif text-[38px] leading-[1.15] font-medium">
              $186
            </div>
            <div className="text-[12.5px] text-on-navy">
              this week · after bills &amp; goals
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
