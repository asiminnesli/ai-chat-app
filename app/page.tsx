import ChatbotChacters from "@/components/character/chatbotChacters";
import { supabase } from "@/lib/supabase/client";

export default async function Home() {


  const { data: chatbots } = await supabase
    .from("characters")
    .select("*");

  return (
    <>
      <span className="bg-white text-2xl text-center font-bold px-6 py-4 block">
        Our AI Chatbots
      </span>
      <div className="flex flex-row flex-wrap gap-6 p-6 justify-between ">
        {chatbots && chatbots.map((chatbot: any) => (
          <ChatbotChacters chatbot={chatbot} key={chatbot.id} />
        ))}
      </div>
    </>
  );
}


