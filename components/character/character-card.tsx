"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export function CharacterCard({ character }: { character: any }) {
    const router = useRouter();

    const startChat = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data } = await supabase
            .from("chats")
            .insert({
                user_id: user.id,
                character_id: character.id,
            })
            .select()
            .single();

        router.push(`/chat/${data.id}`);
    };

    return (
        <div
            onClick={startChat}
            className="border rounded-xl p-4 cursor-pointer hover:bg-muted transition"
        >
            <img
                src={character.avatar_url}
                className="w-16 h-16 rounded-full mb-3"
            />
            <h2>{character.name}</h2>
        </div>
    );
}