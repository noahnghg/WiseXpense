"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function Hero() {
    const { user } = useAuth();
    return (
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16 relative overflow-hidden">

            {/* Center Glow Enhancement */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute -z-10 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px]"
            />

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-6xl md:text-8xl font-serif font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary to-accent drop-shadow-sm"
            >
                WiseXpense
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-primary/90 mb-10 max-w-2xl mx-auto"
            >
                Master your financial climate
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-5"
            >
                {user ? (
                    <Link href="/dashboard">
                        <Button size="lg" className="w-44 text-lg h-14 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/25 border-none">
                            Go to Dashboard
                        </Button>
                    </Link>
                ) : (
                    <>
                        <Link href="/auth/signup">
                            <Button size="lg" className="w-44 text-lg h-14 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/25 border-none">
                                Sign Up
                            </Button>
                        </Link>
                        <Link href="/auth/login">
                            <Button size="lg" variant="ghost" className="w-44 text-lg h-14 border border-accent/50 text-accent hover:bg-accent/10 hover:border-accent hover:text-accent font-medium hover:scale-105 transition-all">
                                Login
                            </Button>
                        </Link>
                    </>
                )}
            </motion.div>
        </section>
    );
}
