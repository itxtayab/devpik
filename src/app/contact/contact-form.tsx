"use client";

import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";

export function ContactForm() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status === "loading") return;

        setStatus("loading");
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success) {
                setStatus("success");
                setForm({ name: "", email: "", subject: "", message: "" });
            } else {
                setStatus("error");
                setErrorMsg(data.message || "Something went wrong.");
            }
        } catch {
            setStatus("error");
            setErrorMsg("Something went wrong. Please try again.");
        }
    };

    if (status === "success") {
        return (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <h3 className="text-lg font-semibold">Message sent!</h3>
                <p className="text-sm text-muted-foreground">
                    We&apos;ll get back to you within 24-48 hours.
                </p>
                <button
                    onClick={() => setStatus("idle")}
                    className="mt-2 text-sm font-medium text-primary hover:underline"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1.5">Name *</label>
                <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl px-4 py-2.5 text-sm border border-border bg-background outline-none focus:border-primary/40 transition-all"
                    placeholder="Your name"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1.5">Email *</label>
                <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl px-4 py-2.5 text-sm border border-border bg-background outline-none focus:border-primary/40 transition-all"
                    placeholder="your@email.com"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1.5">Subject</label>
                <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full rounded-xl px-4 py-2.5 text-sm border border-border bg-background outline-none focus:border-primary/40 transition-all"
                    placeholder="What's this about?"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1.5">Message *</label>
                <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-xl px-4 py-2.5 text-sm border border-border bg-background outline-none focus:border-primary/40 transition-all resize-none"
                    placeholder="Your message..."
                />
            </div>
            {status === "error" && (
                <p className="text-sm text-red-500">{errorMsg}</p>
            )}
            <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #003F87 0%, #006BD6 100%)" }}
            >
                {status === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                ) : (
                    "Send Message"
                )}
            </button>
        </form>
    );
}
