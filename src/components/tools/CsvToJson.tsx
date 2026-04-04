"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Copy, CheckCheck, ArrowRightLeft, Trash2, Download, Upload, FileText } from "lucide-react";
import Link from "next/link";
import { trackToolUsage } from "@/components/ToolAnalytics";

type Delimiter = "," | ";" | "\t" | "|";
type OutputFormat = "objects" | "arrays";

function detectDelimiter(firstLine: string): Delimiter {
    const counts: Record<Delimiter, number> = { ",": 0, ";": 0, "\t": 0, "|": 0 };
    let inQuotes = false;
    for (const ch of firstLine) {
        if (ch === '"') { inQuotes = !inQuotes; continue; }
        if (inQuotes) continue;
        if (ch in counts) counts[ch as Delimiter]++;
    }
    let best: Delimiter = ",";
    let max = 0;
    for (const [d, c] of Object.entries(counts)) {
        if (c > max) { max = c; best = d as Delimiter; }
    }
    return best;
}

function parseCSVLine(line: string, delimiter: string): string[] {
    const fields: string[] = [];
    let current = "";
    let inQuotes = false;
    let i = 0;
    while (i < line.length) {
        const ch = line[i];
        if (inQuotes) {
            if (ch === '"') {
                if (i + 1 < line.length && line[i + 1] === '"') {
                    current += '"';
                    i += 2;
                } else {
                    inQuotes = false;
                    i++;
                }
            } else {
                current += ch;
                i++;
            }
        } else {
            if (ch === '"') {
                inQuotes = true;
                i++;
            } else if (ch === delimiter) {
                fields.push(current);
                current = "";
                i++;
            } else {
                current += ch;
                i++;
            }
        }
    }
    fields.push(current);
    return fields;
}

function parseCSV(csvStr: string, delimiter: Delimiter): string[][] {
    const rows: string[][] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < csvStr.length; i++) {
        const ch = csvStr[i];
        if (ch === '"') {
            inQuotes = !inQuotes;
            current += ch;
        } else if ((ch === "\n" || ch === "\r") && !inQuotes) {
            if (ch === "\r" && i + 1 < csvStr.length && csvStr[i + 1] === "\n") i++;
            if (current.length > 0 || rows.length > 0) {
                rows.push(parseCSVLine(current, delimiter));
            }
            current = "";
        } else {
            current += ch;
        }
    }
    if (current.length > 0) {
        rows.push(parseCSVLine(current, delimiter));
    }
    return rows;
}

function autoDetectType(value: string): unknown {
    if (value === "") return null;
    if (value === "true") return true;
    if (value === "false") return false;
    if (value === "null") return null;
    if (/^-?\d+(\.\d+)?$/.test(value) && value.length < 16) {
        const num = Number(value);
        if (!isNaN(num) && isFinite(num)) return num;
    }
    return value;
}

function csvToJson(
    csvStr: string,
    delimiter: Delimiter,
    firstRowHeaders: boolean,
    autoDetectTypes: boolean,
    outputFormat: OutputFormat
): { json: string; rows: number; error?: string } {
    if (!csvStr.trim()) {
        return { json: "", rows: 0, error: "Input is empty." };
    }

    const allRows = parseCSV(csvStr, delimiter);
    if (allRows.length === 0) {
        return { json: "", rows: 0, error: "No data found in CSV." };
    }

    if (outputFormat === "arrays") {
        const processed = autoDetectTypes
            ? allRows.map(row => row.map(autoDetectType))
            : allRows;
        return { json: JSON.stringify(processed, null, 2), rows: allRows.length };
    }

    if (firstRowHeaders) {
        if (allRows.length < 2) {
            return { json: "[]", rows: 0, error: "CSV has headers but no data rows." };
        }
        const headers = allRows[0].map(h => h.trim());
        const dataRows = allRows.slice(1);
        const result = dataRows.map(row => {
            const obj: Record<string, unknown> = {};
            for (let i = 0; i < headers.length; i++) {
                const val = i < row.length ? row[i] : "";
                obj[headers[i] || `column_${i}`] = autoDetectTypes ? autoDetectType(val) : val;
            }
            return obj;
        });
        return { json: JSON.stringify(result, null, 2), rows: dataRows.length };
    } else {
        const maxCols = Math.max(...allRows.map(r => r.length));
        const headers = Array.from({ length: maxCols }, (_, i) => `column_${i + 1}`);
        const result = allRows.map(row => {
            const obj: Record<string, unknown> = {};
            for (let i = 0; i < headers.length; i++) {
                const val = i < row.length ? row[i] : "";
                obj[headers[i]] = autoDetectTypes ? autoDetectType(val) : val;
            }
            return obj;
        });
        return { json: JSON.stringify(result, null, 2), rows: allRows.length };
    }
}

const SAMPLE_CSV = `name,age,city,department,active
Alice Johnson,32,San Francisco,Engineering,true
Bob Smith,28,New York,Design,true
Carol Davis,35,Chicago,Marketing,false
David Wilson,41,Austin,Engineering,true
Eva Martinez,26,Seattle,Design,true`;

const DELIMITER_OPTIONS: { label: string; value: Delimiter }[] = [
    { label: "Comma (,)", value: "," },
    { label: "Semicolon (;)", value: ";" },
    { label: "Tab", value: "\t" },
    { label: "Pipe (|)", value: "|" },
];

export default function CsvToJson() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");
    const [stats, setStats] = useState("");
    const [copied, setCopied] = useState(false);
    const [delimiter, setDelimiter] = useState<Delimiter>(",");
    const [autoDelimiter, setAutoDelimiter] = useState(true);
    const [firstRowHeaders, setFirstRowHeaders] = useState(true);
    const [autoDetectTypesEnabled, setAutoDetectTypesEnabled] = useState(true);
    const [outputFormat, setOutputFormat] = useState<OutputFormat>("objects");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout>(undefined);

    const doConvert = useCallback((csv: string) => {
        if (!csv.trim()) {
            setOutput("");
            setError("");
            setStats("");
            return;
        }
        let delim = delimiter;
        if (autoDelimiter) {
            const firstLine = csv.split(/\r?\n/)[0] || "";
            delim = detectDelimiter(firstLine);
        }
        const result = csvToJson(csv, delim, firstRowHeaders, autoDetectTypesEnabled, outputFormat);
        if (result.error && !result.json) {
            setError(result.error);
            setOutput("");
            setStats("");
        } else {
            setError(result.error || "");
            setOutput(result.json);
            setStats(`Converted ${result.rows} row${result.rows !== 1 ? "s" : ""} into JSON array`);
            trackToolUsage("csv-to-json");
        }
    }, [delimiter, autoDelimiter, firstRowHeaders, autoDetectTypesEnabled, outputFormat]);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => doConvert(input), 300);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [input, doConvert]);

    const handleCopy = useCallback(() => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [output]);

    const handleDownload = useCallback(() => {
        if (!output) return;
        const blob = new Blob([output], { type: "application/json;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "converted.json";
        a.click();
        URL.revokeObjectURL(url);
    }, [output]);

    const handleUpload = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = ev.target?.result as string;
            setInput(text);
        };
        reader.readAsText(file);
        e.target.value = "";
    }, []);

    const handleClear = () => {
        setInput("");
        setOutput("");
        setError("");
        setStats("");
    };

    const handleSample = () => {
        setInput(SAMPLE_CSV);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">CSV to JSON</span>
                    <span className="text-xs text-muted-foreground">Convert CSV data to JSON format</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSample}
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        <FileText className="mr-1.5 h-3.5 w-3.5" />
                        Load Sample
                    </button>
                    <button
                        onClick={handleUpload}
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        <Upload className="mr-1.5 h-3.5 w-3.5" />
                        Upload CSV
                    </button>
                    <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFileChange} />
                    <button
                        onClick={handleClear}
                        disabled={!input}
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                    >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Clear
                    </button>
                    <Link
                        href="/json-tools/json-to-csv"
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        <ArrowRightLeft className="mr-1.5 h-3.5 w-3.5" />
                        Swap to JSON → CSV
                    </Link>
                </div>
            </div>

            {/* Options Row */}
            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/60 bg-card p-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-muted-foreground">Delimiter:</label>
                    {autoDelimiter ? (
                        <span className="rounded-md border border-input bg-background px-2.5 py-1.5 text-sm text-muted-foreground">Auto-detect</span>
                    ) : (
                        <select
                            value={delimiter}
                            onChange={(e) => setDelimiter(e.target.value as Delimiter)}
                            className="rounded-md border border-input bg-background px-2.5 py-1.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            {DELIMITER_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    )}
                    <label className="flex items-center gap-1 text-xs cursor-pointer">
                        <input
                            type="checkbox"
                            checked={autoDelimiter}
                            onChange={(e) => setAutoDelimiter(e.target.checked)}
                            className="rounded border-input"
                        />
                        <span className="text-muted-foreground">Auto</span>
                    </label>
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={firstRowHeaders}
                        onChange={(e) => setFirstRowHeaders(e.target.checked)}
                        className="rounded border-input"
                    />
                    <span className="text-muted-foreground">First row as headers</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={autoDetectTypesEnabled}
                        onChange={(e) => setAutoDetectTypesEnabled(e.target.checked)}
                        className="rounded border-input"
                    />
                    <span className="text-muted-foreground">Auto-detect types</span>
                </label>
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-muted-foreground">Output:</label>
                    <select
                        value={outputFormat}
                        onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                        className="rounded-md border border-input bg-background px-2.5 py-1.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        <option value="objects">Array of objects</option>
                        <option value="arrays">Array of arrays</option>
                    </select>
                </div>
            </div>

            {/* Two-panel layout */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium tracking-tight text-muted-foreground">
                        CSV Input
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={"name,age,city\nJohn,30,New York\nJane,25,London"}
                        className="min-h-[350px] w-full resize-y rounded-xl border border-input bg-background p-4 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
                        spellCheck="false"
                    />
                    {input && !error && (
                        <div className="text-xs text-muted-foreground">
                            {input.length} character{input.length !== 1 ? "s" : ""}
                        </div>
                    )}
                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium tracking-tight text-muted-foreground">
                            JSON Output
                        </label>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleCopy}
                                disabled={!output}
                                className="inline-flex h-6 items-center justify-center rounded-md px-2 text-xs font-medium text-primary hover:bg-primary/10 disabled:opacity-50"
                            >
                                {copied ? <CheckCheck className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
                                {copied ? "Copied" : "Copy"}
                            </button>
                            <button
                                onClick={handleDownload}
                                disabled={!output}
                                className="inline-flex h-6 items-center justify-center rounded-md px-2 text-xs font-medium text-primary hover:bg-primary/10 disabled:opacity-50"
                            >
                                <Download className="mr-1 h-3 w-3" />
                                Download JSON
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 min-h-[350px] rounded-xl border border-input bg-slate-50 p-4 text-sm shadow-sm overflow-auto font-mono whitespace-pre-wrap">
                        {output || <span className="text-muted-foreground">JSON output will appear here...</span>}
                    </div>
                    {stats && (
                        <div className="text-xs text-emerald-600 font-medium">
                            {stats}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
