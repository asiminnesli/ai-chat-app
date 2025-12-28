"use client";

import { KeyboardEvent } from "react";
import { Send } from "lucide-react";
type ChatInputProps = {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    disabled?: boolean;
};

export function ChatInput({
    value,
    onChange,
    onSend,
    disabled = false,
}: ChatInputProps) {
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className="p-4 border-t flex gap-2">
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                placeholder="Type a message..."
                className="
        flex-1
        px-4 py-2
        rounded-full
        bg-[#3B3B3B]
        text-white
        placeholder:text-[#E1E1E1]
        border border-gray-700
        focus:outline-none
        focus:ring-2
        focus:ring-green-500
        disabled:opacity-50
    "
            />



            <button
                onClick={onSend}
                disabled={disabled || !value.trim()}
                className="
        w-11 h-11
        flex items-center justify-center
        rounded-full
        bg-green-500
        text-white
        hover:bg-green-600
        active:scale-95
        transition
        disabled:opacity-50
        disabled:cursor-not-allowed
    "
            >
                <Send size={18} />
            </button>
        </div>
    );
}