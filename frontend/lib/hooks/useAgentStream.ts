"use client";

import { useState } from "react";
import { Message } from "@/components/AetherMessage";

export function useAgentStream() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const sendMessage = async (message: string) => {
        setIsGenerating(true);

        // Add user message to history
        const userMsg: Message = { role: "user", content: message };
        setMessages((prev) => [...prev, userMsg]);

        try {
            const response = await fetch("http://localhost:8000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            if (!response.body) return;

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let assistantMsg: Message = { role: "assistant", content: "", reasoning: "", type: "thought" };
            setMessages((prev) => [...prev, assistantMsg]);

            let accumulatedReasoning = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split("\n");

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.type === "thought") {
                                // Strip any HTML tags (like <span...>) for cleaner markdown rendering
                                const cleanThought = data.content.replace(/<[^>]*>/g, "");
                                accumulatedReasoning += (accumulatedReasoning ? "\n" : "") + cleanThought;
                                assistantMsg = { ...assistantMsg, reasoning: accumulatedReasoning, type: "thought" };
                                setMessages((prev) => [...prev.slice(0, -1), assistantMsg]);
                            } else if (data.type === "final") {
                                assistantMsg = { ...assistantMsg, content: data.content, type: "final" };
                                setMessages((prev) => [...prev.slice(0, -1), assistantMsg]);
                            } else if (data.type === "image") {
                                const imageMsg: Message = { role: "assistant", content: "", type: "image", url: data.url };
                                setMessages((prev) => [...prev, imageMsg]);
                            } else if (data.type === "error") {
                                assistantMsg = { ...assistantMsg, content: `Error: ${data.content}`, type: "final" };
                                setMessages((prev) => [...prev.slice(0, -1), assistantMsg]);
                            }
                        } catch (err) {
                            console.error("Error parsing SSE data:", err);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Connection error. Is the backend running?", type: "final" },
            ]);
        } finally {
            setIsGenerating(false);
        }
    };

    const clearChat = () => {
        setMessages([]);
    };

    return { messages, isGenerating, sendMessage, clearChat };
}
