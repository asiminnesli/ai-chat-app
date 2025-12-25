import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ChatPage({
    params,
}: {
    params: { id: string };
}) {
    const supabase = await createSupabaseServerClient();

    const { data: messages } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", params.id)
        .order("created_at");

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages?.map((msg) => (
                    <div
                        key={msg.id}
                        className={`max-w-[80%] p-3 rounded-xl ${msg.role === "user"
                                ? "bg-primary text-white ml-auto"
                                : "bg-muted"
                            }`}
                    >
                        {msg.content}
                    </div>
                ))}
            </div>

            <div className="border-t p-4">
                <input
                    placeholder="Type a message..."
                    className="w-full border rounded-lg px-3 py-2"
                />
            </div>
        </div>
    );
}