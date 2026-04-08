"use client";

import { useState, useRef } from "react";
import { Copy, CheckCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { trackToolUsage } from "@/components/ToolAnalytics";

// ──── Character Maps ────

const UPSIDE_DOWN_MAP: Record<string, string> = {
    // Lowercase
    a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ᴉ",
    j: "ɾ", k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ",
    s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z",
    // Uppercase
    A: "∀", B: "ᗺ", C: "Ɔ", D: "ᗡ", E: "Ǝ", F: "Ⅎ", G: "⅁", H: "H", I: "I",
    J: "ſ", K: "ʞ", L: "˥", M: "W", N: "N", O: "O", P: "Ԁ", Q: "Ό", R: "ᴚ",
    S: "S", T: "⊥", U: "∩", V: "Λ", W: "M", X: "X", Y: "⅄", Z: "Z",
    // Numbers
    "0": "0", "1": "Ɩ", "2": "ᄅ", "3": "Ɛ", "4": "ㄣ", "5": "ϛ", "6": "9", "7": "Ɫ", "8": "8", "9": "6",
    // Punctuation
    ".": "˙", ",": "'", "?": "¿", "!": "¡", "'": ",", '"': "„", "(": ")", ")": "(",
    "[": "]", "]": "[", "{": "}", "}": "{", "<": ">", ">": "<", "&": "⅋", "_": "‾",
    ";": "؛", "/": "\\", "\\": "/",
};

// Build reverse map for decoding
const REVERSE_MAP: Record<string, string> = {};
for (const [k, v] of Object.entries(UPSIDE_DOWN_MAP)) {
    if (k !== v) REVERSE_MAP[v] = k;
}

type OutputMode = "upside-down" | "backwards" | "both" | "mirror";

function flipText(text: string): string {
    return text
        .split("")
        .map(char => UPSIDE_DOWN_MAP[char] || char)
        .reverse()
        .join("");
}

function backwardsText(text: string): string {
    return text.split("").reverse().join("");
}

function upsideDownOnly(text: string): string {
    // Map characters without reversing (upside down + backwards = map only)
    return text
        .split("")
        .map(char => UPSIDE_DOWN_MAP[char] || char)
        .reverse()
        .join("");
}

function upsideDownNoReverse(text: string): string {
    // Map each character but keep original order (used for "both" mode — flip + backwards combined)
    return text
        .split("")
        .map(char => UPSIDE_DOWN_MAP[char] || char)
        .join("");
}

function mirrorText(text: string): string {
    return text.split("").reverse().join("");
}

function getOutput(text: string, mode: OutputMode): string {
    if (!text) return "";
    switch (mode) {
        case "upside-down": return flipText(text);
        case "backwards": return backwardsText(text);
        case "both": return upsideDownNoReverse(text);
        case "mirror": return mirrorText(text);
    }
}

const MODE_LABELS: { id: OutputMode; label: string; description: string }[] = [
    { id: "upside-down", label: "Upside Down", description: "ʇxǝʇ uʍop ǝpᴉsdn" },
    { id: "backwards", label: "Backwards", description: "txet sdrawkcaB" },
    { id: "both", label: "Flipped Only", description: "ndsᴉpǝ poʍu ʇǝxʇ" },
    { id: "mirror", label: "Mirror", description: "txet rorriM" },
];

export default function UpsideDownText() {
    const [text, setText] = useState("");
    const [mode, setMode] = useState<OutputMode>("upside-down");
    const [copied, setCopied] = useState(false);
    const [copiedReverse, setCopiedReverse] = useState(false);
    const tracked = useRef(false);

    const output = getOutput(text, mode);

    const handleInput = (val: string) => {
        setText(val);
        if (!tracked.current && val.trim()) {
            trackToolUsage("upside-down-text");
            tracked.current = true;
        }
    };

    const handleCopy = (text: string, setter: (v: boolean) => void) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setter(true);
        setTimeout(() => setter(false), 2000);
    };

    const handleClear = () => {
        setText("");
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
                            onClick={handleClear}
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
                    placeholder="Type or paste your text here..."
                    className="min-h-[180px] w-full resize-y p-4 bg-transparent outline-none text-base text-foreground placeholder:text-muted-foreground/50 focus:ring-0"
                    spellCheck={false}
                />
            </div>

            {/* Mode Selector */}
            <div className="flex flex-wrap gap-2">
                {MODE_LABELS.map(({ id, label }) => (
                    <button
                        key={id}
                        onClick={() => setMode(id)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                            mode === id
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background text-muted-foreground hover:bg-accent"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Output Panel */}
            <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-slate-50 dark:bg-slate-900/50">
                    <span className="text-sm font-semibold text-foreground">
                        {MODE_LABELS.find(m => m.id === mode)?.label} Text
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{output.length} characters</span>
                        <button
                            onClick={() => handleCopy(output, setCopied)}
                            disabled={!output}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40"
                        >
                            {copied ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                </div>
                <div className="min-h-[120px] p-4">
                    {output ? (
                        <p className="text-lg leading-relaxed break-all text-foreground whitespace-pre-wrap">{output}</p>
                    ) : (
                        <p className="text-muted-foreground/50 text-sm">Transformed text will appear here...</p>
                    )}
                </div>
            </div>

            {/* Preview in Large Font */}
            {output && (
                <div className="rounded-xl border border-border/50 bg-slate-50 dark:bg-slate-900/50 p-6 text-center">
                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">Preview</p>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-medium break-all text-foreground leading-tight">{output}</p>
                </div>
            )}

            {/* Quick Actions */}
            {output && (
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => handleCopy(output.split("").reverse().join(""), setCopiedReverse)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-background hover:bg-accent transition-colors"
                    >
                        {copiedReverse ? <CheckCheck className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedReverse ? "Copied!" : "Copy Reversed"}
                    </button>
                    <Link
                        href="/developer-tools/code-share"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-background hover:bg-accent transition-colors text-muted-foreground"
                    >
                        Share via Code Share
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
