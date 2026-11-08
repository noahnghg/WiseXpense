import Link from "next/link";

export function Hero() {
  return (
    <header className="mx-auto grid max-w-[1240px] items-center gap-12 px-12 pt-[88px] pb-[110px] lg:grid-cols-[1.15fr_.85fr]">
      <div>
        <div className="mb-[22px] animate-rise text-[12.5px] font-bold tracking-[.22em] text-gold uppercase">
          Smart money manager
        </div>
        <h1 className="mb-[26px] animate-rise font-serif text-[clamp(44px,7vw,72px)] leading-[1.04] font-medium tracking-[-.02em] text-balance [animation-delay:.1s]">
          Know where every dollar{" "}
          <em className="text-gold italic">wandered off</em> to.
        </h1>
        <p className="mb-9 max-w-[520px] animate-rise text-[19px] leading-[1.65] text-ink-soft text-pretty [animation-delay:.2s]">
          WiseXpense reads your spending like a story — and tells you, plainly,
          what&apos;s going on in your account, where the leaks are, and how
          much is truly safe to spend.
        </p>
        <div className="flex animate-rise flex-wrap items-center gap-4 [animation-delay:.3s]">
          <Link
            href="/signin"
            className="relative overflow-hidden rounded-full bg-gold px-8 py-4 text-base font-semibold text-cream no-underline shadow-[0_10px_24px_rgba(181,137,0,.35)] transition-all duration-250 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(181,137,0,.5)] after:absolute after:top-0 after:left-0 after:h-full after:w-[45%] after:animate-sheen after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent)] after:content-['']"
          >
            Start free
          </Link>
          <Link
            href="/signin"
            className="rounded-full border-[1.5px] border-navy/25 px-[30px] py-[15px] text-base font-semibold text-navy no-underline transition-all duration-250 hover:bg-navy/6"
          >
            See a demo
          </Link>
        </div>
        <div className="mt-[26px] animate-rise text-[13.5px] text-muted [animation-delay:.4s]">
          Free for students · No credit card required
        </div>
      </div>

      <CardStack />
    </header>
  );
}

/**
 * The decorative hero collage: a giant ghosted "$", two spinning coins, and
 * four drifting product cards. Purely illustrative, so the whole stack is
 * hidden from assistive tech and dropped on small screens where the absolute
 * positioning has no room to breathe.
 */
function CardStack() {
  return (
    <div className="relative hidden h-[480px] lg:block" aria-hidden="true">
      <div className="pointer-events-none absolute inset-x-0 top-[-40px] bottom-0 grid place-items-center font-serif text-[430px] leading-none font-medium text-gold/9 italic select-none">
        $
      </div>

      <Coin
        className="top-[148px] -left-4 [animation-delay:.4s] [animation-duration:5.5s]"
        diameter={76}
        fontSize={35}
        ring={5}
        spin="5s"
      >
        $
      </Coin>
      <Coin
        className="right-[22px] -bottom-1.5 [animation-delay:2s] [animation-duration:6.5s]"
        diameter={46}
        fontSize={21}
        ring={3.5}
        spin="7s"
        spinDelay="1s"
      >
        ¢
      </Coin>

      {/* Safe to spend */}
      <div
        className="absolute top-5 left-[8%] w-[290px] animate-floaty rounded-[20px] border border-sand/40 bg-navy px-[26px] py-6 text-cream shadow-[0_12px_26px_rgba(12,35,64,.28),0_48px_95px_rgba(12,35,64,.45)] outline-1 outline-sand/45 outline-dashed -outline-offset-8"
        style={{ "--r": "-2.5deg" } as React.CSSProperties}
      >
        <div className="mb-2.5 text-[11.5px] font-bold tracking-[.16em] text-sand uppercase">
          Safe to spend
        </div>
        <div className="font-serif text-[46px] leading-none font-medium">$186</div>
        <div className="mt-2 text-[13px] text-on-navy">
          this week — after bills, goals &amp; rent
        </div>
      </div>

      {/* Heads up */}
      <div
        className="absolute top-[220px] right-0 w-[280px] animate-floaty rounded-[20px] border border-navy/10 bg-panel px-6 py-[22px] shadow-[0_8px_18px_rgba(12,35,64,.1),0_36px_75px_rgba(12,35,64,.24)] [animation-delay:.8s] [animation-duration:8s]"
        style={{ "--r": "2deg" } as React.CSSProperties}
      >
        <div className="mb-2.5 flex items-center gap-[9px]">
          <span className="size-[9px] animate-pulse-dot rounded-full bg-danger" />
          <span className="text-xs font-bold tracking-[.12em] text-danger uppercase">
            Heads up
          </span>
        </div>
        <div className="font-serif text-xl leading-[1.35]">
          Dining out is 35% over budget — that&apos;s your 3rd dinner out this
          week.
        </div>
      </div>

      {/* Japan trip */}
      <div
        className="absolute top-[378px] left-[16%] w-[260px] animate-floaty rounded-[20px] border border-gold/25 bg-band px-6 py-5 shadow-[0_7px_16px_rgba(12,35,64,.09),0_30px_65px_rgba(12,35,64,.2)] [animation-delay:1.4s] [animation-duration:6.5s]"
        style={{ "--r": "-1.5deg" } as React.CSSProperties}
      >
        <div className="mb-2.5 flex items-baseline justify-between">
          <span className="text-[13px] font-semibold">Japan trip</span>
          <span className="text-[13px] font-semibold text-olive">38%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-navy/10">
          <div className="h-full w-[38%] rounded-full bg-gold" />
        </div>
        <div className="mt-[9px] text-[12.5px] text-olive">
          $1,150 saved · on pace for April
        </div>
      </div>
    </div>
  );
}

function Coin({
  children,
  className,
  diameter,
  fontSize,
  ring,
  spin,
  spinDelay,
}: {
  children: React.ReactNode;
  className?: string;
  diameter: number;
  fontSize: number;
  ring: number;
  spin: string;
  spinDelay?: string;
}) {
  return (
    <div
      className={`absolute animate-floaty [perspective:600px] ${className ?? ""}`}
      style={{ "--r": "0deg" } as React.CSSProperties}
    >
      <div
        className="grid animate-spin-y place-items-center rounded-full bg-[linear-gradient(135deg,#E9C46A,#B58900)] font-serif font-semibold text-navy [transform-style:preserve-3d]"
        style={{
          width: diameter,
          height: diameter,
          fontSize,
          animationDuration: spin,
          animationDelay: spinDelay,
          boxShadow: `0 ${diameter > 60 ? 22 : 14}px ${diameter > 60 ? 48 : 32}px rgba(181,137,0,${diameter > 60 ? ".5" : ".45"}), inset 0 0 0 ${ring}px rgba(253,246,227,.35)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
