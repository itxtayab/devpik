"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Copy, CheckCheck, Trash2, Minimize2 } from "lucide-react";

export default function JsonMinifier() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const minify = useCallback((text: string) => {
        if (!text.trim()) {
            setOutput("");
            setError(null);
            return;
        }
        try {
            const parsed = JSON.parse(text);
            setOutput(JSON.stringify(parsed));
            setError(null);
        } catch (err) {
            setOutput("");
            const msg = err instanceof Error ? err.message : "Invalid JSON";
            setError(msg);
        }
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => minify(input), 150);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [input, minify]);

    const handleCopy = useCallback(() => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [output]);

    const handleClear = () => {
        setInput("");
        setOutput("");
        setError(null);
    };

    const handleSample = () => {
        setInput(JSON.stringify({
            "name": "John Doe",
            "age": 30,
            "email": "john@example.com",
            "address": {
                "street": "123 Main St",
                "city": "New York",
                "state": "NY",
                "zip": "10001"
            },
            "hobbies": ["reading", "coding", "hiking"],
            "isActive": true,
            "metadata": {
                "createdAt": "2026-01-15T10:30:00Z",
                "updatedAt": "2026-03-20T14:45:00Z",
                "tags": ["developer", "premium"]
            }
        }, null, 4));
    };

    const inputSize = new Blob([input]).size;
    const outputSize = output ? new Blob([output]).size : 0;
    const savedBytes = Math.max(0, inputSize - outputSize);
    const savingsPercentage = inputSize > 0 && output ? ((savedBytes / inputSize) * 100).toFixed(1) : "0.0";

    return (
        <div className="flex flex-col gap-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-border/50">
                <span className="text-sm font-semibold flex items-center gap-2">
                    <Minimize2 className="w-4 h-4 text-primary" />
                    JSON Minifier
                    <span className="text-xs font-normal text-muted-foreground">Remove whitespace and compress JSON</span>
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSample}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-background border border-border rounded-md hover:bg-accent transition-colors"
                    >
                        Sample
                    </button>
                    <button
                        onClick={handleClear}
                        disabled={!input}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-md transition-colors disabled:opacity-50"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear
                    </button>
                </div>
            </div>

            {/* Two-panel layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[500px]">
                {/* Input Area */}
                <div className="flex flex-col h-full rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-slate-50">
                        <span className="text-sm font-semibold">Input JSON</span>
                        {input && (
                            <span className="text-xs text-muted-foreground">{inputSize} bytes</span>
                        )}
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder='Paste your JSON here to minify...'
                        className="flex-1 w-full resize-none p-4 bg-transparent outline-none font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-0"
                        spellCheck={false}
                    />
                    {error && (
                        <div className="px-4 py-2 bg-red-50 border-t border-red-200 text-red-700 text-xs font-medium">
                            {error}
                        </div>
                    )}
                </div>

                {/* Output Area */}
                <div className="flex flex-col h-full rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-slate-50">
                        <span className="text-sm font-semibold">Minified Output</span>
                        <button
                            onClick={handleCopy}
                            disabled={!output}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground bg-slate-100 hover:bg-slate-200 hover:text-foreground disabled:opacity-50 rounded-md transition-colors"
                        >
                            {copied ? <CheckCheck className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? "Copied" : "Copy"}
                        </button>
                    </div>
                    <textarea
                        readOnly
                        value={output}
                        placeholder="Minified JSON will appear here..."
                        className="flex-1 w-full resize-none p-4 bg-slate-50/50 outline-none font-mono text-sm text-foreground focus:ring-0"
                        spellCheck={false}
                    />
                </div>
            </div>

            {/* Stats */}
            {output && (
                <div className="flex flex-wrap items-center justify-center gap-6 p-4 bg-green-50 border border-green-200 text-green-800 font-medium rounded-xl text-sm">
                    <div>Original: {inputSize} B</div>
                    <div className="w-px h-4 bg-green-300" />
                    <div>Minified: {outputSize} B</div>
                    <div className="w-px h-4 bg-green-300" />
                    <div>Saved: {savedBytes} B ({savingsPercentage}%)</div>
                </div>
            )}
        </div>
    );
}
