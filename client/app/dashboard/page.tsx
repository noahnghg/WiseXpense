"use client";

import { useState } from "react";
import { AccountsTab } from "@/components/dashboard/AccountsTab";
import { BudgetsTab } from "@/components/dashboard/BudgetsTab";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import { GoalsTab } from "@/components/dashboard/GoalsTab";
import { OverviewHeader } from "@/components/dashboard/OverviewHeader";
import {
  BudgetsCard,
  CashFlowCard,
  GoalsCard,
} from "@/components/dashboard/SidebarCards";
import { StoryFeed } from "@/components/dashboard/StoryFeed";
import { TabHeader } from "@/components/dashboard/TabHeader";
import { TABS, USER_NAME } from "@/lib/data";
import type { DashboardTab } from "@/lib/types";

export default function DashboardPage() {
  const [tab, setTab] = useState<DashboardTab>("overview");
  // Exposed as an editable prop in the design source; pinned on here.
  const showInsights = true;

  const current = TABS.find((t) => t.id === tab) ?? TABS[0];
  const initial = (USER_NAME || "M").trim().charAt(0).toUpperCase();

  const selectTab = (next: DashboardTab) => {
    setTab(next);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-cream">
      <DashboardTopBar tab={tab} onTabChange={selectTab} initial={initial} />

      {tab === "overview" ? (
        <>
          <OverviewHeader userName={USER_NAME} />
          <main className="mx-auto grid max-w-[1180px] items-start gap-11 px-11 pt-10 pb-20 lg:grid-cols-[1fr_370px]">
            <StoryFeed showInsights={showInsights} />
            <aside className="flex flex-col gap-[26px]">
              <BudgetsCard />
              <CashFlowCard />
              <GoalsCard />
            </aside>
          </main>
        </>
      ) : (
        <>
          <TabHeader kicker={current.kicker} title={current.title} />
          {tab === "budgets" && <BudgetsTab />}
          {tab === "goals" && <GoalsTab />}
          {tab === "accounts" && <AccountsTab />}
        </>
      )}
    </div>
  );
}
