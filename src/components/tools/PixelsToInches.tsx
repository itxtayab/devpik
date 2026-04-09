"use client";

import { useState, useMemo } from "react";
import { ArrowLeftRight, Copy, CheckCheck } from "lucide-react";

const DPI_PRESETS = [
    { label: "72 DPI (Web/Screen)", value: 72 },
    { label: "96 DPI (Windows Default)", value: 96 },
    { label: "150 DPI (Medium Print)", value: 150 },
    { label: "300 DPI (High-Quality Print)", value: 300 },
];

const TABLE_PX_VALUES = [100, 200, 300, 500, 720, 1000, 1080, 1200, 1500, 1920, 2550, 3840];
const TABLE_DPI_VALUES = [72, 96, 150, 300];

function formatNum(n: number): string {
    if (Number.isInteger(n)) return n.toString();
    return n.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}

export default function PixelsToInches() {
    const [inputValue, setInputValue] = useState("1920");
    const [dpi, setDpi] = useState(96);
    const [customDpi, setCustomDpi] = useState("");
    const [isCustomDpi, setIsCustomDpi] = useState(false);
    const [direction, setDirection] = useState<"px-to-in" | "in-to-px">("px-to-in");
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const activeDpi = isCustomDpi ? (Number(customDpi) || 96) : dpi;

    const results = useMemo(() => {
        const val = parseFloat(inputValue);
        if (isNaN(val) || val < 0 || activeDpi <= 0) {
            return { inches: 0, cm: 0, mm: 0, pt: 0, pixels: 0 };
        }
        if (direction === "px-to-in") {
            const inches = val / activeDpi;
            return {
                inches,
                cm: inches * 2.54,
                mm: inches * 25.4,
                pt: val * 72 / activeDpi,
                pixels: val,
            };
        } else {
            const pixels = val * activeDpi;
            return {
                inches: val,
                cm: val * 2.54,
                mm: val * 25.4,
                pt: val * 72,
                pixels,
            };
        }
    }, [inputValue, activeDpi, direction]);

    const handleCopy = async (value: string, field: string) => {
        await navigator.clipboard.writeText(value);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 1500);
    };

    const handleSwap = () => {
        setDirection(d => d === "px-to-in" ? "in-to-px" : "px-to-in");
        if (direction === "px-to-in") {
            setInputValue(formatNum(results.inches));
        } else {
            setInputValue(formatNum(results.pixels));
        }
    };

    const handleDpiPreset = (value: number) => {
        setDpi(value);
        setIsCustomDpi(false);
    };

    const resultCards = direction === "px-to-in"
        ? [
            { label: "Inches", value: formatNum(results.inches), unit: "in" },
            { label: "Centimeters", value: formatNum(results.cm), unit: "cm" },
            { label: "Millimeters", value: formatNum(results.mm), unit: "mm" },
            { label: "Points", value: formatNum(results.pt), unit: "pt" },
        ]
        : [
            { label: "Pixels", value: formatNum(results.pixels), unit: "px" },
            { label: "Centimeters", value: formatNum(results.cm), unit: "cm" },
            { label: "Millimeters", value: formatNum(results.mm), unit: "mm" },
            { label: "Points", value: formatNum(results.pt), unit: "pt" },
        ];

    return (
        <div className="flex flex-col gap-6">
            {/* Direction toggle */}
            <div className="flex items-center gap-3 flex-wrap">
                <button
                    onClick={() => { setDirection("px-to-in"); setInputValue("1920"); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${direction === "px-to-in" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                >
                    Pixels → Inches
                </button>
                <button
                    onClick={() => { setDirection("in-to-px"); setInputValue("10"); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${direction === "in-to-px" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                >
                    Inches → Pixels
                </button>
            </div>

            {/* Input and DPI */}
            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] items-end">
                {/* Input */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">{direction === "px-to-in" ? "Pixels (px)" : "Inches (in)"}</label>
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={direction === "px-to-in" ? "Enter pixels" : "Enter inches"}
                        className="h-14 rounded-xl border border-input bg-background px-4 text-2xl font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        min="0"
                        step="any"
                    />
                </div>

                {/* Swap */}
                <button
                    onClick={handleSwap}
                    className="self-center rounded-full border border-border bg-muted p-3 shadow-sm hover:bg-muted/80 transition-colors mt-4 md:mt-0"
                    title="Swap conversion direction"
                >
                    <ArrowLeftRight className="h-5 w-5 text-primary" />
                </button>

                {/* DPI */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">DPI (Dots Per Inch)</label>
                    <div className="flex flex-wrap gap-1.5">
                        {DPI_PRESETS.map((preset) => (
                            <button
                                key={preset.value}
                                onClick={() => handleDpiPreset(preset.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!isCustomDpi && dpi === preset.value ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                            >
                                {preset.value}
                            </button>
                        ))}
                        <button
                            onClick={() => setIsCustomDpi(true)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isCustomDpi ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                        >
                            Custom
                        </button>
                    </div>
                    {isCustomDpi && (
                        <input
                            type="number"
                            value={customDpi}
                            onChange={(e) => setCustomDpi(e.target.value)}
                            placeholder="Enter custom DPI"
                            className="h-10 rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            min="1"
                        />
                    )}
                </div>
            </div>

            {/* Formula */}
            <div className="rounded-lg bg-muted/30 border border-border/50 px-4 py-2.5 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Formula:</span>{" "}
                {direction === "px-to-in"
                    ? `inches = pixels ÷ DPI = ${inputValue || "0"} ÷ ${activeDpi} = ${formatNum(results.inches)} in`
                    : `pixels = inches × DPI = ${inputValue || "0"} × ${activeDpi} = ${formatNum(results.pixels)} px`}
            </div>

            {/* Results */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {resultCards.map((card) => (
                    <div key={card.label} className="relative flex flex-col items-center justify-center rounded-xl border border-border bg-muted/50 p-4 text-center group">
                        <span className="text-2xl font-bold tracking-tight text-foreground">{card.value}</span>
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mt-1">{card.label} ({card.unit})</span>
                        <button
                            onClick={() => handleCopy(card.value, card.label)}
                            className="absolute top-2 right-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                            title={`Copy ${card.label}`}
                        >
                            {copiedField === card.label ? <CheckCheck className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                        </button>
                    </div>
                ))}
            </div>

            {/* Common Screen Resolutions */}
            <div className="space-y-3">
                <h3 className="text-base font-semibold">Common Screen Resolutions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                    {[
                        { name: "Full HD", res: "1920 × 1080" },
                        { name: "2K / QHD", res: "2560 × 1440" },
                        { name: "4K UHD", res: "3840 × 2160" },
                        { name: "iPhone 15 Pro", res: "1179 × 2556" },
                        { name: "iPad Pro 12.9\"", res: "2048 × 2732" },
                        { name: "Letter (300 DPI)", res: "2550 × 3300" },
                    ].map((item) => (
                        <div key={item.name} className="rounded-lg border border-border/50 bg-muted/30 px-3 py-2">
                            <span className="font-medium text-foreground">{item.name}</span>
                            <span className="block text-xs text-muted-foreground">{item.res} px</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Conversion Table */}
            <div className="space-y-3">
                <h3 className="text-base font-semibold">Pixels to Inches Conversion Chart</h3>
                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted/50">
                                <th className="px-4 py-2.5 text-left font-semibold">Pixels</th>
                                {TABLE_DPI_VALUES.map((d) => (
                                    <th key={d} className="px-4 py-2.5 text-right font-semibold">{d} DPI</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {TABLE_PX_VALUES.map((px, i) => (
                                <tr key={px} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                                    <td className="px-4 py-2 font-medium">{px} px</td>
                                    {TABLE_DPI_VALUES.map((d) => (
                                        <td key={d} className="px-4 py-2 text-right text-muted-foreground">
                                            {formatNum(px / d)} in
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
