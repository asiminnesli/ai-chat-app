import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ChatsPage() {
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return <div className="p-6">Unauthorized</div>;
    }

    const { data: chats } = await supabase
        .from("chats")
        .select(`
            id,
            created_at,
            characters ( name )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Your Chats</h1>

            <div className="space-y-2">
                {chats?.map((chat) => (
                    <Link
                        key={chat.id}
                        href={`/chat/${chat.id}`}
                        className="block p-4 border rounded hover:bg-gray-50"
                    >
                        <div className="font-medium">
                            {chat.characters?.name ?? "Chat"}
                        </div>
                        <div className="text-sm text-gray-500">
                            {new Date(chat.created_at).toLocaleString()}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}