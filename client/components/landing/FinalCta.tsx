import Link from "next/link";
import { Logo } from "@/components/Logo";

export function FinalCta() {
  return (
    <section className="bg-navy text-cream">
      <div className="mx-auto max-w-[900px] px-12 py-30 text-center">
        <h2
          data-reveal
          className="reveal-hidden mb-[22px] font-serif text-[clamp(38px,6vw,58px)] leading-[1.08] font-medium tracking-[-.02em] text-balance"
        >
          Start saving the <em className="text-sand italic">calm</em> way.
        </h2>
        <p
          data-reveal
          className="reveal-hidden mb-10 text-[17.5px] leading-[1.6] text-on-navy"
        >
          Built for young professionals and students who&apos;d rather live
          their life than reconcile it.
        </p>
        <Link
          href="/signin"
          data-reveal
          className="reveal-hidden inline-block rounded-full bg-sand px-[38px] py-[17px] text-[16.5px] font-bold text-navy no-underline transition-all duration-250 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(233,196,106,.35)]"
        >
          Create your account
        </Link>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-cream/12 px-12 py-[26px] text-[13px] text-on-navy">
        <Logo size={24} tone="cream" simple wordmark={17} />
        <div>© 2026 WiseXpense · Privacy · Terms</div>
      </footer>
    </section>
  );
}
