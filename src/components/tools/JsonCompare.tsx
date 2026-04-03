"use client";

import { useState, useCallback } from "react";
import { ArrowLeftRight, Trash2, GitCompareArrows, ChevronRight, ChevronDown, Copy, CheckCheck } from "lucide-react";
import { diffLines, Change } from "diff";

// ─── Types ───────────────────────────────────────────────────

interface DiffResult {
    path: string;
    type: "added" | "removed" | "modified" | "type_changed";
    oldValue?: unknown;
    newValue?: unknown;
    oldType?: string;
    newType?: string;
}

// ─── Deep Compare Algorithm ─────────────────────────────────

function getType(val: unknown): string {
    if (val === null) return "null";
    if (Array.isArray(val)) return "array";
    return typeof val;
}

function formatPath(parent: string, key: string | number): string {
    if (parent === "") return String(key);
    if (typeof key === "number") return `${parent}[${key}]`;
    return `${parent}.${key}`;
}

function deepCompare(obj1: unknown, obj2: unknown, path: string = ""): DiffResult[] {
    const diffs: DiffResult[] = [];
    const type1 = getType(obj1);
    const type2 = getType(obj2);

    if (type1 !== type2) {
        diffs.push({ path: path || "(root)", type: "type_changed", oldValue: obj1, newValue: obj2, oldType: type1, newType: type2 });
        return diffs;
    }

    if (type1 === "object" && obj1 !== null && obj2 !== null) {
        const o1 = obj1 as Record<string, unknown>;
        const o2 = obj2 as Record<string, unknown>;
        const allKeys = new Set([...Object.keys(o1), ...Object.keys(o2)]);
        for (const key of allKeys) {
            const p = formatPath(path, key);
            if (!(key in o1)) {
                diffs.push({ path: p, type: "added", newValue: o2[key] });
            } else if (!(key in o2)) {
                diffs.push({ path: p, type: "removed", oldValue: o1[key] });
            } else {
                diffs.push(...deepCompare(o1[key], o2[key], p));
            }
        }
        return diffs;
    }

    if (type1 === "array") {
        const a1 = obj1 as unknown[];
        const a2 = obj2 as unknown[];
        const maxLen = Math.max(a1.length, a2.length);
        for (let i = 0; i < maxLen; i++) {
            const p = formatPath(path, i);
            if (i >= a1.length) {
                diffs.push({ path: p, type: "added", newValue: a2[i] });
            } else if (i >= a2.length) {
                diffs.push({ path: p, type: "removed", oldValue: a1[i] });
            } else {
                diffs.push(...deepCompare(a1[i], a2[i], p));
            }
        }
        return diffs;
    }

    // Primitives
    if (obj1 !== obj2) {
        diffs.push({ path: path || "(root)", type: "modified", oldValue: obj1, newValue: obj2 });
    }
    return diffs;
}

// ─── Value Display ──────────────────────────────────────────

function formatValue(val: unknown): string {
    if (val === undefined) return "undefined";
    if (typeof val === "string") return `"${val}"`;
    if (typeof val === "object") return JSON.stringify(val);
    return String(val);
}

// ─── Diff Tree Node ─────────────────────────────────────────

function DiffTreeNode({ label, leftVal, rightVal, diffs, path, depth }: {
    label: string;
    leftVal: unknown;
    rightVal: unknown;
    diffs: DiffResult[];
    path: string;
    depth: number;
}) {
    const [expanded, setExpanded] = useState(depth < 2);
    const leftType = getType(leftVal);
    const rightType = getType(rightVal);
    const isContainer = (leftType === "object" || leftType === "array" || rightType === "object" || rightType === "array");
    const relevantDiffs = diffs.filter(d => d.path === path || d.path.startsWith(path + ".") || d.path.startsWith(path + "["));
    const directDiff = diffs.find(d => d.path === path);

    let bgClass = "";
    if (directDiff) {
        if (directDiff.type === "added") bgClass = "bg-green-50 border-l-2 border-green-400";
        else if (directDiff.type === "removed") bgClass = "bg-red-50 border-l-2 border-red-400";
        else if (directDiff.type === "modified" || directDiff.type === "type_changed") bgClass = "bg-amber-50 border-l-2 border-amber-400";
    } else if (relevantDiffs.length > 0 && isContainer) {
        bgClass = "border-l-2 border-blue-200";
    }

    if (!isContainer) {
        return (
            <div className={`flex items-start gap-2 py-1.5 px-3 text-xs font-mono rounded ${bgClass}`}>
                <span className="text-muted-foreground shrink-0">{label}:</span>
                {directDiff ? (
                    <span className="flex flex-wrap gap-1">
                        {directDiff.type === "added" && (
                            <span className="text-green-700">{formatValue(directDiff.newValue)}</span>
                        )}
                        {directDiff.type === "removed" && (
                            <span className="text-red-700 line-through">{formatValue(directDiff.oldValue)}</span>
                        )}
                        {(directDiff.type === "modified" || directDiff.type === "type_changed") && (
                            <>
                                <span className="text-red-700 line-through">{formatValue(directDiff.oldValue)}</span>
                                <span className="text-muted-foreground">→</span>
                                <span className="text-green-700">{formatValue(directDiff.newValue)}</span>
                            </>
                        )}
                    </span>
                ) : (
                    <span className="text-foreground">{formatValue(leftVal !== undefined ? leftVal : rightVal)}</span>
                )}
            </div>
        );
    }

    // Container node
    const mergedVal = leftVal !== undefined ? leftVal : rightVal;
    const isArray = getType(mergedVal) === "array";
    const leftObj = (leftVal ?? {}) as Record<string, unknown>;
    const rightObj = (rightVal ?? {}) as Record<string, unknown>;
    const leftArr = (leftVal ?? []) as unknown[];
    const rightArr = (rightVal ?? []) as unknown[];

    let childKeys: (string | number)[];
    if (isArray) {
        const maxLen = Math.max(leftArr.length || 0, rightArr.length || 0);
        childKeys = Array.from({ length: maxLen }, (_, i) => i);
    } else {
        childKeys = Array.from(new Set([
            ...Object.keys(leftVal !== undefined && typeof leftVal === "object" && leftVal !== null ? leftObj : {}),
            ...Object.keys(rightVal !== undefined && typeof rightVal === "object" && rightVal !== null ? rightObj : {}),
        ]));
    }

    return (
        <div className={`${bgClass} rounded`}>
            <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 py-1.5 px-3 text-xs font-mono w-full hover:bg-accent/50 rounded transition-colors text-left"
            >
                {expanded ? <ChevronDown className="w-3 h-3 shrink-0" /> : <ChevronRight className="w-3 h-3 shrink-0" />}
                <span className="text-muted-foreground">{label}</span>
                <span className="text-muted-foreground/60 ml-1">{isArray ? `[${childKeys.length}]` : `{${childKeys.length}}`}</span>
                {relevantDiffs.length > 0 && (
                    <span className="ml-auto text-[10px] text-amber-600 font-sans">{relevantDiffs.length} change{relevantDiffs.length !== 1 ? "s" : ""}</span>
                )}
            </button>
            {expanded && (
                <div className="ml-4 border-l border-border/40">
                    {childKeys.map((key) => {
                        const childPath = formatPath(path, key);
                        const lv = isArray ? (leftArr as unknown[])?.[key as number] : (leftObj as Record<string, unknown>)?.[key as string];
                        const rv = isArray ? (rightArr as unknown[])?.[key as number] : (rightObj as Record<string, unknown>)?.[key as string];
                        return (
                            <DiffTreeNode
                                key={String(key)}
                                label={String(key)}
                                leftVal={lv}
                                rightVal={rv}
                                diffs={diffs}
                                path={childPath}
                                depth={depth + 1}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ─── Text Diff View ─────────────────────────────────────────

function TextDiffView({ leftJson, rightJson }: { leftJson: string; rightJson: string }) {
    const changes: Change[] = diffLines(leftJson, rightJson);
    let lineNum = 1;

    return (
        <div className="font-mono text-xs leading-relaxed overflow-auto max-h-[500px]">
            {changes.map((part, idx) => {
                const lines = part.value.split("\n").filter((l, i, arr) => i < arr.length - 1 || l !== "");
                return lines.map((line, li) => {
                    const num = lineNum++;
                    if (part.added) lineNum--; // don't increment for added lines in old numbering context
                    let bg = "";
                    let prefix = " ";
                    if (part.added) {
                        bg = "bg-green-100 text-green-900";
                        prefix = "+";
                    } else if (part.removed) {
                        bg = "bg-red-100 text-red-900";
                        prefix = "-";
                    }
                    return (
                        <div key={`${idx}-${li}`} className={`flex ${bg}`}>
                            <span className="w-10 shrink-0 text-right pr-2 text-muted-foreground/50 select-none border-r border-border/30">{num}</span>
                            <span className="w-4 shrink-0 text-center select-none">{prefix}</span>
                            <span className="flex-1 whitespace-pre-wrap break-all px-1">{line}</span>
                        </div>
                    );
                });
            })}
        </div>
    );
}

// ─── Main Component ─────────────────────────────────────────

export default function JsonCompare() {
    const [leftInput, setLeftInput] = useState("");
    const [rightInput, setRightInput] = useState("");
    const [diffs, setDiffs] = useState<DiffResult[] | null>(null);
    const [leftParsed, setLeftParsed] = useState<unknown>(undefined);
    const [rightParsed, setRightParsed] = useState<unknown>(undefined);
    const [leftError, setLeftError] = useState<string | null>(null);
    const [rightError, setRightError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"tree" | "text">("tree");
    const [copied, setCopied] = useState(false);

    const handleCompare = () => {
        let lp: unknown, rp: unknown;
        let hasError = false;

        try {
            lp = JSON.parse(leftInput);
            setLeftError(null);
            setLeftParsed(lp);
        } catch (err) {
            setLeftError(err instanceof Error ? err.message : "Invalid JSON");
            hasError = true;
        }

        try {
            rp = JSON.parse(rightInput);
            setRightError(null);
            setRightParsed(rp);
        } catch (err) {
            setRightError(err instanceof Error ? err.message : "Invalid JSON");
            hasError = true;
        }

        if (hasError) {
            setDiffs(null);
            return;
        }

        setDiffs(deepCompare(lp, rp));
    };

    const handleSwap = () => {
        setLeftInput(rightInput);
        setRightInput(leftInput);
        setDiffs(null);
        setLeftError(null);
        setRightError(null);
    };

    const handleClear = () => {
        setLeftInput("");
        setRightInput("");
        setDiffs(null);
        setLeftError(null);
        setRightError(null);
    };

    const handleCopyDiff = useCallback(() => {
        if (!diffs) return;
        const text = diffs.map(d => {
            if (d.type === "added") return `+ ${d.path}: ${formatValue(d.newValue)}`;
            if (d.type === "removed") return `- ${d.path}: ${formatValue(d.oldValue)}`;
            if (d.type === "modified") return `~ ${d.path}: ${formatValue(d.oldValue)} → ${formatValue(d.newValue)}`;
            return `! ${d.path}: type changed from ${d.oldType} to ${d.newType}`;
        }).join("\n");
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [diffs]);

    const addedCount = diffs?.filter(d => d.type === "added").length ?? 0;
    const removedCount = diffs?.filter(d => d.type === "removed").length ?? 0;
    const modifiedCount = diffs?.filter(d => d.type === "modified" || d.type === "type_changed").length ?? 0;

    return (
        <div className="flex flex-col gap-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-border/50">
                <span className="text-sm font-semibold flex items-center gap-2">
                    <GitCompareArrows className="w-4 h-4 text-primary" />
                    JSON Compare
                    <span className="text-xs font-normal text-muted-foreground">Find differences between two JSON objects</span>
                </span>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                        onClick={handleSwap}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-background border border-border rounded-md hover:bg-accent transition-colors flex-1 sm:flex-none"
                    >
                        <ArrowLeftRight className="w-3.5 h-3.5" />
                        Swap
                    </button>
                    <button
                        onClick={handleClear}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-md transition-colors flex-1 sm:flex-none"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear
                    </button>
                    <button
                        onClick={handleCompare}
                        disabled={!leftInput.trim() || !rightInput.trim()}
                        className="flex items-center justify-center gap-1.5 px-5 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50 flex-1 sm:flex-none"
                    >
                        Compare
                    </button>
                </div>
            </div>

            {/* Two side-by-side textareas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[400px]">
                {/* Left (Original) */}
                <div className="flex flex-col h-full rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                    <div className="px-4 py-3 border-b border-border/50 bg-slate-50">
                        <span className="text-sm font-semibold">Original JSON</span>
                    </div>
                    <textarea
                        value={leftInput}
                        onChange={(e) => {
                            setLeftInput(e.target.value);
                            setDiffs(null);
                            setLeftError(null);
                        }}
                        placeholder='Paste original JSON here...'
                        className="flex-1 w-full resize-none p-4 bg-transparent outline-none font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-0"
                        spellCheck={false}
                    />
                    {leftError && (
                        <div className="px-4 py-2 bg-red-50 border-t border-red-200 text-red-700 text-xs font-medium">
                            Invalid JSON (left): {leftError}
                        </div>
                    )}
                </div>

                {/* Right (Modified) */}
                <div className="flex flex-col h-full rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                    <div className="px-4 py-3 border-b border-border/50 bg-slate-50">
                        <span className="text-sm font-semibold">Modified JSON</span>
                    </div>
                    <textarea
                        value={rightInput}
                        onChange={(e) => {
                            setRightInput(e.target.value);
                            setDiffs(null);
                            setRightError(null);
                        }}
                        placeholder='Paste modified JSON here...'
                        className="flex-1 w-full resize-none p-4 bg-transparent outline-none font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-0"
                        spellCheck={false}
                    />
                    {rightError && (
                        <div className="px-4 py-2 bg-red-50 border-t border-red-200 text-red-700 text-xs font-medium">
                            Invalid JSON (right): {rightError}
                        </div>
                    )}
                </div>
            </div>

            {/* Results */}
            {diffs !== null && (
                <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                    {/* Summary bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border/50 bg-slate-50">
                        <div className="flex items-center gap-4 text-xs font-medium">
                            {diffs.length === 0 ? (
                                <span className="text-green-700">No differences found — the JSON objects are identical</span>
                            ) : (
                                <>
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-sm bg-green-400"></span>
                                        {addedCount} addition{addedCount !== 1 ? "s" : ""}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-sm bg-red-400"></span>
                                        {removedCount} deletion{removedCount !== 1 ? "s" : ""}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span>
                                        {modifiedCount} modification{modifiedCount !== 1 ? "s" : ""}
                                    </span>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {diffs.length > 0 && (
                                <button
                                    onClick={handleCopyDiff}
                                    className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-muted-foreground bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                                >
                                    {copied ? <CheckCheck className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                    {copied ? "Copied" : "Copy Diff"}
                                </button>
                            )}
                            <div className="flex rounded-md border border-border overflow-hidden">
                                <button
                                    onClick={() => setViewMode("tree")}
                                    className={`px-3 py-1 text-[11px] font-medium transition-colors ${viewMode === "tree" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-accent text-foreground"}`}
                                >
                                    Tree View
                                </button>
                                <button
                                    onClick={() => setViewMode("text")}
                                    className={`px-3 py-1 text-[11px] font-medium transition-colors ${viewMode === "text" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-accent text-foreground"}`}
                                >
                                    Text Diff
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Diff content */}
                    {diffs.length > 0 && (
                        <div className="p-4 max-h-[600px] overflow-auto">
                            {viewMode === "tree" ? (
                                <DiffTreeNode
                                    label="(root)"
                                    leftVal={leftParsed}
                                    rightVal={rightParsed}
                                    diffs={diffs}
                                    path=""
                                    depth={0}
                                />
                            ) : (
                                <TextDiffView
                                    leftJson={JSON.stringify(leftParsed, null, 2)}
                                    rightJson={JSON.stringify(rightParsed, null, 2)}
                                />
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
