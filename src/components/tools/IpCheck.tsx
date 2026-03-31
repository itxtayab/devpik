"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, CheckCheck, RefreshCw, Globe, MapPin, Building, Clock, Loader2, Compass, Server, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

interface IpData {
    query: string;
    country: string;
    countryCode: string;
    regionName: string;
    city: string;
    zip: string;
    lat: number;
    lon: number;
    timezone: string;
    isp: string;
    org: string;
    as: string;
}

type Status = "loading" | "success" | "error";

function countryFlag(code: string): string {
    try {
        return String.fromCodePoint(
            ...code.toUpperCase().split("").map(c => 0x1F1E6 + c.charCodeAt(0) - 65)
        );
    } catch {
        return "";
    }
}

export default function IpCheck() {
    const [data, setData] = useState<IpData | null>(null);
    const [status, setStatus] = useState<Status>("loading");
    const [errorMsg, setErrorMsg] = useState("");

    const fetchData = useCallback(async () => {
        setStatus("loading");
        setErrorMsg("");
        try {
            const res = await fetch("/api/ip-check", { cache: "no-store" });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to fetch IP data");
            }
            const json: IpData = await res.json();
            setData(json);
            setStatus("success");
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : "Failed to fetch IP data");
            setStatus("error");
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="flex flex-col gap-6">
            {/* Header with refresh */}
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-border/50">
                <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">
                        {status === "loading" && "Fetching your IP information..."}
                        {status === "success" && "Your network information"}
                        {status === "error" && "Failed to fetch IP data"}
                    </span>
                </div>
                <button
                    onClick={fetchData}
                    disabled={status === "loading"}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background hover:bg-accent transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={cn("w-4 h-4", status === "loading" && "animate-spin")} />
                    Refresh
                </button>
            </div>

            {/* Loading */}
            {status === "loading" && (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-xl border border-dashed border-border/60">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="mt-3 text-sm text-muted-foreground">Looking up your IP address...</p>
                </div>
            )}

            {/* Error */}
            {status === "error" && (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
                    <p className="text-sm text-red-700">{errorMsg}</p>
                    <button
                        onClick={fetchData}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                </div>
            )}

            {/* Results */}
            {status === "success" && data && (
                <>
                    {/* IP Address - prominent display */}
                    <div className="flex flex-col items-center gap-3 bg-slate-50 p-8 rounded-xl border border-border/50">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Your Public IP Address</span>
                        <div className="flex items-center gap-3">
                            <span className="text-3xl sm:text-4xl font-bold font-mono text-foreground">{data.query}</span>
                            <CopyButton text={data.query} />
                        </div>
                        {data.countryCode && (
                            <span className="text-lg">
                                {countryFlag(data.countryCode)} {data.country}
                            </span>
                        )}
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoCard icon={<MapPin className="w-4 h-4" />} label="Location" value={[data.city, data.regionName, data.country].filter(Boolean).join(", ")} />
                        <InfoCard icon={<Building className="w-4 h-4" />} label="ISP" value={data.isp} copyable />
                        <InfoCard icon={<Server className="w-4 h-4" />} label="Organization" value={data.org || "N/A"} />
                        <InfoCard icon={<Clock className="w-4 h-4" />} label="Timezone" value={data.timezone || "N/A"} />
                        <InfoCard icon={<Compass className="w-4 h-4" />} label="Coordinates" value={data.lat && data.lon ? `${data.lat}, ${data.lon}` : "N/A"} copyable />
                        <InfoCard icon={<Hash className="w-4 h-4" />} label="AS Number" value={data.as || "N/A"} />
                        <InfoCard icon={<Globe className="w-4 h-4" />} label="Country Code" value={data.countryCode ? `${countryFlag(data.countryCode)} ${data.countryCode}` : "N/A"} />
                        <InfoCard icon={<MapPin className="w-4 h-4" />} label="ZIP Code" value={data.zip || "N/A"} />
                    </div>
                </>
            )}
        </div>
    );
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className={cn(
                "p-2 rounded-lg transition-colors",
                copied ? "bg-green-100 text-green-600" : "bg-slate-200 text-slate-500 hover:text-foreground"
            )}
            title="Copy to clipboard"
        >
            {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
    );
}

function InfoCard({ icon, label, value, copyable }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    copyable?: boolean;
}) {
    return (
        <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
                {icon}
                <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-foreground break-all">{value}</span>
                {copyable && <CopyButton text={value} />}
            </div>
        </div>
    );
}
