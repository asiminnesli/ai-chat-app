import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">AI Chat</h1>

      <div className="flex gap-4">
        <Link
          href="/new"
          className="px-4 py-2 bg-black text-white rounded"
        >
          New Chat
        </Link>

        <Link
          href="/chats"
          className="px-4 py-2 border rounded"
        >
          Chats
        </Link>
      </div>
    </div>
  );
}


