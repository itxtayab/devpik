import type { Metadata } from "next";
import Link from "next/link";
import { Home, Search, ArrowRight, Wrench, Newspaper } from "lucide-react";

export const metadata: Metadata = {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist. Browse our free developer tools or read our latest blog posts.",
    robots: { index: false, follow: true },
};

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 max-w-2xl mx-auto">
            <div className="space-y-4">
                <h1 className="text-7xl font-bold tracking-tighter text-primary/20">404</h1>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Page Not Found
                </h2>
                <p className="text-muted-foreground text-lg">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 w-full">
                <Link
                    href="/"
                    className="flex flex-col items-center gap-2 p-6 rounded-xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-md transition-all group"
                >
                    <Home className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-semibold text-sm">Home</span>
                </Link>
                <Link
                    href="/developer-tools"
                    className="flex flex-col items-center gap-2 p-6 rounded-xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-md transition-all group"
                >
                    <Wrench className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-semibold text-sm">Developer Tools</span>
                </Link>
                <Link
                    href="/blog"
                    className="flex flex-col items-center gap-2 p-6 rounded-xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-md transition-all group"
                >
                    <Newspaper className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-semibold text-sm">Blog</span>
                </Link>
            </div>

            <div className="space-y-3 w-full">
                <p className="text-sm text-muted-foreground font-medium">Popular Tools</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {[
                        { name: "JSON Formatter", href: "/developer-tools/json-formatter" },
                        { name: "Base64 Encoder", href: "/developer-tools/base64-encode-decode" },
                        { name: "Word Counter", href: "/text-tools/word-counter" },
                        { name: "Code Share", href: "/developer-tools/code-share" },
                        { name: "UUID Generator", href: "/developer-tools/uuid-generator" },
                    ].map((tool) => (
                        <Link
                            key={tool.href}
                            href={tool.href}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-full border border-border/60 hover:border-primary/30 hover:text-primary transition-all"
                        >
                            {tool.name}
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
