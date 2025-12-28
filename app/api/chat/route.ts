import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
    try {
        const supabase = await createSupabaseServerClient();
        const { chatId, messages } = await req.json();

        if (!chatId || !messages || messages.length === 0) {
            return NextResponse.json(
                { error: "chatId or messages missing" },
                { status: 400 }
            );
        }

        /* ---------------------------
           1️⃣ chat → character_id
        ---------------------------- */
        const { data: chat, error: chatError } = await supabase
            .from("chats")
            .select("character_id")
            .eq("id", chatId)
            .single();

        if (chatError || !chat?.character_id) {
            return NextResponse.json(
                { error: "Chat or character not found" },
                { status: 400 }
            );
        }

        const { data: character, error: charError } = await supabase
            .from("characters")
            .select("system_prompt")
            .eq("id", chat.character_id)
            .single();

        if (charError || !character?.system_prompt) {
            return NextResponse.json(
                { error: "System prompt not found" },
                { status: 400 }
            );
        }

        const { data: history } = await supabase
            .from("messages")
            .select("role, content")
            .eq("chat_id", chatId)
            .order("created_at");

        const finalMessages = [
            { role: "system", content: character.system_prompt },
            ...(history ?? []),
        ];

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: finalMessages,
            stream: true,
        });

        let fullResponse = "";

        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of completion) {
                    const token = chunk.choices[0]?.delta?.content;
                    if (token) {
                        fullResponse += token;
                        controller.enqueue(new TextEncoder().encode(token));
                    }
                }

                await supabase.from("messages").insert({
                    chat_id: chatId,
                    role: "assistant",
                    content: fullResponse,
                });

                controller.close();
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
            },
        });
    } catch (err: any) {
        console.error("API CHAT ERROR:", err);
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}