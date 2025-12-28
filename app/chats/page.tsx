import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatChatTime } from "@/lib/formatChatTime";

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
      characters!inner (
        name,
        avatar_url
      ),
      last_message:messages (
        content,
        created_at
      )
    `)
        .eq("user_id", user.id)
        .order("created_at", { foreignTable: "last_message", ascending: false })
        .limit(1, { foreignTable: "last_message" });

    if (!chats || chats.length === 0) {
        return (
            <Link
                href="/new"
                className="block p-4 border rounded hover:bg-gray-50 text-center text-blue-600"
            >
                Start a new chat
            </Link>
        );
    }

    return (
        <div className="space-y-2">
            {chats.map((chat) => {
                const lastMessage = chat.last_message?.[0];

                if (!lastMessage) return null;

                return (
                    <Link
                        key={chat.id}
                        href={`/chat/${chat.id}`}
                        className="block p-4 border rounded hover:bg-gray-50"
                    >
                        <div className="flex justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <img
                                    // @ts-ignore
                                    src={chat.characters.avatar_url || "/default-avatar.png"}
                                    // @ts-ignore
                                    alt={chat.characters.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />

                                <div>
                                    <div className="font-medium">
                                        {/* @ts-ignore  */}
                                        {chat.characters.name}
                                    </div>

                                    <div className="text-sm text-gray-600 truncate max-w-[220px]">
                                        {lastMessage.content.length > 30
                                            ? `${lastMessage.content.slice(0, 30)}…`
                                            : lastMessage.content}
                                    </div>
                                </div>
                            </div>

                            <div className="text-xs text-gray-500 whitespace-nowrap">
                                {formatChatTime(lastMessage.created_at)}
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}