"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Copy, CheckCheck, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { trackToolUsage } from "@/components/ToolAnalytics";

interface MatchResult {
    index: number;
    fullMatch: string;
    groups: string[];
    start: number;
    end: number;
}

const FLAGS = [
    { key: "g", label: "g", title: "Global — find all matches" },
    { key: "i", label: "i", title: "Case Insensitive" },
    { key: "m", label: "m", title: "Multiline — ^ and $ match line boundaries" },
    { key: "s", label: "s", title: "DotAll — . matches newlines" },
    { key: "u", label: "u", title: "Unicode" },
] as const;

const COMMON_PATTERNS = [
    { label: "Email", pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}" },
    { label: "URL", pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)" },
    { label: "Phone (US)", pattern: "(\\d{3})[-.\\s]?(\\d{3})[-.\\s]?(\\d{4})" },
    { label: "IP Address", pattern: "\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b" },
    { label: "Date (YYYY-MM-DD)", pattern: "\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])" },
    { label: "Hex Color", pattern: "#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})" },
];

const CHEAT_SHEET = [
    {
        title: "Characters",
        items: [
            { pattern: ".", desc: "Any character (except newline)" },
            { pattern: "\\d", desc: "Digit (0-9)" },
            { pattern: "\\w", desc: "Word character (a-z, A-Z, 0-9, _)" },
            { pattern: "\\s", desc: "Whitespace (space, tab, newline)" },
            { pattern: "\\b", desc: "Word boundary" },
        ],
    },
    {
        title: "Quantifiers",
        items: [
            { pattern: "*", desc: "0 or more" },
            { pattern: "+", desc: "1 or more" },
            { pattern: "?", desc: "0 or 1" },
            { pattern: "{n}", desc: "Exactly n times" },
            { pattern: "{n,m}", desc: "Between n and m times" },
        ],
    },
    {
        title: "Groups & Lookaround",
        items: [
            { pattern: "(...)", desc: "Capture group" },
            { pattern: "(?:...)", desc: "Non-capture group" },
            { pattern: "(?=...)", desc: "Lookahead" },
            { pattern: "(?<=...)", desc: "Lookbehind" },
        ],
    },
    {
        title: "Anchors",
        items: [
            { pattern: "^", desc: "Start of string/line" },
            { pattern: "$", desc: "End of string/line" },
            { pattern: "\\b", desc: "Word boundary" },
        ],
    },
    {
        title: "Character Classes",
        items: [
            { pattern: "[abc]", desc: "Any of a, b, or c" },
            { pattern: "[^abc]", desc: "Not a, b, or c" },
            { pattern: "[a-z]", desc: "Range: a to z" },
            { pattern: "[0-9]", desc: "Range: 0 to 9" },
        ],
    },
];

export default function RegexTester() {
    const [pattern, setPattern] = useState("");
    const [testString, setTestString] = useState("");
    const [activeFlags, setActiveFlags] = useState<Record<string, boolean>>({
        g: true,
        i: false,
        m: true,
        s: false,
        u: false,
    });
    const [showCheatSheet, setShowCheatSheet] = useState(false);
    const [copied, setCopied] = useState(false);
    const trackedRef = useRef(false);

    const flagString = useMemo(
        () => FLAGS.filter((f) => activeFlags[f.key]).map((f) => f.key).join(""),
        [activeFlags]
    );

    const toggleFlag = (key: string) => {
        setActiveFlags((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const { matches, error, regex } = useMemo(() => {
        if (!pattern) return { matches: [] as MatchResult[], error: null, regex: null };

        try {
            const re = new RegExp(pattern, flagString);
            if (!testString) return { matches: [] as MatchResult[], error: null, regex: re };

            const results: MatchResult[] = [];

            if (flagString.includes("g")) {
                const iter = testString.matchAll(re);
                let idx = 0;
                for (const m of iter) {
                    results.push({
                        index: idx++,
                        fullMatch: m[0],
                        groups: m.slice(1).map((g) => g ?? ""),
                        start: m.index!,
                        end: m.index! + m[0].length,
                    });
                    // Safety valve for catastrophic patterns
                    if (results.length > 5000) break;
                }
            } else {
                const m = testString.match(re);
                if (m && m.index !== undefined) {
                    results.push({
                        index: 0,
                        fullMatch: m[0],
                        groups: m.slice(1).map((g) => g ?? ""),
                        start: m.index,
                        end: m.index + m[0].length,
                    });
                }
            }

            return { matches: results, error: null, regex: re };
        } catch (e: unknown) {
            return { matches: [] as MatchResult[], error: (e as Error).message, regex: null };
        }
    }, [pattern, testString, flagString]);

    // Track usage when matches found
    useEffect(() => {
        if (matches.length > 0 && !trackedRef.current) {
            trackedRef.current = true;
            trackToolUsage("regex-tester");
        }
        if (matches.length === 0) {
            trackedRef.current = false;
        }
    }, [matches.length]);

    // Build highlighted HTML
    const highlightedHtml = useMemo(() => {
        if (!testString || !pattern || error || matches.length === 0) return null;

        const parts: string[] = [];
        let lastEnd = 0;

        for (const m of matches) {
            if (m.start > lastEnd) {
                parts.push(escapeHtml(testString.slice(lastEnd, m.start)));
            }
            parts.push(
                `<mark class="bg-yellow-200 text-yellow-900 rounded-sm px-[1px]">${escapeHtml(
                    testString.slice(m.start, m.end)
                )}</mark>`
            );
            lastEnd = m.end;
        }
        if (lastEnd < testString.length) {
            parts.push(escapeHtml(testString.slice(lastEnd)));
        }

        return parts.join("");
    }, [testString, pattern, error, matches]);

    const handlePatternChange = (value: string) => {
        setPattern(value);
    };

    const applyCommonPattern = (p: string) => {
        setPattern(p);
    };

    const handleCopyRegex = () => {
        if (!pattern) return;
        navigator.clipboard.writeText(`/${pattern}/${flagString}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Regex Input Row */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium tracking-tight">Regular Expression</label>
                    <button
                        onClick={handleCopyRegex}
                        disabled={!pattern}
                        className="inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium text-primary hover:bg-primary/10 disabled:opacity-50"
                    >
                        {copied ? <CheckCheck className="mr-1.5 h-3 w-3" /> : <Copy className="mr-1.5 h-3 w-3" />}
                        {copied ? "Copied" : "Copy"}
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex flex-1 items-center rounded-xl border border-input bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring overflow-hidden">
                        <span className="pl-4 text-muted-foreground font-mono text-sm select-none">/</span>
                        <input
                            type="text"
                            value={pattern}
                            onChange={(e) => handlePatternChange(e.target.value)}
                            placeholder="e.g. (\d{3})-(\d{3})-(\d{4})"
                            className="flex-1 bg-transparent px-2 py-2.5 text-sm font-mono placeholder:text-muted-foreground focus:outline-none"
                        />
                        <span className="pr-2 text-muted-foreground font-mono text-sm select-none">/{flagString}</span>
                    </div>
                </div>

                {/* Flag toggles */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground mr-1">Flags:</span>
                    {FLAGS.map((f) => (
                        <button
                            key={f.key}
                            title={f.title}
                            onClick={() => toggleFlag(f.key)}
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-mono font-bold transition-colors ${
                                activeFlags[f.key]
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-input bg-background text-muted-foreground hover:bg-muted"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Common patterns */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground mr-1">Quick patterns:</span>
                    {COMMON_PATTERNS.map((p) => (
                        <button
                            key={p.label}
                            onClick={() => applyCommonPattern(p.pattern)}
                            className="inline-flex h-7 items-center rounded-md border border-input bg-background px-2.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                            <Zap className="mr-1 h-3 w-3" />
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <span className="font-semibold">Invalid regular expression:</span> {error}
                </div>
            )}

            {/* Test String */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium tracking-tight">Test String</label>
                <textarea
                    value={testString}
                    onChange={(e) => setTestString(e.target.value)}
                    placeholder="Type or paste your test string here..."
                    className="min-h-[160px] w-full resize-y rounded-xl border border-input bg-transparent px-4 py-3 text-sm font-mono shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
            </div>

            {/* Highlighted preview */}
            {highlightedHtml && (
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium tracking-tight">Match Highlighting</label>
                    <div
                        className="min-h-[80px] w-full rounded-xl border border-input bg-slate-50 px-4 py-3 text-sm font-mono whitespace-pre-wrap break-all leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                    />
                </div>
            )}

            {/* Results Panel */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium tracking-tight">Results</label>
                    {pattern && !error && (
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                            {matches.length} match{matches.length !== 1 ? "es" : ""} found
                        </span>
                    )}
                </div>

                {!pattern && (
                    <p className="text-sm text-muted-foreground">Enter a regex pattern to see results.</p>
                )}

                {pattern && !error && matches.length === 0 && testString && (
                    <p className="text-sm text-muted-foreground">No matches found</p>
                )}

                {matches.length > 0 && (
                    <div className="overflow-x-auto rounded-xl border border-border/60">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border/60 bg-muted/50">
                                    <th className="px-4 py-2.5 text-left font-semibold text-xs uppercase text-muted-foreground">#</th>
                                    <th className="px-4 py-2.5 text-left font-semibold text-xs uppercase text-muted-foreground">Match</th>
                                    {matches.some((m) => m.groups.length > 0) && (
                                        <th className="px-4 py-2.5 text-left font-semibold text-xs uppercase text-muted-foreground">Groups</th>
                                    )}
                                    <th className="px-4 py-2.5 text-left font-semibold text-xs uppercase text-muted-foreground">Position</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matches.slice(0, 200).map((m) => (
                                    <tr key={m.index} className="border-b border-border/30 last:border-b-0">
                                        <td className="px-4 py-2 text-muted-foreground font-mono">{m.index + 1}</td>
                                        <td className="px-4 py-2 font-mono break-all">
                                            <code className="bg-yellow-100 text-yellow-900 px-1.5 py-0.5 rounded text-xs">
                                                {m.fullMatch}
                                            </code>
                                        </td>
                                        {matches.some((m) => m.groups.length > 0) && (
                                            <td className="px-4 py-2 font-mono text-xs">
                                                {m.groups.length > 0
                                                    ? m.groups.map((g, i) => (
                                                          <span key={i} className="mr-2">
                                                              <span className="text-muted-foreground">Group {i + 1}:</span>{" "}
                                                              <code className="bg-blue-50 text-blue-700 px-1 py-0.5 rounded">
                                                                  {g || "(empty)"}
                                                              </code>
                                                          </span>
                                                      ))
                                                    : "—"}
                                            </td>
                                        )}
                                        <td className="px-4 py-2 text-muted-foreground font-mono text-xs">
                                            {m.start}–{m.end}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {matches.length > 200 && (
                            <p className="px-4 py-2 text-xs text-muted-foreground">
                                Showing first 200 of {matches.length} matches.
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Cheat Sheet */}
            <div className="rounded-xl border border-border/60">
                <button
                    onClick={() => setShowCheatSheet(!showCheatSheet)}
                    className="flex w-full items-center justify-between px-5 py-3.5 text-sm font-semibold hover:bg-muted/50 transition-colors rounded-xl"
                >
                    Regex Cheat Sheet
                    {showCheatSheet ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                </button>
                {showCheatSheet && (
                    <div className="grid gap-4 px-5 pb-5 sm:grid-cols-2 lg:grid-cols-3">
                        {CHEAT_SHEET.map((section) => (
                            <div key={section.title} className="rounded-lg border border-border/40 p-3">
                                <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">
                                    {section.title}
                                </h4>
                                <div className="space-y-1">
                                    {section.items.map((item) => (
                                        <div key={item.pattern} className="flex items-baseline gap-2 text-xs">
                                            <code className="font-mono font-bold text-primary shrink-0 min-w-[50px]">
                                                {item.pattern}
                                            </code>
                                            <span className="text-muted-foreground">{item.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
