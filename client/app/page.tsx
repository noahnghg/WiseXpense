import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      <Hero />
      <Features />

      {/* Footer */}
      <footer className="py-12 text-center text-sm text-gray-400 font-sans">
        © 2026 WiseXpense. All rights reserved.
      </footer>
    </main>
  );
}
