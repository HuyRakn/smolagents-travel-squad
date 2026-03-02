"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Plus, Mic, ArrowUp, X } from "lucide-react";

interface AetherInputProps {
    onSendMessage: (msg: string) => void;
    isGenerating?: boolean;
}

export default function AetherInput({ onSendMessage, isGenerating }: AetherInputProps) {
    const [value, setValue] = useState("");

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (value.trim() && !isGenerating) {
            onSendMessage(value);
            setValue("");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-2xl mx-auto px-4 sticky bottom-8 z-50"
        >
            <div className="relative group">
                {/* Glow effect around input */}
                <div className="absolute -inset-0.5 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

                <div className="relative flex flex-col bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden inset-shadow-top shadow-2xl">
                    {/* Status Bar */}
                    <div className="flex items-center justify-between px-4 py-2 text-[11px] font-medium border-b border-white/5">
                        <div className="flex items-center gap-1.5 text-zinc-500">
                            <Zap size={12} className="text-zinc-400" />
                            <span>Unlock more features with the Pro plan.</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-500">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                            <span>Active extensions</span>
                        </div>
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-3">
                        <button
                            type="button"
                            className="p-1 text-zinc-500 hover:text-white transition-colors"
                        >
                            <Plus size={18} />
                        </button>

                        <div className="w-[1px] h-4 bg-white/10" />

                        <input
                            autoFocus
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="Ask HuyRakn to write a travel story..."
                            disabled={isGenerating}
                            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-zinc-500 py-1"
                        />

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="p-1.5 text-zinc-500 hover:text-white transition-colors"
                            >
                                <div className="flex items-center gap-0.5">
                                    <div className="w-[2px] h-2 bg-zinc-600 rounded-full animate-[bounce_1s_infinite_0s]" />
                                    <div className="w-[2px] h-3 bg-zinc-500 rounded-full animate-[bounce_1s_infinite_0.1s]" />
                                    <div className="w-[2px] h-2 bg-zinc-600 rounded-full animate-[bounce_1s_infinite_0.2s]" />
                                </div>
                            </button>

                            <div className="w-[1px] h-4 bg-white/10 mx-1" />

                            <button
                                type="submit"
                                disabled={!value.trim() || isGenerating}
                                className="p-1.5 bg-zinc-800 border border-white/10 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all disabled:opacity-30 disabled:hover:bg-zinc-800"
                            >
                                <ArrowUp size={16} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}
