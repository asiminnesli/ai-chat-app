"use client";

import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    const signInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <h1 className="text-2xl font-semibold">AI Chat</h1>

                <Button onClick={signInWithGoogle}>
                    Sign in with Google
                </Button>
            </div>
        </div>
    );
}