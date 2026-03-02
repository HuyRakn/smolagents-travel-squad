"use client";

import { motion } from "framer-motion";
import { Github, Globe, Terminal, Activity, ChevronRight } from "lucide-react";

export default function RightSidebar() {
    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hidden xl:flex w-[300px] h-screen fixed right-0 top-0 border-l border-white/5 bg-zinc-950/40 backdrop-blur-2xl flex-col z-40"
        >
            {/* Profile Header */}
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-900 border border-white/10 flex items-center justify-center shadow-lg">
                        <span className="text-sm font-bold text-white tracking-widest">HR</span>
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-white">HuyRakn</h2>
                        <div className="flex items-center gap-1.5 mt-1 opacity-70 hover:opacity-100 transition-opacity">
                            <Github size={12} className="text-zinc-400" />
                            <a href="https://github.com/HuyRakn/smolagents-travel-squad" target="_blank" rel="noreferrer" className="text-xs text-zinc-400 hover:text-white transition-colors decoration-zinc-500 underline underline-offset-2">
                                /smolagents-travel-squad
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cookbook Section - Agent MAP */}
            <div className="flex-1 p-6 flex flex-col gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Globe size={14} className="text-zinc-400" />
                        <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Agent Architecture</h3>
                    </div>

                    {/* Glass Cookbook Box */}
                    <div className="relative rounded-2xl bg-zinc-900/40 p-5 border border-white/5 backdrop-blur-md overflow-hidden group">
                        {/* Animated Glow Grid behind */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />

                        <div className="relative z-10 space-y-6">
                            {/* Editor Node */}
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center z-10 relative">
                                        <Terminal size={14} className="text-indigo-400" />
                                    </div>
                                    {/* Pulse Effect */}
                                    <div className="absolute inset-0 rounded-lg bg-indigo-500/30 animate-ping opacity-50" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-zinc-200">Editor Agent</h4>
                                    <p className="text-[10px] text-zinc-500 mt-0.5">Llama-3.3-70B • Orchestrator</p>
                                </div>
                            </div>

                            {/* Connection Pipeline & Code Block */}
                            <div className="relative border-l-2 border-dashed border-white/10 flex flex-col justify-center ml-4 pl-6 py-2">
                                <motion.div
                                    animate={{ y: [0, 80, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                                />
                                <span className="text-[10px] font-medium text-zinc-500 flex items-center gap-1 mb-2">
                                    Connects & Delegates via
                                </span>

                                <div className="bg-zinc-950/80 border border-white/5 rounded-lg p-3 shadow-inner w-full font-mono text-[9px] leading-relaxed relative overflow-hidden group-hover:border-white/10 transition-colors whitespace-pre-wrap break-words">
                                    <div className="text-purple-400">return <span className="text-zinc-300">CodeAgent(</span></div>
                                    <div className="pl-4">
                                        <span className="text-blue-400">tools</span>=<span className="text-zinc-300">[],</span>
                                    </div>
                                    <div className="pl-4">
                                        <span className="text-blue-400">model</span>=<span className="text-green-300">model</span><span className="text-zinc-300">,</span>
                                    </div>
                                    <div className="pl-4 flex items-start gap-1 group/highlight relative">
                                        <div className="absolute -left-3 w-0.5 h-full bg-yellow-500/0 group-hover/highlight:bg-yellow-500/50 transition-colors" />
                                        <div>
                                            <span className="text-blue-400">managed_agents</span>=<span className="text-zinc-300">[</span><span className="text-yellow-300 group-hover/highlight:animate-pulse">researcher</span><span className="text-zinc-300">],</span>
                                        </div>
                                    </div>
                                    <div className="pl-4">
                                        <span className="text-blue-400">max_steps</span>=<span className="text-orange-300">EDITOR_MAX_STEPS</span><span className="text-zinc-300">,</span>
                                    </div>
                                    <div className="pl-4">
                                        <span className="text-blue-400">name</span>=<span className="text-green-300">"editor_agent"</span><span className="text-zinc-300">,</span>
                                    </div>
                                    <div className="text-zinc-300">)</div>
                                </div>
                            </div>

                            {/* Researcher Node */}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center relative">
                                    <Activity size={14} className="text-cyan-400" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-zinc-200">Researcher Agent</h4>
                                    <p className="text-[10px] text-zinc-500 mt-0.5">Tavily Web Search • CodeAgent</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Status Mockup */}
                <div className="mt-4">
                    <div className="flex items-center justify-between text-xs px-1">
                        <span className="text-zinc-500 font-medium">Memory Usage</span>
                        <span className="text-green-400 font-medium">Stable</span>
                    </div>
                    <div className="h-1 mt-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: "20%" }}
                            animate={{ width: ["20%", "25%", "22%", "28%", "20%"] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="h-full bg-zinc-600 rounded-full"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
