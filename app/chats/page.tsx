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
        characters (
            name,
            avatar_url
        ),
        messages (
            content,
            created_at
        )
    `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .order("created_at", { foreignTable: "messages", ascending: false })
        .limit(1, { foreignTable: "messages" });

    console.log("chats data:", chats);
    return (

        <div className="space-y-2">
            {
                chats?.length === 0 ? (
                    <Link
                        href="/new"
                        className="block p-4 border rounded hover:bg-gray-50 text-center text-blue-600"
                    >
                        Start a new chat
                    </Link>
                ) : (
                    <>
                        {chats?.map((chat) =>
                            chat.messages.length != 0 &&
                            (
                                <Link
                                    key={chat.id}
                                    href={`/chat/${chat.id}`}
                                    className="block p-4 border rounded hover:bg-gray-50"
                                >

                                    <div className="flex justify-between space-x-4">
                                        <div className="flex items-start gap-2">
                                            <img src={chat.characters?.avatar_url ?? "/default-avatar.png"} alt="Avatar" className="rounded-full w-12 h-12 mb-2" />
                                            <div>
                                                <div className="font-medium ">{chat.characters?.name}</div>

                                                <div className="font-light">{chat.messages[0].content.length > 30
                                                    ? `${chat.messages[0].content.slice(0, 30)}...`
                                                    : `${chat.messages[0].content}`}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-medium ">{formatChatTime(chat.messages[0].created_at)}</div>
                                        </div>

                                    </div>
                                </Link>
                            )
                        )}

                    </>
                )
            }
        </div>
    );
}