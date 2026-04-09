"use client";

import { useState, useMemo } from "react";
import { Copy, CheckCheck } from "lucide-react";

type Mode = "px-to-rem" | "rem-to-px" | "em-px";

const BASE_PRESETS = [14, 16, 18, 20];
const TABLE_PX_VALUES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96];

function formatNum(n: number): string {
    if (Number.isInteger(n)) return n.toString();
    // Show up to 4 decimal places, strip trailing zeros
    return n.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}

export default function PxToRem() {
    const [mode, setMode] = useState<Mode>("px-to-rem");
    const [inputValue, setInputValue] = useState("16");
    const [baseFontSize, setBaseFontSize] = useState(16);
    const [customBase, setCustomBase] = useState("");
    const [isCustomBase, setIsCustomBase] = useState(false);
    const [emDirection, setEmDirection] = useState<"px-to-em" | "em-to-px">("px-to-em");
    const [copied, setCopied] = useState(false);

    const activeBase = isCustomBase ? (Number(customBase) || 16) : baseFontSize;

    const result = useMemo(() => {
        const val = parseFloat(inputValue);
        if (isNaN(val) || activeBase <= 0) return "";
        if (mode === "px-to-rem") return formatNum(val / activeBase);
        if (mode === "rem-to-px") return formatNum(val * activeBase);
        if (mode === "em-px") {
            return emDirection === "px-to-em"
                ? formatNum(val / activeBase)
                : formatNum(val * activeBase);
        }
        return "";
    }, [inputValue, activeBase, mode, emDirection]);

    const resultUnit = mode === "px-to-rem" ? "rem" : mode === "rem-to-px" ? "px" : emDirection === "px-to-em" ? "em" : "px";
    const inputUnit = mode === "px-to-rem" ? "px" : mode === "rem-to-px" ? "rem" : emDirection === "px-to-em" ? "px" : "em";
    const formulaLabel = mode === "px-to-rem"
        ? `rem = px ÷ ${activeBase} = ${inputValue || "0"} ÷ ${activeBase} = ${result || "0"}rem`
        : mode === "rem-to-px"
            ? `px = rem × ${activeBase} = ${inputValue || "0"} × ${activeBase} = ${result || "0"}px`
            : emDirection === "px-to-em"
                ? `em = px ÷ parent font size = ${inputValue || "0"} ÷ ${activeBase} = ${result || "0"}em`
                : `px = em × parent font size = ${inputValue || "0"} × ${activeBase} = ${result || "0"}px`;

    const handleCopy = async () => {
        if (!result) return;
        await navigator.clipboard.writeText(`${result}${resultUnit}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleBasePreset = (value: number) => {
        setBaseFontSize(value);
        setIsCustomBase(false);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Mode tabs */}
            <div className="flex flex-wrap gap-2 border-b border-border/50 pb-4">
                <button
                    onClick={() => { setMode("px-to-rem"); setInputValue("16"); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "px-to-rem" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                >
                    Px → Rem
                </button>
                <button
                    onClick={() => { setMode("rem-to-px"); setInputValue("1"); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "rem-to-px" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                >
                    Rem → Px
                </button>
                <button
                    onClick={() => { setMode("em-px"); setInputValue("16"); setEmDirection("px-to-em"); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "em-px" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                >
                    Em ↔ Px
                </button>
            </div>

            {/* Em sub-direction toggle */}
            {mode === "em-px" && (
                <div className="flex gap-2">
                    <button
                        onClick={() => { setEmDirection("px-to-em"); setInputValue("16"); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${emDirection === "px-to-em" ? "bg-primary/10 text-primary border border-primary/30" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                    >
                        Px → Em
                    </button>
                    <button
                        onClick={() => { setEmDirection("em-to-px"); setInputValue("1"); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${emDirection === "em-to-px" ? "bg-primary/10 text-primary border border-primary/30" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                    >
                        Em → Px
                    </button>
                </div>
            )}

            {/* Input, Base Size, Result */}
            <div className="grid gap-4 md:grid-cols-3 items-end">
                {/* Input */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">
                        {inputUnit === "px" ? "Pixels (px)" : inputUnit === "rem" ? "Rem" : "Em"}
                    </label>
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={`Enter ${inputUnit}`}
                        className="h-14 rounded-xl border border-input bg-background px-4 text-2xl font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        min="0"
                        step="any"
                    />
                </div>

                {/* Base font size */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">
                        {mode === "em-px" ? "Parent Font Size" : "Root Font Size"}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                        {BASE_PRESETS.map((preset) => (
                            <button
                                key={preset}
                                onClick={() => handleBasePreset(preset)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!isCustomBase && baseFontSize === preset ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                            >
                                {preset}px
                            </button>
                        ))}
                        <button
                            onClick={() => setIsCustomBase(true)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isCustomBase ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                        >
                            Custom
                        </button>
                    </div>
                    {isCustomBase && (
                        <input
                            type="number"
                            value={customBase}
                            onChange={(e) => setCustomBase(e.target.value)}
                            placeholder="Enter base font size"
                            className="h-10 rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            min="1"
                        />
                    )}
                </div>

                {/* Result */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Result</label>
                    <div className="relative">
                        <div className="h-14 flex items-center rounded-xl border border-input bg-slate-50 px-4 text-2xl font-semibold shadow-sm">
                            {result ? (
                                <span>{result}<span className="text-lg text-muted-foreground ml-1">{resultUnit}</span></span>
                            ) : (
                                <span className="text-muted-foreground text-lg">Result</span>
                            )}
                        </div>
                        {result && (
                            <button
                                onClick={handleCopy}
                                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 items-center justify-center rounded-md px-2 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                                title="Copy result"
                            >
                                {copied ? <CheckCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Formula */}
            <div className="rounded-lg bg-muted/30 border border-border/50 px-4 py-2.5 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Formula:</span> {formulaLabel}
            </div>

            {/* Quick reference conversions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                    { px: 12, label: "Small text" },
                    { px: 14, label: "Body text" },
                    { px: 16, label: "Default / 1rem" },
                    { px: 24, label: "Heading" },
                ].map((item) => (
                    <div key={item.px} className="rounded-xl border border-border bg-muted/50 p-3 text-center">
                        <span className="text-lg font-bold text-foreground">{item.px}px</span>
                        <span className="block text-xs text-muted-foreground">{formatNum(item.px / activeBase)}rem</span>
                        <span className="block text-[10px] text-muted-foreground/70 mt-0.5">{item.label}</span>
                    </div>
                ))}
            </div>

            {/* Full Reference Table */}
            <div className="space-y-3">
                <h3 className="text-base font-semibold">Px to Rem Conversion Table (Base: {activeBase}px)</h3>
                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted/50">
                                <th className="px-4 py-2.5 text-left font-semibold">Pixels</th>
                                <th className="px-4 py-2.5 text-right font-semibold">Rem</th>
                                <th className="px-4 py-2.5 text-right font-semibold">Em</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TABLE_PX_VALUES.map((px, i) => (
                                <tr key={px} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                                    <td className="px-4 py-2 font-medium">{px}px</td>
                                    <td className="px-4 py-2 text-right text-muted-foreground">{formatNum(px / activeBase)}rem</td>
                                    <td className="px-4 py-2 text-right text-muted-foreground">{formatNum(px / activeBase)}em</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-xs text-muted-foreground">
                    Note: rem values are relative to the root font size ({activeBase}px). Em values shown assume the parent font size equals {activeBase}px.
                </p>
            </div>
        </div>
    );
}
