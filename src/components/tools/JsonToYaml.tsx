"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Copy, CheckCheck, Trash2, Download, ArrowRightLeft, FileText } from "lucide-react";
import { trackToolUsage } from "@/components/ToolAnalytics";

// ──── Custom JSON ↔ YAML Converter (no external dependency) ────

function jsonToYaml(value: unknown, indent: number, level: number, inlineShort: boolean, quoteStrings: boolean): string {
    const pad = " ".repeat(indent * level);
    const childPad = " ".repeat(indent * (level + 1));

    if (value === null) return "null";
    if (value === undefined) return "null";
    if (typeof value === "boolean") return value.toString();
    if (typeof value === "number") {
        if (Number.isNaN(value)) return ".nan";
        if (!Number.isFinite(value)) return value > 0 ? ".inf" : "-.inf";
        return value.toString();
    }
    if (typeof value === "string") {
        if (value === "") return quoteStrings ? '""' : '""';
        // Check if the string could be misinterpreted
        const needsQuotes =
            quoteStrings ||
            value === "true" || value === "false" ||
            value === "null" || value === "yes" || value === "no" ||
            value === "on" || value === "off" ||
            value === "True" || value === "False" ||
            value === "Yes" || value === "No" ||
            /^[0-9]/.test(value) && !isNaN(Number(value)) ||
            /^0x/i.test(value) || /^0o/i.test(value) ||
            value.includes(": ") || value.includes("#") ||
            value.startsWith("&") || value.startsWith("*") ||
            value.startsWith("!") || value.startsWith("%") ||
            value.startsWith("@") || value.startsWith("`") ||
            value.startsWith("{") || value.startsWith("[") ||
            value.startsWith(",") || value.startsWith("-") ||
            value.startsWith("?") || value.startsWith(">") ||
            value.startsWith("|") ||
            value.endsWith(":") || value.endsWith(" ") ||
            value.startsWith(" ") ||
            /[\n\r\t]/.test(value);

        if (value.includes("\n")) {
            const lines = value.split("\n");
            const trailingNewline = value.endsWith("\n");
            const indicator = trailingNewline ? "|" : "|-";
            return indicator + "\n" + lines.map(l => childPad + l).join("\n");
        }

        if (needsQuotes) {
            const escaped = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
            return `"${escaped}"`;
        }
        return value;
    }

    if (Array.isArray(value)) {
        if (value.length === 0) return "[]";
        // Inline short arrays of primitives
        if (inlineShort && value.length <= 5 && value.every(v => typeof v !== "object" || v === null)) {
            const items = value.map(v => jsonToYaml(v, indent, 0, false, quoteStrings));
            const inline = `[${items.join(", ")}]`;
            if (inline.length <= 80) return inline;
        }
        return "\n" + value.map(item => {
            const rendered = jsonToYaml(item, indent, level + 1, inlineShort, quoteStrings);
            if (typeof item === "object" && item !== null && !Array.isArray(item)) {
                const objLines = rendered.trim().split("\n");
                return pad + "- " + objLines[0].trim() + (objLines.length > 1 ? "\n" + objLines.slice(1).map(l => pad + "  " + l.trim()).join("\n") : "");
            }
            return pad + "- " + rendered.trim();
        }).join("\n");
    }

    if (typeof value === "object") {
        const entries = Object.entries(value as Record<string, unknown>);
        if (entries.length === 0) return "{}";
        const lines = entries.map(([k, v]) => {
            const safeKey = /[:{}\[\],&*#?|>!'"%@`\-\s]/.test(k) || k === "" ? `"${k.replace(/"/g, '\\"')}"` : k;
            const rendered = jsonToYaml(v, indent, level + 1, inlineShort, quoteStrings);
            if (typeof v === "object" && v !== null && (Array.isArray(v) ? v.length > 0 : Object.keys(v).length > 0)) {
                if (typeof rendered === "string" && rendered.startsWith("\n")) {
                    return pad + safeKey + ":" + rendered;
                }
                return pad + safeKey + ": " + rendered;
            }
            return pad + safeKey + ": " + rendered;
        });

        if (level === 0) return lines.join("\n");
        return "\n" + lines.join("\n");
    }

    return String(value);
}

function convertJsonToYaml(jsonStr: string, indentSize: number, inlineShort: boolean, quoteStrings: boolean): { yaml: string; error?: string } {
    try {
        const parsed = JSON.parse(jsonStr);
        const yaml = jsonToYaml(parsed, indentSize, 0, inlineShort, quoteStrings);
        return { yaml };
    } catch (e) {
        const msg = e instanceof SyntaxError ? e.message : "Invalid JSON";
        return { yaml: "", error: `Invalid JSON: ${msg}` };
    }
}

// ──── Simple YAML parser for common structures ────

function parseYamlValue(value: string): unknown {
    const trimmed = value.trim();
    if (trimmed === "" || trimmed === "null" || trimmed === "~") return null;
    if (trimmed === "true" || trimmed === "True" || trimmed === "yes" || trimmed === "Yes" || trimmed === "on" || trimmed === "On") return true;
    if (trimmed === "false" || trimmed === "False" || trimmed === "no" || trimmed === "No" || trimmed === "off" || trimmed === "Off") return false;
    if (trimmed === ".inf" || trimmed === ".Inf") return Infinity;
    if (trimmed === "-.inf" || trimmed === "-.Inf") return -Infinity;
    if (trimmed === ".nan" || trimmed === ".NaN") return NaN;
    // Quoted string
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
        return trimmed.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    }
    // Number
    if (/^-?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(trimmed)) {
        const n = Number(trimmed);
        if (!isNaN(n)) return n;
    }
    // Hex
    if (/^0x[0-9a-fA-F]+$/.test(trimmed)) return parseInt(trimmed, 16);
    // Octal
    if (/^0o[0-7]+$/.test(trimmed)) return parseInt(trimmed.slice(2), 8);
    // Inline array
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
            return JSON.parse(trimmed);
        } catch {
            const inner = trimmed.slice(1, -1);
            return inner.split(",").map(s => parseYamlValue(s));
        }
    }
    // Inline object
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        try {
            return JSON.parse(trimmed);
        } catch {
            return trimmed;
        }
    }
    return trimmed;
}

function yamlToJson(yamlStr: string): { json: string; error?: string } {
    try {
        // Strip comments
        const lines = yamlStr.split("\n").map(line => {
            // Remove comments but not inside quotes
            let inSingle = false, inDouble = false;
            for (let i = 0; i < line.length; i++) {
                if (line[i] === "'" && !inDouble) inSingle = !inSingle;
                if (line[i] === '"' && !inSingle) inDouble = !inDouble;
                if (line[i] === "#" && !inSingle && !inDouble && (i === 0 || line[i - 1] === " ")) {
                    return line.slice(0, i).trimEnd();
                }
            }
            return line;
        });

        const result = parseYamlLines(lines, 0, 0);
        return { json: JSON.stringify(result.value, null, 2) };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Invalid YAML";
        return { json: "", error: `Invalid YAML: ${msg}` };
    }
}

interface ParseResult {
    value: unknown;
    nextLine: number;
}

function getIndent(line: string): number {
    const match = line.match(/^(\s*)/);
    return match ? match[1].length : 0;
}

function parseYamlLines(lines: string[], startLine: number, minIndent: number): ParseResult {
    // Skip blank lines
    let i = startLine;
    while (i < lines.length && lines[i].trim() === "") i++;
    if (i >= lines.length) return { value: null, nextLine: i };

    const line = lines[i];
    const trimmed = line.trim();

    // Document separator
    if (trimmed === "---") {
        return parseYamlLines(lines, i + 1, minIndent);
    }

    // Check if it's a list
    if (trimmed.startsWith("- ") || trimmed === "-") {
        return parseYamlArray(lines, i, getIndent(line));
    }

    // Check if it's a key-value pair
    if (trimmed.includes(": ") || trimmed.endsWith(":")) {
        return parseYamlObject(lines, i, getIndent(line));
    }

    // Scalar
    return { value: parseYamlValue(trimmed), nextLine: i + 1 };
}

function parseYamlArray(lines: string[], startLine: number, baseIndent: number): ParseResult {
    const arr: unknown[] = [];
    let i = startLine;

    while (i < lines.length) {
        // Skip blank lines
        if (lines[i].trim() === "") { i++; continue; }
        const indent = getIndent(lines[i]);
        if (indent < baseIndent) break;
        if (indent > baseIndent) break; // shouldn't happen
        const trimmed = lines[i].trim();
        if (!trimmed.startsWith("- ") && trimmed !== "-") break;

        const afterDash = trimmed === "-" ? "" : trimmed.slice(2);
        if (afterDash === "" || afterDash.trim() === "") {
            // Block value after dash
            const result = parseYamlLines(lines, i + 1, indent + 2);
            arr.push(result.value);
            i = result.nextLine;
        } else if (afterDash.includes(": ") || afterDash.endsWith(":")) {
            // Inline object start after dash
            const tempLines = [" ".repeat(indent + 2) + afterDash, ...lines.slice(i + 1)];
            const result = parseYamlObject(tempLines, 0, indent + 2);
            arr.push(result.value);
            i = i + 1 + (result.nextLine - 1);
        } else {
            arr.push(parseYamlValue(afterDash));
            i++;
        }
    }

    return { value: arr, nextLine: i };
}

function parseYamlObject(lines: string[], startLine: number, baseIndent: number): ParseResult {
    const obj: Record<string, unknown> = {};
    let i = startLine;

    while (i < lines.length) {
        if (lines[i].trim() === "") { i++; continue; }
        const indent = getIndent(lines[i]);
        if (indent < baseIndent) break;
        if (indent > baseIndent) break;
        const trimmed = lines[i].trim();

        // Must be a key-value line
        const colonIdx = trimmed.indexOf(": ");
        const isColonEnd = trimmed.endsWith(":");
        if (colonIdx === -1 && !isColonEnd) break;

        let key: string, valueStr: string;
        if (isColonEnd && colonIdx === -1) {
            key = trimmed.slice(0, -1);
            valueStr = "";
        } else {
            key = trimmed.slice(0, colonIdx);
            valueStr = trimmed.slice(colonIdx + 2);
        }

        // Strip quotes from key
        if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
            key = key.slice(1, -1);
        }

        if (valueStr === "" || valueStr.trim() === "") {
            // Check for block scalar indicators
            const nextTrimmed = valueStr.trim();
            if (nextTrimmed === "|" || nextTrimmed === "|-" || nextTrimmed === "|+" || nextTrimmed === ">" || nextTrimmed === ">-") {
                // Block scalar
                const keepNewline = !nextTrimmed.endsWith("-");
                i++;
                const blockLines: string[] = [];
                let blockIndent = -1;
                while (i < lines.length) {
                    if (lines[i].trim() === "") { blockLines.push(""); i++; continue; }
                    const li = getIndent(lines[i]);
                    if (blockIndent === -1) blockIndent = li;
                    if (li < blockIndent) break;
                    blockLines.push(lines[i].slice(blockIndent));
                    i++;
                }
                let text = blockLines.join("\n");
                // Trim trailing newlines then add one if keep
                text = text.replace(/\n+$/, "");
                if (keepNewline) text += "\n";
                obj[key] = text;
            } else {
                // Block value — parse children
                const result = parseYamlLines(lines, i + 1, indent + 2);
                obj[key] = result.value;
                i = result.nextLine;
            }
        } else {
            obj[key] = parseYamlValue(valueStr);
            i++;
        }
    }

    return { value: obj, nextLine: i };
}

// ──── Component ────

const SAMPLE_JSON = `{
  "name": "DevPik",
  "version": "2.0.0",
  "description": "Free online developer tools",
  "features": ["JSON formatter", "YAML converter", "Base64 encoder"],
  "config": {
    "port": 3000,
    "debug": false,
    "database": {
      "host": "localhost",
      "name": "devpik_db"
    }
  },
  "scripts": {
    "start": "next start",
    "build": "next build",
    "dev": "next dev"
  }
}`;

const SAMPLE_YAML = `name: DevPik
version: "2.0.0"
description: Free online developer tools
features:
  - JSON formatter
  - YAML converter
  - Base64 encoder
config:
  port: 3000
  debug: false
  database:
    host: localhost
    name: devpik_db
scripts:
  start: next start
  build: next build
  dev: next dev`;

type IndentOption = 2 | 4;
type Direction = "json-to-yaml" | "yaml-to-json";

export default function JsonToYaml() {
    const [leftText, setLeftText] = useState("");
    const [rightText, setRightText] = useState("");
    const [error, setError] = useState("");
    const [direction, setDirection] = useState<Direction>("json-to-yaml");
    const [indentSize, setIndentSize] = useState<IndentOption>(2);
    const [inlineShort, setInlineShort] = useState(false);
    const [quoteStrings, setQuoteStrings] = useState(false);
    const [copied, setCopied] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
    const tracked = useRef(false);

    const leftLabel = direction === "json-to-yaml" ? "JSON" : "YAML";
    const rightLabel = direction === "json-to-yaml" ? "YAML" : "JSON";
    const leftPlaceholder = direction === "json-to-yaml" ? "Paste your JSON here..." : "Paste your YAML here...";

    const convert = useCallback((input: string) => {
        if (!input.trim()) {
            setRightText("");
            setError("");
            return;
        }
        if (direction === "json-to-yaml") {
            const result = convertJsonToYaml(input, indentSize, inlineShort, quoteStrings);
            setRightText(result.yaml);
            setError(result.error || "");
        } else {
            const result = yamlToJson(input);
            setRightText(result.json);
            setError(result.error || "");
        }
    }, [direction, indentSize, inlineShort, quoteStrings]);

    // Re-convert when options change
    useEffect(() => {
        if (leftText.trim()) convert(leftText);
    }, [direction, indentSize, inlineShort, quoteStrings, convert, leftText]);

    const handleInput = (val: string) => {
        setLeftText(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            convert(val);
            if (!tracked.current) {
                trackToolUsage("json-to-yaml");
                tracked.current = true;
            }
        }, 200);
    };

    const handleSwap = () => {
        const newDir = direction === "json-to-yaml" ? "yaml-to-json" : "json-to-yaml";
        setDirection(newDir as Direction);
        setLeftText(rightText);
        setRightText("");
        setError("");
    };

    const handleCopy = () => {
        if (!rightText) return;
        navigator.clipboard.writeText(rightText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!rightText) return;
        const ext = direction === "json-to-yaml" ? "yaml" : "json";
        const mime = direction === "json-to-yaml" ? "text/yaml" : "application/json";
        const blob = new Blob([rightText], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `converted.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleLoadSample = () => {
        const sample = direction === "json-to-yaml" ? SAMPLE_JSON : SAMPLE_YAML;
        setLeftText(sample);
        convert(sample);
    };

    const handleClear = () => {
        setLeftText("");
        setRightText("");
        setError("");
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">
                        {direction === "json-to-yaml" ? "JSON → YAML" : "YAML → JSON"}
                    </span>
                    <button
                        onClick={handleSwap}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-background hover:bg-accent transition-colors"
                    >
                        <ArrowRightLeft className="h-3.5 w-3.5" />
                        Swap
                    </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <select
                        value={indentSize}
                        onChange={(e) => setIndentSize(Number(e.target.value) as IndentOption)}
                        className="text-xs px-2 py-1.5 rounded-md border border-border bg-background text-foreground"
                    >
                        <option value={2}>2 Spaces</option>
                        <option value={4}>4 Spaces</option>
                    </select>
                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                        <input type="checkbox" checked={inlineShort} onChange={(e) => setInlineShort(e.target.checked)} className="rounded" />
                        Inline arrays
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                        <input type="checkbox" checked={quoteStrings} onChange={(e) => setQuoteStrings(e.target.checked)} className="rounded" />
                        Quote strings
                    </label>
                </div>
            </div>

            {/* Editor Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Panel - Input */}
                <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-slate-50 dark:bg-slate-900/50">
                        <span className="text-sm font-semibold text-foreground">{leftLabel}</span>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={handleLoadSample}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md hover:bg-accent transition-colors text-muted-foreground"
                            >
                                <FileText className="h-3 w-3" />
                                Sample
                            </button>
                            <button
                                onClick={handleClear}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground"
                            >
                                <Trash2 className="h-3 w-3" />
                                Clear
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={leftText}
                        onChange={(e) => handleInput(e.target.value)}
                        placeholder={leftPlaceholder}
                        className="flex-1 min-h-[400px] w-full resize-none p-4 bg-transparent outline-none font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-0"
                        spellCheck={false}
                    />
                </div>

                {/* Right Panel - Output */}
                <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-slate-50 dark:bg-slate-900/50">
                        <span className="text-sm font-semibold text-foreground">{rightLabel}</span>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={handleCopy}
                                disabled={!rightText}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md hover:bg-accent transition-colors text-muted-foreground disabled:opacity-40"
                            >
                                {copied ? <CheckCheck className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                                {copied ? "Copied" : "Copy"}
                            </button>
                            <button
                                onClick={handleDownload}
                                disabled={!rightText}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md hover:bg-accent transition-colors text-muted-foreground disabled:opacity-40"
                            >
                                <Download className="h-3 w-3" />
                                Download
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={error || rightText}
                        readOnly
                        className={`flex-1 min-h-[400px] w-full resize-none p-4 bg-transparent outline-none font-mono text-sm placeholder:text-muted-foreground/50 focus:ring-0 ${error ? "text-red-500" : "text-foreground"}`}
                        placeholder={`${rightLabel} output will appear here...`}
                        spellCheck={false}
                    />
                </div>
            </div>

            {/* Stats */}
            {leftText.trim() && !error && (
                <div className="flex items-center gap-4 text-xs text-muted-foreground px-1">
                    <span>Input: {new Blob([leftText]).size.toLocaleString()} bytes</span>
                    <span>Output: {new Blob([rightText]).size.toLocaleString()} bytes</span>
                </div>
            )}
        </div>
    );
}
