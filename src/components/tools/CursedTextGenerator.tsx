"use client";

import { useState, useRef, useCallback } from "react";
import { Copy, CheckCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { trackToolUsage } from "@/components/ToolAnalytics";

// Unicode combining diacritical marks
const MARKS_ABOVE = Array.from({ length: 47 }, (_, i) => String.fromCharCode(0x0300 + i));
const MARKS_BELOW = Array.from({ length: 30 }, (_, i) => String.fromCharCode(0x0316 + i));
const MARKS_OVERLAY = ["\u0334", "\u0335", "\u0336", "\u0337", "\u0338"];

type Intensity = "light" | "medium" | "heavy" | "extreme";

const INTENSITY_CONFIG: Record<Intensity, { label: string; description: string; min: number; max: number }> = {
    light: { label: "Light", description: "Subtle glitch effect", min: 1, max: 3 },
    medium: { label: "Medium", description: "Noticeable distortion", min: 3, max: 6 },
    heavy: { label: "Heavy", description: "Heavy corruption", min: 6, max: 12 },
    extreme: { label: "EXTREME", description: "Maximum chaos", min: 12, max: 20 },
};

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function cursifyText(text: string, intensity: Intensity, randomize: boolean): string {
    const config = INTENSITY_CONFIG[intensity];
    return text
        .split("")
        .map((char) => {
            if (char === " " || char === "\n") return char;
            const effectiveMin = randomize ? 1 : config.min;
            const effectiveMax = randomize ? config.max + 4 : config.max;
            const count = getRandomInt(effectiveMin, effectiveMax);
            let result = char;
            for (let i = 0; i < count; i++) {
                const pool = Math.random();
                if (pool < 0.4) {
                    result += MARKS_ABOVE[getRandomInt(0, MARKS_ABOVE.length - 1)];
                } else if (pool < 0.8) {
                    result += MARKS_BELOW[getRandomInt(0, MARKS_BELOW.length - 1)];
                } else {
                    result += MARKS_OVERLAY[getRandomInt(0, MARKS_OVERLAY.length - 1)];
                }
            }
            return result;
        })
        .join("");
}

export default function CursedTextGenerator() {
    const [text, setText] = useState("");
    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [randomize, setRandomize] = useState(true);
    const [copied, setCopied] = useState(false);
    const tracked = useRef(false);

    const output = text ? cursifyText(text, intensity, randomize) : "";

    const handleInput = useCallback((val: string) => {
        setText(val);
        if (!tracked.current && val.trim()) {
            trackToolUsage("cursed-text-generator");
            tracked.current = true;
        }
    }, []);

    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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
                    placeholder="Type or paste your text here to cursify it..."
                    className="min-h-[180px] w-full resize-y p-4 bg-transparent outline-none text-base text-foreground placeholder:text-muted-foreground/50 focus:ring-0"
                    spellCheck={false}
                />
            </div>

            {/* Intensity Selector */}
            <div className="flex flex-wrap gap-2">
                {(Object.keys(INTENSITY_CONFIG) as Intensity[]).map((key) => (
                    <button
                        key={key}
                        onClick={() => setIntensity(key)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                            intensity === key
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background text-muted-foreground hover:bg-accent"
                        }`}
                    >
                        {INTENSITY_CONFIG[key].label}
                    </button>
                ))}
                <label className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={randomize}
                        onChange={(e) => setRandomize(e.target.checked)}
                        className="rounded border-border"
                    />
                    Randomize per character
                </label>
            </div>

            {/* Output Panel */}
            <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-slate-50 dark:bg-slate-900/50">
                    <span className="text-sm font-semibold text-foreground">Cursed Text</span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{output.length} characters</span>
                        <button
                            onClick={handleCopy}
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
                        <p className="text-muted-foreground/50 text-sm">Cursed text will appear here...</p>
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
                        href="/text-tools/small-text-generator"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-background hover:bg-accent transition-colors text-muted-foreground"
                    >
                        Try Small Text Generator
                    </Link>
                    <Link
                        href="/text-tools/upside-down-text"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-background hover:bg-accent transition-colors text-muted-foreground"
                    >
                        Try Upside Down Text
                    </Link>
                </div>
            )}
        </div>
    );
}
