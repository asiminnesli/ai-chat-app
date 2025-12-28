"use client";

export function ChatBubble({ message, isUser }: { message: any, isUser?: boolean }) {

    return (
        <div className={`flex flex-row ${isUser ? "justify-start" : "justify-end"}`}>
            <div className={`inline-flex shadow-[0_4px_4px_rgba(0,0,0,0.12)] flex-col gap-1 bg-[#09A13C] text-white px-4 py-2 rounded-[15px] text-sm max-w-[60%] ${isUser ? " rounded-bl-none" : " rounded-br-none"}`}>
                <span className="whitespace-pre-wrap break-words">
                    {message.content}
                </span>
                <span className="text-[10px] opacity-80 self-end">
                    00:08
                </span>
            </div>
        </div>
    );
}