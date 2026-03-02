"use client";

import { motion, AnimatePresence } from "framer-motion";
import ParticlesBackground from "@/components/ParticlesBackground";
import GlowSpotlight from "@/components/GlowSpotlight";
import HeroHeader from "@/components/HeroHeader";
import AetherInput from "@/components/AetherInput";
import ChatInterface from "@/components/ChatInterface";
import { useAgentStream } from "@/lib/hooks/useAgentStream";
import { X } from "lucide-react";

export default function AetherPage() {
  const { messages, isGenerating, sendMessage, clearChat } = useAgentStream();

  const showHero = messages.length === 0;

  return (
    <main className="relative min-h-screen flex flex-col items-center selection:bg-white/10 selection:text-white">
      <ParticlesBackground />
      <GlowSpotlight />

      {/* Header / Top Bar */}
      <div className="fixed top-0 w-full flex justify-between items-center px-6 py-4 z-50 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Sidebar toggle or menu if needed */}
        </div>
        <div className="pointer-events-auto">
          <button className="px-4 py-1.5 bg-zinc-900 border border-white/10 rounded-full text-[11px] font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
            Upgrade
          </button>
        </div>
      </div>

      <div className="flex-1 w-full flex flex-col">
        <AnimatePresence mode="wait">
          {showHero ? (
            <HeroHeader key="hero" />
          ) : (
            <ChatInterface key="chat" messages={messages} isGenerating={isGenerating} />
          )}
        </AnimatePresence>
      </div>

      {/* Suggestion Chips (only when hero is visible) */}
      <AnimatePresence>
        {showHero && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-wrap justify-center gap-2 mb-8 px-4 max-w-2xl"
          >
            {[
              "Write a blog post about 'Ca Phe Muoi' in Da Nang",
              "Explore Ba Na Hills and the Golden Bridge",
              "'Mi Quang' — the soul of Central Vietnamese cuisine",
              "Han Market at night — a travel guide",
              "Hoi An Ancient Town lantern festival",
            ].map((text) => (
              <button
                key={text}
                onClick={() => sendMessage(text)}
                className="px-4 py-1.5 bg-zinc-900/40 border border-white/5 rounded-full text-[11px] text-zinc-500 hover:text-zinc-300 hover:border-white/10 transition-all"
              >
                {text}
              </button>
            ))}
            <button className="p-1 text-zinc-600 hover:text-zinc-400">
              <span className="text-lg">···</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AetherInput onSendMessage={sendMessage} isGenerating={isGenerating} />

      {/* Reset Button (Floating) */}
      {!showHero && (
        <button
          onClick={clearChat}
          className="fixed top-4 left-6 p-2 bg-zinc-900/50 border border-white/10 rounded-full text-zinc-500 hover:text-white transition-all z-50"
          title="Clear Conversation"
        >
          <X size={18} />
        </button>
      )}

      {/* Footer */}
      <footer className="w-full text-center py-6 text-[10px] text-zinc-600 font-medium tracking-tight mt-auto">
        <div className="flex items-center justify-center gap-1.5">
          <span>Unlock new era with AetherAI.</span>
          <a href="#" className="underline decoration-zinc-700 underline-offset-2 hover:text-zinc-400 transition-colors">
            share us
          </a>
        </div>
      </footer>
    </main>
  );
}
