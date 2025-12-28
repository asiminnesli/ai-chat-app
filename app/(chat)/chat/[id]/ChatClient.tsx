"use client";

import { ChatBubble } from "@/components/chat/bubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { supabase } from "@/lib/supabase/client";
import { useState, useRef, useEffect } from "react";

type Message = {
    id?: string;
    role: "user" | "assistant";
    content: string;
};

export default function ChatClient({
    chatId,
    initialMessages = [],
}: {
    chatId: string;
    initialMessages?: Message[];
}) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chatId) return;

        const fetchMessages = async () => {
            const res = await fetch(`/api/chat/${chatId}`);
            if (!res.ok) return;

            const data = await res.json();
            setMessages(data);
        };

        fetchMessages();
    }, [chatId]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { role: "user", content: input };

        await supabase.from("messages").insert({
            chat_id: chatId,
            role: "user",
            content: input,
        });

        setMessages((m) => [...m, userMsg]);
        setInput("");

        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chatId,
                messages: [...messages, userMsg],
            }),
        });

        if (!res.body) return;

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        let aiMsg: Message = { role: "assistant", content: "" };
        setMessages((m) => [...m, aiMsg]);

        let fullContent = "";

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            fullContent += decoder.decode(value, { stream: true });

            setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    role: "assistant",
                    content: fullContent,
                };
                return updated;
            });

            await new Promise((r) => setTimeout(r, 15));
        }
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => (
                    <ChatBubble key={i} message={msg} isUser={msg.role === "assistant"} />

                ))}
                <div ref={bottomRef} />
            </div>

            <ChatInput
                value={input}
                onChange={setInput}
                onSend={sendMessage}
            />
        </div>
    );
}