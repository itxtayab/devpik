"use client";

import { useState, useEffect, useCallback, useRef, useMemo, Fragment } from "react";
import {
    Copy, CheckCheck, Trash2, Wand2, Download, Upload,
    ChevronRight, ChevronDown, Search, X, FileJson, ToggleLeft,
    ToggleRight, Braces, ListTree, WrapText, Minimize2, FileCode,
    AlertTriangle, ChevronUp, Wrench, Sparkles, Info, ChevronsUpDown,
    FoldVertical, UnfoldVertical
} from "lucide-react";

// ─── Conversion Helpers ──────────────────────────────────────────────────────

function jsonToXml(obj: any, rootName = "root", indent = 0): string {
    const pad = "  ".repeat(indent);
    if (obj === null) return `${pad}<${rootName} />\n`;
    if (typeof obj !== "object") {
        const escaped = String(obj).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `${pad}<${rootName}>${escaped}</${rootName}>\n`;
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => jsonToXml(item, "item", indent)).join("");
    }
    let xml = `${pad}<${rootName}>\n`;
    for (const key of Object.keys(obj)) {
        const safeName = key.replace(/[^a-zA-Z0-9_-]/g, "_");
        if (Array.isArray(obj[key])) {
            xml += `${"  ".repeat(indent + 1)}<${safeName}>\n`;
            xml += obj[key].map((item: any) => jsonToXml(item, "item", indent + 2)).join("");
            xml += `${"  ".repeat(indent + 1)}</${safeName}>\n`;
        } else {
            xml += jsonToXml(obj[key], safeName, indent + 1);
        }
    }
    xml += `${pad}</${rootName}>\n`;
    return xml;
}

function jsonToCsv(data: any): string {
    if (!Array.isArray(data)) {
        if (typeof data === "object" && data !== null) data = [data];
        else return String(data);
    }
    if (data.length === 0) return "";
    const headers = Array.from(new Set(data.flatMap((row: any) => (typeof row === "object" && row !== null ? Object.keys(row) : []))));
    if (headers.length === 0) return data.map(String).join("\n");
    const escape = (val: any) => {
        const s = val === null || val === undefined ? "" : typeof val === "object" ? JSON.stringify(val) : String(val);
        return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = data.map((row: any) => headers.map((h) => escape(row?.[h as string])).join(","));
    return [headers.join(","), ...rows].join("\n");
}

function jsonToYaml(obj: any, indent = 0): string {
    const pad = "  ".repeat(indent);
    if (obj === null) return "null";
    if (typeof obj === "boolean") return obj ? "true" : "false";
    if (typeof obj === "number") return String(obj);
    if (typeof obj === "string") {
        if (obj.includes("\n") || obj.includes(": ") || obj.includes("#") || obj.startsWith("{") || obj.startsWith("[")) {
            return `"${obj.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`;
        }
        return obj;
    }
    if (Array.isArray(obj)) {
        if (obj.length === 0) return "[]";
        return "\n" + obj.map((item) => `${pad}- ${jsonToYaml(item, indent + 1).trimStart()}`).join("\n");
    }
    const keys = Object.keys(obj);
    if (keys.length === 0) return "{}";
    return (indent === 0 ? "" : "\n") + keys.map((key) => {
        const val = obj[key];
        const yamlVal = jsonToYaml(val, indent + 1);
        if (typeof val === "object" && val !== null && (Array.isArray(val) ? val.length > 0 : Object.keys(val).length > 0)) {
            return `${pad}${key}: ${yamlVal}`;
        }
        return `${pad}${key}: ${yamlVal}`;
    }).join("\n");
}

function fixJson(input: string): string {
    let s = input.trim();
    // Replace single quotes with double quotes (naive but effective for common cases)
    s = s.replace(/'/g, '"');
    // Remove trailing commas before } or ]
    s = s.replace(/,\s*([\]}])/g, "$1");
    // Add missing quotes around unquoted keys
    s = s.replace(/(\{|,)\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
    return s;
}

// ─── Statistics ──────────────────────────────────────────────────────────────

interface JsonStats {
    keys: number;
    values: number;
    depth: number;
    arrays: number;
    objects: number;
    strings: number;
    numbers: number;
    booleans: number;
    nulls: number;
    size: string;
}

function getJsonStats(obj: any, depth = 0): Omit<JsonStats, "size"> {
    const stats = { keys: 0, values: 0, depth, arrays: 0, objects: 0, strings: 0, numbers: 0, booleans: 0, nulls: 0 };
    if (obj === null) { stats.nulls = 1; stats.values = 1; return stats; }
    if (typeof obj !== "object") {
        stats.values = 1;
        if (typeof obj === "string") stats.strings = 1;
        else if (typeof obj === "number") stats.numbers = 1;
        else if (typeof obj === "boolean") stats.booleans = 1;
        return stats;
    }
    if (Array.isArray(obj)) {
        stats.arrays = 1;
        for (const item of obj) {
            const child = getJsonStats(item, depth + 1);
            stats.keys += child.keys; stats.values += child.values;
            stats.depth = Math.max(stats.depth, child.depth);
            stats.arrays += child.arrays; stats.objects += child.objects;
            stats.strings += child.strings; stats.numbers += child.numbers;
            stats.booleans += child.booleans; stats.nulls += child.nulls;
        }
    } else {
        stats.objects = 1;
        const entries = Object.entries(obj);
        stats.keys = entries.length;
        for (const [, val] of entries) {
            const child = getJsonStats(val, depth + 1);
            stats.keys += child.keys; stats.values += child.values;
            stats.depth = Math.max(stats.depth, child.depth);
            stats.arrays += child.arrays; stats.objects += child.objects;
            stats.strings += child.strings; stats.numbers += child.numbers;
            stats.booleans += child.booleans; stats.nulls += child.nulls;
        }
    }
    return stats;
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(2)} MB`;
}

// ─── Syntax Highlighting ─────────────────────────────────────────────────────

function highlightJson(json: string): string {
    return json.replace(
        /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        (match) => {
            let cls = "text-emerald-600 dark:text-emerald-400"; // string
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = "text-blue-600 dark:text-blue-400 font-semibold"; // key
                    match = match.replace(/:$/, "");
                    return `<span class="${cls}">${escapeHtml(match)}</span>:`;
                }
            } else if (/true|false/.test(match)) {
                cls = "text-amber-600 dark:text-amber-400"; // boolean
            } else if (/null/.test(match)) {
                cls = "text-rose-500 dark:text-rose-400 italic"; // null
            } else {
                cls = "text-violet-600 dark:text-violet-400"; // number
            }
            return `<span class="${cls}">${escapeHtml(match)}</span>`;
        }
    );
}

function escapeHtml(s: string): string {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ─── Collapsible JSON Code View ──────────────────────────────────────────────

interface JsonLine {
    lineNumber: number;
    content: string; // HTML-highlighted content for the line
    indent: number;
    foldable: boolean;
    foldId: string; // unique id for this foldable region
    foldEnd?: number; // line number where this fold ends
}

function buildCollapsibleLines(
    obj: any,
    indent: number,
    lineCounter: { current: number },
    parentKey?: string,
    isLast?: boolean,
    pathPrefix?: string
): JsonLine[] {
    const lines: JsonLine[] = [];
    const pad = "  ".repeat(indent);
    const comma = isLast === false ? "," : "";
    const prefix = parentKey !== undefined ? `<span class="text-blue-600 dark:text-blue-400 font-semibold">"${escapeHtml(parentKey)}"</span>: ` : "";

    if (obj === null) {
        lines.push({
            lineNumber: lineCounter.current++,
            content: `${pad}${prefix}<span class="text-rose-500 dark:text-rose-400 italic">null</span>${comma}`,
            indent,
            foldable: false,
            foldId: `${pathPrefix ?? "$"}-null`,
        });
    } else if (typeof obj === "string") {
        const escaped = escapeHtml(obj);
        lines.push({
            lineNumber: lineCounter.current++,
            content: `${pad}${prefix}<span class="text-emerald-600 dark:text-emerald-400">"${escaped}"</span>${comma}`,
            indent,
            foldable: false,
            foldId: `${pathPrefix ?? "$"}-str`,
        });
    } else if (typeof obj === "number") {
        lines.push({
            lineNumber: lineCounter.current++,
            content: `${pad}${prefix}<span class="text-violet-600 dark:text-violet-400">${obj}</span>${comma}`,
            indent,
            foldable: false,
            foldId: `${pathPrefix ?? "$"}-num`,
        });
    } else if (typeof obj === "boolean") {
        lines.push({
            lineNumber: lineCounter.current++,
            content: `${pad}${prefix}<span class="text-amber-600 dark:text-amber-400">${obj}</span>${comma}`,
            indent,
            foldable: false,
            foldId: `${pathPrefix ?? "$"}-bool`,
        });
    } else if (Array.isArray(obj)) {
        const foldId = pathPrefix ?? "$-arr";
        const startLine = lineCounter.current;
        lines.push({
            lineNumber: lineCounter.current++,
            content: `${pad}${prefix}[`,
            indent,
            foldable: obj.length > 0,
            foldId,
        });
        for (let i = 0; i < obj.length; i++) {
            const childPath = `${pathPrefix ?? "$"}[${i}]`;
            lines.push(
                ...buildCollapsibleLines(obj[i], indent + 1, lineCounter, undefined, i === obj.length - 1, childPath)
            );
        }
        const endLine = lineCounter.current;
        lines.push({
            lineNumber: lineCounter.current++,
            content: `${pad}]${comma}`,
            indent,
            foldable: false,
            foldId: `${foldId}-end`,
        });
        // Set foldEnd on the opening line
        if (obj.length > 0) {
            lines[lines.length - obj.reduce((acc: number, _, i) => {
                return acc; // We'll set it differently
            }, 0)]; // not useful, let's just find the start
            const startIdx = lines.findIndex(l => l.foldId === foldId);
            if (startIdx !== -1) lines[startIdx].foldEnd = endLine;
        }
    } else if (typeof obj === "object") {
        const keys = Object.keys(obj);
        const foldId = pathPrefix ?? "$-obj";
        const startLine = lineCounter.current;
        lines.push({
            lineNumber: lineCounter.current++,
            content: `${pad}${prefix}{`,
            indent,
            foldable: keys.length > 0,
            foldId,
        });
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const childPath = `${pathPrefix ?? "$"}.${key}`;
            lines.push(
                ...buildCollapsibleLines(obj[key], indent + 1, lineCounter, key, i === keys.length - 1, childPath)
            );
        }
        const endLine = lineCounter.current;
        lines.push({
            lineNumber: lineCounter.current++,
            content: `${pad}}${comma}`,
            indent,
            foldable: false,
            foldId: `${foldId}-end`,
        });
        // Set foldEnd on the opening line
        if (keys.length > 0) {
            const startIdx = lines.findIndex(l => l.foldId === foldId);
            if (startIdx !== -1) lines[startIdx].foldEnd = endLine;
        }
    }
    return lines;
}

function CollapsibleJsonView({ data, foldAllSignal }: { data: any; foldAllSignal: "expand" | "collapse" | null }) {
    const lines = useMemo(() => {
        if (data === undefined || data === null && typeof data !== "object") {
            // handle simple primitives
            return buildCollapsibleLines(data, 0, { current: 1 }, undefined, true, "$");
        }
        return buildCollapsibleLines(data, 0, { current: 1 }, undefined, true, "$");
    }, [data]);

    const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

    // React to fold all / unfold all signals
    useEffect(() => {
        if (foldAllSignal === "collapse") {
            const allFoldable = new Set(lines.filter(l => l.foldable).map(l => l.foldId));
            setCollapsed(allFoldable);
        } else if (foldAllSignal === "expand") {
            setCollapsed(new Set());
        }
    }, [foldAllSignal, lines]);

    const toggleFold = useCallback((foldId: string) => {
        setCollapsed(prev => {
            const next = new Set(prev);
            if (next.has(foldId)) next.delete(foldId);
            else next.add(foldId);
            return next;
        });
    }, []);

    // Build visible lines considering collapsed regions
    const visibleLines = useMemo(() => {
        const result: { line: JsonLine; collapsedInfo?: { count: number; isArray: boolean } }[] = [];
        let skipUntilLine: number | null = null;
        let skipFoldId: string | null = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // If we're skipping lines due to a collapsed fold
            if (skipUntilLine !== null && line.lineNumber < skipUntilLine) {
                continue;
            }
            if (skipUntilLine !== null && line.lineNumber >= skipUntilLine) {
                // This is the closing bracket line — include it
                skipUntilLine = null;
                skipFoldId = null;
                result.push({ line });
                continue;
            }

            if (line.foldable && collapsed.has(line.foldId) && line.foldEnd !== undefined) {
                // Count how many lines are being collapsed
                const hiddenCount = line.foldEnd - line.lineNumber - 1;
                const isArray = line.content.trimEnd().endsWith("[");
                result.push({ line, collapsedInfo: { count: hiddenCount, isArray } });
                skipUntilLine = line.foldEnd;
                skipFoldId = line.foldId;
                continue;
            }

            result.push({ line });
        }
        return result;
    }, [lines, collapsed]);

    const maxLineNum = lines.length > 0 ? lines[lines.length - 1].lineNumber : 1;
    const gutterWidth = String(maxLineNum).length;

    return (
        <div className="font-mono text-sm leading-relaxed">
            {visibleLines.map(({ line, collapsedInfo }) => (
                <div
                    key={line.lineNumber}
                    className="flex hover:bg-accent/30 transition-colors group"
                >
                    {/* Line number gutter */}
                    <span
                        className="select-none text-right text-muted-foreground/50 pr-4 pl-2 flex-shrink-0 border-r border-border/30 mr-3"
                        style={{ minWidth: `${gutterWidth + 2}ch` }}
                    >
                        {line.lineNumber}
                    </span>

                    {/* Fold button */}
                    <span className="w-5 flex-shrink-0 flex items-center justify-center">
                        {line.foldable ? (
                            <button
                                onClick={() => toggleFold(line.foldId)}
                                className="text-muted-foreground/60 hover:text-primary transition-colors p-0 leading-none"
                                title={collapsed.has(line.foldId) ? "Expand" : "Collapse"}
                            >
                                {collapsed.has(line.foldId) ? (
                                    <ChevronRight className="h-3.5 w-3.5" />
                                ) : (
                                    <ChevronDown className="h-3.5 w-3.5" />
                                )}
                            </button>
                        ) : null}
                    </span>

                    {/* Line content */}
                    <span
                        className="whitespace-pre flex-1"
                        dangerouslySetInnerHTML={{ __html: line.content }}
                    />

                    {/* Collapsed indicator */}
                    {collapsedInfo && (
                        <button
                            onClick={() => toggleFold(line.foldId)}
                            className="inline-flex items-center gap-1 ml-1 px-2 py-0 rounded bg-muted/80 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-border/40 cursor-pointer flex-shrink-0"
                        >
                            <ChevronsUpDown className="h-3 w-3" />
                            {collapsedInfo.count} lines
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

// ─── Tree View Component ─────────────────────────────────────────────────────

function TreeNode({
    name, value, path, depth, onPathClick, searchTerm, expandAll
}: {
    name: string; value: any; path: string; depth: number;
    onPathClick: (path: string) => void; searchTerm: string; expandAll: boolean | null;
}) {
    const [expanded, setExpanded] = useState(depth < 2);

    useEffect(() => {
        if (expandAll === true) setExpanded(true);
        else if (expandAll === false) setExpanded(false);
    }, [expandAll]);

    const isObject = value !== null && typeof value === "object" && !Array.isArray(value);
    const isArray = Array.isArray(value);
    const isExpandable = isObject || isArray;

    const matchesSearch = searchTerm && (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (!isExpandable && String(value).toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getTypeColor = (v: any) => {
        if (v === null) return "text-rose-500";
        switch (typeof v) {
            case "string": return "text-emerald-600 dark:text-emerald-400";
            case "number": return "text-violet-600 dark:text-violet-400";
            case "boolean": return "text-amber-600 dark:text-amber-400";
            default: return "text-muted-foreground";
        }
    };

    const getTypeBadge = (v: any): string => {
        if (v === null) return "null";
        if (Array.isArray(v)) return `Array[${v.length}]`;
        if (typeof v === "object") return `Object{${Object.keys(v).length}}`;
        return typeof v;
    };

    const displayValue = (v: any): string => {
        if (v === null) return "null";
        if (typeof v === "string") return `"${v.length > 80 ? v.substring(0, 80) + "..." : v}"`;
        return String(v);
    };

    return (
        <div className={`${depth > 0 ? "ml-4 border-l border-border/40 pl-3" : ""}`}>
            <div
                className={`group flex items-center gap-1.5 py-0.5 px-1 rounded hover:bg-accent/50 cursor-pointer text-sm font-mono transition-colors ${matchesSearch ? "bg-amber-100/60 dark:bg-amber-900/30 ring-1 ring-amber-300 dark:ring-amber-700" : ""}`}
                onClick={() => {
                    if (isExpandable) setExpanded(!expanded);
                    onPathClick(path);
                }}
            >
                {isExpandable ? (
                    expanded ?
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" /> :
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                ) : (
                    <span className="w-3.5 flex-shrink-0" />
                )}

                <span className="text-blue-600 dark:text-blue-400 font-semibold flex-shrink-0">{name}</span>
                <span className="text-muted-foreground/50">:</span>

                {isExpandable ? (
                    <span className="text-xs text-muted-foreground bg-muted/80 px-1.5 py-0.5 rounded">{getTypeBadge(value)}</span>
                ) : (
                    <span className={`${getTypeColor(value)} truncate max-w-[300px]`}>{displayValue(value)}</span>
                )}

                <button
                    onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(path); }}
                    className="opacity-0 group-hover:opacity-100 ml-auto text-muted-foreground hover:text-primary transition-opacity"
                    title="Copy path"
                >
                    <Copy className="h-3 w-3" />
                </button>
            </div>

            {isExpandable && expanded && (
                <div>
                    {isArray
                        ? value.map((item: any, i: number) => (
                            <TreeNode key={i} name={`[${i}]`} value={item} path={`${path}[${i}]`} depth={depth + 1} onPathClick={onPathClick} searchTerm={searchTerm} expandAll={expandAll} />
                        ))
                        : Object.entries(value).map(([key, val]) => (
                            <TreeNode key={key} name={key} value={val} path={`${path}.${key}`} depth={depth + 1} onPathClick={onPathClick} searchTerm={searchTerm} expandAll={expandAll} />
                        ))}
                </div>
            )}
        </div>
    );
}

// ─── Sample Data ─────────────────────────────────────────────────────────────

const SAMPLE_JSON = `{
  "name": "DevPik Tools",
  "version": "2.0.0",
  "description": "A suite of free developer tools",
  "features": ["JSON Formatter", "Base64 Encoder", "JWT Decoder"],
  "author": {
    "name": "DevPik",
    "website": "https://www.devpik.com",
    "social": {
      "github": "devpik",
      "twitter": "@devpik"
    }
  },
  "stats": {
    "tools": 14,
    "monthlyUsers": 50000,
    "satisfaction": 98.5,
    "isOpenSource": true
  },
  "tags": ["developer", "tools", "free", "online", null],
  "pricing": null
}`;

const STORAGE_KEY = "devpik_json_formatter_last";

// ─── Main Component ──────────────────────────────────────────────────────────

type ViewMode = "code" | "tree";
type ConvertFormat = "xml" | "csv" | "yaml";

export default function JsonFormatter() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [indent, setIndent] = useState(2);
    const [viewMode, setViewMode] = useState<ViewMode>("code");
    const [parsedJson, setParsedJson] = useState<any>(null);
    const [autoFormat, setAutoFormat] = useState(false);
    const [jsonPath, setJsonPath] = useState("$");
    const [searchTerm, setSearchTerm] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [expandAll, setExpandAll] = useState<boolean | null>(null);
    const [stats, setStats] = useState<JsonStats | null>(null);
    const [showConvertMenu, setShowConvertMenu] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const convertMenuRef = useRef<HTMLDivElement>(null);

    // Load from local storage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setInput(saved);
        } catch { }
    }, []);

    // Save to local storage on input change
    useEffect(() => {
        try {
            if (input) localStorage.setItem(STORAGE_KEY, input);
        } catch { }
    }, [input]);

    // Auto-format on paste
    const handleInputChange = useCallback((value: string) => {
        setInput(value);
        if (autoFormat && value.trim()) {
            try {
                const parsed = JSON.parse(value);
                setOutput(JSON.stringify(parsed, null, indent));
                setParsedJson(parsed);
                setError(null);
                const s = getJsonStats(parsed);
                setStats({ ...s, size: formatBytes(new Blob([value]).size) });
            } catch (e: any) {
                setError(e.message || "Invalid JSON");
                setOutput("");
                setParsedJson(null);
                setStats(null);
            }
        }
    }, [autoFormat, indent]);

    // Close convert menu on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (convertMenuRef.current && !convertMenuRef.current.contains(e.target as Node)) {
                setShowConvertMenu(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const formatJson = useCallback(() => {
        setError(null);
        if (!input.trim()) { setOutput(""); setParsedJson(null); setStats(null); return; }
        try {
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, indent);
            setOutput(formatted);
            setParsedJson(parsed);
            const s = getJsonStats(parsed);
            setStats({ ...s, size: formatBytes(new Blob([input]).size) });
        } catch (e: any) {
            setError(e.message || "Invalid JSON format");
            setOutput("");
            setParsedJson(null);
            setStats(null);
        }
    }, [input, indent]);

    const minifyJson = useCallback(() => {
        setError(null);
        if (!input.trim()) return;
        try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed));
            setParsedJson(parsed);
            const s = getJsonStats(parsed);
            setStats({ ...s, size: formatBytes(new Blob([input]).size) });
        } catch (e: any) {
            setError(e.message || "Invalid JSON format");
            setOutput("");
            setParsedJson(null);
            setStats(null);
        }
    }, [input]);

    const handleFixJson = useCallback(() => {
        if (!input.trim()) return;
        const fixed = fixJson(input);
        setInput(fixed);
        try {
            const parsed = JSON.parse(fixed);
            setOutput(JSON.stringify(parsed, null, indent));
            setParsedJson(parsed);
            setError(null);
            const s = getJsonStats(parsed);
            setStats({ ...s, size: formatBytes(new Blob([fixed]).size) });
        } catch (e: any) {
            setError("Fix attempted but JSON still has errors: " + e.message);
        }
    }, [input, indent]);

    const handleCopy = useCallback((text: string, label: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
    }, []);

    const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const content = ev.target?.result as string;
            setInput(content);
            if (autoFormat) handleInputChange(content);
        };
        reader.readAsText(file);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, [autoFormat, handleInputChange]);

    const handleDownload = useCallback((content: string, filename: string, mime = "application/json") => {
        if (!content) return;
        const blob = new Blob([content], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a); URL.revokeObjectURL(url);
    }, []);

    const handleConvert = useCallback((format: ConvertFormat) => {
        if (!parsedJson) {
            setError("Please format valid JSON first before converting.");
            return;
        }
        let result = "";
        let filename = "data";
        let mime = "text/plain";
        switch (format) {
            case "xml":
                result = '<?xml version="1.0" encoding="UTF-8"?>\n' + jsonToXml(parsedJson);
                filename = "data.xml"; mime = "text/xml";
                break;
            case "csv":
                result = jsonToCsv(parsedJson);
                filename = "data.csv"; mime = "text/csv";
                break;
            case "yaml":
                result = jsonToYaml(parsedJson);
                filename = "data.yaml"; mime = "text/yaml";
                break;
        }
        setOutput(result);
        setViewMode("code");
        setShowConvertMenu(false);
    }, [parsedJson]);

    const loadSample = useCallback(() => {
        setInput(SAMPLE_JSON);
        setError(null);
        if (autoFormat) handleInputChange(SAMPLE_JSON);
    }, [autoFormat, handleInputChange]);

    const clear = useCallback(() => {
        setInput(""); setOutput(""); setError(null); setParsedJson(null);
        setStats(null); setJsonPath("$"); setSearchTerm("");
    }, []);

    // Drag & drop handlers
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type === "application/json" || file?.name.endsWith(".json")) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const content = ev.target?.result as string;
                setInput(content);
                if (autoFormat) handleInputChange(content);
            };
            reader.readAsText(file);
        }
    };

    // Collapsible fold signal state
    const [foldSignal, setFoldSignal] = useState<"expand" | "collapse" | null>(null);

    // Whether the output looks like JSON (for collapsible view)
    const outputIsJson = useMemo(() => {
        if (!output) return false;
        const t = output.trim();
        return t.startsWith("{") || t.startsWith("[");
    }, [output]);

    // Highlighted output (memoized for performance) — used for non-JSON conversions
    const highlightedOutput = useMemo(() => {
        if (!output || viewMode !== "code") return "";
        if (outputIsJson) return ""; // will use CollapsibleJsonView instead
        return escapeHtml(output).replace(/\n/g, "<br/>").replace(/ {2}/g, "&nbsp;&nbsp;");
    }, [output, viewMode, outputIsJson]);

    // Line count for gutter
    const inputLines = input.split("\n").length;
    const outputLines = output.split("\n").length;

    // Filter search results count
    const searchMatchCount = useMemo(() => {
        if (!searchTerm || !output) return 0;
        const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
        return (output.match(regex) || []).length;
    }, [searchTerm, output]);

    return (
        <div className="flex flex-col gap-4">
            {/* ── Toolbar ─────────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-2 border-b border-border/50 pb-4">
                {/* Primary Actions */}
                <button onClick={formatJson} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md active:scale-[0.98]">
                    <Wand2 className="h-4 w-4" /> Format
                </button>
                <button onClick={minifyJson} className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm transition-all hover:bg-accent hover:text-accent-foreground active:scale-[0.98]">
                    <Minimize2 className="h-4 w-4" /> Minify
                </button>
                {/* <button onClick={handleFixJson} className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm transition-all hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 active:scale-[0.98]" title="Fix trailing commas, single quotes, unquoted keys">
                    <Wrench className="h-4 w-4" /> Fix JSON
                </button> */}

                <div className="h-6 w-px bg-border/70 mx-1 hidden sm:block" />

                {/* File Actions */}
                <input ref={fileInputRef} type="file" accept=".json,application/json" className="hidden" onChange={handleUpload} />
                <button onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm transition-all hover:bg-accent active:scale-[0.98]">
                    <Upload className="h-4 w-4" /> Upload
                </button>
                <button onClick={() => handleDownload(output, "formatted.json")} disabled={!output} className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm transition-all hover:bg-accent active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed">
                    <Download className="h-4 w-4" /> Download
                </button>

                {/* Convert Menu */}
                <div className="relative" ref={convertMenuRef}>
                    <button onClick={() => setShowConvertMenu(!showConvertMenu)} disabled={!parsedJson} className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm transition-all hover:bg-accent active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed">
                        <FileCode className="h-4 w-4" /> Convert
                        <ChevronDown className="h-3 w-3" />
                    </button>
                    {showConvertMenu && (
                        <div className="absolute top-full left-0 mt-1 z-50 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[140px]">
                            {[
                                { format: "xml" as ConvertFormat, label: "JSON → XML" },
                                { format: "csv" as ConvertFormat, label: "JSON → CSV" },
                                { format: "yaml" as ConvertFormat, label: "JSON → YAML" },
                            ].map(({ format, label }) => (
                                <button key={format} onClick={() => handleConvert(format)} className="w-full px-3 py-2 text-sm text-left hover:bg-accent transition-colors">
                                    {label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="h-6 w-px bg-border/70 mx-1 hidden sm:block" />

                {/* Sample & Clear */}
                <button onClick={loadSample} className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm transition-all hover:bg-accent active:scale-[0.98]">
                    <Sparkles className="h-4 w-4" /> Sample
                </button>
                <button onClick={clear} className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-all hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 active:scale-[0.98]">
                    <Trash2 className="h-4 w-4" /> Clear
                </button>

                {/* Right-side controls */}
                <div className="ml-auto flex items-center gap-3 flex-wrap">
                    {/* Auto-format toggle */}
                    <button onClick={() => setAutoFormat(!autoFormat)} className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${autoFormat ? "text-primary" : "text-muted-foreground"}`} title="Auto-format on paste">
                        {autoFormat ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                        <span className="hidden sm:inline">Auto</span>
                    </button>

                    {/* Indent selector */}
                    <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="h-9 rounded-lg border border-input bg-background px-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                        <option value={2}>2 sp</option>
                        <option value={3}>3 sp</option>
                        <option value={4}>4 sp</option>
                        <option value={0}>Tab</option>
                    </select>
                </div>
            </div>

            {/* ── Editor Panels ───────────────────────────────────────── */}
            <div className="grid gap-4 lg:grid-cols-2">
                {/* Input Panel */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileJson className="h-4 w-4 text-primary" />
                            <label className="text-sm font-semibold tracking-tight">Input</label>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{inputLines} lines</span>
                        </div>
                        <button onClick={() => handleCopy(input, "input")} disabled={!input} className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 disabled:opacity-40 transition-colors">
                            {copied === "input" ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            {copied === "input" ? "Copied" : "Copy"}
                        </button>
                    </div>
                    <div
                        className={`relative rounded-xl border transition-all ${isDragging ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "border-input"}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {isDragging && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-primary/5 backdrop-blur-sm">
                                <div className="flex flex-col items-center gap-2 text-primary">
                                    <Upload className="h-8 w-8 animate-bounce" />
                                    <span className="text-sm font-semibold">Drop JSON file here</span>
                                </div>
                            </div>
                        )}
                        <div className="flex h-[450px] rounded-xl bg-background overflow-hidden">
                            {/* Line numbers gutter */}
                            {input && (
                                <div
                                    className="select-none text-right text-muted-foreground/40 font-mono text-sm leading-relaxed pt-4 pb-4 pl-2 pr-3 border-r border-border/30 overflow-hidden flex-shrink-0 bg-muted/20"
                                    aria-hidden="true"
                                >
                                    {Array.from({ length: inputLines }, (_, i) => (
                                        <div key={i + 1}>{i + 1}</div>
                                    ))}
                                </div>
                            )}
                            <textarea
                                value={input}
                                onChange={(e) => handleInputChange(e.target.value)}
                                placeholder="Paste your JSON here, or drag & drop a .json file..."
                                className="font-mono flex-1 h-full resize-none bg-transparent p-4 text-sm leading-relaxed focus:outline-none"
                                spellCheck="false"
                            />
                        </div>
                    </div>
                </div>

                {/* Output Panel */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {/* View mode toggle */}
                            <div className="flex items-center bg-muted rounded-lg p-0.5">
                                <button
                                    onClick={() => setViewMode("code")}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${viewMode === "code" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    <Braces className="h-3.5 w-3.5" /> Code
                                </button>
                                <button
                                    onClick={() => setViewMode("tree")}
                                    disabled={!parsedJson}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all disabled:opacity-40 ${viewMode === "tree" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    <ListTree className="h-3.5 w-3.5" /> Tree
                                </button>
                            </div>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                {viewMode === "code" ? `${outputLines} lines` : parsedJson ? "interactive" : "—"}
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            {/* Search toggle */}
                            <button onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearchTerm(""); }} className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-xs transition-colors ${showSearch ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`} title="Search">
                                <Search className="h-3.5 w-3.5" />
                            </button>
                            {/* Stats toggle */}
                            <button onClick={() => setShowStats(!showStats)} disabled={!stats} className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-xs transition-colors disabled:opacity-40 ${showStats ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`} title="Statistics">
                                <Info className="h-3.5 w-3.5" />
                            </button>
                            {/* Tree controls */}
                            {viewMode === "tree" && parsedJson && (
                                <>
                                    <button onClick={() => setExpandAll(true)} className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="Expand all">
                                        <ChevronDown className="h-3 w-3" /> All
                                    </button>
                                    <button onClick={() => setExpandAll(false)} className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="Collapse all">
                                        <ChevronUp className="h-3 w-3" /> All
                                    </button>
                                </>
                            )}
                            {/* Code view fold controls */}
                            {viewMode === "code" && parsedJson && outputIsJson && (
                                <>
                                    <button onClick={() => setFoldSignal(s => s === "expand" ? null : "expand")} className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="Expand all folds">
                                        <UnfoldVertical className="h-3.5 w-3.5" />
                                    </button>
                                    <button onClick={() => setFoldSignal(s => s === "collapse" ? null : "collapse")} className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="Collapse all folds">
                                        <FoldVertical className="h-3.5 w-3.5" />
                                    </button>
                                </>
                            )}
                            {/* Copy */}
                            <button onClick={() => handleCopy(output, "output")} disabled={!output} className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-primary hover:bg-primary/10 disabled:opacity-40 transition-colors">
                                {copied === "output" ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                {copied === "output" ? "Copied" : "Copy"}
                            </button>
                        </div>
                    </div>

                    {/* Search bar */}
                    {showSearch && (
                        <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 border border-border/50">
                            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search in JSON..."
                                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                                autoFocus
                            />
                            {searchTerm && (
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                    {searchMatchCount} match{searchMatchCount !== 1 ? "es" : ""}
                                </span>
                            )}
                            <button onClick={() => { setSearchTerm(""); setShowSearch(false); }} className="text-muted-foreground hover:text-foreground">
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    )}

                    {/* Stats panel */}
                    {showStats && stats && (
                        <div className="grid grid-cols-4 gap-2 bg-muted/30 rounded-lg p-3 border border-border/50 text-xs">
                            {[
                                { label: "Keys", value: stats.keys, color: "text-blue-600" },
                                { label: "Depth", value: stats.depth, color: "text-violet-600" },
                                { label: "Size", value: stats.size, color: "text-emerald-600" },
                                { label: "Objects", value: stats.objects, color: "text-amber-600" },
                                { label: "Arrays", value: stats.arrays, color: "text-rose-600" },
                                { label: "Strings", value: stats.strings, color: "text-emerald-600" },
                                { label: "Numbers", value: stats.numbers, color: "text-violet-600" },
                                { label: "Nulls", value: stats.nulls, color: "text-rose-500" },
                            ].map(({ label, value, color }) => (
                                <div key={label} className="flex flex-col items-center gap-0.5">
                                    <span className={`font-bold text-sm ${color}`}>{value}</span>
                                    <span className="text-muted-foreground">{label}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Output area */}
                    {error ? (
                        <div className="flex flex-col gap-3 h-[450px] rounded-xl border border-destructive/30 bg-destructive/5 p-4 overflow-auto">
                            <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
                                <AlertTriangle className="h-4 w-4" />
                                JSON Validation Error
                            </div>
                            <pre className="font-mono text-sm text-destructive/90 whitespace-pre-wrap break-words">{error}</pre>
                            <button onClick={handleFixJson} className="self-start inline-flex items-center gap-2 rounded-lg bg-amber-100 border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-200 transition-colors">
                                <Wrench className="h-3.5 w-3.5" /> Attempt Auto-Fix
                            </button>
                        </div>
                    ) : viewMode === "tree" && parsedJson ? (
                        <div className="h-[450px] rounded-xl border border-input bg-slate-50 dark:bg-slate-900/50 overflow-auto p-3">
                            <TreeNode
                                name="$"
                                value={parsedJson}
                                path="$"
                                depth={0}
                                onPathClick={(p) => setJsonPath(p)}
                                searchTerm={searchTerm}
                                expandAll={expandAll}
                            />
                        </div>
                    ) : (
                        <div className="relative h-[450px] rounded-xl border border-input bg-slate-50 dark:bg-slate-900/50 overflow-auto">
                            {output ? (
                                outputIsJson && parsedJson ? (
                                    <div className="py-2">
                                        <CollapsibleJsonView data={parsedJson} foldAllSignal={foldSignal} />
                                    </div>
                                ) : (
                                    <pre className="font-mono text-sm p-4 leading-relaxed">
                                        {output.split("\n").map((line, i) => (
                                            <div key={i} className="flex hover:bg-accent/30 transition-colors">
                                                <span
                                                    className="select-none text-right text-muted-foreground/40 pr-4 pl-2 flex-shrink-0 border-r border-border/30 mr-3"
                                                    style={{ minWidth: `${String(outputLines).length + 2}ch` }}
                                                >
                                                    {i + 1}
                                                </span>
                                                <span className="whitespace-pre">{line}</span>
                                            </div>
                                        ))}
                                    </pre>
                                )
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-muted-foreground/60">
                                    <div className="flex flex-col items-center gap-2">
                                        <Braces className="h-10 w-10 text-muted-foreground/30" />
                                        <span>Formatted output will appear here</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Status Bar ──────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground border-t border-border/50 pt-3">
                {/* Validation Status */}
                <div className="flex items-center gap-1.5">
                    <span className={`inline-block h-2 w-2 rounded-full ${error ? "bg-destructive" : parsedJson ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                    <span>{error ? "Invalid JSON" : parsedJson ? "Valid JSON" : "Awaiting input"}</span>
                </div>

                {/* JSON Path */}
                {jsonPath !== "$" && (
                    <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-0.5 rounded-md font-mono">
                        <span className="text-muted-foreground/70">Path:</span>
                        <span className="text-primary font-medium">{jsonPath}</span>
                        <button onClick={() => handleCopy(jsonPath, "path")} className="hover:text-primary transition-colors ml-1">
                            {copied === "path" ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </button>
                    </div>
                )}

                {/* Quick stats in status bar */}
                {stats && (
                    <div className="flex items-center gap-3 ml-auto">
                        <span>{stats.size}</span>
                        <span>{stats.keys} keys</span>
                        <span>depth {stats.depth}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
