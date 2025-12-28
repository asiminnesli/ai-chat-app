"use client";


import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ name?: string; avatar?: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                router.replace("/login");
                return;
            }
            setLoading(false);
        };
        checkSession();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    useEffect(() => {

        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setUser({
                    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                    avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
                });
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                    avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
                });
            } else {
                setUser(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    if (loading) return null;

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
            <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-slate-900 to-slate-700" />

                {/* Avatar */}
                <div className="relative -mt-12 flex justify-center">
                    <div className="h-24 w-24 rounded-full bg-white shadow-lg flex items-center justify-center">
                        <img
                            src={user?.avatar || "/default-avatar.png"}
                            alt="Profile"
                            className="h-20 w-20 rounded-full"
                        />
                    </div>
                </div>

                <div className="px-6 pt-4 pb-6 text-center">
                    <h2 className="text-lg font-semibold text-slate-900">{user?.name || "User"}</h2>
                    <div className="my-6 h-px bg-slate-200" />
                    <button onClick={handleLogout} className="w-full rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition">
                        Log out
                    </button>
                </div>
            </div>
        </div>
    );
}
