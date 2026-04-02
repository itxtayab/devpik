"use client";

import { useState, useCallback } from "react";
import { Copy, CheckCheck, ArrowRightLeft, Trash2 } from "lucide-react";
import Link from "next/link";

function escapeJsonString(str: string): string {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        const ch = str[i];
        const code = str.charCodeAt(i);

        switch (ch) {
            case '"':
                result += '\\"';
                break;
            case '\\':
                result += '\\\\';
                break;
            case '\b':
                result += '\\b';
                break;
            case '\f':
                result += '\\f';
                break;
            case '\n':
                result += '\\n';
                break;
            case '\r':
                result += '\\r';
                break;
            case '\t':
                result += '\\t';
                break;
            default:
                if (code < 0x20) {
                    result += '\\u' + code.toString(16).padStart(4, '0');
                } else {
                    result += ch;
                }
        }
    }
    return result;
}

const ESCAPE_REFERENCE = [
    { character: '"', escaped: '\\"', description: "Double quote" },
    { character: '\\', escaped: '\\\\', description: "Backslash" },
    { character: '/', escaped: '\\/', description: "Forward slash (optional)" },
    { character: '\\b', escaped: '\\b', description: "Backspace" },
    { character: '\\f', escaped: '\\f', description: "Form feed" },
    { character: '\\n', escaped: '\\n', description: "Newline" },
    { character: '\\r', escaped: '\\r', description: "Carriage return" },
    { character: '\\t', escaped: '\\t', description: "Tab" },
    { character: 'U+0000–U+001F', escaped: '\\uXXXX', description: "Unicode control characters" },
];

export default function JsonEscape() {
    const [input, setInput] = useState("");
    const [copied, setCopied] = useState(false);

    const output = input ? escapeJsonString(input) : "";

    const handleCopy = useCallback(() => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [output]);

    const handleClear = () => {
        setInput("");
    };

    const handleSample = () => {
        setInput('He said "hello world"\nLine 2 with a tab:\there\nPath: C:\\Users\\dev\\file.json\nSpecial: \b\f');
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">JSON Escape</span>
                    <span className="text-xs text-muted-foreground">Convert special characters to escape sequences</span>
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
                        href="/json-tools/json-unescape"
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        <ArrowRightLeft className="mr-1.5 h-3.5 w-3.5" />
                        Swap to Unescape
                    </Link>
                </div>
            </div>

            {/* Two-panel layout */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium tracking-tight text-muted-foreground">
                        Raw Text Input
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder='Paste text with special characters to escape...\nExample: He said "hello"'
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
                            Escaped JSON Output
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
                    <div className="flex-1 min-h-[300px] rounded-xl border border-input bg-slate-50 p-4 text-sm shadow-sm overflow-auto break-all font-mono">
                        {output || <span className="text-muted-foreground">Escaped output will appear here...</span>}
                    </div>
                    {output && (
                        <div className="text-xs text-muted-foreground">
                            {output.length} character{output.length !== 1 ? "s" : ""}
                        </div>
                    )}
                </div>
            </div>

            {/* Escape Reference Table */}
            <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
                <h3 className="text-base font-semibold mb-3">JSON Escape Characters Reference</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border/50">
                                <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Character</th>
                                <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Escape Sequence</th>
                                <th className="text-left py-2 font-medium text-muted-foreground">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ESCAPE_REFERENCE.map((row) => (
                                <tr key={row.description} className="border-b border-border/30 last:border-0">
                                    <td className="py-2 pr-4 font-mono text-foreground">{row.character}</td>
                                    <td className="py-2 pr-4 font-mono text-primary font-semibold">{row.escaped}</td>
                                    <td className="py-2 text-muted-foreground">{row.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
