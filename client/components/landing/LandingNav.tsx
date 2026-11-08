import Link from "next/link";
import { Logo } from "@/components/Logo";

export function LandingNav() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-navy/8 bg-cream/85 px-12 py-[18px] backdrop-blur-[12px]">
      <Logo size={34} tone="navy" wordmark={24} />
      <div className="flex items-center gap-8 text-sm font-medium text-ink-soft">
        <a href="#why" className="hidden text-inherit no-underline sm:inline">
          Why WiseXpense
        </a>
        <a href="#how" className="hidden text-inherit no-underline sm:inline">
          How it works
        </a>
        <Link
          href="/signin"
          className="font-semibold text-navy no-underline"
        >
          Sign in
        </Link>
        <Link
          href="/signin"
          className="rounded-full bg-navy px-[22px] py-[11px] text-sm font-semibold text-cream no-underline transition-all duration-250 hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(12,35,64,.25)]"
        >
          Get started
        </Link>
      </div>
    </nav>
  );
}
