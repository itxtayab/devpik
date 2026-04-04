"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Copy, CheckCheck, ArrowRightLeft, Trash2, Download, Upload, FileText } from "lucide-react";
import Link from "next/link";
import { trackToolUsage } from "@/components/ToolAnalytics";

type Delimiter = "," | ";" | "\t" | "|";

function flattenObject(obj: Record<string, unknown>, prefix = ""): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const value = obj[key];
        if (value && typeof value === "object" && !Array.isArray(value)) {
            Object.assign(result, flattenObject(value as Record<string, unknown>, fullKey));
        } else {
            result[fullKey] = value;
        }
    }
    return result;
}

function escapeCSVValue(value: unknown, delimiter: string): string {
    if (value === null || value === undefined) return "";
    let str: string;
    if (Array.isArray(value)) {
        str = value.map(v => (typeof v === "object" ? JSON.stringify(v) : String(v))).join(";");
    } else if (typeof value === "object") {
        str = JSON.stringify(value);
    } else {
        str = String(value);
    }
    if (str.includes(delimiter) || str.includes('"') || str.includes("\n") || str.includes("\r")) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}

function jsonToCsv(
    jsonStr: string,
    delimiter: Delimiter,
    includeHeaders: boolean,
    flattenNested: boolean
): { csv: string; rows: number; cols: number; error?: string } {
    let parsed: unknown;
    try {
        parsed = JSON.parse(jsonStr);
    } catch (e) {
        const msg = e instanceof SyntaxError ? e.message : "Invalid JSON";
        return { csv: "", rows: 0, cols: 0, error: `Invalid JSON: ${msg}` };
    }

    if (!Array.isArray(parsed)) {
        const type = parsed === null ? "null" : typeof parsed;
        return { csv: "", rows: 0, cols: 0, error: `JSON must be an array of objects. Got ${type} instead.` };
    }

    if (parsed.length === 0) {
        return { csv: "", rows: 0, cols: 0, error: "The JSON array is empty." };
    }

    const objects = parsed.filter(item => item && typeof item === "object" && !Array.isArray(item));
    if (objects.length === 0) {
        return { csv: "", rows: 0, cols: 0, error: "No valid objects found in the array." };
    }

    const processed = flattenNested
        ? objects.map(obj => flattenObject(obj as Record<string, unknown>))
        : objects as Record<string, unknown>[];

    const headersSet = new Set<string>();
    for (const obj of processed) {
        for (const key of Object.keys(obj)) {
            headersSet.add(key);
        }
    }
    const headers = Array.from(headersSet);

    const lines: string[] = [];
    if (includeHeaders) {
        lines.push(headers.map(h => escapeCSVValue(h, delimiter)).join(delimiter));
    }

    for (const obj of processed) {
        const row = headers.map(h => escapeCSVValue(obj[h], delimiter));
        lines.push(row.join(delimiter));
    }

    return { csv: lines.join("\n"), rows: objects.length, cols: headers.length };
}

const SAMPLE_JSON = `[
  {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "age": 32,
    "department": "Engineering",
    "address": {
      "city": "San Francisco",
      "state": "CA",
      "zip": "94102"
    },
    "skills": ["JavaScript", "Python", "React"]
  },
  {
    "id": 2,
    "name": "Bob Smith",
    "email": "bob@example.com",
    "age": 28,
    "department": "Design",
    "address": {
      "city": "New York",
      "state": "NY",
      "zip": "10001"
    },
    "skills": ["Figma", "CSS", "Illustrator"]
  },
  {
    "id": 3,
    "name": "Carol Davis",
    "email": "carol@example.com",
    "age": 35,
    "department": "Marketing",
    "address": {
      "city": "Chicago",
      "state": "IL",
      "zip": "60601"
    },
    "skills": ["SEO", "Analytics", "Content"]
  }
]`;

const DELIMITER_OPTIONS: { label: string; value: Delimiter }[] = [
    { label: "Comma (,)", value: "," },
    { label: "Semicolon (;)", value: ";" },
    { label: "Tab", value: "\t" },
    { label: "Pipe (|)", value: "|" },
];

export default function JsonToCsv() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");
    const [stats, setStats] = useState("");
    const [copied, setCopied] = useState(false);
    const [delimiter, setDelimiter] = useState<Delimiter>(",");
    const [includeHeaders, setIncludeHeaders] = useState(true);
    const [flattenNested, setFlattenNested] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout>(undefined);

    const doConvert = useCallback((json: string) => {
        if (!json.trim()) {
            setOutput("");
            setError("");
            setStats("");
            return;
        }
        const result = jsonToCsv(json, delimiter, includeHeaders, flattenNested);
        if (result.error) {
            setError(result.error);
            setOutput("");
            setStats("");
        } else {
            setError("");
            setOutput(result.csv);
            setStats(`Converted ${result.rows} row${result.rows !== 1 ? "s" : ""} with ${result.cols} column${result.cols !== 1 ? "s" : ""}`);
            trackToolUsage("json-to-csv");
        }
    }, [delimiter, includeHeaders, flattenNested]);

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
        const blob = new Blob([output], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "converted.csv";
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
        setInput(SAMPLE_JSON);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">JSON to CSV</span>
                    <span className="text-xs text-muted-foreground">Convert JSON arrays to CSV format</span>
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
                        Upload JSON
                    </button>
                    <input ref={fileInputRef} type="file" accept=".json,application/json" className="hidden" onChange={handleFileChange} />
                    <button
                        onClick={handleClear}
                        disabled={!input}
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                    >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Clear
                    </button>
                    <Link
                        href="/json-tools/csv-to-json"
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        <ArrowRightLeft className="mr-1.5 h-3.5 w-3.5" />
                        Swap to CSV → JSON
                    </Link>
                </div>
            </div>

            {/* Options Row */}
            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/60 bg-card p-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-muted-foreground">Delimiter:</label>
                    <select
                        value={delimiter}
                        onChange={(e) => setDelimiter(e.target.value as Delimiter)}
                        className="rounded-md border border-input bg-background px-2.5 py-1.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        {DELIMITER_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={includeHeaders}
                        onChange={(e) => setIncludeHeaders(e.target.checked)}
                        className="rounded border-input"
                    />
                    <span className="text-muted-foreground">Include headers</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={flattenNested}
                        onChange={(e) => setFlattenNested(e.target.checked)}
                        className="rounded border-input"
                    />
                    <span className="text-muted-foreground">Flatten nested objects</span>
                </label>
            </div>

            {/* Two-panel layout */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium tracking-tight text-muted-foreground">
                        JSON Input
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={'[{"name":"John","age":30},{"name":"Jane","age":25}]'}
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
                            CSV Output
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
                                Download CSV
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 min-h-[350px] rounded-xl border border-input bg-slate-50 p-4 text-sm shadow-sm overflow-auto break-all font-mono whitespace-pre-wrap">
                        {output || <span className="text-muted-foreground">CSV output will appear here...</span>}
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
