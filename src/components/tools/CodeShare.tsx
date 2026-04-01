"use client";

import { useState } from "react";
import { Copy, Check, Share2, Loader2 } from "lucide-react";
import { trackToolUsage } from "@/components/ToolAnalytics";

const LANGUAGES = [
    "plaintext", "javascript", "typescript", "python", "html", "css",
    "json", "sql", "bash", "go", "rust", "java", "c", "cpp", "php",
    "ruby", "swift", "kotlin", "yaml", "xml", "markdown",
];

const EXPIRY_OPTIONS = [
    { label: "Never", value: "" },
    { label: "1 Hour", value: "1h" },
    { label: "24 Hours", value: "24h" },
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
];

function getExpiryDate(value: string): string | null {
    if (!value) return null;
    const now = new Date();
    switch (value) {
        case "1h": return new Date(now.getTime() + 3600000).toISOString();
        case "24h": return new Date(now.getTime() + 86400000).toISOString();
        case "7d": return new Date(now.getTime() + 604800000).toISOString();
        case "30d": return new Date(now.getTime() + 2592000000).toISOString();
        default: return null;
    }
}

export default function CodeShare() {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [language, setLanguage] = useState("plaintext");
    const [expiry, setExpiry] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ url: string; short_code: string } | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const handleShare = async () => {
        if (!content.trim()) {
            setError("Please enter some code to share.");
            return;
        }
        setLoading(true);
        setError("");
        trackToolUsage("code-share");

        try {
            const res = await fetch("/api/pastes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title || "Untitled",
                    content,
                    language,
                    expires_at: getExpiryDate(expiry),
                }),
            });
            const data = await res.json();
            if (data.success) {
                setResult({ url: data.url, short_code: data.short_code });
            } else {
                setError(data.message || "Failed to create paste.");
            }
        } catch {
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const copyUrl = () => {
        const fullUrl = `${window.location.origin}${result?.url}`;
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
                <div>
                    <label className="block text-sm font-medium mb-1.5">Title (optional)</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="My code snippet"
                        className="w-full rounded-xl px-4 py-2.5 text-sm border border-border bg-background outline-none focus:border-primary/40 transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1.5">Language</label>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full rounded-xl px-4 py-2.5 text-sm border border-border bg-background outline-none focus:border-primary/40 transition-all"
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang} value={lang}>
                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1.5">Expires</label>
                    <select
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full rounded-xl px-4 py-2.5 text-sm border border-border bg-background outline-none focus:border-primary/40 transition-all"
                    >
                        {EXPIRY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1.5">Code</label>
                <textarea
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                        if (error) setError("");
                    }}
                    rows={14}
                    placeholder="Paste your code here..."
                    className="w-full rounded-xl px-4 py-3 text-sm border border-border bg-background outline-none focus:border-primary/40 transition-all font-mono resize-none"
                    spellCheck={false}
                />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
                onClick={handleShare}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #003F87 0%, #006BD6 100%)" }}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Share2 className="h-4 w-4" />
                )}
                Share Code
            </button>

            {result && (
                <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 space-y-2">
                    <p className="text-sm font-medium text-green-700">Your code snippet is ready!</p>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            readOnly
                            value={`${typeof window !== "undefined" ? window.location.origin : ""}${result.url}`}
                            className="flex-1 rounded-lg px-3 py-2 text-sm border border-border bg-background font-mono"
                        />
                        <button
                            onClick={copyUrl}
                            className="px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium transition-all hover:bg-primary/5"
                        >
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
