import Link from "next/link";
import { CATEGORIES, getToolsByCategory, ToolCategory } from "@/lib/tools-data";
import {
  ArrowRight,
  Sparkles,
  Code2,
  Type,
  Shield,
  Zap,
  Gift,
  Globe,
  Newspaper,
  Wifi,
  Wrench,
  ArrowUpRight,
} from "lucide-react";

const CategoryIcon = ({ category }: { category: ToolCategory }) => {
  if (category === "text-tools") return <Type className="h-5 w-5" />;
  if (category === "developer-tools") return <Code2 className="h-5 w-5" />;
  if (category === "network-tools") return <Wifi className="h-5 w-5" />;
  return <Wrench className="h-5 w-5" />;
};

const STATS = [
  { value: "20+", label: "Free Tools", icon: Wrench },
  { value: "100%", label: "Client-Side", icon: Shield },
  { value: "0", label: "Data Sent", icon: Globe },
  { value: "∞", label: "Usage Limit", icon: Zap },
];

const FEATURES = [
  {
    icon: Shield,
    title: "Privacy First",
    description: "Every tool processes data locally in your browser. Nothing is sent to any server — your data stays yours.",
    color: "#003F87",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "No server round-trips mean instant results. Our tools respond in milliseconds, not seconds.",
    color: "#0059B3",
  },
  {
    icon: Gift,
    title: "Free Forever",
    description: "No premium tiers, no signup walls, no hidden fees. All tools are completely free to use with no limits.",
    color: "#00D4FF",
  },
];

const BLOG_POSTS = [
  {
    title: "What Is Agentic AI? The Rise of AI Agents in 2026",
    excerpt: "Agentic AI is redefining how software operates — autonomous AI agents can now plan, reason, and execute multi-step tasks without human intervention.",
    tag: "AI Trends",
    readTime: "9 min read",
    slug: "what-is-agentic-ai",
    heroImage: "/blog/agentic-ai-hero.png",
  },
  {
    title: "10 Best AI Coding Tools in 2026",
    excerpt: "From Cursor to GitHub Copilot — AI code generation tools have evolved from autocomplete to autonomous development agents. Here are the best ones.",
    tag: "AI Coding",
    readTime: "11 min read",
    slug: "best-ai-coding-tools-2026",
    heroImage: "/blog/ai-coding-tools-hero.png",
  },
  {
    title: "ChatGPT vs Claude vs Perplexity: Which Is Best?",
    excerpt: "An in-depth comparison of the three dominant AI assistants covering features, pricing, accuracy, and real-world use cases for 2026.",
    tag: "AI Comparison",
    readTime: "12 min read",
    slug: "chatgpt-vs-claude-vs-perplexity-2026",
    heroImage: "/blog/ai-comparison-hero.png",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-0 -mt-6 md:-mt-10">

      {/* ===== HERO SECTION ===== */}
      <section className="animated-grid-bg relative overflow-hidden py-10 md:py-16 lg:py-20 px-4">
        {/* Decorative orbs */}
        <div className="absolute top-10 left-[10%] w-96 h-96 rounded-full opacity-[0.07] blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #003F87, transparent)" }} />
        <div className="absolute bottom-10 right-[10%] w-[500px] h-[500px] rounded-full opacity-[0.05] blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #00D4FF, transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03] blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #0059B3, transparent)" }} />

        <div className="relative z-10 max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">

            {/* Left Column: Text Content */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-2 border shadow-sm mb-5 opacity-0 animate-fade-in-up"
                style={{ borderColor: "rgba(0, 212, 255, 0.3)", background: "rgba(0, 212, 255, 0.06)" }}>
                <Sparkles className="h-4 w-4" style={{ color: "#00D4FF" }} />
                <span className="text-muted-foreground">Your Free Developer Toolkit</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-6xl font-extrabold tracking-tight leading-[1.12] opacity-0 animate-fade-in-up stagger-1">
                <span style={{ color: "#0f172a" }}>Free Online </span>
                <span className="gradient-text">Developer Tools</span>
                <span style={{ color: "#0f172a" }}> & </span>
                <span className="gradient-text">Resources</span>
              </h1>

              <p className="mt-4 max-w-xl text-base md:text-lg leading-relaxed text-muted-foreground opacity-0 animate-fade-in-up stagger-2">
                Explore 20+ free online tools for text processing, code formatting, network testing,
                and developer utilities — all running 100% in your browser.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-7 opacity-0 animate-fade-in-up stagger-3">
                <Link
                  href="#tools"
                  className="shimmer-btn inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #003F87 0%, #0059B3 50%, #006BD6 100%)",
                    boxShadow: "0 4px 24px rgba(0, 63, 135, 0.3)",
                  }}
                >
                  <Wrench className="h-4 w-4" />
                  Explore All Tools
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold border-2 transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-md bg-white"
                  style={{ borderColor: "#003F87", color: "#003F87" }}
                >
                  <Newspaper className="h-4 w-4" />
                  Read the Blog
                </Link>
              </div>

              {/* Trust Row */}
              <div className="flex flex-wrap items-center gap-4 mt-7 opacity-0 animate-fade-in-up stagger-4">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Shield className="h-3.5 w-3.5" style={{ color: "#003F87" }} />
                  100% Client-Side
                </div>
                <div className="w-px h-3 bg-border" />
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Zap className="h-3.5 w-3.5" style={{ color: "#003F87" }} />
                  Lightning Fast
                </div>
                <div className="w-px h-3 bg-border" />
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Gift className="h-3.5 w-3.5" style={{ color: "#003F87" }} />
                  Free Forever
                </div>
              </div>
            </div>

            {/* Right Column: Visual Panel */}
            <div className="hidden lg:flex flex-col items-center justify-center relative opacity-0 animate-fade-in-up stagger-3">

              {/* Floating tool badges */}
              <div className="absolute -top-2 left-4 z-20 animate-float">
                <div className="glass-card rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs font-semibold shadow-lg">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #003F87, #0059B3)" }}>
                    <Code2 className="h-3.5 w-3.5 text-white" />
                  </div>
                  JSON Formatter
                </div>
              </div>

              <div className="absolute -top-3 right-8 z-20 animate-float" style={{ animationDelay: "1s" }}>
                <div className="glass-card rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs font-semibold shadow-lg">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0059B3, #00D4FF)" }}>
                    <Code2 className="h-3.5 w-3.5 text-white" />
                  </div>
                  Regex Tester
                </div>
              </div>

              <div className="absolute bottom-4 left-0 z-20 animate-float" style={{ animationDelay: "2s" }}>
                <div className="glass-card rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs font-semibold shadow-lg">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00D4FF, #003F87)" }}>
                    <Type className="h-3.5 w-3.5 text-white" />
                  </div>
                  Word Counter
                </div>
              </div>

              <div className="absolute bottom-8 right-2 z-20 animate-float" style={{ animationDelay: "3s" }}>
                <div className="glass-card rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs font-semibold shadow-lg">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #003F87, #006BD6)" }}>
                    <Shield className="h-3.5 w-3.5 text-white" />
                  </div>
                  Base64 Encoder
                </div>
              </div>

              {/* Main visual card */}
              <div className="relative w-full max-w-md">
                <div className="rounded-2xl border overflow-hidden shadow-xl" style={{
                  borderColor: "rgba(0, 63, 135, 0.15)",
                  background: "linear-gradient(135deg, #001a3a 0%, #003F87 40%, #002a5c 100%)",
                }}>
                  {/* Title bar */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                      <div className="w-3 h-3 rounded-full bg-green-400/80" />
                    </div>
                    <div className="flex-1 text-center text-xs text-white/40 font-mono">devpik.com</div>
                  </div>

                  {/* Content area */}
                  <div className="p-5 space-y-3.5">
                    {/* Tool cards inside */}
                    <div className="rounded-xl p-3.5 border border-white/10 bg-white/5 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #00D4FF33, #003F8733)" }}>
                        <Code2 className="h-4 w-4 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white">JSON Formatter</div>
                        <div className="text-[11px] text-white/40">Format, validate & beautify JSON</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-white/30 shrink-0" />
                    </div>

                    <div className="rounded-xl p-3.5 border border-white/10 bg-white/5 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #00D4FF33, #003F8733)" }}>
                        <Type className="h-4 w-4 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white">Word Counter</div>
                        <div className="text-[11px] text-white/40">Count words, characters & sentences</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-white/30 shrink-0" />
                    </div>

                    <div className="rounded-xl p-3.5 border border-white/10 bg-white/5 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #00D4FF33, #003F8733)" }}>
                        <Wifi className="h-4 w-4 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white">DNS Lookup</div>
                        <div className="text-[11px] text-white/40">Query DNS records instantly</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-white/30 shrink-0" />
                    </div>

                    {/* Stats mini row */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div className="rounded-lg bg-white/5 border border-white/10 p-2.5 text-center">
                        <div className="text-lg font-bold text-cyan-400">18+</div>
                        <div className="text-[9px] text-white/40 font-medium">Tools</div>
                      </div>
                      <div className="rounded-lg bg-white/5 border border-white/10 p-2.5 text-center">
                        <div className="text-lg font-bold text-cyan-400">0</div>
                        <div className="text-[9px] text-white/40 font-medium">Data Sent</div>
                      </div>
                      <div className="rounded-lg bg-white/5 border border-white/10 p-2.5 text-center">
                        <div className="text-lg font-bold text-cyan-400">∞</div>
                        <div className="text-[9px] text-white/40 font-medium">Free Uses</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glow behind card */}
                <div className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl pointer-events-none -z-10" style={{ background: "linear-gradient(135deg, #003F87, #00D4FF)" }} />
              </div>
            </div>
          </div>

          {/* Mobile Stats Bar (shows only on mobile/tablet) */}
          <div className="lg:hidden mt-10 opacity-0 animate-fade-in-up stagger-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STATS.map((stat) => (
                <div key={stat.label} className="stat-card glass-card rounded-xl p-4 text-center transition-all hover:scale-[1.03]">
                  <stat.icon className="h-5 w-5 mx-auto mb-2" style={{ color: "#00D4FF" }} />
                  <div className="text-2xl font-extrabold tracking-tight gradient-text">{stat.value}</div>
                  <div className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TOOLS SHOWCASE ===== */}
      <section id="tools" className="py-16 md:py-20 scroll-mt-20">
        {Object.entries(CATEGORIES).map(([category, { name, description }]) => {
          const cat = category as ToolCategory;
          const tools = getToolsByCategory(cat);

          return (
            <div key={category} className="mb-14 last:mb-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl shadow-sm" style={{
                  background: "linear-gradient(135deg, #003F87 0%, #0059B3 100%)",
                  boxShadow: "0 4px 16px rgba(0, 63, 135, 0.2)",
                }}>
                  <CategoryIcon category={cat} />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{name}</h2>
                  <p className="text-muted-foreground text-sm">{description}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/${category}/${tool.slug}`}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/60 bg-card p-6 tool-card-hover gradient-border"
                    style={{ boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="z-10 flex flex-col gap-2">
                      <h3 className="font-bold leading-none tracking-tight group-hover:text-primary transition-colors text-base">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                    <div className="z-10 mt-4 flex items-center text-sm font-semibold" style={{ color: "#003F87" }}>
                      Launch Tool
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* ===== BLOG PREVIEW ===== */}
      <section className="py-16 md:py-20">
        <div className="section-divider mb-14" />

        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Latest Developer Insights</h2>
            <p className="text-muted-foreground mt-2 text-base">
              Practical guides, tutorials, and deep dives into the tools and concepts developers use every day.
            </p>
          </div>
          <Link href="/blog" className="hidden md:flex items-center gap-1.5 text-sm font-semibold hover:gap-2.5 transition-all" style={{ color: "#003F87" }}>
            View All Posts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group relative glass-card rounded-xl overflow-hidden tool-card-hover"
            >
              {/* Card hero image */}
              <div className="h-40 relative overflow-hidden">
                <img
                  src={post.heroImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.4) 100%)" }} />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white/90"
                    style={{ background: "rgba(0, 63, 135, 0.7)", backdropFilter: "blur(8px)" }}>
                    {post.tag}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-base tracking-tight leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  <span className="text-xs font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all" style={{ color: "#003F87" }}>
                    Read More
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="md:hidden mt-6 text-center">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "#003F87" }}>
            View All Posts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ===== WHY DEVPIK ===== */}
      <section className="py-16 md:py-20">
        <div className="section-divider mb-14" />

        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Why DevPik?</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto text-base">
            Built by developers, for developers. Here&apos;s why thousands trust DevPik for their daily toolkit.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="glass-card rounded-2xl p-7 text-center transition-all hover:scale-[1.02] group"
            >
              <div className="mx-auto w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all group-hover:scale-110 group-hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${feature.color}15, ${feature.color}08)`,
                  border: `1px solid ${feature.color}20`,
                }}>
                <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
              </div>
              <h3 className="font-bold text-lg tracking-tight mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SEO CONTENT SECTION ===== */}
      <section className="py-16 md:py-20">
        <div className="section-divider mb-14" />

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-6">
            The Ultimate Platform for Free Developer Tools
          </h2>

          <div className="prose prose-slate max-w-none text-muted-foreground space-y-4 text-sm md:text-base leading-relaxed">
            <p>
              <strong className="text-foreground">DevPik</strong> is your one-stop destination for
              <strong className="text-foreground"> free online developer tools</strong>, text utilities, and practical tech insights.
              Whether you&apos;re a software developer, content creator, student, or tech professional, our platform provides
              everything you need to work smarter and more efficiently.
            </p>

            <p>
              Our collection of <strong className="text-foreground">free online tools</strong> includes essential utilities for text processing —
              word counters, case converters, markdown converters, and Lorem Ipsum generators. For developers, we offer JSON formatters,
              regex testers, Base64 encoders, JWT decoders, UUID generators, HTML minifiers, Mermaid diagram converters, unit converters,
              and color code converters. Every tool runs 100% client-side with zero data sent to servers, ensuring maximum privacy and speed.
            </p>

            <p>
              For network and infrastructure work, DevPik provides <strong className="text-foreground">DNS lookup</strong>,
              <strong className="text-foreground"> IP address tools</strong>, and other network utilities that run directly in your browser.
              Our blog features in-depth tutorials, comparisons, and practical guides covering developer workflows, tooling,
              and the latest technology trends that matter most to modern professionals.
            </p>

            <p>
              Join thousands of developers and creators who rely on DevPik as their daily toolkit. All our tools are free forever,
              require no signup, and prioritize your privacy. Start exploring today and discover why DevPik is the ultimate
              online toolkit for developers and creators.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
