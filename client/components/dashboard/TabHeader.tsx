/** Compact navy header used by every tab except Overview. */
export function TabHeader({
  kicker,
  title,
}: {
  kicker: string;
  title: string;
}) {
  return (
    <header className="bg-navy px-11 pt-9 pb-11 text-cream">
      <div className="mx-auto max-w-[1180px] animate-rise [animation-duration:.5s]">
        <div className="mb-2.5 text-xs font-bold tracking-[.18em] text-sand uppercase">
          {kicker}
        </div>
        <h1 className="font-serif text-[clamp(30px,4vw,40px)] font-medium tracking-[-.02em]">
          {title}
        </h1>
      </div>
    </header>
  );
}
