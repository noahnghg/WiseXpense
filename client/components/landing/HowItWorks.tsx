const STEPS = [
  {
    n: "01",
    title: "Connect",
    body: "Link your accounts once. WiseXpense sorts every transaction into honest categories — automatically.",
  },
  {
    n: "02",
    title: "Understand",
    body: "Your feed narrates your habits: overspend alerts, subscription clusters, weekend patterns — in plain language.",
  },
  {
    n: "03",
    title: "Save more",
    body: "A safe-to-spend number keeps you honest, while auto-save quietly moves money toward your goals on payday.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      className="border-y border-gold/18 bg-band"
    >
      <div className="mx-auto max-w-[1240px] px-12 py-25">
        <h2
          data-reveal
          className="reveal-hidden mb-15 text-center font-serif text-[clamp(32px,4.5vw,46px)] font-medium tracking-[-.015em]"
        >
          Three steps to calmer money
        </h2>
        <div className="grid gap-11 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.n} data-reveal className="reveal-hidden">
              <div className="font-serif text-[58px] leading-none text-gold italic">
                {step.n}
              </div>
              <h3 className="mt-4 mb-2.5 font-serif text-2xl font-semibold">
                {step.title}
              </h3>
              <p className="text-[15.5px] leading-[1.65] text-olive-soft">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
