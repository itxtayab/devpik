"use client";

import { useState, useMemo } from "react";
import { Copy, CheckCheck } from "lucide-react";

type Mode = "num-to-sci" | "sci-to-num" | "calculator";
type Operation = "add" | "subtract" | "multiply" | "divide";

const DECIMAL_PRESETS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const SUPERSCRIPT_MAP: Record<string, string> = {
    "0": "\u2070", "1": "\u00B9", "2": "\u00B2", "3": "\u00B3", "4": "\u2074",
    "5": "\u2075", "6": "\u2076", "7": "\u2077", "8": "\u2078", "9": "\u2079", "-": "\u207B",
};

function toSuperscript(n: number): string {
    return String(n).split("").map((c) => SUPERSCRIPT_MAP[c] || c).join("");
}

function toEngineering(num: number): { coefficient: number; exponent: number } {
    if (num === 0) return { coefficient: 0, exponent: 0 };
    const exp = Math.floor(Math.log10(Math.abs(num)));
    const engExp = Math.floor(exp / 3) * 3;
    const coeff = num / Math.pow(10, engExp);
    return { coefficient: coeff, exponent: engExp };
}

function formatWithCommas(num: number): string {
    if (!isFinite(num)) return String(num);
    const parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function toScientific(num: number, decimals: number): { coefficient: number; exponent: number } {
    if (num === 0) return { coefficient: 0, exponent: 0 };
    const exp = Math.floor(Math.log10(Math.abs(num)));
    const coeff = num / Math.pow(10, exp);
    return { coefficient: parseFloat(coeff.toFixed(decimals)), exponent: exp };
}

function fromSuperscript(str: string): string {
    const reverseMap: Record<string, string> = {};
    for (const [k, v] of Object.entries(SUPERSCRIPT_MAP)) {
        reverseMap[v] = k;
    }
    return str.split("").map((c) => reverseMap[c] || c).join("");
}

function parseScientificInput(input: string): number | null {
    const trimmed = input.trim();
    if (!trimmed) return null;

    // Try plain number first
    const plain = Number(trimmed);
    if (!isNaN(plain) && trimmed !== "") return plain;

    // e-notation: 3.5e8, 3.5E-4
    if (/[eE]/.test(trimmed)) {
        const val = Number(trimmed);
        return isNaN(val) ? null : val;
    }

    // × or x or * notation: "3.5 × 10^8", "3.5 x 10^8", "3.5*10^8", "3.5 × 10⁸"
    const mulMatch = trimmed.split(/[×xX\*]/);
    if (mulMatch.length === 2) {
        const coeff = parseFloat(mulMatch[0].trim());
        if (isNaN(coeff)) return null;

        let expPart = mulMatch[1].trim();

        // Remove leading "10" prefix
        if (expPart.startsWith("10")) {
            expPart = expPart.slice(2).trim();
        } else {
            return null;
        }

        // Handle "^8" or "^-8"
        if (expPart.startsWith("^")) {
            expPart = expPart.slice(1).trim();
            const exp = parseInt(expPart, 10);
            if (isNaN(exp)) return null;
            return coeff * Math.pow(10, exp);
        }

        // Handle unicode superscripts: "⁸", "⁻³¹"
        const converted = fromSuperscript(expPart);
        const exp = parseInt(converted, 10);
        if (isNaN(exp)) return null;
        return coeff * Math.pow(10, exp);
    }

    return null;
}

function formatScientificUnicode(coeff: number, exp: number): string {
    return `${coeff} \u00D7 10${toSuperscript(exp)}`;
}

function formatENotation(coeff: number, exp: number): string {
    return `${coeff}e${exp}`;
}

const REFERENCE_TABLE = [
    { value: "Speed of light", scientific: "2.998 \u00D7 10\u2078 m/s", eNotation: "2.998e8", name: "~300 million m/s" },
    { value: "Avogadro's number", scientific: `6.022 \u00D7 10${toSuperscript(23)}`, eNotation: "6.022e23", name: "Atoms per mole" },
    { value: "Electron mass", scientific: `9.109 \u00D7 10${toSuperscript(-31)} kg`, eNotation: "9.109e-31", name: "Very small mass" },
    { value: "Earth's mass", scientific: `5.972 \u00D7 10${toSuperscript(24)} kg`, eNotation: "5.972e24", name: "~6 trillion trillion kg" },
    { value: "Planck's constant", scientific: `6.626 \u00D7 10${toSuperscript(-34)} J\u00B7s`, eNotation: "6.626e-34", name: "Quantum of action" },
    { value: "Distance to Sun", scientific: `1.496 \u00D7 10${toSuperscript(11)} m`, eNotation: "1.496e11", name: "~150 million km" },
    { value: "Age of universe", scientific: `4.35 \u00D7 10${toSuperscript(17)} s`, eNotation: "4.35e17", name: "~13.8 billion years" },
    { value: "Hydrogen atom size", scientific: `1.2 \u00D7 10${toSuperscript(-10)} m`, eNotation: "1.2e-10", name: "~0.12 nanometers" },
];

export default function ScientificNotationConverter() {
    const [mode, setMode] = useState<Mode>("num-to-sci");
    const [numberInput, setNumberInput] = useState("123456789");
    const [decimals, setDecimals] = useState(6);
    const [sciInput, setSciInput] = useState("3.5e8");
    const [calcA, setCalcA] = useState("3.5e8");
    const [calcB, setCalcB] = useState("2.0e3");
    const [operation, setOperation] = useState<Operation>("multiply");
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const handleCopy = async (text: string, key: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 1500);
    };

    // Mode 1: Number -> Scientific
    const numToSciResults = useMemo(() => {
        const val = parseFloat(numberInput);
        if (isNaN(val) || numberInput.trim() === "") return null;

        const { coefficient, exponent } = toScientific(val, decimals);
        const eng = toEngineering(val);
        const engCoeff = parseFloat(eng.coefficient.toFixed(decimals));

        return {
            scientific: formatScientificUnicode(coefficient, exponent),
            eNotation: formatENotation(coefficient, exponent),
            engineering: `${engCoeff} \u00D7 10${toSuperscript(eng.exponent)}`,
            standard: formatWithCommas(val),
            coefficient,
            exponent,
        };
    }, [numberInput, decimals]);

    // Mode 2: Scientific -> Number
    const sciToNumResults = useMemo(() => {
        const val = parseScientificInput(sciInput);
        if (val === null) return null;

        const { coefficient, exponent } = toScientific(val, 10);
        const sci6 = toScientific(val, 6);
        const eng = toEngineering(val);
        const engCoeff = parseFloat(eng.coefficient.toFixed(6));

        return {
            standard: formatWithCommas(val),
            scientific: formatScientificUnicode(sci6.coefficient, sci6.exponent),
            eNotation: formatENotation(sci6.coefficient, sci6.exponent),
            engineering: `${engCoeff} \u00D7 10${toSuperscript(eng.exponent)}`,
            rawValue: val,
            coefficient,
            exponent,
        };
    }, [sciInput]);

    // Mode 3: Calculator
    const calcResults = useMemo(() => {
        const a = parseScientificInput(calcA);
        const b = parseScientificInput(calcB);
        if (a === null || b === null) return null;

        let result: number;
        switch (operation) {
            case "add": result = a + b; break;
            case "subtract": result = a - b; break;
            case "multiply": result = a * b; break;
            case "divide":
                if (b === 0) return null;
                result = a / b;
                break;
        }

        const sci = toScientific(result, 6);
        const sciA = toScientific(a, 6);
        const sciB = toScientific(b, 6);

        let steps: string[] = [];
        switch (operation) {
            case "multiply":
                steps = [
                    `Multiply coefficients: ${sciA.coefficient} \u00D7 ${sciB.coefficient} = ${parseFloat((sciA.coefficient * sciB.coefficient).toFixed(6))}`,
                    `Add exponents: ${sciA.exponent} + ${sciB.exponent} = ${sciA.exponent + sciB.exponent}`,
                    `Raw result: ${parseFloat((sciA.coefficient * sciB.coefficient).toFixed(6))} \u00D7 10${toSuperscript(sciA.exponent + sciB.exponent)}`,
                    `Normalized: ${formatScientificUnicode(sci.coefficient, sci.exponent)}`,
                ];
                break;
            case "divide":
                steps = [
                    `Divide coefficients: ${sciA.coefficient} \u00F7 ${sciB.coefficient} = ${parseFloat((sciA.coefficient / sciB.coefficient).toFixed(6))}`,
                    `Subtract exponents: ${sciA.exponent} \u2212 ${sciB.exponent} = ${sciA.exponent - sciB.exponent}`,
                    `Raw result: ${parseFloat((sciA.coefficient / sciB.coefficient).toFixed(6))} \u00D7 10${toSuperscript(sciA.exponent - sciB.exponent)}`,
                    `Normalized: ${formatScientificUnicode(sci.coefficient, sci.exponent)}`,
                ];
                break;
            case "add":
            case "subtract": {
                const maxExp = Math.max(sciA.exponent, sciB.exponent);
                const adjA = a / Math.pow(10, maxExp);
                const adjB = b / Math.pow(10, maxExp);
                const opSymbol = operation === "add" ? "+" : "\u2212";
                const adjResult = operation === "add" ? adjA + adjB : adjA - adjB;
                steps = [
                    `Convert to same exponent (10${toSuperscript(maxExp)}):`,
                    `  ${parseFloat(adjA.toFixed(6))} \u00D7 10${toSuperscript(maxExp)} ${opSymbol} ${parseFloat(adjB.toFixed(6))} \u00D7 10${toSuperscript(maxExp)}`,
                    `${operation === "add" ? "Add" : "Subtract"} coefficients: ${parseFloat(adjA.toFixed(6))} ${opSymbol} ${parseFloat(adjB.toFixed(6))} = ${parseFloat(adjResult.toFixed(6))}`,
                    `Normalized: ${formatScientificUnicode(sci.coefficient, sci.exponent)}`,
                ];
                break;
            }
        }

        return {
            scientific: formatScientificUnicode(sci.coefficient, sci.exponent),
            eNotation: formatENotation(sci.coefficient, sci.exponent),
            standard: formatWithCommas(result),
            steps,
        };
    }, [calcA, calcB, operation]);

    const CopyButton = ({ text, copyKey }: { text: string; copyKey: string }) => (
        <button
            onClick={() => handleCopy(text, copyKey)}
            className="inline-flex h-7 items-center justify-center rounded-md px-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
            title="Copy"
        >
            {copiedKey === copyKey ? <CheckCheck className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
    );

    const ResultCard = ({ label, value, copyKey }: { label: string; value: string; copyKey: string }) => (
        <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
            <span className="block text-xs text-muted-foreground mb-1">{label}</span>
            <div className="flex items-center justify-center gap-1">
                <span className="text-lg font-bold text-foreground break-all">{value}</span>
                <CopyButton text={value} copyKey={copyKey} />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            {/* Mode tabs */}
            <div className="flex flex-wrap gap-2 border-b border-border/50 pb-4">
                <button
                    onClick={() => setMode("num-to-sci")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "num-to-sci" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                >
                    Number → Scientific
                </button>
                <button
                    onClick={() => setMode("sci-to-num")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "sci-to-num" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                >
                    Scientific → Number
                </button>
                <button
                    onClick={() => setMode("calculator")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "calculator" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                >
                    Calculator
                </button>
            </div>

            {/* Mode 1: Number to Scientific */}
            {mode === "num-to-sci" && (
                <>
                    <div className="flex flex-col gap-4">
                        {/* Input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Enter a Number</label>
                            <input
                                type="text"
                                value={numberInput}
                                onChange={(e) => setNumberInput(e.target.value)}
                                placeholder="e.g., 123456789 or 0.000035"
                                className="h-14 rounded-xl border border-input bg-background px-4 text-2xl font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>

                        {/* Decimal places */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Decimal Places</label>
                            <div className="flex flex-wrap gap-1.5">
                                {DECIMAL_PRESETS.map((preset) => (
                                    <button
                                        key={preset}
                                        onClick={() => setDecimals(preset)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${decimals === preset ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                                    >
                                        {preset}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    {numToSciResults && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <ResultCard label="Scientific Notation" value={numToSciResults.scientific} copyKey="sci" />
                                <ResultCard label="E Notation" value={numToSciResults.eNotation} copyKey="enot" />
                                <ResultCard label="Engineering Notation" value={numToSciResults.engineering} copyKey="eng" />
                                <ResultCard label="Decimal / Standard" value={numToSciResults.standard} copyKey="std" />
                            </div>

                            {/* Formula */}
                            <div className="rounded-lg bg-muted/30 border border-border/50 px-4 py-2.5 text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">Formula:</span>{" "}
                                {numberInput} = {numToSciResults.coefficient} \u00D7 10{toSuperscript(numToSciResults.exponent)}{" "}
                                (move decimal {Math.abs(numToSciResults.exponent)} place{Math.abs(numToSciResults.exponent) !== 1 ? "s" : ""} to the {numToSciResults.exponent >= 0 ? "left" : "right"})
                            </div>
                        </>
                    )}
                </>
            )}

            {/* Mode 2: Scientific to Number */}
            {mode === "sci-to-num" && (
                <>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Enter Scientific Notation</label>
                        <input
                            type="text"
                            value={sciInput}
                            onChange={(e) => setSciInput(e.target.value)}
                            placeholder='e.g., 3.5e8 or 3.5 × 10^8 or 3.5 × 10⁸'
                            className="h-14 rounded-xl border border-input bg-background px-4 text-2xl font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <p className="text-xs text-muted-foreground">
                            Accepts: 3.5e8, 3.5E-4, 3.5 × 10^8, 3.5 x 10^8, 3.5*10^8, 3.5 × 10⁸
                        </p>
                    </div>

                    {/* Results */}
                    {sciToNumResults && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <ResultCard label="Standard Number" value={sciToNumResults.standard} copyKey="s2n-std" />
                                <ResultCard label="Scientific Notation" value={sciToNumResults.scientific} copyKey="s2n-sci" />
                                <ResultCard label="E Notation" value={sciToNumResults.eNotation} copyKey="s2n-enot" />
                                <ResultCard label="Engineering Notation" value={sciToNumResults.engineering} copyKey="s2n-eng" />
                            </div>

                            {/* Formula */}
                            <div className="rounded-lg bg-muted/30 border border-border/50 px-4 py-2.5 text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">Formula:</span>{" "}
                                {sciToNumResults.scientific} = {sciToNumResults.standard}
                            </div>
                        </>
                    )}
                </>
            )}

            {/* Mode 3: Calculator */}
            {mode === "calculator" && (
                <>
                    <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] items-end">
                        {/* Input A */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Number A</label>
                            <input
                                type="text"
                                value={calcA}
                                onChange={(e) => setCalcA(e.target.value)}
                                placeholder="e.g., 3.5e8"
                                className="h-14 rounded-xl border border-input bg-background px-4 text-2xl font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>

                        {/* Operation */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Operation</label>
                            <div className="flex gap-1.5">
                                {([
                                    { op: "add" as Operation, label: "+" },
                                    { op: "subtract" as Operation, label: "\u2212" },
                                    { op: "multiply" as Operation, label: "\u00D7" },
                                    { op: "divide" as Operation, label: "\u00F7" },
                                ]).map(({ op, label }) => (
                                    <button
                                        key={op}
                                        onClick={() => setOperation(op)}
                                        className={`w-10 h-10 rounded-lg text-lg font-semibold transition-colors ${operation === op ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input B */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Number B</label>
                            <input
                                type="text"
                                value={calcB}
                                onChange={(e) => setCalcB(e.target.value)}
                                placeholder="e.g., 2.0e3"
                                className="h-14 rounded-xl border border-input bg-background px-4 text-2xl font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Enter numbers in any format: plain numbers, e-notation (3.5e8), or scientific notation (3.5 × 10^8)
                    </p>

                    {/* Results */}
                    {calcResults && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <ResultCard label="Scientific Notation" value={calcResults.scientific} copyKey="calc-sci" />
                                <ResultCard label="E Notation" value={calcResults.eNotation} copyKey="calc-enot" />
                                <ResultCard label="Standard Decimal" value={calcResults.standard} copyKey="calc-std" />
                            </div>

                            {/* Steps */}
                            <div className="rounded-lg bg-muted/30 border border-border/50 px-4 py-2.5 text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">Step-by-step:</span>
                                <ol className="list-decimal list-inside mt-1 space-y-0.5">
                                    {calcResults.steps.map((step, i) => (
                                        <li key={i} className={step.startsWith("  ") ? "ml-4 list-none" : ""}>
                                            {step}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </>
                    )}
                </>
            )}

            {/* Reference Table */}
            <div className="space-y-3">
                <h3 className="text-base font-semibold">Common Scientific Notation Values</h3>
                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted/50">
                                <th className="px-4 py-2.5 text-left font-semibold">Value</th>
                                <th className="px-4 py-2.5 text-left font-semibold">Scientific</th>
                                <th className="px-4 py-2.5 text-left font-semibold">E Notation</th>
                                <th className="px-4 py-2.5 text-left font-semibold">Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {REFERENCE_TABLE.map((row, i) => (
                                <tr key={row.value} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                                    <td className="px-4 py-2 font-medium">{row.value}</td>
                                    <td className="px-4 py-2 text-muted-foreground">{row.scientific}</td>
                                    <td className="px-4 py-2 text-muted-foreground">{row.eNotation}</td>
                                    <td className="px-4 py-2 text-muted-foreground">{row.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
