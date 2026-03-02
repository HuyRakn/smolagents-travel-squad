"use client";

import { motion } from "framer-motion";

export default function HeroHeader() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center text-center gap-3 pt-40 pb-16"
        >
            <motion.div
                variants={item}
                className="w-14 h-14 bg-gradient-to-tr from-zinc-700 to-zinc-900 border border-white/10 shadow-lg rounded-2xl flex items-center justify-center text-sm font-bold text-white tracking-widest mb-4"
            >
                HR
            </motion.div>
            <motion.p variants={item} className="text-zinc-500 text-sm font-medium">
                Good to See You.
            </motion.p>
            <motion.h1
                variants={item}
                className="text-white text-4xl md:text-5xl font-light leading-tight max-w-2xl px-4"
            >
                How <span className="font-semibold text-zinc-100">Can I Write Your Travel Story?</span>
            </motion.h1>
            <motion.p
                variants={item}
                className="text-zinc-500 text-sm max-w-sm mt-2 leading-relaxed"
            >
                Describe a destination, dish, or experience in Da Nang & Vietnam —
                the AI squad will research, illustrate, and publish.
            </motion.p>
        </motion.div>
    );
}
