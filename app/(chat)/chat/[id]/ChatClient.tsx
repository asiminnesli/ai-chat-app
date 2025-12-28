"use client";

import { ChatBubble } from "@/components/chat/bubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
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
    const [character, setCharacter] = useState<any | null>(null);
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
        getCharacter();

    }, [chatId]);

    const getCharacter = async () => {
        console.log('chat_id', chatId);
        const { data: chat, error } = await supabase
            .from("chats")
            .select(`
    character_id,
    characters (
        id,
        name,
        avatar_url,
        system_prompt
    )
  `)
            .eq("id", chatId)
            .single();

        setCharacter(chat?.characters);
    };
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
        <div className="flex flex-col h-full">
            <div className="h-14 border-b bg-white flex items-center px-4 justify-between">
                <div className="flex items-center gap-2">
                    <Link
                        className="rounded-md p-1 hover:bg-gray-100 cursor-pointer"
                        /* Navigate back to chats list */
                        href="/chats"
                    >
                        <svg
                            className="h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </Link>
                    <div className="flex items-center gap-1">
                        <img src={character?.avatar_url || "/default-avatar.png"} alt="Character Avatar" className="h-8 w-8 rounded-full object-cover" />
                        <span className="font-medium">{character?.name}</span>
                    </div>

                </div>

            </div>
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