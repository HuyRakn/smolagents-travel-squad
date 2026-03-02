"use client";

import { motion } from "framer-motion";

export default function GlowSpotlight() {
    return (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 -z-20 w-full max-w-[1000px] h-[500px] pointer-events-none">
            <motion.div
                animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.15, 0.2, 0.15],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="w-full h-full rounded-full bg-white blur-[120px]"
            />
        </div>
    );
}
