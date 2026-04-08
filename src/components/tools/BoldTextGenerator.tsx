"use client";

import { useState, useRef } from "react";
import { Copy, CheckCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { trackToolUsage } from "@/components/ToolAnalytics";

// Unicode style mappings
interface StyleDef {
    label: string;
    preview: string;
    map: Record<string, string>;
}

function buildMap(upperStart: number, lowerStart: number, digitStart?: number): Record<string, string> {
    const map: Record<string, string> = {};
    for (let i = 0; i < 26; i++) {
        map[String.fromCharCode(65 + i)] = String.fromCodePoint(upperStart + i);
        map[String.fromCharCode(97 + i)] = String.fromCodePoint(lowerStart + i);
    }
    if (digitStart !== undefined) {
        for (let i = 0; i < 10; i++) {
            map[String(i)] = String.fromCodePoint(digitStart + i);
        }
    }
    return map;
}

const STYLES: StyleDef[] = [
    {
        label: "Bold",
        preview: "𝐁𝐨𝐥𝐝",
        map: buildMap(0x1D400, 0x1D41A, 0x1D7CE),
    },
    {
        label: "Italic",
        preview: "𝐼𝑡𝑎𝑙𝑖𝑐",
        map: (() => {
            const m = buildMap(0x1D434, 0x1D44E);
            m["h"] = "ℎ"; // special case
            return m;
        })(),
    },
    {
        label: "Bold Italic",
        preview: "𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄",
        map: buildMap(0x1D468, 0x1D482),
    },
    {
        label: "Double-Struck",
        preview: "𝔻𝕠𝕦𝕓𝕝𝕖",
        map: buildMap(0x1D538, 0x1D552, 0x1D7D8),
    },
    {
        label: "Script",
        preview: "𝒮𝒸𝓇𝒾𝓅𝓉",
        map: buildMap(0x1D49C, 0x1D4B6),
    },
    {
        label: "Bold Script",
        preview: "𝓑𝓸𝓵𝓭 𝓢𝓬𝓻𝓲𝓹𝓽",
        map: buildMap(0x1D4D0, 0x1D4EA),
    },
    {
        label: "Fraktur",
        preview: "𝔉𝔯𝔞𝔨𝔱𝔲𝔯",
        map: buildMap(0x1D504, 0x1D51E),
    },
    {
        label: "Sans-Serif",
        preview: "𝖲𝖺𝗇𝗌",
        map: buildMap(0x1D5A0, 0x1D5BA, 0x1D7E2),
    },
    {
        label: "Sans Bold",
        preview: "𝗦𝗮𝗻𝘀 𝗕𝗼𝗹𝗱",
        map: buildMap(0x1D5D4, 0x1D5EE, 0x1D7EC),
    },
    {
        label: "Sans Italic",
        preview: "𝘚𝘢𝘯𝘴 𝘐𝘵𝘢𝘭𝘪𝘤",
        map: buildMap(0x1D608, 0x1D622),
    },
    {
        label: "Sans Bold Italic",
        preview: "𝙎𝙖𝙣𝙨 𝘽𝙄",
        map: buildMap(0x1D63C, 0x1D656),
    },
    {
        label: "Monospace",
        preview: "𝙼𝚘𝚗𝚘",
        map: buildMap(0x1D670, 0x1D68A, 0x1D7F6),
    },
    {
        label: "Circled",
        preview: "Ⓒⓘⓡⓒⓛⓔⓓ",
        map: (() => {
            const m: Record<string, string> = {};
            for (let i = 0; i < 26; i++) {
                m[String.fromCharCode(65 + i)] = String.fromCodePoint(0x24B6 + i);
                m[String.fromCharCode(97 + i)] = String.fromCodePoint(0x24D0 + i);
            }
            for (let i = 0; i < 10; i++) {
                m[String(i)] = i === 0 ? "⓪" : String.fromCodePoint(0x2460 + i - 1);
            }
            return m;
        })(),
    },
    {
        label: "Squared",
        preview: "🅂🅀🅄🄰🅁🄴🄳",
        map: (() => {
            const m: Record<string, string> = {};
            for (let i = 0; i < 26; i++) {
                const cp = String.fromCodePoint(0x1F130 + i);
                m[String.fromCharCode(65 + i)] = cp;
                m[String.fromCharCode(97 + i)] = cp;
            }
            return m;
        })(),
    },
    {
        label: "Negative Squared",
        preview: "🅽🅴🅶",
        map: (() => {
            const m: Record<string, string> = {};
            for (let i = 0; i < 26; i++) {
                const cp = String.fromCodePoint(0x1F170 + i);
                m[String.fromCharCode(65 + i)] = cp;
                m[String.fromCharCode(97 + i)] = cp;
            }
            return m;
        })(),
    },
    {
        label: "Strikethrough",
        preview: "S̷t̷r̷i̷k̷e̷",
        map: {},
    },
    {
        label: "Underlined",
        preview: "U̲n̲d̲e̲r̲l̲i̲n̲e̲",
        map: {},
    },
];

function convertText(text: string, style: StyleDef): string {
    if (style.label === "Strikethrough") {
        return text.split("").map((c) => (c === " " ? c : c + "\u0337")).join("");
    }
    if (style.label === "Underlined") {
        return text.split("").map((c) => (c === " " ? c : c + "\u0332")).join("");
    }
    return text.split("").map((c) => style.map[c] || c).join("");
}

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

export default function BoldTextGenerator() {
    const [text, setText] = useState("");
    const tracked = useRef(false);

    const handleInput = (val: string) => {
        setText(val);
        if (!tracked.current && val.trim()) {
            trackToolUsage("bold-text-generator");
            tracked.current = true;
        }
    };

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
                    placeholder="Type or paste your text here to generate bold and fancy text styles..."
                    className="min-h-[160px] w-full resize-y p-4 bg-transparent outline-none text-base text-foreground placeholder:text-muted-foreground/50 focus:ring-0"
                    spellCheck={false}
                />
            </div>

            {/* Results Grid */}
            {text.trim() ? (
                <div className="grid gap-3 sm:grid-cols-2">
                    {STYLES.map((style) => {
                        const converted = convertText(text, style);
                        return (
                            <div
                                key={style.label}
                                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 hover:bg-muted/30 transition-colors shadow-sm"
                            >
                                <div className="flex flex-col gap-1 min-w-0 flex-1">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        {style.label}
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
                    Start typing above to see your text in 17 different bold and fancy styles
                </div>
            )}

            {/* Quick Actions */}
            {text.trim() && (
                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href="/text-tools/strikethrough-text-generator"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-background hover:bg-accent transition-colors text-muted-foreground"
                    >
                        Try Strikethrough Text
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
                        href="/text-tools/upside-down-text"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-background hover:bg-accent transition-colors text-muted-foreground"
                    >
                        Try Upside Down Text
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
