import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SignInForm } from "@/components/signin/SignInForm";

export const metadata = { title: "Sign in — WiseXpense" };

export default function SignInPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel */}
      <div className="relative flex flex-col justify-between overflow-hidden bg-navy px-14 py-11 text-cream">
        <div
          aria-hidden="true"
          className="absolute -top-[90px] -right-[90px] size-[320px] animate-floaty rounded-full bg-sand/14 [animation-duration:9s]"
          style={{ "--r": "0deg" } as React.CSSProperties}
        />
        <div
          aria-hidden="true"
          className="absolute bottom-15 -left-[70px] size-[220px] animate-floaty rounded-full border-[1.5px] border-sand/35 [animation-delay:1s]"
          style={{ "--r": "0deg" } as React.CSSProperties}
        />

        <Link href="/" className="relative w-fit no-underline">
          <Logo size={34} tone="cream" wordmark={24} />
        </Link>

        <div className="relative animate-rise">
          <h1 className="mb-[18px] font-serif text-[clamp(38px,6vw,56px)] leading-[1.08] font-medium tracking-[-.02em] text-balance">
            Money, <em className="text-sand italic">understood.</em>
          </h1>
          <p className="max-w-[400px] text-base leading-[1.65] text-on-navy">
            Your spending, told back to you as a story you can actually act on.
          </p>
        </div>

        <div className="relative font-serif text-[17px] text-on-navy italic">
          &ldquo;The first budgeting app that didn&apos;t make me feel
          bad.&rdquo; — Priya, grad student
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-12">
        <SignInForm />
      </div>
    </div>
  );
}
