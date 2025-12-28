import { createSupabaseServerClient } from "@/lib/supabase/server";
import ChatbotCard from "@/components/character/chatbotChacters";

export default async function NewChatPage() {
    const supabase = await createSupabaseServerClient();

    const { data: characters } = await supabase
        .from("characters")
        .select("*")
        .order("created_at");

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">
                Choose your AI character
            </h1>

            <div className="flex flex-wrap gap-4">
                {characters?.map((char) => (
                    <ChatbotCard key={char.id} chatbot={char} />
                ))}
            </div>
        </div>
    );
}