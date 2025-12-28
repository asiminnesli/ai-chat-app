"use client";

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

        // ⚡ optimistic UI
        setMessages((m) => [...m, userMsg]);
        setInput("");

        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chatId,
                messages: [...messages, userMsg], // 🔥 GROQ minimum 1 mesaj ister
            }),
        });

        if (!res.body) return;

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        let aiMsg: Message = { role: "assistant", content: "" };
        setMessages((m) => [...m, aiMsg]);

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            aiMsg.content += decoder.decode(value);
            setMessages((m) => [...m.slice(0, -1), aiMsg]);
        }
    };

    /* ⬇️ AUTO SCROLL */
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => (
                    <div key={i}>
                        <b>{msg.role}:</b> {msg.content}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="p-4 border-t flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 border rounded px-3 py-2"
                    placeholder="Type a message..."
                />
                <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-black text-white rounded"
                >
                    Send
                </button>
            </div>
        </div>
    );
}