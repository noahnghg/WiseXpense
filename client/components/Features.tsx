"use client";

import { motion } from "framer-motion";
import { Activity, Wallet, TrendingUp } from "lucide-react";

export function Features() {
    const features = [
        {
            icon: Activity,
            title: "Real-time Tracking",
            description: "Monitor your cash flow as it happens."
        },
        {
            icon: Wallet,
            title: "Smart Buckets",
            description: "Organize savings for what matters."
        },
        {
            icon: TrendingUp,
            title: "Future Forecasting",
            description: "Predict your financial weather."
        },
    ];

    return (
        <section className="py-24 px-6 max-w-4xl mx-auto">
            <div className="flex flex-col gap-12">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        className="flex items-center gap-6 group cursor-default"
                    >
                        <div className="p-4 rounded-full bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300 transform group-hover:scale-110 shadow-sm">
                            <feature.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-4xl md:text-5xl font-serif font-medium text-primary group-hover:text-accent transition-colors duration-300">
                                {feature.title}
                            </h2>
                            <p className="text-lg text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-0 group-hover:h-auto overflow-hidden">
                                {feature.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
