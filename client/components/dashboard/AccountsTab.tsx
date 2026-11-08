import { accounts } from "@/lib/data";
import { accountTone } from "@/lib/tone";

export function AccountsTab() {
  return (
    <main className="mx-auto max-w-[1180px] px-11 pt-10 pb-20">
      <div className="mb-8 flex animate-rise flex-wrap items-baseline gap-4 [animation-duration:.5s]">
        <span className="text-[11.5px] font-bold tracking-[.16em] text-muted uppercase">
          Net worth
        </span>
        <span className="font-serif text-[42px] font-medium">$6,222</span>
        <span className="text-[13.5px] font-bold text-success">
          ▲ $412 this month
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((a) => {
          const tone = accountTone(a.variant);
          return (
            <div
              key={a.name}
              className="flex min-h-[190px] flex-col justify-between rounded-[22px] border border-navy/10 px-7 py-[26px] shadow-[0_10px_22px_rgba(12,35,64,.12),0_38px_75px_rgba(12,35,64,.22)] outline-1 outline-dashed -outline-offset-[9px]"
              style={{
                background: tone.background,
                color: tone.color,
                outlineColor: tone.frame,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] font-bold">{a.name}</span>
                <span
                  aria-hidden="true"
                  className="grid size-[30px] place-items-center rounded-full bg-[linear-gradient(135deg,#E9C46A,#B58900)] font-serif text-[15px] font-semibold text-navy"
                >
                  $
                </span>
              </div>
              <div className="font-serif text-4xl leading-none font-medium">
                {a.bal}
              </div>
              <div>
                <div className="text-[12.5px] opacity-65">{a.inst}</div>
                <div
                  className="mt-[3px] text-[12.5px] font-semibold"
                  style={{ color: tone.sub }}
                >
                  {a.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
