"use client";

import { useState, useMemo } from "react";
import { Copy, CheckCheck } from "lucide-react";

type Mode = "markup" | "margin" | "converter";
type MarkupSubMode = "cost-markup" | "cost-selling";
type MarginSubMode = "selling-margin" | "cost-selling";
type ConverterDirection = "markup-to-margin" | "margin-to-markup";

function formatDollar(n: number): string {
    return n.toFixed(2);
}

function formatPercent(n: number): string {
    if (Number.isInteger(n)) return n.toString();
    const s = n.toFixed(2);
    return s.replace(/0+$/, "").replace(/\.$/, "");
}

const MARKUP_MARGIN_TABLE = [
    { markup: 10, margin: 9.09 },
    { markup: 15, margin: 13.04 },
    { markup: 20, margin: 16.67 },
    { markup: 25, margin: 20 },
    { markup: 30, margin: 23.08 },
    { markup: 33.33, margin: 25 },
    { markup: 40, margin: 28.57 },
    { markup: 50, margin: 33.33 },
    { markup: 75, margin: 42.86 },
    { markup: 100, margin: 50 },
    { markup: 150, margin: 60 },
    { markup: 200, margin: 66.67 },
];

export default function MarkupCalculator() {
    const [mode, setMode] = useState<Mode>("markup");
    const [markupSubMode, setMarkupSubMode] = useState<MarkupSubMode>("cost-markup");
    const [marginSubMode, setMarginSubMode] = useState<MarginSubMode>("selling-margin");
    const [converterDirection, setConverterDirection] = useState<ConverterDirection>("markup-to-margin");

    // Markup mode inputs
    const [markupCost, setMarkupCost] = useState("50");
    const [markupPercent, setMarkupPercent] = useState("30");
    const [markupSellingPrice, setMarkupSellingPrice] = useState("65");

    // Margin mode inputs
    const [marginSellingPrice, setMarginSellingPrice] = useState("100");
    const [marginPercent, setMarginPercent] = useState("30");
    const [marginCost, setMarginCost] = useState("70");
    const [marginCostSelling, setMarginCostSelling] = useState("100");

    // Converter inputs
    const [converterInput, setConverterInput] = useState("50");

    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const handleCopy = async (value: string, key: string) => {
        if (!value) return;
        await navigator.clipboard.writeText(value);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 1500);
    };

    // Markup mode calculations
    const markupResults = useMemo(() => {
        if (mode !== "markup") return null;
        if (markupSubMode === "cost-markup") {
            const cost = parseFloat(markupCost);
            const markup = parseFloat(markupPercent);
            if (isNaN(cost) || isNaN(markup) || cost < 0) return null;
            const sellingPrice = cost * (1 + markup / 100);
            const profit = sellingPrice - cost;
            const marginPct = sellingPrice > 0 ? ((sellingPrice - cost) / sellingPrice) * 100 : 0;
            return {
                sellingPrice: formatDollar(sellingPrice),
                profit: formatDollar(profit),
                marginPercent: formatPercent(marginPct),
            };
        } else {
            const cost = parseFloat(markupCost);
            const selling = parseFloat(markupSellingPrice);
            if (isNaN(cost) || isNaN(selling) || cost <= 0) return null;
            const markupPct = ((selling - cost) / cost) * 100;
            const profit = selling - cost;
            const marginPct = selling > 0 ? ((selling - cost) / selling) * 100 : 0;
            return {
                markupPercent: formatPercent(markupPct),
                profit: formatDollar(profit),
                marginPercent: formatPercent(marginPct),
            };
        }
    }, [mode, markupSubMode, markupCost, markupPercent, markupSellingPrice]);

    // Margin mode calculations
    const marginResults = useMemo(() => {
        if (mode !== "margin") return null;
        if (marginSubMode === "selling-margin") {
            const selling = parseFloat(marginSellingPrice);
            const margin = parseFloat(marginPercent);
            if (isNaN(selling) || isNaN(margin)) return null;
            const cost = selling * (1 - margin / 100);
            const profit = selling - cost;
            return {
                cost: formatDollar(cost),
                profit: formatDollar(profit),
            };
        } else {
            const cost = parseFloat(marginCost);
            const selling = parseFloat(marginCostSelling);
            if (isNaN(cost) || isNaN(selling) || selling <= 0) return null;
            const marginPct = ((selling - cost) / selling) * 100;
            const profit = selling - cost;
            return {
                marginPercent: formatPercent(marginPct),
                profit: formatDollar(profit),
            };
        }
    }, [mode, marginSubMode, marginSellingPrice, marginPercent, marginCost, marginCostSelling]);

    // Converter calculations
    const converterResult = useMemo(() => {
        if (mode !== "converter") return null;
        const val = parseFloat(converterInput);
        if (isNaN(val)) return null;
        if (converterDirection === "markup-to-margin") {
            const margin = (val / (100 + val)) * 100;
            return formatPercent(margin);
        } else {
            const markup = (val / (100 - val)) * 100;
            return isFinite(markup) ? formatPercent(markup) : "---";
        }
    }, [mode, converterDirection, converterInput]);

    const handleReset = () => {
        if (mode === "markup") {
            setMarkupCost("50");
            setMarkupPercent("30");
            setMarkupSellingPrice("65");
        } else if (mode === "margin") {
            setMarginSellingPrice("100");
            setMarginPercent("30");
            setMarginCost("70");
            setMarginCostSelling("100");
        } else {
            setConverterInput("50");
        }
    };

    const CopyButton = ({ value, copyKey }: { value: string; copyKey: string }) => (
        <button
            onClick={() => handleCopy(value, copyKey)}
            className="inline-flex h-6 items-center justify-center rounded-md px-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
            title="Copy value"
        >
            {copiedKey === copyKey ? <CheckCheck className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
    );

    return (
        <div className="flex flex-col gap-6">
            {/* Mode tabs */}
            <div className="flex flex-wrap gap-2 border-b border-border/50 pb-4">
                <button
                    onClick={() => setMode("markup")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "markup" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                >
                    Markup Calculator
                </button>
                <button
                    onClick={() => setMode("margin")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "margin" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                >
                    Margin Calculator
                </button>
                <button
                    onClick={() => setMode("converter")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "converter" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                >
                    Markup ↔ Margin
                </button>
            </div>

            {/* Sub-mode toggles */}
            {mode === "markup" && (
                <div className="flex gap-2">
                    <button
                        onClick={() => setMarkupSubMode("cost-markup")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${markupSubMode === "cost-markup" ? "bg-primary/10 text-primary border border-primary/30" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                    >
                        Cost + Markup %
                    </button>
                    <button
                        onClick={() => setMarkupSubMode("cost-selling")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${markupSubMode === "cost-selling" ? "bg-primary/10 text-primary border border-primary/30" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                    >
                        Cost + Selling Price
                    </button>
                </div>
            )}

            {mode === "margin" && (
                <div className="flex gap-2">
                    <button
                        onClick={() => setMarginSubMode("selling-margin")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${marginSubMode === "selling-margin" ? "bg-primary/10 text-primary border border-primary/30" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                    >
                        Selling Price + Margin %
                    </button>
                    <button
                        onClick={() => setMarginSubMode("cost-selling")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${marginSubMode === "cost-selling" ? "bg-primary/10 text-primary border border-primary/30" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                    >
                        Cost + Selling Price
                    </button>
                </div>
            )}

            {mode === "converter" && (
                <div className="flex gap-2">
                    <button
                        onClick={() => { setConverterDirection("markup-to-margin"); setConverterInput("50"); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${converterDirection === "markup-to-margin" ? "bg-primary/10 text-primary border border-primary/30" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                    >
                        Markup → Margin
                    </button>
                    <button
                        onClick={() => { setConverterDirection("margin-to-markup"); setConverterInput("33.33"); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${converterDirection === "margin-to-markup" ? "bg-primary/10 text-primary border border-primary/30" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                    >
                        Margin → Markup
                    </button>
                </div>
            )}

            {/* ===== MARKUP MODE ===== */}
            {mode === "markup" && markupSubMode === "cost-markup" && (
                <>
                    <div className="grid gap-4 md:grid-cols-2 items-end">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Cost Price</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground font-semibold">$</span>
                                <input
                                    type="number"
                                    value={markupCost}
                                    onChange={(e) => setMarkupCost(e.target.value)}
                                    placeholder="Enter cost"
                                    className="h-14 w-full rounded-xl border border-input bg-background pl-9 pr-4 text-2xl font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    min="0"
                                    step="any"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Markup Percentage</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={markupPercent}
                                    onChange={(e) => setMarkupPercent(e.target.value)}
                                    placeholder="Enter markup %"
                                    className="h-14 w-full rounded-xl border border-input bg-background px-4 pr-10 text-2xl font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    min="0"
                                    step="any"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground font-semibold">%</span>
                            </div>
                        </div>
                    </div>

                    {markupResults && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                                <div className="text-xs text-muted-foreground mb-1">Selling Price</div>
                                <div className="text-2xl font-bold text-foreground">${markupResults.sellingPrice}</div>
                                <CopyButton value={markupResults.sellingPrice!} copyKey="markup-selling" />
                            </div>
                            <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                                <div className="text-xs text-muted-foreground mb-1">Profit (Markup Amount)</div>
                                <div className="text-2xl font-bold text-foreground">${markupResults.profit}</div>
                                <CopyButton value={markupResults.profit} copyKey="markup-profit" />
                            </div>
                            <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                                <div className="text-xs text-muted-foreground mb-1">Margin %</div>
                                <div className="text-2xl font-bold text-foreground">{markupResults.marginPercent}%</div>
                                <CopyButton value={markupResults.marginPercent} copyKey="markup-margin" />
                            </div>
                        </div>
                    )}

                    <div className="rounded-lg bg-muted/30 border border-border/50 px-4 py-2.5 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Formula:</span> Selling Price = Cost × (1 + Markup/100) = {markupCost || "0"} × (1 + {markupPercent || "0"}/100) = ${markupResults?.sellingPrice || "0"}
                    </div>
                </>
            )}

            {mode === "markup" && markupSubMode === "cost-selling" && (
                <>
                    <div className="grid gap-4 md:grid-cols-2 items-end">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Cost Price</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground font-semibold">$</span>
                                <input
                                    type="number"
                                    value={markupCost}
                                    onChange={(e) => setMarkupCost(e.target.value)}
                                    placeholder="Enter cost"
                                    className="h-14 w-full rounded-xl border border-input bg-background pl-9 pr-4 text-2xl font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    min="0"
                                    step="any"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Selling Price</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground font-semibold">$</span>
                                <input
                                    type="number"
                                    value={markupSellingPrice}
                                    onChange={(e) => setMarkupSellingPrice(e.target.value)}
                                    placeholder="Enter selling price"
                                    className="h-14 w-full rounded-xl border border-input bg-background pl-9 pr-4 text-2xl font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    min="0"
                                    step="any"
                                />
                            </div>
                        </div>
                    </div>

                    {markupResults && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                                <div className="text-xs text-muted-foreground mb-1">Markup %</div>
                                <div className="text-2xl font-bold text-foreground">{markupResults.markupPercent}%</div>
                                <CopyButton value={markupResults.markupPercent!} copyKey="markup-pct" />
                            </div>
                            <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                                <div className="text-xs text-muted-foreground mb-1">Profit (Markup Amount)</div>
                                <div className="text-2xl font-bold text-foreground">${markupResults.profit}</div>
                                <CopyButton value={markupResults.profit} copyKey="markup-profit2" />
                            </div>
                            <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                                <div className="text-xs text-muted-foreground mb-1">Margin %</div>
                                <div className="text-2xl font-bold text-foreground">{markupResults.marginPercent}%</div>
                                <CopyButton value={markupResults.marginPercent} copyKey="markup-margin2" />
                            </div>
                        </div>
                    )}

                    <div className="rounded-lg bg-muted/30 border border-border/50 px-4 py-2.5 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Formula:</span> Markup % = ((Selling Price - Cost) / Cost) × 100 = (({markupSellingPrice || "0"} - {markupCost || "0"}) / {markupCost || "0"}) × 100 = {markupResults?.markupPercent || "0"}%
                    </div>
                </>
            )}

            {/* ===== MARGIN MODE ===== */}
            {mode === "margin" && marginSubMode === "selling-margin" && (
                <>
                    <div className="grid gap-4 md:grid-cols-2 items-end">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Selling Price / Revenue</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground font-semibold">$</span>
                                <input
                                    type="number"
                                    value={marginSellingPrice}
                                    onChange={(e) => setMarginSellingPrice(e.target.value)}
                                    placeholder="Enter selling price"
                                    className="h-14 w-full rounded-xl border border-input bg-background pl-9 pr-4 text-2xl font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    min="0"
                                    step="any"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Margin Percentage</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={marginPercent}
                                    onChange={(e) => setMarginPercent(e.target.value)}
                                    placeholder="Enter margin %"
                                    className="h-14 w-full rounded-xl border border-input bg-background px-4 pr-10 text-2xl font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    min="0"
                                    step="any"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground font-semibold">%</span>
                            </div>
                        </div>
                    </div>

                    {marginResults && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                                <div className="text-xs text-muted-foreground mb-1">Cost</div>
                                <div className="text-2xl font-bold text-foreground">${marginResults.cost}</div>
                                <CopyButton value={marginResults.cost!} copyKey="margin-cost" />
                            </div>
                            <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                                <div className="text-xs text-muted-foreground mb-1">Profit</div>
                                <div className="text-2xl font-bold text-foreground">${marginResults.profit}</div>
                                <CopyButton value={marginResults.profit} copyKey="margin-profit" />
                            </div>
                        </div>
                    )}

                    <div className="rounded-lg bg-muted/30 border border-border/50 px-4 py-2.5 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Formula:</span> Cost = Selling Price × (1 - Margin/100) = {marginSellingPrice || "0"} × (1 - {marginPercent || "0"}/100) = ${marginResults?.cost || "0"}
                    </div>
                </>
            )}

            {mode === "margin" && marginSubMode === "cost-selling" && (
                <>
                    <div className="grid gap-4 md:grid-cols-2 items-end">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Cost</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground font-semibold">$</span>
                                <input
                                    type="number"
                                    value={marginCost}
                                    onChange={(e) => setMarginCost(e.target.value)}
                                    placeholder="Enter cost"
                                    className="h-14 w-full rounded-xl border border-input bg-background pl-9 pr-4 text-2xl font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    min="0"
                                    step="any"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Selling Price</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground font-semibold">$</span>
                                <input
                                    type="number"
                                    value={marginCostSelling}
                                    onChange={(e) => setMarginCostSelling(e.target.value)}
                                    placeholder="Enter selling price"
                                    className="h-14 w-full rounded-xl border border-input bg-background pl-9 pr-4 text-2xl font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    min="0"
                                    step="any"
                                />
                            </div>
                        </div>
                    </div>

                    {marginResults && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                                <div className="text-xs text-muted-foreground mb-1">Margin %</div>
                                <div className="text-2xl font-bold text-foreground">{marginResults.marginPercent}%</div>
                                <CopyButton value={marginResults.marginPercent!} copyKey="margin-pct" />
                            </div>
                            <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                                <div className="text-xs text-muted-foreground mb-1">Profit</div>
                                <div className="text-2xl font-bold text-foreground">${marginResults.profit}</div>
                                <CopyButton value={marginResults.profit} copyKey="margin-profit2" />
                            </div>
                        </div>
                    )}

                    <div className="rounded-lg bg-muted/30 border border-border/50 px-4 py-2.5 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Formula:</span> Margin % = ((Selling Price - Cost) / Selling Price) × 100 = (({marginCostSelling || "0"} - {marginCost || "0"}) / {marginCostSelling || "0"}) × 100 = {marginResults?.marginPercent || "0"}%
                    </div>
                </>
            )}

            {/* ===== CONVERTER MODE ===== */}
            {mode === "converter" && (
                <>
                    <div className="grid gap-4 md:grid-cols-2 items-end">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">
                                {converterDirection === "markup-to-margin" ? "Markup %" : "Margin %"}
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={converterInput}
                                    onChange={(e) => setConverterInput(e.target.value)}
                                    placeholder={converterDirection === "markup-to-margin" ? "Enter markup %" : "Enter margin %"}
                                    className="h-14 w-full rounded-xl border border-input bg-background px-4 pr-10 text-2xl font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    step="any"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground font-semibold">%</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">
                                {converterDirection === "markup-to-margin" ? "Equivalent Margin %" : "Equivalent Markup %"}
                            </label>
                            <div className="relative">
                                <div className="h-14 flex items-center rounded-xl border border-input bg-slate-50 px-4 text-2xl font-semibold shadow-sm">
                                    {converterResult ? (
                                        <span>{converterResult}<span className="text-lg text-muted-foreground ml-1">%</span></span>
                                    ) : (
                                        <span className="text-muted-foreground text-lg">Result</span>
                                    )}
                                </div>
                                {converterResult && (
                                    <button
                                        onClick={() => handleCopy(converterResult, "converter-result")}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 items-center justify-center rounded-md px-2 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                                        title="Copy result"
                                    >
                                        {copiedKey === "converter-result" ? <CheckCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-muted/30 border border-border/50 px-4 py-2.5 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Formulas:</span>{" "}
                        Margin = Markup / (1 + Markup) &nbsp;|&nbsp; Markup = Margin / (1 - Margin)
                    </div>

                    {/* Reference table */}
                    <div className="space-y-3">
                        <h3 className="text-base font-semibold">Markup vs Margin Reference Table</h3>
                        <div className="overflow-x-auto rounded-xl border border-border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-muted/50">
                                        <th className="px-4 py-2.5 text-left font-semibold">Markup %</th>
                                        <th className="px-4 py-2.5 text-right font-semibold">Margin %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MARKUP_MARGIN_TABLE.map((row, i) => (
                                        <tr key={row.markup} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                                            <td className="px-4 py-2 font-medium">{formatPercent(row.markup)}%</td>
                                            <td className="px-4 py-2 text-right text-muted-foreground">{formatPercent(row.margin)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Markup is based on cost price, while margin is based on selling price. A 100% markup always equals a 50% margin.
                        </p>
                    </div>
                </>
            )}

            {/* Reset button */}
            <div className="flex justify-end">
                <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
