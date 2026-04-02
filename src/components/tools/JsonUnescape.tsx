"use client";

import { useState, useCallback } from "react";
import { Copy, CheckCheck, ArrowRightLeft, Trash2 } from "lucide-react";
import Link from "next/link";

function unescapeJsonString(str: string): string {
    // If the input looks like a quoted JSON string value, try JSON.parse directly
    const trimmed = str.trim();
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        try {
            return JSON.parse(trimmed) as string;
        } catch {
            // Fall through to manual unescaping
        }
    }

    // Manual unescaping for unquoted strings
    let result = "";
    let i = 0;
    while (i < str.length) {
        if (str[i] === '\\' && i + 1 < str.length) {
            const next = str[i + 1];
            switch (next) {
                case '"':
                    result += '"';
                    i += 2;
                    break;
                case '\\':
                    result += '\\';
                    i += 2;
                    break;
                case '/':
                    result += '/';
                    i += 2;
                    break;
                case 'b':
                    result += '\b';
                    i += 2;
                    break;
                case 'f':
                    result += '\f';
                    i += 2;
                    break;
                case 'n':
                    result += '\n';
                    i += 2;
                    break;
                case 'r':
                    result += '\r';
                    i += 2;
                    break;
                case 't':
                    result += '\t';
                    i += 2;
                    break;
                case 'u': {
                    if (i + 5 < str.length) {
                        const hex = str.substring(i + 2, i + 6);
                        if (/^[0-9a-fA-F]{4}$/.test(hex)) {
                            const codePoint = parseInt(hex, 16);
                            // Handle surrogate pairs
                            if (codePoint >= 0xD800 && codePoint <= 0xDBFF && i + 11 < str.length) {
                                if (str[i + 6] === '\\' && str[i + 7] === 'u') {
                                    const hex2 = str.substring(i + 8, i + 12);
                                    if (/^[0-9a-fA-F]{4}$/.test(hex2)) {
                                        const low = parseInt(hex2, 16);
                                        if (low >= 0xDC00 && low <= 0xDFFF) {
                                            result += String.fromCharCode(codePoint, low);
                                            i += 12;
                                            break;
                                        }
                                    }
                                }
                            }
                            result += String.fromCharCode(codePoint);
                            i += 6;
                        } else {
                            result += str[i];
                            i++;
                        }
                    } else {
                        result += str[i];
                        i++;
                    }
                    break;
                }
                default:
                    result += str[i];
                    i++;
            }
        } else {
            result += str[i];
            i++;
        }
    }
    return result;
}

export default function JsonUnescape() {
    const [input, setInput] = useState("");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const processInput = useCallback((text: string) => {
        setInput(text);
        setError("");
    }, []);

    let output = "";
    if (input) {
        try {
            output = unescapeJsonString(input);
        } catch {
            output = "";
        }
    }

    const handleCopy = useCallback(() => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [output]);

    const handleClear = () => {
        setInput("");
        setError("");
    };

    const handleSample = () => {
        processInput('He said \\"hello world\\"\\nLine 2 with a tab:\\there\\nPath: C:\\\\Users\\\\dev\\\\file.json');
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">JSON Unescape</span>
                    <span className="text-xs text-muted-foreground">Convert escape sequences back to original characters</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSample}
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        Sample
                    </button>
                    <button
                        onClick={handleClear}
                        disabled={!input}
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                    >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Clear
                    </button>
                    <Link
                        href="/json-tools/json-escape"
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        <ArrowRightLeft className="mr-1.5 h-3.5 w-3.5" />
                        Swap to Escape
                    </Link>
                </div>
            </div>

            {/* Two-panel layout */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium tracking-tight text-muted-foreground">
                        Escaped JSON Input
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => processInput(e.target.value)}
                        placeholder='Paste escaped JSON string here...\nExample: He said \"hello\"\\nNew line'
                        className="min-h-[300px] w-full resize-y rounded-xl border border-input bg-background p-4 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
                        spellCheck="false"
                    />
                    {input && (
                        <div className="text-xs text-muted-foreground">
                            {input.length} character{input.length !== 1 ? "s" : ""}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium tracking-tight text-muted-foreground">
                            Unescaped Output
                        </label>
                        <button
                            onClick={handleCopy}
                            disabled={!output}
                            className="inline-flex h-6 items-center justify-center rounded-md px-2 text-xs font-medium text-primary hover:bg-primary/10 disabled:opacity-50"
                        >
                            {copied ? <CheckCheck className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
                            {copied ? "Copied" : "Copy"}
                        </button>
                    </div>
                    <div className={`flex-1 min-h-[300px] rounded-xl border border-input p-4 text-sm shadow-sm overflow-auto font-mono whitespace-pre-wrap ${error ? 'bg-destructive/10 text-destructive border-transparent' : 'bg-slate-50'}`}>
                        {error || output || <span className="text-muted-foreground">Unescaped output will appear here...</span>}
                    </div>
                    {output && !error && (
                        <div className="text-xs text-muted-foreground">
                            {output.length} character{output.length !== 1 ? "s" : ""}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
