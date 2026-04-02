"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, FileText, Wrench } from "lucide-react";

interface SearchResult {
    type: "tool" | "blog";
    title: string;
    description: string;
    href: string;
}

export function SearchDialog() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const [allItems, setAllItems] = useState<SearchResult[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Lazy-load search data only when dialog opens
    useEffect(() => {
        if (open && allItems.length === 0) {
            Promise.all([
                import("@/lib/tools-data").then((m) => m.toolsData),
                import("@/lib/blog-data").then((m) => m.blogPosts),
            ]).then(([tools, blogs]) => {
                setAllItems([
                    ...tools.map((t) => ({
                        type: "tool" as const,
                        title: t.name,
                        description: t.description,
                        href: `/${t.category}/${t.slug}`,
                    })),
                    ...blogs.map((p) => ({
                        type: "blog" as const,
                        title: p.title,
                        description: p.excerpt,
                        href: `/blog/${p.slug}`,
                    })),
                ]);
            });
        }
    }, [open, allItems.length]);

    const results = query.trim()
        ? allItems.filter(
              (item) =>
                  item.title.toLowerCase().includes(query.toLowerCase()) ||
                  item.description.toLowerCase().includes(query.toLowerCase())
          ).slice(0, 8)
        : [];

    const close = useCallback(() => {
        setOpen(false);
        setQuery("");
        setActiveIndex(0);
    }, []);

    // Keyboard shortcut: Cmd+K / Ctrl+K
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
            if (e.key === "Escape") close();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [close]);

    // Focus input + toggle body class when opened
    useEffect(() => {
        if (open) {
            document.documentElement.classList.add("search-open");
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            document.documentElement.classList.remove("search-open");
        }
    }, [open]);

    // Arrow key navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter" && results[activeIndex]) {
            e.preventDefault();
            router.push(results[activeIndex].href);
            close();
        }
    };

    const navigate = (href: string) => {
        router.push(href);
        close();
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setOpen(true)}
                aria-label="Search tools and blog posts"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 text-white/60 text-sm hover:bg-white/10 hover:text-white/80 transition-all"
            >
                <Search className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/10 border border-white/10 text-white/40 ml-1">
                    ⌘K
                </kbd>
            </button>

            {/* Overlay + Dialog */}
            {open && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] isolate">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={close}
                    />

                    {/* Dialog */}
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Search"
                        className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl border border-border/60 overflow-hidden animate-fade-in-up"
                    >
                        {/* Search Input */}
                        <div className="flex items-center gap-3 px-4 border-b border-border/60">
                            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setActiveIndex(0);
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="Search tools and blog posts..."
                                aria-label="Search"
                                className="flex-1 py-4 text-base outline-none bg-transparent placeholder:text-muted-foreground/60"
                            />
                            <button
                                onClick={close}
                                aria-label="Close search"
                                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Results */}
                        <div className="max-h-[50vh] overflow-y-auto">
                            {query.trim() && results.length === 0 && (
                                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                                    No results found for &ldquo;{query}&rdquo;
                                </div>
                            )}

                            {results.length > 0 && (
                                <div className="py-2">
                                    {results.map((result, i) => (
                                        <button
                                            key={result.href}
                                            onClick={() => navigate(result.href)}
                                            onMouseEnter={() => setActiveIndex(i)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                                                i === activeIndex
                                                    ? "bg-primary/5"
                                                    : "hover:bg-muted/30"
                                            }`}
                                        >
                                            <div
                                                className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                                                    result.type === "tool"
                                                        ? "bg-primary/10 text-primary"
                                                        : "bg-amber-500/10 text-amber-600"
                                                }`}
                                            >
                                                {result.type === "tool" ? (
                                                    <Wrench className="h-4 w-4" />
                                                ) : (
                                                    <FileText className="h-4 w-4" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-foreground truncate">
                                                    {result.title}
                                                </div>
                                                <div className="text-xs text-muted-foreground truncate">
                                                    {result.description}
                                                </div>
                                            </div>
                                            <ArrowRight
                                                className={`h-4 w-4 shrink-0 transition-opacity ${
                                                    i === activeIndex
                                                        ? "opacity-100 text-primary"
                                                        : "opacity-0"
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Empty state — show popular when no query */}
                            {!query.trim() && (
                                <div className="py-2">
                                    <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Popular Tools
                                    </p>
                                    {allItems
                                        .filter((i) => i.type === "tool")
                                        .slice(0, 5)
                                        .map((result, i) => (
                                            <button
                                                key={result.href}
                                                onClick={() => navigate(result.href)}
                                                onMouseEnter={() => setActiveIndex(i)}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-muted/30 transition-colors"
                                            >
                                                <div className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                                                    <Wrench className="h-3.5 w-3.5" />
                                                </div>
                                                <span className="text-sm text-foreground">
                                                    {result.title}
                                                </span>
                                            </button>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border/60 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">↑↓</kbd>
                                navigate
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">↵</kbd>
                                open
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">esc</kbd>
                                close
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
