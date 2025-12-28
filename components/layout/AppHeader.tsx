"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Plus, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export function AppHeader() {
    const pathname = usePathname();
    const [user, setUser] = useState<{ name?: string; avatar?: string } | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setUser({
                    name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
                    avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
                });
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    name:
                        session.user.user_metadata?.full_name ||
                        session.user.email?.split("@")[0] ||
                        "User",
                    avatar:
                        session.user.user_metadata?.avatar_url ||
                        session.user.user_metadata?.picture,
                });
            } else {
                setUser(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <>
            <header className="h-14 border-b bg-white flex items-center px-4 justify-between">
                {/* LEFT */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setOpen(true)}
                        className="rounded-md p-1 hover:bg-gray-100"
                    >
                        <svg
                            className="h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>

                    <Link href="/" className="font-semibold text-lg tracking-tight">
                        <img src="/logo.png" alt="Logo" className="inline-block w-20" />
                    </Link>
                </div>

                {/* RIGHT */}
                <Link href="/profile" className="flex items-center gap-2">
                    {user?.avatar ? (
                        <>
                            <span className="text-sm">{user.name}</span>
                            <img
                                src={user.avatar}
                                alt={user.name || "User"}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        </>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User size={16} />
                        </div>
                    )}
                </Link>
            </header>

            {/* OVERLAY */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/30 z-40"
                />
            )}

            {/* DRAWER */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="h-14 flex items-center justify-between px-4 border-b">
                    <span className="font-semibold">Menu</span>
                    <button onClick={() => setOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    <Link
                        href="/new"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                    >
                        <Plus size={18} />
                        New Chat
                    </Link>

                    <Link
                        href="/chats"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                    >
                        <MessageSquare size={18} />
                        Old Chats
                    </Link>
                </nav>
            </aside>
        </>
    );
}