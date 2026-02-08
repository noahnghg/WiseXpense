"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { ArrowUpRight, ArrowDownLeft, Wallet, CreditCard, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock Data
const data = [
    { name: "Jan", amount: 2400 },
    { name: "Feb", amount: 1398 },
    { name: "Mar", amount: 9800 },
    { name: "Apr", amount: 3908 },
    { name: "May", amount: 4800 },
    { name: "Jun", amount: 3800 },
    { name: "Jul", amount: 4300 },
];

const buckets = [
    { name: "Emergency Fund", target: 10000, current: 8500, color: "bg-blue-500/90 shadow-blue-500/20" },
    { name: "Travel", target: 5000, current: 1200, color: "bg-yellow-500/90 shadow-yellow-500/20" },
    { name: "New Laptop", target: 2000, current: 1800, color: "bg-purple-500/90 shadow-purple-500/20" },
    { name: "Gifts", target: 500, current: 100, color: "bg-pink-500/90 shadow-pink-500/20" },
];

const transactions = [
    { id: 1, name: "Grocery Store", date: "Today", amount: -120.50, type: "expense" },
    { id: 2, name: "Salary Deposit", date: "Yesterday", amount: 4500.00, type: "income" },
    { id: 3, name: "Electric Bill", date: "Yesterday", amount: -95.00, type: "expense" },
    { id: 4, name: "Coffee Shop", date: "2 days ago", amount: -5.40, type: "expense" },
    { id: 5, name: "Freelance Work", date: "3 days ago", amount: 850.00, type: "income" },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

export function Dashboard() {
    const overviewRef = useRef<HTMLDivElement>(null);
    const bucketsRef = useRef<HTMLDivElement>(null);
    const transactionsRef = useRef<HTMLDivElement>(null);
    const analysisRef = useRef<HTMLDivElement>(null);

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Navigation */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-background/80 backdrop-blur-md border-b border-primary/10"
            >
                <div className="flex items-center justify-between max-w-5xl mx-auto">
                    <Link href="/" className="text-xl font-serif font-bold text-primary">
                        WiseXpense
                    </Link>
                    <div className="hidden md:flex items-center gap-8 font-sans text-sm font-medium text-muted-foreground">
                        <button onClick={() => scrollToSection(overviewRef)} className="hover:text-primary hover:scale-105 transition-all">Overview</button>
                        <button onClick={() => scrollToSection(bucketsRef)} className="hover:text-primary hover:scale-105 transition-all">Buckets</button>
                        <button onClick={() => scrollToSection(transactionsRef)} className="hover:text-primary hover:scale-105 transition-all">Transactions</button>
                        <button onClick={() => scrollToSection(analysisRef)} className="hover:text-primary hover:scale-105 transition-all">Analysis</button>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold font-serif shadow-lg shadow-primary/20">
                        A
                    </div>
                </div>
            </motion.nav>

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="pt-24 px-6 max-w-3xl mx-auto flex flex-col gap-24"
            >

                {/* Overview Section */}
                <motion.section ref={overviewRef} variants={itemVariants} className="flex flex-col gap-2">
                    <h1 className="text-3xl font-serif text-primary/60">Good afternoon, Alex</h1>
                    <div className="mt-4">
                        <p className="text-sm font-sans text-muted-foreground uppercase tracking-wider font-semibold">Total Balance</p>
                        <motion.h2
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="text-6xl md:text-7xl font-serif font-bold text-accent mt-2 drop-shadow-sm"
                        >
                            $14,250.00
                        </motion.h2>
                    </div>
                    <div className="flex gap-4 mt-8">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20">
                            <ArrowUpRight className="w-4 h-4" />
                            <span className="font-serif font-bold">+$4,500</span>
                            <span className="text-xs opacity-70">mo</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20">
                            <ArrowDownLeft className="w-4 h-4" />
                            <span className="font-serif font-bold">-$2,100</span>
                            <span className="text-xs opacity-70">mo</span>
                        </div>
                    </div>
                </motion.section>

                {/* Money Buckets */}
                <motion.section ref={bucketsRef} variants={itemVariants} className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-primary">Money Buckets</h3>
                    </div>

                    <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar -mx-6 px-6 snap-x">
                        {buckets.map((bucket, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="flex-none w-72 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none snap-center transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className="font-serif font-bold text-lg text-primary">{bucket.name}</span>
                                    <span className={`w-3 h-3 rounded-full ${bucket.color}`} />
                                </div>
                                <div className="flex items-end gap-1 mb-2">
                                    <span className="text-2xl font-serif font-bold text-foreground">${bucket.current.toLocaleString()}</span>
                                    <span className="text-sm text-muted-foreground mb-1">/ ${bucket.target.toLocaleString()}</span>
                                </div>
                                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${(bucket.current / bucket.target) * 100}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className={`h-full rounded-full ${bucket.color}`}
                                    />
                                </div>
                            </motion.div>
                        ))}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex-none w-24 flex items-center justify-center rounded-2xl border-2 border-dashed border-primary/20 text-primary/40 hover:text-primary hover:border-primary cursor-pointer transition-all bg-primary/5"
                        >
                            <span className="text-3xl">+</span>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Latest Transactions */}
                <motion.section ref={transactionsRef} variants={itemVariants} className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-primary">Latest Transactions</h3>
                    </div>

                    <div className="flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none overflow-hidden">
                        {transactions.map((t, i) => (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-default"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="font-serif font-medium text-lg text-foreground">{t.name}</span>
                                    <span className="text-xs text-muted-foreground">{t.date}</span>
                                </div>
                                <span className={`font-serif font-bold text-lg ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                    {t.type === 'income' ? '+' : ''}
                                    ${Math.abs(t.amount).toFixed(2)}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                    <Button variant="ghost" className="self-center mt-2 font-sans text-primary hover:bg-primary/5">
                        View All Transactions
                    </Button>
                </motion.section>

                {/* Spending Analysis */}
                <motion.section ref={analysisRef} variants={itemVariants} className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <PieChart className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-primary">Spending Analysis</h3>
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="h-[300px] w-full bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#334E68" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#334E68" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fontFamily: 'sans-serif', fill: '#888' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fontFamily: 'sans-serif', fill: '#888' }}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontFamily: 'Georgia', color: 'var(--primary)', fontWeight: 'bold' }}
                                    cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="var(--primary)"
                                    fillOpacity={1}
                                    fill="url(#colorAmount)"
                                    strokeWidth={3}
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>
                </motion.section>

            </motion.main>
        </div>
    );
}
