import { createSupabaseServerClient } from "@/lib/supabase/server";

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

            <div className="grid grid-cols-2 gap-4">
                {characters?.map((char) => (
                    <div
                        key={char.id}
                        className="border rounded-xl p-4 hover:bg-muted cursor-pointer transition"
                    >
                        <img
                            src={char.avatar_url}
                            alt={char.name}
                            className="w-16 h-16 rounded-full mb-3"
                        />
                        <h2 className="font-medium">{char.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}