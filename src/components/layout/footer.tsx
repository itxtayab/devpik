import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, getToolsByCategory, ToolCategory } from "@/lib/tools-data";
import { Mail, Github, Twitter, Linkedin, ArrowRight, Zap } from "lucide-react";
import { NewsletterForm } from "@/components/NewsletterForm";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative mt-16">
            {/* Gradient top border */}
            <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #003F87, #00D4FF, #003F87, transparent)" }} />

            {/* Newsletter Banner */}
            <div className="w-full" style={{ background: "linear-gradient(135deg, #001a3a 0%, #003F87 50%, #002a5c 100%)" }}>
                <div className="mx-auto max-w-screen-2xl px-4 md:px-8 py-10 md:py-14">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 justify-center md:justify-start">
                                <Zap className="h-5 w-5 text-cyan-400" />
                                Stay Ahead with Developer Insights
                            </h3>
                            <p className="text-white/60 mt-1.5 text-sm md:text-base max-w-md">
                                Get the latest developer resources, tool updates, and technology insights delivered to your inbox.
                            </p>
                        </div>
                        <NewsletterForm source="footer" />
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="bg-slate-50 border-t border-border/40">
                <div className="mx-auto max-w-screen-2xl px-4 md:px-8 py-12 md:py-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12">

                        {/* Brand Column */}
                        <div className="col-span-2 md:col-span-1 lg:col-span-2">
                            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
                                <div className="relative h-9 w-9 overflow-hidden rounded-lg shrink-0 transition-transform group-hover:scale-110">
                                    <Image src="/logo.png" alt="DevPik" fill className="object-contain" />
                                </div>
                                <span className="font-extrabold text-lg tracking-tight">
                                    <span className="gradient-text">Dev</span>
                                    <span className="text-foreground">Pik</span>
                                </span>
                            </Link>
                            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-5">
                                Your go-to platform for free developer tools, text utilities, and practical tech insights. All tools run 100% client-side — your data never leaves your browser.
                            </p>
                            <div className="flex items-center gap-3">
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 hover:shadow-md transition-all">
                                    <Twitter className="h-4 w-4" />
                                </a>
                                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 hover:shadow-md transition-all">
                                    <Github className="h-4 w-4" />
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 hover:shadow-md transition-all">
                                    <Linkedin className="h-4 w-4" />
                                </a>
                                <a href="mailto:founders@mergemain.com" className="p-2 rounded-lg bg-white border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 hover:shadow-md transition-all">
                                    <Mail className="h-4 w-4" />
                                </a>
                            </div>
                        </div>

                        {/* Tools Column */}
                        <div>
                            <h4 className="font-bold text-sm tracking-tight mb-4 text-foreground">Tools</h4>
                            <ul className="space-y-2.5">
                                {Object.entries(CATEGORIES).map(([category, { name }]) => (
                                    <li key={category}>
                                        <Link href={`/${category}`} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                                            {name}
                                            <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                                        All Tools
                                        <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Resources Column */}
                        <div>
                            <h4 className="font-bold text-sm tracking-tight mb-4 text-foreground">Resources</h4>
                            <ul className="space-y-2.5">
                                <li>
                                    <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                                        Blog
                                        <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                                        About Us
                                        <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                                        Contact
                                        <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Legal Column */}
                        <div>
                            <h4 className="font-bold text-sm tracking-tight mb-4 text-foreground">Legal</h4>
                            <ul className="space-y-2.5">
                                <li>
                                    <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        Terms of Service
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/disclaimer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        Disclaimer
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="section-divider mt-10 mb-6" />
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                        <p className="text-xs text-muted-foreground">
                            © {currentYear} DevPik. All rights reserved. Built with ❤️ for developers & creators.
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Free developer tools, text utilities, and technology insights.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
