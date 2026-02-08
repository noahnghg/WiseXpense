"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16 relative overflow-hidden">

            {/* Dynamic Background Circle behind text */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"
            />

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-6xl md:text-8xl font-serif font-bold tracking-tight mb-6 text-primary drop-shadow-sm"
            >
                WiseXpense
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl font-serif text-primary/80 mb-10 max-w-2xl mx-auto"
            >
                Master your financial climate
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
            >
                <Link href="/dashboard">
                    <Button size="lg" className="w-40 text-lg h-12 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105">
                        Sign Up
                    </Button>
                </Link>
                <Link href="/dashboard">
                    <Button size="lg" variant="ghost" className="w-40 text-lg h-12 border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary transition-all hover:scale-105">
                        Login
                    </Button>
                </Link>
            </motion.div>
        </section>
    );
}
