/** "Your money, narrated" — the sample diary entry that sells the feed. */
export function NarratedFeed() {
  return (
    <section
      id="why"
      className="mx-auto grid max-w-[1240px] items-center gap-[72px] px-12 py-[110px] lg:grid-cols-2"
    >
      <div data-reveal className="reveal-hidden">
        <div className="mb-[18px] text-[12.5px] font-bold tracking-[.22em] text-gold uppercase">
          Your money, narrated
        </div>
        <h2 className="mb-5 font-serif text-[clamp(32px,4.5vw,46px)] leading-[1.1] font-medium tracking-[-.015em] text-balance">
          A bank feed that reads like a diary, not a ledger.
        </h2>
        <p className="text-[17px] leading-[1.7] text-ink-soft text-pretty">
          Every day of spending becomes a short entry: what happened, why it
          matters, and the one thing worth doing about it. No pivot tables. No
          guilt. Just the plot of your money.
        </p>
      </div>

      <div
        data-reveal
        className="reveal-hidden flex flex-col gap-[18px] rounded-3xl border border-navy/10 bg-panel px-8 py-[30px] shadow-[0_10px_24px_rgba(12,35,64,.08),0_42px_90px_rgba(12,35,64,.2)]"
      >
        <div className="text-xs font-bold tracking-[.14em] text-muted uppercase">
          Monday, June 30
        </div>

        <SampleRow
          name="Dinner — Casa Lupe"
          meta="8:41 PM · Dining out"
          amount="−$86.20"
        />
        <SampleRow name="Uber" meta="11:03 PM · Transport" amount="−$18.40" />

        <div className="rounded-[14px] border border-danger/25 bg-[#FBEFEF] px-[18px] py-4">
          <div className="mb-1.5 text-[11.5px] font-bold tracking-[.14em] text-danger uppercase">
            Dining is running hot
          </div>
          <div className="font-serif text-[16.5px] leading-[1.45]">
            3rd dinner out this week — $296 against a $220 budget. Skipping two
            takeout orders saves ≈$46.
          </div>
        </div>
      </div>
    </section>
  );
}

function SampleRow({
  name,
  meta,
  amount,
}: {
  name: string;
  meta: string;
  amount: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-[15px] font-semibold">{name}</div>
        <div className="mt-0.5 text-[13px] text-muted">{meta}</div>
      </div>
      <div className="font-serif text-[19px] font-semibold">{amount}</div>
    </div>
  );
}
