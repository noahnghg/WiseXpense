"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const FIELD =
  "rounded-xl border-[1.5px] border-navy/18 bg-panel px-4 py-[13px] text-[15px] text-navy outline-none transition-all duration-200 focus:border-gold focus:shadow-[0_0_0_3px_rgba(181,137,0,.15)]";

/**
 * Demo sign-in. There is no auth backend yet, so either button simply walks
 * the user into the dashboard — the credentials are prefilled to make that
 * obvious rather than pretending to validate.
 */
export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("maya@example.com");
  const [password, setPassword] = useState("demo-password");

  const enter = () => router.push("/dashboard");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        enter();
      }}
      className="flex w-full max-w-[380px] animate-rise flex-col gap-[18px] [animation-delay:.15s]"
    >
      <h2 className="mb-1 font-serif text-4xl font-medium tracking-[-.015em]">
        Welcome back
      </h2>
      <p className="mb-2.5 text-[14.5px] text-muted">
        Sign in to see what your money&apos;s been up to.
      </p>

      <label className="flex flex-col gap-[7px] text-[13px] font-semibold text-ink-soft">
        Email
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={FIELD}
        />
      </label>

      <label className="flex flex-col gap-[7px] text-[13px] font-semibold text-ink-soft">
        Password
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={FIELD}
        />
      </label>

      <button
        type="submit"
        className="mt-2 cursor-pointer rounded-full bg-navy py-[15px] text-[15.5px] font-semibold text-cream transition-all duration-250 hover:-translate-y-px hover:shadow-[0_8px_22px_rgba(12,35,64,.3)]"
      >
        Sign in
      </button>

      <div className="text-center text-[13.5px] text-muted">
        New here?{" "}
        <button
          type="button"
          onClick={enter}
          className="cursor-pointer font-semibold text-gold"
        >
          Create an account
        </button>
      </div>
    </form>
  );
}
