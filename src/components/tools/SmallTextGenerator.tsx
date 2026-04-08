"use client";

import { useState, useRef, useCallback } from "react";
import { Copy, CheckCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { trackToolUsage } from "@/components/ToolAnalytics";

const SUPERSCRIPT_MAP: Record<string, string> = {
    a: "ᵃ", b: "ᵇ", c: "ᶜ", d: "ᵈ", e: "ᵉ", f: "ᶠ", g: "ᵍ", h: "ʰ", i: "ⁱ",
    j: "ʲ", k: "ᵏ", l: "ˡ", m: "ᵐ", n: "ⁿ", o: "ᵒ", p: "ᵖ", q: "q", r: "ʳ",
    s: "ˢ", t: "ᵗ", u: "ᵘ", v: "ᵛ", w: "ʷ", x: "ˣ", y: "ʸ", z: "ᶻ",
    A: "ᴬ", B: "ᴮ", C: "ᶜ", D: "ᴰ", E: "ᴱ", F: "ᶠ", G: "ᴳ", H: "ᴴ", I: "ᴵ",
    J: "ᴶ", K: "ᴷ", L: "ᴸ", M: "ᴹ", N: "ᴺ", O: "ᴼ", P: "ᴾ", Q: "Q", R: "ᴿ",
    S: "ˢ", T: "ᵀ", U: "ᵁ", V: "ⱽ", W: "ᵂ", X: "ˣ", Y: "ʸ", Z: "ᶻ",
    "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
    "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
    "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾",
};

const SUBSCRIPT_MAP: Record<string, string> = {
    a: "ₐ", e: "ₑ", h: "ₕ", i: "ᵢ", j: "ⱼ", k: "ₖ", l: "ₗ", m: "ₘ", n: "ₙ",
    o: "ₒ", p: "ₚ", r: "ᵣ", s: "ₛ", t: "ₜ", u: "ᵤ", v: "ᵥ", x: "ₓ",
    "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄",
    "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
    "+": "₊", "-": "₋", "=": "₌", "(": "₍", ")": "₎",
};

const SMALL_CAPS_MAP: Record<string, string> = {
    a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ", h: "ʜ", i: "ɪ",
    j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ",
    s: "ꜱ", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ",
};

interface StyleDef {
    label: string;
    preview: string;
    map: Record<string, string>;
}

const STYLES: StyleDef[] = [
    { label: "Superscript", preview: "ˢᵘᵖᵉʳˢᶜʳⁱᵖᵗ", map: SUPERSCRIPT_MAP },
    { label: "Subscript", preview: "ₛᵤᵦₛ꜀ᵣᵢₚₜ", map: SUBSCRIPT_MAP },
    { label: "Small Caps", preview: "ꜱᴍᴀʟʟ ᴄᴀᴘꜱ", map: SMALL_CAPS_MAP },
];

function convertText(text: string, map: Record<string, string>): string {
    return text
        .split("")
        .map((c) => map[c] || c)
        .join("");
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

export default function SmallTextGenerator() {
    const [text, setText] = useState("");
    const tracked = useRef(false);

    const handleInput = useCallback((val: string) => {
        setText(val);
        if (!tracked.current && val.trim()) {
            trackToolUsage("small-text-generator");
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
                    placeholder="Type or paste your text here to generate small text styles..."
                    className="min-h-[160px] w-full resize-y p-4 bg-transparent outline-none text-base text-foreground placeholder:text-muted-foreground/50 focus:ring-0"
                    spellCheck={false}
                />
            </div>

            {/* Results Grid */}
            {text.trim() ? (
                <div className="grid gap-3">
                    {STYLES.map((style) => {
                        const converted = convertText(text, style.map);
                        return (
                            <div
                                key={style.label}
                                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 hover:bg-muted/30 transition-colors shadow-sm"
                            >
                                <div className="flex flex-col gap-1 min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                            {style.label}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground/60">
                                            {converted.length} chars
                                        </span>
                                    </div>
                                    <span className="text-lg break-all leading-relaxed text-foreground">
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
                    Start typing above to see your text in superscript, subscript, and small caps
                </div>
            )}

            {/* Preview */}
            {text.trim() && (
                <div className="rounded-xl border border-border/50 bg-slate-50 dark:bg-slate-900/50 p-6">
                    <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-medium">Character Support Note</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Not all characters have Unicode small equivalents. Superscript supports a-z, A-Z, 0-9.
                        Subscript supports a, e, h, i, j, k, l, m, n, o, p, r, s, t, u, v, x, and 0-9.
                        Small Caps supports a-z (lowercase only). Characters without equivalents stay as-is.
                    </p>
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
                        href="/text-tools/strikethrough-text-generator"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-background hover:bg-accent transition-colors text-muted-foreground"
                    >
                        Try Strikethrough Text
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
