"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export function NewsletterForm({ source = "footer" }: { source?: string }) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status === "loading") return;

        setStatus("loading");
        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, source }),
            });
            const data = await res.json();
            if (data.success) {
                setStatus("success");
                setMessage("You're subscribed! 🎉");
                setEmail("");
            } else {
                setStatus("error");
                setMessage(data.message || "Something went wrong.");
            }
        } catch {
            setStatus("error");
            setMessage("Something went wrong. Please try again.");
        }
    };

    if (status === "success") {
        return (
            <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
                {message}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto max-w-md">
            <input
                type="email"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                }}
                placeholder="Enter your email"
                required
                className="flex-1 md:w-64 rounded-xl px-4 py-3 text-sm bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-cyan-400/50 focus:bg-white/15 transition-all"
            />
            <button
                type="submit"
                disabled={status === "loading"}
                className="px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all shimmer-btn whitespace-nowrap disabled:opacity-50"
                style={{
                    background: "linear-gradient(135deg, #00D4FF 0%, #0080CC 100%)",
                    boxShadow: "0 4px 16px rgba(0, 212, 255, 0.3)",
                }}
            >
                {status === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    "Subscribe"
                )}
            </button>
            {status === "error" && (
                <p className="absolute mt-14 text-xs text-red-400">{message}</p>
            )}
        </form>
    );
}
