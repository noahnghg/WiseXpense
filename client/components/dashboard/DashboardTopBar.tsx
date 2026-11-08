"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { TABS } from "@/lib/data";
import type { DashboardTab } from "@/lib/types";

export function DashboardTopBar({
  tab,
  onTabChange,
  initial,
}: {
  tab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  initial: string;
}) {
  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 bg-navy px-11 py-4 text-cream">
      <Link href="/" className="no-underline">
        <Logo size={30} tone="cream" wordmark={21} />
      </Link>

      <div className="flex items-center gap-2.5">
        {TABS.map(({ id, label }) => {
          const active = id === tab;
          return (
            <button
              key={id}
              type="button"
              aria-current={active ? "page" : undefined}
              onClick={() => onTabChange(id)}
              className={`cursor-pointer rounded-full border px-[17px] py-2 text-[13px] font-semibold transition-all duration-200 ${
                active
                  ? "border-sand bg-sand text-navy"
                  : "border-cream/25 bg-transparent text-on-navy-soft hover:border-sand/60"
              }`}
            >
              {label}
            </button>
          );
        })}
        <span className="grid size-8 place-items-center rounded-full bg-sand text-[13px] font-bold text-navy">
          {initial}
        </span>
      </div>
    </nav>
  );
}
