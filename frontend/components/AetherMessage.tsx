"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export interface Message {
    role: "user" | "assistant";
    content: string;
    reasoning?: string;
    type?: "thought" | "final" | "image";
    url?: string;
}

interface AetherMessageProps {
    message: Message;
}

export default function AetherMessage({ message }: AetherMessageProps) {
    const isUser = message.role === "user";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex flex-col ${isUser ? "items-end" : "items-start"} w-full`}
        >
            <div className="max-w-[85%] w-full flex flex-col gap-3">
                {/* Reasoning Block (Gemini-style) */}
                {message.reasoning && (
                    <div className="bg-zinc-950/70 border border-white/5 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-3xl overflow-hidden mb-4 border-l-2 border-l-zinc-500/20">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.03]">
                            <div className="flex items-center gap-2.5 opacity-60 uppercase tracking-[0.2em] text-[8px] font-bold text-zinc-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse shadow-[0_0_5px_rgba(255,255,255,0.2)]" />
                                Aether Perception
                            </div>
                        </div>
                        <div className="h-[160px] overflow-y-auto px-5 py-4 text-zinc-500 text-[11px] font-mono leading-relaxed scroll-smooth custom-scrollbar">
                            <ReactMarkdown>
                                {message.reasoning}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}

                {/* Main Content Block */}
                {(message.content || message.type === "image") && (
                    <div
                        className={`rounded-2xl px-5 py-4 transition-all duration-300 ${isUser
                            ? "bg-zinc-800 border border-white/5 text-zinc-100 shadow-lg ml-auto"
                            : "bg-zinc-900/40 border border-white/10 text-zinc-200 backdrop-blur-sm shadow-2xl"
                            }`}
                    >
                        {message.type === "image" && message.url ? (
                            <img
                                src={`http://localhost:8000${message.url}`}
                                alt="Travel Hero"
                                className="rounded-xl w-full h-auto object-cover border border-white/10 shadow-2xl mb-2"
                            />
                        ) : (
                            <ReactMarkdown
                                components={{
                                    code({ node, inline, className, children, ...props }: any) {
                                        const match = /language-(\w+)/.exec(className || "");
                                        return !inline && match ? (
                                            <SyntaxHighlighter
                                                style={oneDark}
                                                language={match[1]}
                                                PreTag="div"
                                                className="rounded-lg border border-white/5 my-2 text-xs"
                                                {...props}
                                            >
                                                {String(children).replace(/\n$/, "")}
                                            </SyntaxHighlighter>
                                        ) : (
                                            <code
                                                className="bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono text-zinc-300"
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        );
                                    },
                                    img: ({ src, alt }) => {
                                        const srcStr = typeof src === "string" ? src : "";
                                        const fullSrc = srcStr.startsWith("/static") ? `http://localhost:8000${srcStr}` : srcStr;
                                        return <img src={fullSrc} alt={alt} className="rounded-xl w-full h-auto mt-4 mb-2 shadow-lg border border-white/5" />;
                                    },
                                    p: ({ children }) => <p className="leading-relaxed mb-3 last:mb-0">{children}</p>,
                                    h1: ({ children }) => <h1 className="text-xl font-semibold text-white mb-4">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-lg font-medium text-zinc-100 mt-6 mb-3 border-b border-white/5 pb-1">{children}</h2>,
                                    ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4 text-zinc-300">{children}</ul>,
                                    li: ({ children }) => <li className="marker:text-zinc-500">{children}</li>,
                                    table: ({ children }) => (
                                        <div className="overflow-x-auto my-4 border border-white/5 rounded-xl">
                                            <table className="w-full text-sm border-collapse">{children}</table>
                                        </div>
                                    ),
                                    th: ({ children }) => <th className="bg-white/5 p-2 text-left text-zinc-400 font-medium border border-white/5">{children}</th>,
                                    td: ({ children }) => <td className="p-2 border border-white/5 text-zinc-400">{children}</td>,
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
