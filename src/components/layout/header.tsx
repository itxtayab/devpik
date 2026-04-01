"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { CATEGORIES, getToolsByCategory, ToolCategory } from "@/lib/tools-data";

export function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <div className={`flex items-center justify-center w-full px-4 md:px-8 py-3 sticky top-0 z-50 transition-all duration-300 ${scrolled ? "header-scrolled" : ""}`}>
                <header className="w-full max-w-screen-2xl flex items-center justify-between pointer-events-none">

                    {/* Left: Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 pointer-events-auto rounded-full px-3 py-2 shadow-md border border-border/30 backdrop-blur-md bg-white/80 transition-all hover:shadow-lg hover:bg-white/95 group"
                    >
                        <div className="relative h-8 w-8 overflow-hidden rounded-md shrink-0 transition-transform group-hover:scale-110">
                            <Image src="/logo_main.png" alt="DevPik Logo" fill className="object-contain" />
                        </div>
                        <span className="font-extrabold tracking-tight text-base hidden sm:inline-flex whitespace-nowrap gap-0">
                            <span className="gradient-text">Dev</span>
                            <span className="text-foreground ml-0.5">Pik</span>
                        </span>
                    </Link>

                    {/* Center: Desktop navigation */}
                    <nav
                        className="hidden md:flex items-center justify-center gap-0.5 text-sm font-semibold rounded-full px-2 h-11 border border-white/25 backdrop-blur-md pointer-events-auto"
                        style={{
                            background: "linear-gradient(135deg, #001a3a 0%, #003F87 40%, #0059B3 70%, #006BD6 100%)",
                            boxShadow: "0 4px 24px rgba(0, 63, 135, 0.35), 0 0 0 1px rgba(255,255,255,0.08) inset, 0 0 40px rgba(0, 212, 255, 0.08)",
                        }}
                    >
                        <Link href="/" className="text-white/80 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/10">
                            Home
                        </Link>

                        {Object.entries(CATEGORIES).map(([category, { name }]) => {
                            const cat = category as ToolCategory;
                            const tools = getToolsByCategory(cat);

                            return (
                                <div key={category} className="group relative h-full flex items-center">
                                    <Link
                                        href={`/${category}`}
                                        className="flex items-center gap-1 text-white/80 hover:text-white transition-colors cursor-pointer h-full px-3 py-1.5 rounded-full hover:bg-white/10"
                                    >
                                        {name}
                                        <ChevronDown className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
                                    </Link>
                                    <div className="absolute left-1/2 -translate-x-1/2 top-full hidden w-[260px] group-hover:block transition-all pt-2">
                                        <div className="rounded-2xl glass-card shadow-xl p-2 border border-border/40">
                                            <div className="grid gap-0.5">
                                                {tools.map((tool) => (
                                                    <Link
                                                        key={tool.slug}
                                                        href={`/${category}/${tool.slug}`}
                                                        className="block rounded-xl p-2.5 text-sm leading-none transition-all hover:bg-primary/5 group/item"
                                                    >
                                                        <div className="font-medium text-foreground group-hover/item:text-primary transition-colors">{tool.name}</div>
                                                        <div className="mt-1.5 line-clamp-1 text-[11px] text-muted-foreground">{tool.description}</div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <Link href="/blog" className="text-white/80 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/10 flex items-center gap-1.5">
                            Blog
                        </Link>

                        <Link href="/about" className="text-white/80 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/10">
                            About
                        </Link>

                    </nav>

                    {/* Right: Mobile Toggle */}
                    <div className="flex items-center justify-end gap-2 pointer-events-auto">
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2.5 rounded-full border border-white/25 backdrop-blur-md transition-all text-white hover:shadow-lg"
                            style={{
                                background: "linear-gradient(135deg, #001a3a 0%, #003F87 50%, #006BD6 100%)",
                                boxShadow: "0 4px 20px rgba(0, 63, 135, 0.35)",
                            }}
                            aria-label="Toggle navigation menu"
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>

                </header>
            </div>

            {/* Mobile Nav Drawer */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 top-[68px] z-40 bg-background/98 backdrop-blur-xl overflow-y-auto">
                    <nav className="flex flex-col gap-1 p-5 max-w-lg mx-auto">
                        <Link
                            href="/"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all hover:bg-primary/8 hover:text-primary"
                        >
                            Home
                        </Link>

                        {Object.entries(CATEGORIES).map(([category, { name }]) => {
                            const cat = category as ToolCategory;
                            const tools = getToolsByCategory(cat);

                            return (
                                <div key={category} className="flex flex-col">
                                    <Link
                                        href={`/${category}`}
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center gap-2 px-4 py-3.5 rounded-xl text-base font-semibold transition-all hover:bg-primary/8 hover:text-primary"
                                    >
                                        {name}
                                    </Link>
                                    <div className="flex flex-col gap-0.5 ml-4 pl-4 border-l-2 border-primary/15">
                                        {tools.map((tool) => (
                                            <Link
                                                key={tool.slug}
                                                href={`/${category}/${tool.slug}`}
                                                onClick={() => setMobileOpen(false)}
                                                className="block rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-primary/8 hover:text-primary"
                                            >
                                                <span className="font-medium text-foreground">{tool.name}</span>
                                                <span className="block mt-0.5 text-xs text-muted-foreground line-clamp-1">{tool.description}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        <Link
                            href="/blog"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all hover:bg-primary/8 hover:text-primary"
                        >
                            Blog
                        </Link>

                        <Link
                            href="/about"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all hover:bg-primary/8 hover:text-primary"
                        >
                            About
                        </Link>

                    </nav>
                </div>
            )}
        </>
    );
}
