"use client";

import { useState, useCallback } from "react";
import { Search, Loader2, Copy, CheckCheck, AlertCircle } from "lucide-react";
import { trackToolUsage } from "@/components/ToolAnalytics";

const RECORD_TYPES = ["ALL", "A", "AAAA", "CNAME", "MX", "TXT", "NS", "SOA"] as const;
type RecordType = (typeof RECORD_TYPES)[number];

interface DnsAnswer {
    name: string;
    type: number;
    TTL: number;
    data: string;
}

interface GroupedResults {
    A: DnsAnswer[];
    AAAA: DnsAnswer[];
    CNAME: DnsAnswer[];
    MX: DnsAnswer[];
    TXT: DnsAnswer[];
    NS: DnsAnswer[];
    SOA: DnsAnswer[];
}

function cleanDomain(input: string): string {
    let domain = input.trim().toLowerCase();
    domain = domain.replace(/^https?:\/\//, "");
    domain = domain.split("/")[0].split("?")[0].split("#")[0];
    domain = domain.split(":")[0];
    return domain;
}

function isValidDomain(domain: string): boolean {
    return /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/.test(
        domain
    );
}

export default function DnsLookup() {
    const [domainInput, setDomainInput] = useState("");
    const [selectedType, setSelectedType] = useState<RecordType>("ALL");
    const [results, setResults] = useState<GroupedResults | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [queryTime, setQueryTime] = useState<number | null>(null);
    const [queryTimestamp, setQueryTimestamp] = useState<Date | null>(null);
    const [queriedDomain, setQueriedDomain] = useState("");
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const handleCopy = useCallback((text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(key);
        setTimeout(() => setCopiedField(null), 2000);
    }, []);

    const handleLookup = useCallback(async () => {
        const domain = cleanDomain(domainInput);

        if (!domain) {
            setError("Please enter a domain name.");
            return;
        }

        if (!isValidDomain(domain)) {
            setError("Please enter a valid domain name (e.g., example.com).");
            return;
        }

        setLoading(true);
        setError(null);
        setResults(null);
        setQueryTime(null);
        setQueriedDomain(domain);

        try {
            const res = await fetch(
                `/api/dns?domain=${encodeURIComponent(domain)}&type=${selectedType}`
            );
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Could not resolve DNS for this domain. Please check the domain name and try again.");
                return;
            }

            const grouped: GroupedResults = { A: [], AAAA: [], CNAME: [], MX: [], TXT: [], NS: [], SOA: [] };

            for (const [typeName, answers] of Object.entries(data.records)) {
                const key = typeName as keyof GroupedResults;
                if (grouped[key] && Array.isArray(answers)) {
                    grouped[key] = answers as DnsAnswer[];
                }
            }

            setResults(grouped);
            setQueryTime(data.queryTime);
            setQueryTimestamp(new Date(data.timestamp));
            trackToolUsage("dns-lookup");
        } catch {
            setError("Could not resolve DNS for this domain. Please check the domain name and try again.");
        } finally {
            setLoading(false);
        }
    }, [domainInput, selectedType]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleLookup();
    };

    const hasAnyResults =
        results && Object.values(results).some((arr) => arr.length > 0);

    return (
        <div className="flex flex-col gap-6">
            {/* Input Row */}
            <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        value={domainInput}
                        onChange={(e) => setDomainInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g. example.com"
                        className="flex-1 h-11 rounded-xl border border-input bg-background px-4 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value as RecordType)}
                        className="h-11 rounded-xl border border-input bg-background px-4 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        {RECORD_TYPES.map((t) => (
                            <option key={t} value={t}>
                                {t === "ALL" ? "All Records" : `${t} Record`}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleLookup}
                        disabled={loading || !domainInput.trim()}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                        style={{
                            background: "linear-gradient(135deg, #003F87 0%, #0059B3 50%, #006BD6 100%)",
                            boxShadow: "0 4px 16px rgba(0, 63, 135, 0.25)",
                        }}
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Search className="h-4 w-4" />
                        )}
                        Lookup
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    {error}
                </div>
            )}

            {/* Loading skeleton */}
            {loading && (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-xl border border-border/60 p-4 animate-pulse">
                            <div className="h-4 w-24 bg-muted rounded mb-3" />
                            <div className="h-3 w-full bg-muted rounded mb-2" />
                            <div className="h-3 w-2/3 bg-muted rounded" />
                        </div>
                    ))}
                </div>
            )}

            {/* Results */}
            {results && !loading && (
                <div className="flex flex-col gap-4">
                    {/* Query meta */}
                    {queryTime !== null && (
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            <span>Domain: <span className="font-semibold text-foreground">{queriedDomain}</span></span>
                            <span>Query completed in <span className="font-semibold text-foreground">{queryTime}ms</span></span>
                            {queryTimestamp && (
                                <span>{queryTimestamp.toLocaleTimeString()}</span>
                            )}
                        </div>
                    )}

                    {!hasAnyResults && (
                        <p className="text-sm text-muted-foreground">
                            No {selectedType === "ALL" ? "" : selectedType + " "}records found for {queriedDomain}.
                        </p>
                    )}

                    {/* A Records */}
                    <RecordSection
                        title="A Records"
                        records={results.A}
                        columns={["Name", "TTL", "IP Address"]}
                        renderRow={(r, i) => (
                            <tr key={i} className="border-b border-border/30 last:border-b-0">
                                <td className="px-4 py-2 font-mono text-xs">{r.name}</td>
                                <td className="px-4 py-2 text-xs text-muted-foreground">{r.TTL}s</td>
                                <td className="px-4 py-2 font-mono text-xs">
                                    <CopyableValue value={r.data} copiedField={copiedField} onCopy={handleCopy} fieldKey={`a-${i}`} />
                                </td>
                            </tr>
                        )}
                    />

                    {/* AAAA Records */}
                    <RecordSection
                        title="AAAA Records"
                        records={results.AAAA}
                        columns={["Name", "TTL", "IPv6 Address"]}
                        renderRow={(r, i) => (
                            <tr key={i} className="border-b border-border/30 last:border-b-0">
                                <td className="px-4 py-2 font-mono text-xs">{r.name}</td>
                                <td className="px-4 py-2 text-xs text-muted-foreground">{r.TTL}s</td>
                                <td className="px-4 py-2 font-mono text-xs">
                                    <CopyableValue value={r.data} copiedField={copiedField} onCopy={handleCopy} fieldKey={`aaaa-${i}`} />
                                </td>
                            </tr>
                        )}
                    />

                    {/* CNAME Records */}
                    <RecordSection
                        title="CNAME Records"
                        records={results.CNAME}
                        columns={["Name", "TTL", "Target"]}
                        renderRow={(r, i) => (
                            <tr key={i} className="border-b border-border/30 last:border-b-0">
                                <td className="px-4 py-2 font-mono text-xs">{r.name}</td>
                                <td className="px-4 py-2 text-xs text-muted-foreground">{r.TTL}s</td>
                                <td className="px-4 py-2 font-mono text-xs">
                                    <CopyableValue value={r.data} copiedField={copiedField} onCopy={handleCopy} fieldKey={`cname-${i}`} />
                                </td>
                            </tr>
                        )}
                    />

                    {/* MX Records */}
                    <RecordSection
                        title="MX Records"
                        records={results.MX}
                        columns={["Name", "TTL", "Priority", "Mail Server"]}
                        renderRow={(r, i) => {
                            const parts = r.data.split(" ");
                            const priority = parts[0] || "—";
                            const server = parts.slice(1).join(" ") || r.data;
                            return (
                                <tr key={i} className="border-b border-border/30 last:border-b-0">
                                    <td className="px-4 py-2 font-mono text-xs">{r.name}</td>
                                    <td className="px-4 py-2 text-xs text-muted-foreground">{r.TTL}s</td>
                                    <td className="px-4 py-2 text-xs font-semibold">{priority}</td>
                                    <td className="px-4 py-2 font-mono text-xs">
                                        <CopyableValue value={server} copiedField={copiedField} onCopy={handleCopy} fieldKey={`mx-${i}`} />
                                    </td>
                                </tr>
                            );
                        }}
                    />

                    {/* TXT Records */}
                    <RecordSection
                        title="TXT Records"
                        records={results.TXT}
                        columns={["Name", "TTL", "Value"]}
                        renderRow={(r, i) => (
                            <tr key={i} className="border-b border-border/30 last:border-b-0">
                                <td className="px-4 py-2 font-mono text-xs">{r.name}</td>
                                <td className="px-4 py-2 text-xs text-muted-foreground">{r.TTL}s</td>
                                <td className="px-4 py-2 font-mono text-xs break-all max-w-[400px]">
                                    <CopyableValue value={r.data.replace(/^"|"$/g, "")} copiedField={copiedField} onCopy={handleCopy} fieldKey={`txt-${i}`} />
                                </td>
                            </tr>
                        )}
                    />

                    {/* NS Records */}
                    <RecordSection
                        title="NS Records"
                        records={results.NS}
                        columns={["Name", "TTL", "Nameserver"]}
                        renderRow={(r, i) => (
                            <tr key={i} className="border-b border-border/30 last:border-b-0">
                                <td className="px-4 py-2 font-mono text-xs">{r.name}</td>
                                <td className="px-4 py-2 text-xs text-muted-foreground">{r.TTL}s</td>
                                <td className="px-4 py-2 font-mono text-xs">
                                    <CopyableValue value={r.data} copiedField={copiedField} onCopy={handleCopy} fieldKey={`ns-${i}`} />
                                </td>
                            </tr>
                        )}
                    />

                    {/* SOA Records */}
                    {results.SOA.length > 0 && (
                        <div className="rounded-xl border border-border/60 overflow-hidden">
                            <div className="bg-muted/50 px-4 py-2.5 border-b border-border/60">
                                <h3 className="text-sm font-semibold">SOA Record</h3>
                            </div>
                            {results.SOA.map((r, i) => {
                                const parts = r.data.split(" ");
                                return (
                                    <div key={i} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4 text-xs">
                                        <div>
                                            <span className="text-muted-foreground block mb-0.5">Primary NS</span>
                                            <span className="font-mono">{parts[0] || "—"}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block mb-0.5">Admin Email</span>
                                            <span className="font-mono">{parts[1]?.replace(/\.$/, "").replace(".", "@") || "—"}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block mb-0.5">Serial</span>
                                            <span className="font-mono">{parts[2] || "—"}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block mb-0.5">Refresh</span>
                                            <span className="font-mono">{parts[3] ? `${parts[3]}s` : "—"}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block mb-0.5">Retry</span>
                                            <span className="font-mono">{parts[4] ? `${parts[4]}s` : "—"}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block mb-0.5">Expire</span>
                                            <span className="font-mono">{parts[5] ? `${parts[5]}s` : "—"}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block mb-0.5">Minimum TTL</span>
                                            <span className="font-mono">{parts[6] ? `${parts[6]}s` : "—"}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block mb-0.5">TTL</span>
                                            <span className="font-mono">{r.TTL}s</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function RecordSection({
    title,
    records,
    columns,
    renderRow,
}: {
    title: string;
    records: DnsAnswer[];
    columns: string[];
    renderRow: (record: DnsAnswer, index: number) => React.ReactNode;
}) {
    if (records.length === 0) return null;

    return (
        <div className="rounded-xl border border-border/60 overflow-hidden">
            <div className="bg-muted/50 px-4 py-2.5 border-b border-border/60">
                <h3 className="text-sm font-semibold">
                    {title} <span className="text-muted-foreground font-normal">({records.length})</span>
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border/40">
                            {columns.map((col) => (
                                <th key={col} className="px-4 py-2 text-left text-xs font-semibold uppercase text-muted-foreground">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>{records.map(renderRow)}</tbody>
                </table>
            </div>
        </div>
    );
}

function CopyableValue({
    value,
    copiedField,
    onCopy,
    fieldKey,
}: {
    value: string;
    copiedField: string | null;
    onCopy: (text: string, key: string) => void;
    fieldKey: string;
}) {
    return (
        <span className="inline-flex items-center gap-1.5 group">
            {value}
            <button
                onClick={() => onCopy(value, fieldKey)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                title="Copy"
            >
                {copiedField === fieldKey ? (
                    <CheckCheck className="h-3 w-3 text-green-600" />
                ) : (
                    <Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                )}
            </button>
        </span>
    );
}
