"use client";

import { useState, useRef, useCallback } from "react";
import { Copy, CheckCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { trackToolUsage } from "@/components/ToolAnalytics";

interface StyleDef {
    label: string;
    description: string;
    convert: (text: string) => string;
}

const STYLES: StyleDef[] = [
    {
        label: "Single Strikethrough",
        description: "Standard line through text (U+0336)",
        convert: (text) =>
            text.split("").map((c) => (c === " " || c === "\n" ? c : c + "\u0336")).join(""),
    },
    {
        label: "Short Strikethrough",
        description: "Short stroke overlay (U+0335)",
        convert: (text) =>
            text.split("").map((c) => (c === " " || c === "\n" ? c : c + "\u0335")).join(""),
    },
    {
        label: "Slash Through",
        description: "Long solidus overlay (U+0338)",
        convert: (text) =>
            text.split("").map((c) => (c === " " || c === "\n" ? c : c + "\u0338")).join(""),
    },
    {
        label: "Diagonal Strikethrough",
        description: "Short solidus overlay (U+0337)",
        convert: (text) =>
            text.split("").map((c) => (c === " " || c === "\n" ? c : c + "\u0337")).join(""),
    },
    {
        label: "Markdown / Discord",
        description: "~~text~~ format for Discord, Reddit, Slack",
        convert: (text) => `~~${text}~~`,
    },
    {
        label: "HTML Strikethrough",
        description: "<del> tag for web pages",
        convert: (text) => `<del>${text}</del>`,
    },
];

function CopyBtn({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex-shrink-0"
        >
            {copied ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied!" : "Copy"}
        </button>
    );
}

export default function StrikethroughTextGenerator() {
    const [text, setText] = useState("");
    const tracked = useRef(false);

    const handleInput = useCallback((val: string) => {
        setText(val);
        if (!tracked.current && val.trim()) {
            trackToolUsage("strikethrough-text-generator");
            tracked.current = true;
        }
    }, []);

    return (
        <div className="space-y-4">
            {/* Input Panel */}
            <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-slate-50 dark:bg-slate-900/50">
                    <span className="text-sm font-semibold text-foreground">Your Text</span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{text.length} characters</span>
                        <button
                            onClick={() => setText("")}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground"
                        >
                            <Trash2 className="h-3 w-3" />
                            Clear
                        </button>
                    </div>
                </div>
                <textarea
                    value={text}
                    onChange={(e) => handleInput(e.target.value)}
                    placeholder="Type or paste your text here to generate strikethrough text..."
                    className="min-h-[160px] w-full resize-y p-4 bg-transparent outline-none text-base text-foreground placeholder:text-muted-foreground/50 focus:ring-0"
                    spellCheck={false}
                />
            </div>

            {/* Results Grid */}
            {text.trim() ? (
                <div className="grid gap-3 sm:grid-cols-2">
                    {STYLES.map((style) => {
                        const converted = style.convert(text);
                        return (
                            <div
                                key={style.label}
                                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 hover:bg-muted/30 transition-colors shadow-sm"
                            >
                                <div className="flex flex-col gap-1 min-w-0 flex-1">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        {style.label}
                                    </span>
                                    <span className="text-xs text-muted-foreground/70 mb-1">
                                        {style.description}
                                    </span>
                                    <span className="text-sm break-all leading-relaxed text-foreground">
                                        {converted}
                                    </span>
                                </div>
                                <CopyBtn text={converted} />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex items-center justify-center h-40 rounded-xl border border-dashed border-border text-sm text-muted-foreground">
                    Start typing above to see your text in 6 different strikethrough styles
                </div>
            )}

            {/* How to Strikethrough Section */}
            {text.trim() && (
                <div className="rounded-xl border border-border/50 bg-slate-50 dark:bg-slate-900/50 p-6">
                    <h3 className="text-sm font-semibold text-foreground mb-3">How to Strikethrough Text On:</h3>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs text-muted-foreground">
                        <div><span className="font-medium text-foreground">Discord:</span> ~~text~~</div>
                        <div><span className="font-medium text-foreground">Slack:</span> ~text~</div>
                        <div><span className="font-medium text-foreground">WhatsApp:</span> ~text~</div>
                        <div><span className="font-medium text-foreground">Reddit:</span> ~~text~~</div>
                        <div><span className="font-medium text-foreground">Markdown:</span> ~~text~~</div>
                        <div><span className="font-medium text-foreground">Google Docs:</span> Alt+Shift+5</div>
                        <div><span className="font-medium text-foreground">Word:</span> Ctrl+D → Strikethrough</div>
                        <div><span className="font-medium text-foreground">HTML:</span> {"<del>"} or {"<s>"} tag</div>
                        <div><span className="font-medium text-foreground">Mac Docs:</span> ⌘+Shift+X</div>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            {text.trim() && (
                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href="/text-tools/bold-text-generator"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-background hover:bg-accent transition-colors text-muted-foreground"
                    >
                        Try Bold Text Generator
                    </Link>
                    <Link
                        href="/text-tools/small-text-generator"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-background hover:bg-accent transition-colors text-muted-foreground"
                    >
                        Try Small Text Generator
                    </Link>
                    <Link
                        href="/text-tools/cursed-text-generator"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-background hover:bg-accent transition-colors text-muted-foreground"
                    >
                        Try Cursed Text Generator
                    </Link>
                    <Link
                        href="/text-tools/unicode-text-converter"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-background hover:bg-accent transition-colors text-muted-foreground"
                    >
                        More Text Styles
                    </Link>
                    <Link
                        href="/text-tools/italics-generator"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-background hover:bg-accent transition-colors text-muted-foreground"
                    >
                        Try Italics Generator
                    </Link>
                    <Link
                        href="/text-tools/backwards-text-generator"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-background hover:bg-accent transition-colors text-muted-foreground"
                    >
                        Try Backwards Text
                    </Link>
                </div>
            )}
        </div>
    );
}
