"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ChatbotCard({ chatbot }: { chatbot: any }) {
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
        character_id: chatbot.id,
      })
      .select()
      .single();

    router.push(`/chat/${data.id}`);
  };

  return (

    <div onClick={startChat} className="cursor-pointer relative w-100 rounded-2xl overflow-hidden shadow-xl bg-white pb-5">

      <div className="h-70 w-full overflow-hidden">
        <img
          src={`${chatbot.avatar_url}`}
          alt={`${chatbot.name}`}
          className="h-full w-full object-cover object-top"
        />
      </div>

      <div className="relative -mt-10 mx-4 rounded-2xl bg-white shadow-lg p-5">
        <h3 className="text-lg font-semibold text-slate-900">{chatbot.name}</h3>
        <p className="text-sm font-medium ">{chatbot.role}</p>
        <p className="mt-2 text-sm text-slate-600 italic ">
          {chatbot.descp}
        </p>

        <hr className="my-4" />
        <div className="rounded-xl py-2 text-xs">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
          Ready to chat
        </div>
      </div>
    </div>
  );
}
