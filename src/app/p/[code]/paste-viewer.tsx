"use client";

import { useState } from "react";
import { Copy, Check, Share2, Eye, Clock, Code2 } from "lucide-react";
import Link from "next/link";

interface PasteViewerProps {
    title: string;
    content: string;
    language: string;
    createdAt: string;
    viewCount: number;
    shortCode: string;
}

export function PasteViewer({ title, content, language, createdAt, viewCount, shortCode }: PasteViewerProps) {
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState(false);

    const copyCode = () => {
        navigator.clipboard.writeText(content);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    const copyUrl = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{title || "Untitled"}</h1>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Code2 className="h-3.5 w-3.5" />
                            {language}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(createdAt).toLocaleDateString("en-US", {
                                year: "numeric", month: "short", day: "numeric"
                            })}
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            {viewCount} views
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={copyCode}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium transition-all hover:bg-primary/5"
                    >
                        {copiedCode ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                        Copy Code
                    </button>
                    <button
                        onClick={copyUrl}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium transition-all hover:bg-primary/5"
                    >
                        {copiedUrl ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Share2 className="h-3.5 w-3.5" />}
                        Share
                    </button>
                </div>
            </div>

            {/* Code Block */}
            <div className="rounded-xl border border-border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
                    <span className="text-xs font-medium text-muted-foreground">{language}</span>
                    <span className="text-xs text-muted-foreground">{shortCode}</span>
                </div>
                <pre className="p-4 overflow-x-auto text-sm leading-relaxed bg-card">
                    <code className="font-mono whitespace-pre">{content}</code>
                </pre>
            </div>

            {/* Actions */}
            <div className="flex justify-center">
                <Link
                    href="/developer-tools/code-share"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg"
                    style={{ background: "linear-gradient(135deg, #003F87 0%, #006BD6 100%)" }}
                >
                    <Code2 className="h-4 w-4" />
                    Create New Paste
                </Link>
            </div>
        </div>
    );
}
