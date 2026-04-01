"use client";

import { useState, useEffect, useRef } from "react";
import { Copy, Check, Link2, Loader2 } from "lucide-react";
import { trackToolUsage } from "@/components/ToolAnalytics";

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

function QRCode({ text, size = 200 }: { text: string; size?: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        import("qrcode").then((QRCodeLib) => {
            QRCodeLib.toCanvas(canvas, text, {
                width: size,
                margin: 2,
                color: { dark: "#000000", light: "#ffffff" },
            });
        });
    }, [text, size]);

    return <canvas ref={canvasRef} className="rounded-lg border border-border" />;
}

export default function UrlShortener() {
    const [url, setUrl] = useState("");
    const [expiry, setExpiry] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ short_url: string; short_code: string } | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const handleShorten = async () => {
        if (!url.trim()) {
            setError("Please enter a URL.");
            return;
        }
        try {
            new URL(url);
        } catch {
            setError("Please enter a valid URL (e.g., https://example.com).");
            return;
        }

        setLoading(true);
        setError("");
        trackToolUsage("url-shortener");

        try {
            const res = await fetch("/api/shorten", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    url,
                    expires_at: getExpiryDate(expiry),
                }),
            });
            const data = await res.json();
            if (data.success) {
                setResult({ short_url: data.short_url, short_code: data.short_code });
            } else {
                setError(data.message || "Failed to shorten URL.");
            }
        } catch {
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const fullShortUrl = typeof window !== "undefined" && result
        ? `${window.location.origin}${result.short_url}`
        : "";

    const copyUrl = () => {
        navigator.clipboard.writeText(fullShortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1.5">URL to shorten</label>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => {
                            setUrl(e.target.value);
                            if (error) setError("");
                        }}
                        placeholder="https://example.com/very/long/url"
                        className="w-full rounded-xl px-4 py-2.5 text-sm border border-border bg-background outline-none focus:border-primary/40 transition-all"
                    />
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

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
                onClick={handleShorten}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #003F87 0%, #006BD6 100%)" }}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Link2 className="h-4 w-4" />
                )}
                Shorten URL
            </button>

            {result && (
                <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5 space-y-4">
                    <p className="text-sm font-medium text-green-700">Your short URL is ready!</p>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            readOnly
                            value={fullShortUrl}
                            className="flex-1 rounded-lg px-3 py-2 text-sm border border-border bg-background font-mono"
                        />
                        <button
                            onClick={copyUrl}
                            className="px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium transition-all hover:bg-primary/5"
                        >
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </button>
                    </div>
                    <div className="flex justify-center pt-2">
                        <QRCode text={fullShortUrl} size={180} />
                    </div>
                </div>
            )}
        </div>
    );
}
