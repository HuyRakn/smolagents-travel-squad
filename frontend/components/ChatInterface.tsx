"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AetherMessage, { Message } from "./AetherMessage";

interface ChatInterfaceProps {
    messages: Message[];
    isGenerating?: boolean;
}

export default function ChatInterface({ messages, isGenerating }: ChatInterfaceProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isGenerating]);

    return (
        <div className="flex-1 w-full max-w-3xl mx-auto px-4 pb-32 overflow-y-auto overflow-x-hidden min-h-[50vh]">
            <div className="flex flex-col gap-6 pt-10">
                <AnimatePresence initial={false}>
                    {messages.map((msg, idx) => (
                        <AetherMessage key={idx} message={msg} />
                    ))}

                    {isGenerating && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex justify-center py-4"
                        >
                            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/5 rounded-full text-zinc-400 text-xs shadow-xl ring-1 ring-white/10">
                                <div className="relative w-4 h-4">
                                    <div className="absolute inset-0 border-2 border-zinc-700/50 rounded-full" />
                                    <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                </div>
                                <span className="font-medium tracking-wide">Generating</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={bottomRef} className="h-4" />
            </div>
        </div>
    );
}
