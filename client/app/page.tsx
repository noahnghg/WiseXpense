"use client";

import { FinalCta } from "@/components/landing/FinalCta";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingNav } from "@/components/landing/LandingNav";
import { NarratedFeed } from "@/components/landing/NarratedFeed";
import { Ticker } from "@/components/landing/Ticker";
import { useReveal } from "@/hooks/useReveal";

export default function LandingPage() {
  useReveal();

  return (
    <div className="min-h-screen bg-cream">
      <LandingNav />
      <Hero />
      <Ticker />
      <NarratedFeed />
      <HowItWorks />
      <FinalCta />
    </div>
  );
}
