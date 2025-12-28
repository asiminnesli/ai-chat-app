"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}`,
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
            <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl p-6 text-center">
                <h1 className="text-xl font-semibold text-slate-900">Welcome back</h1>
                <p className="mt-1 text-sm text-slate-500">Sign in to continue</p>

                <button
                    onClick={handleGoogleLogin}
                    className="mt-6 w-full flex items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                        className="h-5 w-5"
                    />
                    Continue with Google
                </button>
            </div>
        </div>
    );
}
