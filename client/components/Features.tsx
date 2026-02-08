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
        <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        className="flex flex-col items-center text-center gap-6 group cursor-default p-6 rounded-2xl hover:bg-primary/5 transition-colors duration-500"
                    >
                        <div className="p-5 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 transform group-hover:scale-110 shadow-lg shadow-primary/10">
                            <feature.icon className="w-10 h-10" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-medium text-primary-foreground group-hover:text-accent transition-colors duration-300">
                                {feature.title}
                            </h2>
                            <p className="text-lg text-muted-foreground mt-3 opacity-80 group-hover:opacity-100 transition-opacity duration-300 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
