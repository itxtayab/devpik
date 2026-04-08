"use client";

import { useState, useRef } from "react";
import { Copy, CheckCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { trackToolUsage } from "@/components/ToolAnalytics";

// Mirror character mapping for "mirror text" mode
const MIRROR_MAP: Record<string, string> = {
    a: "ɒ", b: "d", c: "ɔ", d: "b", e: "ɘ", f: "Ꮈ", g: "ǫ", h: "ʜ",
    i: "i", j: "ꞁ", k: "ʞ", l: "l", m: "m", n: "n", o: "o", p: "q",
    q: "p", r: "ɿ", s: "ꙅ", t: "ƚ", u: "u", v: "v", w: "w", x: "x",
    y: "ʏ", z: "z",
    A: "A", B: "ᗺ", C: "Ɔ", D: "ᗡ", E: "Ǝ", F: "ꟻ", G: "Ꭾ", H: "H",
    I: "I", J: "Ꞁ", K: "⊻", L: "⌐", M: "M", N: "И", O: "O", P: "Ԁ",
    Q: "Ọ", R: "Я", S: "Ꙅ", T: "T", U: "U", V: "V", W: "W", X: "X",
    Y: "Y", Z: "Z",
    "1": "1", "2": "S", "3": "Ɛ", "4": "ᔭ", "5": "5", "6": "6",
    "7": "7", "8": "8", "9": "P", "0": "0",
    "?": "⸮", "!": "!", "(": ")", ")": "(", "[": "]", "]": "[",
    "{": "}", "}": "{", "<": ">", ">": "<", "/": "\\", "\\": "/",
};

// Upside-down character mapping for "upside down reversed"
const UPSIDE_DOWN_MAP: Record<string, string> = {
    a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ",
    i: "ᴉ", j: "ɾ", k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d",
    q: "b", r: "ɹ", s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x",
    y: "ʎ", z: "z",
    A: "∀", B: "ᗺ", C: "Ɔ", D: "ᗡ", E: "Ǝ", F: "Ⅎ", G: "⅁", H: "H",
    I: "I", J: "ſ", K: "ʞ", L: "˥", M: "W", N: "N", O: "O", P: "Ԁ",
    Q: "Ό", R: "ᴚ", S: "S", T: "⊥", U: "∩", V: "Λ", W: "M", X: "X",
    Y: "⅄", Z: "Z",
    "1": "Ɩ", "2": "ᄅ", "3": "Ɛ", "4": "ㄣ", "5": "ϛ", "6": "9",
    "7": "ㄥ", "8": "8", "9": "6", "0": "0",
    ".": "˙", ",": "'", "'": ",", "\"": ",,", "!": "¡", "?": "¿",
    "(": ")", ")": "(", "[": "]", "]": "[", "{": "}", "}": "{",
    "<": ">", ">": "<", "&": "⅋", "_": "‾",
};

interface ModeDef {
    label: string;
    description: string;
    transform: (text: string) => string;
}

const MODES: ModeDef[] = [
    {
        label: "Reverse Text",
        description: "Reverses all characters",
        transform: (text: string) => [...text].reverse().join(""),
    },
    {
        label: "Reverse Words",
        description: "Reverses word order",
        transform: (text: string) => text.split(" ").reverse().join(" "),
    },
    {
        label: "Reverse Each Word",
        description: "Reverses characters within each word",
        transform: (text: string) =>
            text
                .split(" ")
                .map((w) => [...w].reverse().join(""))
                .join(" "),
    },
    {
        label: "Mirror Text",
        description: "Uses mirrored Unicode characters",
        transform: (text: string) =>
            [...text]
                .reverse()
                .map((c) => MIRROR_MAP[c] || c)
                .join(""),
    },
    {
        label: "Upside Down + Reversed",
        description: "Flipped text that reads upside down",
        transform: (text: string) =>
            [...text]
                .map((c) => UPSIDE_DOWN_MAP[c] || c)
                .reverse()
                .join(""),
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

export default function BackwardsTextGenerator() {
    const [text, setText] = useState("");
    const tracked = useRef(false);

    const handleInput = (val: string) => {
        setText(val);
        if (!tracked.current && val.trim()) {
            trackToolUsage("backwards-text-generator");
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
                    placeholder="Type or paste your text here to reverse, mirror, and flip it..."
                    className="min-h-[160px] w-full resize-y p-4 bg-transparent outline-none text-base text-foreground placeholder:text-muted-foreground/50 focus:ring-0"
                    spellCheck={false}
                />
            </div>

            {/* Results Grid */}
            {text.trim() ? (
                <div className="grid gap-3 sm:grid-cols-2">
                    {MODES.map((mode) => {
                        const converted = mode.transform(text);
                        return (
                            <div
                                key={mode.label}
                                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 hover:bg-muted/30 transition-colors shadow-sm"
                            >
                                <div className="flex flex-col gap-1 min-w-0 flex-1">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        {mode.label}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground/70">
                                        {mode.description}
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
                    Start typing above to see your text reversed, mirrored, and flipped in 5 different ways
                </div>
            )}

            {/* Quick Actions */}
            {text.trim() && (
                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href="/text-tools/upside-down-text"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-background hover:bg-accent transition-colors text-muted-foreground"
                    >
                        Try Upside Down Text
                    </Link>
                    <Link
                        href="/text-tools/bold-text-generator"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-background hover:bg-accent transition-colors text-muted-foreground"
                    >
                        Try Bold Text Generator
                    </Link>
                    <Link
                        href="/text-tools/cursed-text-generator"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-background hover:bg-accent transition-colors text-muted-foreground"
                    >
                        Try Cursed Text Generator
                    </Link>
                    <Link
                        href="/text-tools/italics-generator"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-background hover:bg-accent transition-colors text-muted-foreground"
                    >
                        Try Italics Generator
                    </Link>
                    <Link
                        href="/text-tools/small-text-generator"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-background hover:bg-accent transition-colors text-muted-foreground"
                    >
                        Try Small Text Generator
                    </Link>
                    <Link
                        href="/text-tools/unicode-text-converter"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-background hover:bg-accent transition-colors text-muted-foreground"
                    >
                        Try Unicode Text Converter
                    </Link>
                </div>
            )}
        </div>
    );
}
