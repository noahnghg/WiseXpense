"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Github } from "lucide-react";

export default function Home() {
  const [activeSection, setActiveSection] = useState("");
  const [isNavVisible, setIsNavVisible] = useState(false);

  // Monitor Scroll for Navbar Visibility
  useEffect(() => {
    const handleScroll = () => {
      // Show navbar if scrolled past 150px
      setIsNavVisible(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for Active Section highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 } // Trigger when 40% of the section is visible
    );

    document.querySelectorAll("section[id]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Shared framer-motion variants for scroll reveal
  const revealVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const getNavClass = (section: string) => {
    const isActive = activeSection === section;
    return `font-headline text-lg italic tracking-tight transition-colors duration-300 ${
      isActive ? "text-[#D4B06A] font-bold" : "text-[#E5E2E1]/60 hover:text-[#E5E2E1]"
    }`;
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Top Navigation */}
      <nav 
        className={`fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-md transition-transform duration-500 border-b border-[#42474B]/20 ${
          isNavVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <span 
            className="font-georgia font-bold text-2xl text-[#E5E2E1] cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            WiseXpense
          </span>
          <div className="hidden md:flex gap-12">
            <Link className={getNavClass("description")} href="#description">Description</Link>
            <Link className={getNavClass("tech")} href="#tech">Tech</Link>
            <Link className={getNavClass("snippets")} href="#snippets">Snippets</Link>
            <Link className={getNavClass("use-cases")} href="#use-cases">Use Cases</Link>
            <Link 
              className={`flex items-center transition-colors duration-300 ml-4 ${
                activeSection === "github" ? "text-[#D4B06A]" : "text-[#E5E2E1]/60 hover:text-[#E5E2E1]"
              }`} 
              href="#github"
              aria-label="GitHub Repository"
            >
              <Github size={20} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center pt-20 px-8">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#213744_0%,_transparent_50%)]"></div>
        </div>
        <motion.div 
          className="max-w-4xl text-center z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          <span className="font-label text-secondary tracking-[0.3em] uppercase text-xs mb-8 block">Project Showcase Vol. I</span>
          <h1 className="font-georgia font-bold text-7xl md:text-9xl leading-[0.9] editorial-gradient mb-12">
            WiseXpense
          </h1>
          <p className="font-headline text-2xl md:text-4xl text-on-surface-variant italic font-light max-w-2xl mx-auto leading-relaxed">
            The architecture of personal wealth, visualized through a lens of absolute precision.
          </p>
          <motion.div 
            className="mt-20 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <div className="w-px h-24 bg-gradient-to-b from-secondary to-transparent opacity-50"></div>
          </motion.div>
        </motion.div>
      </header>

      {/* Description Section */}
      <motion.section 
        className="py-32 px-8 bg-surface-container-low scroll-mt-24" 
        id="description"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={revealVariants}
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-start">
          <div className="sticky top-32">
            <h2 className="font-headline text-5xl italic mb-8">Redefining the Ritual of Finance</h2>
            <p className="text-on-surface-variant text-xl leading-relaxed mb-8">
              <span className="font-georgia">WiseXpense</span> is not a tool; it is a philosophy. We believe that financial data should be presented with the same elegance as a classical manuscript. By stripping away the clutter of traditional banking apps, we reveal the narrative arc of your capital.
            </p>
            <div className="flex items-center gap-4 text-secondary">
              <span className="font-label text-sm uppercase tracking-widest">Explore Core Purpose</span>
              <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
            </div>
          </div>
          
          <motion.div 
            className="space-y-20"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="group" variants={revealVariants}>
              <span className="font-label text-secondary-fixed-dim block mb-2 text-sm italic">01 / Intentionality</span>
              <h3 className="font-headline text-3xl mb-4 italic">The Ledger as Art</h3>
              <p className="text-on-surface-variant font-light leading-relaxed">Every transaction is a brushstroke. <span className="font-georgia">WiseXpense</span> uses advanced categorization algorithms to paint a vivid picture of your spending habits, turning dry numbers into actionable insight.</p>
            </motion.div>
            <motion.div className="group" variants={revealVariants}>
              <span className="font-label text-secondary-fixed-dim block mb-2 text-sm italic">02 / Sovereignty</span>
              <h3 className="font-headline text-3xl mb-4 italic">Private by Design</h3>
              <p className="text-on-surface-variant font-light leading-relaxed">Your data remains your own. Built on an encrypted foundation, <span className="font-georgia">WiseXpense</span> ensures that your financial identity is protected behind layers of institutional-grade security.</p>
            </motion.div>
            <motion.div className="group" variants={revealVariants}>
              <span className="font-label text-secondary-fixed-dim block mb-2 text-sm italic">03 / Fluidity</span>
              <h3 className="font-headline text-3xl mb-4 italic">The Seamless Flow</h3>
              <p className="text-on-surface-variant font-light leading-relaxed">Multi-currency support and real-time syncing across platforms allow your financial awareness to travel as far as you do, without friction.</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Tech Stack (Bento Grid) */}
      <motion.section 
        className="py-32 px-8 scroll-mt-24" 
        id="tech"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8" variants={revealVariants}>
            <h2 className="font-headline text-6xl italic">The Digital Foundation</h2>
            <span className="font-label text-secondary/60 text-xs tracking-widest uppercase pb-4">Built for longevity</span>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px]">
            <motion.div 
              className="md:col-span-2 md:row-span-2 bg-surface-container-high rounded-xl p-10 flex flex-col justify-between group overflow-hidden relative"
              variants={revealVariants}
            >
              <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <span className="material-symbols-outlined text-[15rem]">terminal</span>
              </div>
              <div>
                <span className="font-label text-secondary text-xs uppercase tracking-widest">Engine</span>
                <h4 className="font-headline text-4xl italic mt-4">Agentic Core</h4>
              </div>
              <p className="text-on-surface-variant max-w-sm">A smart, self-hosted processing core designed for autonomous categorization, privacy, and speed—written entirely in Python.</p>
            </motion.div>
            
            <motion.div 
              className="md:col-span-2 bg-surface-container rounded-xl p-8 flex flex-col justify-between border border-outline-variant/15"
              variants={revealVariants}
            >
              <div>
                <span className="font-label text-secondary text-xs uppercase tracking-widest">Interface</span>
                <h4 className="font-headline text-3xl italic mt-2">Vite + React</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-surface-container-highest px-3 py-1 rounded-full text-xs font-label">Vite Built</span>
                <span className="bg-surface-container-highest px-3 py-1 rounded-full text-xs font-label">Tailwind CSS</span>
                <span className="bg-surface-container-highest px-3 py-1 rounded-full text-xs font-label">Recharts</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-surface-container-low rounded-xl p-8 flex flex-col justify-center items-center text-center"
              variants={revealVariants}
            >
              <span className="material-symbols-outlined text-secondary text-4xl mb-4">database</span>
              <span className="font-label text-xs uppercase tracking-widest">Storage</span>
              <p className="font-headline italic text-lg mt-2">SQLite Embedded</p>
            </motion.div>
            
            <motion.div 
              className="bg-surface-container-low rounded-xl p-8 flex flex-col justify-center items-center text-center"
              variants={revealVariants}
            >
              <span className="material-symbols-outlined text-secondary text-4xl mb-4">security</span>
              <span className="font-label text-xs uppercase tracking-widest">Server</span>
              <p className="font-headline italic text-lg mt-2">FastAPI API</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Snippets (Glassmorphism Cards) */}
      <motion.section 
        className="py-32 px-8 bg-surface-container-lowest overflow-hidden scroll-mt-24" 
        id="snippets"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 className="font-headline text-5xl italic mb-20 text-center" variants={revealVariants}>
            A Glimpse into Excellence
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Snippet 1 */}
            <motion.div 
              className="glass-card p-8 rounded-xl border border-outline-variant/15 relative"
              variants={revealVariants}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-error/40"></div>
                  <div className="w-3 h-3 rounded-full bg-secondary/40"></div>
                  <div className="w-3 h-3 rounded-full bg-primary/40"></div>
                </div>
                <span className="font-label text-[10px] text-on-surface-variant/40 tracking-widest uppercase">Transaction_Parser.py</span>
              </div>
              <pre className="font-label text-sm text-primary/80 overflow-x-auto leading-relaxed">
{`def parse_transactions(payload: dict) -> list[Transaction]:
    """Compile Plaid payload into semantic schema."""
    return [
        Transaction(
            plaid_id=txn.get("transaction_id"),
            name=txn.get("name"),
            amount=txn.get("amount"),
            category=process_category(txn),
        )
        for txn in payload.get("transactions", [])
    ]`}
              </pre>
            </motion.div>
            
            {/* Snippet 2 (Visual UI Preview) */}
            <motion.div 
              className="glass-card rounded-xl border border-outline-variant/15 overflow-hidden flex flex-col"
              variants={revealVariants}
            >
              <div className="p-8 pb-0">
                <span className="font-label text-secondary text-xs uppercase tracking-widest mb-4 block">Visual Composition</span>
                <h4 className="font-headline text-3xl italic mb-6">Harmonic Balance</h4>
              </div>
              <div className="mt-auto pl-8 pb-8 pr-8">
                <div className="bg-surface-container-high rounded-lg p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary">payments</span>
                    </div>
                    <div>
                      <p className="font-label text-sm text-on-surface">Equity Purchase</p>
                      <p className="text-xs text-on-surface-variant">Wealth Management</p>
                    </div>
                  </div>
                  <span className="font-headline italic text-xl text-secondary">-$2,450.00</span>
                </div>
              </div>
              <div className="h-32 bg-gradient-to-t from-primary/10 to-transparent"></div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Use Cases */}
      <motion.section 
        className="py-32 px-8 scroll-mt-24" 
        id="use-cases"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="max-w-2xl mb-24" variants={revealVariants}>
            <h2 className="font-headline text-6xl italic mb-8">Architectures of Wealth</h2>
            <p className="text-on-surface-variant text-xl italic font-light"><span className="font-georgia">WiseXpense</span> adapts to the gravity of your financial world.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-12">
            <motion.div className="relative pt-12 border-t border-outline-variant/30" variants={revealVariants}>
              <span className="absolute top-0 left-0 font-label text-secondary text-xs py-4">01</span>
              <h3 className="font-headline text-3xl italic mb-4">The Portfolio Curator</h3>
              <p className="text-on-surface-variant font-light">For those who view their finances as a collection. Track diversified assets and observe the synergy between your holdings.</p>
            </motion.div>
            <motion.div className="relative pt-12 border-t border-outline-variant/30" variants={revealVariants}>
              <span className="absolute top-0 left-0 font-label text-secondary text-xs py-4">02</span>
              <h3 className="font-headline text-3xl italic mb-4">The Precisionist</h3>
              <p className="text-on-surface-variant font-light">For the detail-oriented. Leverage micro-tagging and nested categories to account for every cent with surgical accuracy.</p>
            </motion.div>
            <motion.div className="relative pt-12 border-t border-outline-variant/30" variants={revealVariants}>
              <span className="absolute top-0 left-0 font-label text-secondary text-xs py-4">03</span>
              <h3 className="font-headline text-3xl italic mb-4">The Global Citizen</h3>
              <p className="text-on-surface-variant font-light">For the nomad. Real-time exchange rates and localized reporting for accounts spanning multiple continents and currencies.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* GitHub & Contribute Section */}
      <motion.section 
        className="py-32 px-8 bg-surface-container-lowest scroll-mt-24" 
        id="github"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-start">
          
          {/* Left Column: GitHub Link */}
          <motion.div variants={revealVariants} className="flex flex-col h-full bg-surface-container-low p-12 rounded-xl border border-outline-variant/15 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <Github size={300} />
            </div>
            <h2 className="font-headline text-5xl italic mb-6">Open Source</h2>
            <p className="text-on-surface-variant text-xl leading-relaxed mb-12 font-light">
              WiseXpense is built in the open. Inspect our architecture, fork the engine, and host your own precise financial climate locally without external dependencies.
            </p>
            <div className="mt-auto">
              <a 
                href="https://github.com/noahnghg/WiseXpense" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-on-surface text-surface px-6 py-3 rounded-full font-label text-sm uppercase tracking-widest hover:bg-secondary transition-colors"
              >
                <Github size={18} />
                View Repository
              </a>
            </div>
          </motion.div>

          {/* Right Column: Contribution Guideline */}
          <motion.div variants={revealVariants} className="space-y-12">
            <div>
              <h3 className="font-headline text-4xl italic mb-6">Contribution Philosophy</h3>
              <p className="text-on-surface-variant font-light leading-relaxed">
                We welcome architects who share our vision for uncompromising financial sovereignty. Our codebase prioritizes clarity over cleverness, and explicit design over implicit magic.
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="group border-l border-outline-variant/30 pl-6 hover:border-secondary/50 transition-colors">
                <span className="font-label text-secondary-fixed-dim block mb-2 text-xs uppercase tracking-widest">Standards</span>
                <h4 className="font-headline text-2xl italic mb-2">Code Quality</h4>
                <p className="text-on-surface-variant font-light text-sm">Follow the single-user local architecture. Ensure standard typing is maintained and backend additions fit loosely coupled modules.</p>
              </div>
              
              <div className="group border-l border-outline-variant/30 pl-6 hover:border-secondary/50 transition-colors">
                <span className="font-label text-secondary-fixed-dim block mb-2 text-xs uppercase tracking-widest">Process</span>
                <h4 className="font-headline text-2xl italic mb-2">Pull Requests</h4>
                <p className="text-on-surface-variant font-light text-sm">Open an issue to discuss significant changes before writing code. Keep PRs focused, atomic, and heavily documented.</p>
              </div>
              
              <div className="group border-l border-outline-variant/30 pl-6 hover:border-secondary/50 transition-colors">
                <span className="font-label text-secondary-fixed-dim block mb-2 text-xs uppercase tracking-widest">Community</span>
                <h4 className="font-headline text-2xl italic mb-2">Discussions</h4>
                <p className="text-on-surface-variant font-light text-sm">Use GitHub Discussions for architectural proposals, API connector requests, or to share your customized local deployment setups.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA / Image Section */}
      <motion.section 
        className="py-24 px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={revealVariants}
      >
        <div className="max-w-7xl mx-auto relative h-[500px] rounded-2xl overflow-hidden group">
          <img 
            alt="Minimalist architectural detail" 
            className="w-full h-full object-cover grayscale opacity-40 group-hover:scale-105 transition-transform duration-[3s]" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ1K5NjSZTK2TUyCuxnPL_wFisL-_4sDpy0uJ8IPeVQUDLGxWNfAU3hr6pnm9AF8s2OGNZm69yDqykr48o7eY8CZWVsaqIiDPPjvzQJEWoHA4uoS7umMlH1GAJSfFjHjeNrikKuZx6tNhtJEWpMSHnYlADet5yYQiZ7WTDDyT05hADljxTKe2W0R8RzVOIpaz35ONvI4HB7F__bREqOY6TD5vhtO4ht-gHbW5WonCSAhjB5PDw9RDyZyaLR9lAbB463DmLz8E59Q"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <h2 className="font-headline text-5xl md:text-7xl italic text-on-surface max-w-3xl mb-12">Elevate your financial perspective.</h2>
            <div className="h-px w-32 bg-secondary/50"></div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="w-full py-20 border-t border-[#42474B]/15 bg-[#131313]">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 max-w-7xl mx-auto gap-8">
          <div className="text-center md:text-left">
            <span className="font-georgia font-bold text-xl text-[#E5E2E1]">WiseXpense</span>
            <p className="font-label text-[10px] text-[#E5E2E1]/40 tracking-widest uppercase mt-2">developed by noahnghg</p>
          </div>
          <div className="flex gap-12">
            <Link className="font-label text-xs tracking-widest uppercase text-[#E5E2E1]/40 hover:text-[#B2CADB] transition-colors" href="#description">Description</Link>
            <Link className="font-label text-xs tracking-widest uppercase text-[#E5E2E1]/40 hover:text-[#B2CADB] transition-colors" href="#tech">Tech</Link>
            <Link className="font-label text-xs tracking-widest uppercase text-[#E5E2E1]/40 hover:text-[#B2CADB] transition-colors" href="#snippets">Snippets</Link>
            <Link className="font-label text-xs tracking-widest uppercase text-[#E5E2E1]/40 hover:text-[#B2CADB] transition-colors" href="#use-cases">Use Cases</Link>
          </div>
          <div className="flex gap-6">
            <a 
              href="https://github.com/noahnghg/WiseXpense" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#E5E2E1]/40 hover:text-secondary transition-colors"
              aria-label="GitHub Repository"
            >
              <Github size={24} />
            </a>
          </div>
        </div>
      </footer>
    </motion.main>
  );
}
