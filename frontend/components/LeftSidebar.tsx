import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Github, ArrowUpRight } from "lucide-react";

export default function LeftSidebar() {
    return (
        <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex w-[260px] h-screen fixed left-0 top-0 border-r border-white/5 bg-zinc-950/40 backdrop-blur-2xl flex-col z-40"
        >
            {/* Header */}
            <div className="p-5 border-b border-white/5">
                <div className="flex items-center gap-2 mb-1">
                    <GraduationCap size={18} className="text-zinc-300" />
                    <h2 className="text-sm font-bold text-white tracking-wide">AI Agents Course</h2>
                </div>
                <p className="text-xs text-zinc-500 font-medium">Hugging Face • Unit 0</p>
            </div>

            {/* Project Introduction */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
                <div>
                    <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <BookOpen size={14} className="text-zinc-500" />
                        About Project
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed text-justify">
                        This repository is a hands-on implementation for the <strong>🤗 AI Agents Course</strong>. It features a custom Multi-Agent System (MAS) built entirely from scratch using the <code>smolagents</code> library to orchestrate an autonomous <strong>AI Travel Blogger Squad</strong>.
                    </p>
                </div>

                <div className="space-y-3 border-l-2 border-white/10 pl-3">
                    <h4 className="text-xs font-semibold text-zinc-300">The Squad Architecture:</h4>
                    <div className="space-y-4">
                        <div>
                            <span className="text-xs font-medium text-indigo-400 block mb-1">1. Editor Agent (Orchestrator)</span>
                            <p className="text-[11px] text-zinc-500 leading-relaxed text-justify">Runs on <code className="text-zinc-300 bg-white/5 px-1 rounded">Llama-3.3-70B</code> via Groq. It acts as the brain, receiving your travel prompt, delegating research tasks, and finally compiling all facts into a beautifully formatted Markdown travel blog.</p>
                        </div>
                        <div>
                            <span className="text-xs font-medium text-cyan-400 block mb-1">2. Researcher Agent (Worker)</span>
                            <p className="text-[11px] text-zinc-500 leading-relaxed text-justify">A secondary <code className="text-zinc-300 bg-white/5 px-1 rounded">CodeAgent</code> that executes actual Python code to search the web using the Tavily API. It hunts down exact addresses, facts, and price ranges requested by the Editor.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-4 mt-2">
                    <p className="text-[11px] text-zinc-500 leading-relaxed italic text-justify">
                        "This MAS pattern proves that 2 distinct agents—one for deep reasoning and one for isolated web research—outperform a single monolithic agent when crafting complex blog posts."
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5">
                <a
                    href="https://huggingface.co/learn/agents-course/unit0/introduction"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex justify-between items-center px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-lg transition-colors group"
                >
                    <span className="text-xs font-medium text-zinc-300">Start the Course</span>
                    <ArrowUpRight size={14} className="text-zinc-500 group-hover:text-white transition-colors" />
                </a>
            </div>
        </motion.div>
    );
}
