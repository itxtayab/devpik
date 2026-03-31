"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Download, Upload, Activity, RotateCcw, Square, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

type TestPhase = "idle" | "ping" | "download" | "upload" | "complete";

interface TestResults {
    ping: number | null;
    download: number | null;
    upload: number | null;
}

// ── Helpers ──────────────────────────────────────────

function median(arr: number[]): number {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function fmt(speed: number | null): string {
    if (speed === null) return "—";
    if (speed >= 100) return speed.toFixed(0);
    if (speed >= 10) return speed.toFixed(1);
    return speed.toFixed(2);
}

function generateRandomBytes(size: number): Uint8Array {
    const data = new Uint8Array(size);
    for (let o = 0; o < size; o += 65536) {
        crypto.getRandomValues(new Uint8Array(data.buffer, o, Math.min(65536, size - o)));
    }
    return data;
}

// Log scale for gauge
function speedToFraction(speed: number): number {
    if (speed <= 0) return 0;
    const minL = Math.log10(0.5);
    const maxL = Math.log10(1000);
    return Math.max(0, Math.min(1, (Math.log10(Math.min(speed, 1000)) - minL) / (maxL - minL)));
}

// ── Gauge constants ─────────────────────────────────

const CX = 200, CY = 200, R = 148;
const START_DEG = 135, SWEEP_DEG = 270;
const CIRCUMFERENCE = 2 * Math.PI * R;
const ARC_LENGTH = (SWEEP_DEG / 360) * CIRCUMFERENCE;

const TICKS = [0, 5, 10, 20, 50, 100, 250, 500, 750, 1000];

function polar(deg: number, r: number) {
    const rad = (deg * Math.PI) / 180;
    return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

// ── useAnimatedValue hook ───────────────────────────

function useAnimatedValue(target: number, duration = 600) {
    const [value, setValue] = useState(target);
    const rafRef = useRef<number>(0);
    const startRef = useRef({ value: 0, time: 0, target: 0 });

    useEffect(() => {
        const now = performance.now();
        startRef.current = { value, time: now, target };

        const animate = (time: number) => {
            const { value: from, time: startTime, target: to } = startRef.current;
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(from + (to - from) * eased);
            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            }
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, duration]);

    return value;
}

// ── SpeedGauge ──────────────────────────────────────

function SpeedGauge({ speed, isActive }: { speed: number | null; isActive: boolean }) {
    const displaySpeed = speed ?? 0;
    const animatedSpeed = useAnimatedValue(displaySpeed, 800);
    const fraction = speedToFraction(animatedSpeed);

    // strokeDasharray / dashoffset for smooth arc
    const dashOffset = ARC_LENGTH * (1 - fraction);

    // Needle angle
    const needleDeg = START_DEG + fraction * SWEEP_DEG;
    const needleTip = polar(needleDeg, R - 25);

    return (
        <svg viewBox="0 0 400 300" className="w-full max-w-[460px] mx-auto select-none">
            <defs>
                <linearGradient id="arcGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="5" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="dotGlow">
                    <feGaussianBlur stdDeviation="3" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>

            {/* Minor tick marks */}
            {Array.from({ length: 54 }).map((_, i) => {
                const deg = START_DEG + (i / 54) * SWEEP_DEG;
                const o = polar(deg, R + 2);
                const inn = polar(deg, R + 7);
                return <line key={i} x1={o.x} y1={o.y} x2={inn.x} y2={inn.y} stroke="#334155" strokeWidth="1" />;
            })}

            {/* Major ticks + labels */}
            {TICKS.map((t) => {
                const frac = t === 0 ? 0 : speedToFraction(t);
                const deg = START_DEG + frac * SWEEP_DEG;
                const o = polar(deg, R + 2);
                const inn = polar(deg, R + 12);
                const lbl = polar(deg, R + 27);
                return (
                    <g key={t}>
                        <line x1={o.x} y1={o.y} x2={inn.x} y2={inn.y} stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                        <text x={lbl.x} y={lbl.y} textAnchor="middle" dominantBaseline="central"
                            fill="#94a3b8" fontSize="12" fontWeight="600" fontFamily="system-ui">{t}</text>
                    </g>
                );
            })}

            {/* Background track */}
            <circle
                cx={CX} cy={CY} r={R}
                fill="none"
                stroke="#1e293b"
                strokeWidth="20"
                strokeLinecap="round"
                strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
                strokeDashoffset={0}
                transform={`rotate(${START_DEG} ${CX} ${CY})`}
                opacity="0.4"
            />

            {/* Active arc — uses CSS transition for smoothness */}
            <circle
                cx={CX} cy={CY} r={R}
                fill="none"
                stroke="url(#arcGrad)"
                strokeWidth="20"
                strokeLinecap="round"
                strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
                strokeDashoffset={dashOffset}
                transform={`rotate(${START_DEG} ${CX} ${CY})`}
                filter="url(#glow)"
                style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.22, 1, 0.36, 1)" }}
            />

            {/* Needle */}
            {(isActive || displaySpeed > 0) && (
                <g style={{ transition: "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)", transformOrigin: `${CX}px ${CY}px` }}>
                    <line
                        x1={CX} y1={CY}
                        x2={needleTip.x} y2={needleTip.y}
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        opacity="0.9"
                    />
                    {/* Counter-weight */}
                    <line
                        x1={CX} y1={CY}
                        x2={polar(needleDeg + 180, 16).x} y2={polar(needleDeg + 180, 16).y}
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        opacity="0.3"
                    />
                    {/* Tip glow */}
                    <circle cx={needleTip.x} cy={needleTip.y} r="5" fill="#22D3EE" filter="url(#dotGlow)" />
                </g>
            )}

            {/* Center hub */}
            <circle cx={CX} cy={CY} r="8" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <circle cx={CX} cy={CY} r="3" fill="#64748b" />

            {/* Speed readout */}
            <text x={CX} y={CY + 50} textAnchor="middle" fill="white"
                fontSize="52" fontWeight="700" fontFamily="system-ui" letterSpacing="-2">
                {displaySpeed > 0 ? fmt(animatedSpeed) : "—"}
            </text>
            <text x={CX} y={CY + 72} textAnchor="middle" fill="#64748b"
                fontSize="14" fontWeight="500" fontFamily="system-ui" letterSpacing="2">
                Mbps
            </text>
        </svg>
    );
}

// ── Main component ──────────────────────────────────

export default function SpeedTest() {
    const [phase, setPhase] = useState<TestPhase>("idle");
    const [results, setResults] = useState<TestResults>({ ping: null, download: null, upload: null });
    const [liveSpeed, setLiveSpeed] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => () => { abortRef.current?.abort(); }, []);

    // ── Ping ──
    const runPing = useCallback(async (signal: AbortSignal) => {
        const latencies: number[] = [];
        for (let i = 0; i < 8; i++) {
            const t = performance.now();
            await fetch(`https://speed.cloudflare.com/__down?bytes=0&_=${Date.now()}-${i}`, { signal, cache: "no-store", mode: "cors" });
            latencies.push(performance.now() - t);
        }
        // Drop first 3 (DNS + cold), median rest
        return median(latencies.slice(3));
    }, []);

    // ── Download ──
    const runDownload = useCallback(async (signal: AbortSignal) => {
        let totalBytes = 0, totalTime = 0;

        // Warmup
        const wt = performance.now();
        const wr = await fetch(`https://speed.cloudflare.com/__down?bytes=200000&_=${Date.now()}`, { signal, cache: "no-store", mode: "cors" });
        await wr.arrayBuffer();
        const warmMbps = (200000 * 8) / (((performance.now() - wt) / 1000) * 1e6);

        // Adaptive: pick chunk size & count for ~8-12s total test
        let chunk = 1_000_000, iters = 10;
        if (warmMbps > 15) { chunk = 5_000_000; iters = 10; }
        if (warmMbps > 50) { chunk = 10_000_000; iters = 8; }
        if (warmMbps > 150) { chunk = 25_000_000; iters = 6; }

        for (let i = 0; i < iters; i++) {
            if (signal.aborted) throw new DOMException("", "AbortError");
            const t = performance.now();
            const r = await fetch(`https://speed.cloudflare.com/__down?bytes=${chunk}&_=${Date.now()}-${i}`, { signal, cache: "no-store", mode: "cors" });
            const b = await r.arrayBuffer();
            totalBytes += b.byteLength;
            totalTime += (performance.now() - t) / 1000;
            setLiveSpeed((totalBytes * 8) / (totalTime * 1e6));
        }

        return (totalBytes * 8) / (totalTime * 1e6);
    }, []);

    // ── Upload ──
    const runUpload = useCallback(async (signal: AbortSignal) => {
        let totalBytes = 0, totalTime = 0;

        // Warmup
        const wd = generateRandomBytes(200_000);
        const wt = performance.now();
        await fetch("https://speed.cloudflare.com/__up", { method: "POST", body: wd.buffer as ArrayBuffer, signal, mode: "cors" });
        const warmMbps = (200_000 * 8) / (((performance.now() - wt) / 1000) * 1e6);

        let chunk = 500_000, iters = 10;
        if (warmMbps > 15) { chunk = 2_000_000; iters = 10; }
        if (warmMbps > 50) { chunk = 5_000_000; iters = 8; }
        if (warmMbps > 150) { chunk = 10_000_000; iters = 6; }

        for (let i = 0; i < iters; i++) {
            if (signal.aborted) throw new DOMException("", "AbortError");
            const d = generateRandomBytes(chunk);
            const t = performance.now();
            await fetch("https://speed.cloudflare.com/__up", { method: "POST", body: d.buffer as ArrayBuffer, signal, mode: "cors" });
            totalBytes += chunk;
            totalTime += (performance.now() - t) / 1000;
            setLiveSpeed((totalBytes * 8) / (totalTime * 1e6));
        }

        return (totalBytes * 8) / (totalTime * 1e6);
    }, []);

    const startTest = useCallback(async () => {
        const ctrl = new AbortController();
        abortRef.current = ctrl;
        setResults({ ping: null, download: null, upload: null });
        setLiveSpeed(null);
        setError(null);

        try {
            setPhase("ping");
            const ping = await runPing(ctrl.signal);
            setResults(p => ({ ...p, ping: Math.round(ping) }));

            setPhase("download");
            setLiveSpeed(null);
            const dl = await runDownload(ctrl.signal);
            setResults(p => ({ ...p, download: dl }));

            setPhase("upload");
            setLiveSpeed(null);
            const ul = await runUpload(ctrl.signal);
            setResults(p => ({ ...p, upload: ul }));

            setPhase("complete");
            setLiveSpeed(null);
        } catch (err) {
            if (err instanceof DOMException && err.name === "AbortError") {
                setPhase("idle");
            } else {
                setError("Speed test failed. Check your connection and try again.");
                setPhase("idle");
            }
        }
    }, [runPing, runDownload, runUpload]);

    const stopTest = useCallback(() => {
        abortRef.current?.abort();
        setPhase("idle");
        setLiveSpeed(null);
    }, []);

    const isRunning = phase !== "idle" && phase !== "complete";

    return (
        <div className="flex flex-col gap-5">
            {/* ── Dark panel ── */}
            <div className="relative rounded-2xl bg-[#0f172a] overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 via-transparent to-cyan-950/10" />

                <div className="relative flex flex-col items-center px-4 pt-8 pb-10">

                    {/* ── Top results row ── */}
                    {(isRunning || phase === "complete") && (
                        <div className="flex items-start justify-center gap-10 sm:gap-20 mb-4 animate-in fade-in duration-500">
                            <TopStat
                                icon={<Download className="w-4 h-4" />}
                                label="DOWNLOAD"
                                color="cyan"
                                value={results.download !== null ? fmt(results.download) : phase === "download" ? fmt(liveSpeed) : "—"}
                                active={phase === "download"}
                            />
                            <TopStat
                                icon={<Activity className="w-4 h-4" />}
                                label="PING"
                                color="amber"
                                value={results.ping !== null ? `${results.ping}` : "—"}
                                unit="ms"
                                active={phase === "ping"}
                            />
                            <TopStat
                                icon={<Upload className="w-4 h-4" />}
                                label="UPLOAD"
                                color="violet"
                                value={results.upload !== null ? fmt(results.upload) : phase === "upload" ? fmt(liveSpeed) : "—"}
                                active={phase === "upload"}
                            />
                        </div>
                    )}

                    {/* ── Progress bar ── */}
                    {isRunning && (
                        <div className="flex items-center gap-2 mb-3">
                            <Step label="Ping" active={phase === "ping"} done={phase !== "ping"} color="amber" />
                            <div className="w-5 h-px bg-slate-700" />
                            <Step label="Download" active={phase === "download"} done={phase === "upload"} color="cyan" />
                            <div className="w-5 h-px bg-slate-700" />
                            <Step label="Upload" active={phase === "upload"} done={false} color="violet" />
                        </div>
                    )}

                    {/* ── Gauge or idle ── */}
                    {isRunning || phase === "complete" ? (
                        <div className="w-full max-w-[420px]">
                            <SpeedGauge
                                speed={
                                    phase === "complete" ? (results.download ?? 0)
                                        : phase === "ping" ? null
                                            : liveSpeed
                                }
                                isActive={phase === "download" || phase === "upload" || phase === "complete"}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center py-20">
                            <Gauge className="w-16 h-16 text-slate-700 mb-4" strokeWidth={1.2} />
                            <p className="text-slate-500 text-sm font-medium tracking-wider uppercase">
                                Ready to test your speed
                            </p>
                        </div>
                    )}

                    {/* ── Ping ripple ── */}
                    {phase === "ping" && (
                        <div className="flex flex-col items-center -mt-4 mb-4">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-ping" />
                                <div className="absolute inset-3 rounded-full border border-cyan-400/15 animate-ping [animation-delay:300ms]" />
                                <Activity className="w-5 h-5 text-cyan-400" />
                            </div>
                            <span className="text-[11px] text-slate-500 mt-2 tracking-wide">Measuring latency...</span>
                        </div>
                    )}

                    {/* ── Phase label ── */}
                    {(phase === "download" || phase === "upload") && (
                        <div className="flex items-center gap-2 -mt-1 mb-3">
                            {phase === "download"
                                ? <Download className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                                : <Upload className="w-3.5 h-3.5 text-violet-400 animate-pulse" />}
                            <span className={cn(
                                "text-[11px] font-semibold tracking-[0.15em] uppercase",
                                phase === "download" ? "text-cyan-400" : "text-violet-400"
                            )}>
                                {phase === "download" ? "Measuring Download" : "Measuring Upload"}
                            </span>
                        </div>
                    )}
                    {phase === "complete" && (
                        <p className="text-[11px] text-emerald-400 font-semibold tracking-[0.15em] uppercase -mt-1 mb-3">
                            Test Complete
                        </p>
                    )}

                    {/* ── GO / STOP ── */}
                    <div className="mt-1">
                        {isRunning ? (
                            <button onClick={stopTest}
                                className="group w-[68px] h-[68px] rounded-full bg-red-500/10 border-2 border-red-400/40 flex items-center justify-center hover:border-red-400/70 hover:bg-red-500/20 active:scale-95 transition-all">
                                <Square className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
                            </button>
                        ) : (
                            <button onClick={startTest}
                                className="group w-[68px] h-[68px] rounded-full border-2 border-cyan-400/40 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 flex items-center justify-center hover:border-cyan-400/70 hover:from-cyan-500/25 hover:to-violet-500/25 active:scale-95 transition-all">
                                {phase === "complete"
                                    ? <RotateCcw className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                                    : <span className="text-xl font-extrabold text-cyan-400 group-hover:text-cyan-300 tracking-wider transition-colors">GO</span>}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Error ── */}
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
            )}

            {/* ── Bottom cards ── */}
            <div className="grid grid-cols-3 gap-3">
                <Card icon={<Activity className="w-4 h-4" />} label="PING" value={results.ping != null ? `${results.ping}` : "—"} unit="ms" accent="amber" active={phase === "ping"} />
                <Card icon={<Download className="w-4 h-4" />} label="DOWNLOAD" value={fmt(results.download)} unit="Mbps" accent="cyan" active={phase === "download"} />
                <Card icon={<Upload className="w-4 h-4" />} label="UPLOAD" value={fmt(results.upload)} unit="Mbps" accent="violet" active={phase === "upload"} />
            </div>
        </div>
    );
}

// ── Sub-components ──────────────────────────────────

function TopStat({ icon, label, color, value, unit = "Mbps", active }: {
    icon: React.ReactNode; label: string; color: string; value: string; unit?: string; active: boolean;
}) {
    const colors: Record<string, string> = { cyan: "text-cyan-400", amber: "text-amber-400", violet: "text-violet-400" };
    return (
        <div className="flex flex-col items-center min-w-[80px]">
            <div className={cn("flex items-center gap-1.5 mb-1", colors[color])}>
                {icon}
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase">{label}</span>
                <span className="text-[10px] text-slate-600 font-medium">{unit}</span>
            </div>
            <span className={cn(
                "text-2xl sm:text-3xl font-bold tabular-nums transition-all duration-300",
                active ? "text-white" : value === "—" ? "text-slate-600" : "text-white"
            )}>
                {value}
            </span>
        </div>
    );
}

function Step({ label, active, done, color }: { label: string; active: boolean; done: boolean; color: string }) {
    const dc: Record<string, string> = { amber: "bg-amber-400", cyan: "bg-cyan-400", violet: "bg-violet-400" };
    const tc: Record<string, string> = { amber: "text-amber-400", cyan: "text-cyan-400", violet: "text-violet-400" };
    return (
        <div className="flex items-center gap-1.5">
            <div className={cn("w-2 h-2 rounded-full transition-all duration-500",
                active && `${dc[color]} animate-pulse scale-125`,
                done && !active && "bg-emerald-500",
                !active && !done && "bg-slate-700"
            )} />
            <span className={cn("text-[10px] font-semibold tracking-wider uppercase transition-colors duration-500",
                active && tc[color],
                done && !active && "text-emerald-500",
                !active && !done && "text-slate-600"
            )}>{label}</span>
        </div>
    );
}

function Card({ icon, label, value, unit, accent, active }: {
    icon: React.ReactNode; label: string; value: string; unit: string; accent: string; active: boolean;
}) {
    const ac: Record<string, string> = { amber: "text-amber-500", cyan: "text-cyan-500", violet: "text-violet-500" };
    return (
        <div className={cn(
            "flex flex-col items-center gap-1.5 rounded-xl border p-4 sm:p-5 text-center transition-all duration-300",
            active ? "border-primary/20 bg-primary/5 shadow-sm" : "border-border/50 bg-card"
        )}>
            <div className={cn("flex items-center gap-1.5", active ? "text-primary" : "text-muted-foreground")}>
                {icon}
                <span className="text-[10px] font-bold tracking-[0.12em]">{label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
            </div>
            <span className={cn("text-2xl sm:text-3xl font-bold tabular-nums transition-colors duration-500", value === "—" ? "text-muted-foreground" : ac[accent])}>
                {value}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">{unit}</span>
        </div>
    );
}
