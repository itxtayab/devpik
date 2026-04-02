import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost, getAllBlogSlugs } from "@/lib/blog-data";
import { toolsData } from "@/lib/tools-data";
import {
    StructuredData,
    generateBreadcrumbSchema,
    generateFAQSchema,
} from "@/components/seo/StructuredData";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { ArrowLeft, Clock, Calendar, User, ChevronRight, ExternalLink } from "lucide-react";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";

// Fetch blog from Supabase by slug (pure fetch to avoid static-to-dynamic cookie error)
interface BlogPostData {
    slug: string;
    title: string;
    metaTitle: string;
    metaDescription: string;
    excerpt: string;
    heroImage: string;
    publishedAt: string;
    updatedAt: string;
    author: string;
    readingTime: string;
    tags: string[];
    relatedToolSlugs: string[];
    content: { heading: string; body: string }[];
    faqs: { question: string; answer: string }[];
}

async function getSupabaseBlog(slug: string): Promise<BlogPostData | null> {
    try {
        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/blogs?slug=eq.${encodeURIComponent(slug)}&is_published=eq.true&select=*`;
        const res = await fetch(url, {
            headers: {
                apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
            },
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        const rows = await res.json();
        const data = rows?.[0];

        if (!data) return null;

        return {
            slug: data.slug,
            title: data.title,
            metaTitle: data.meta_title || data.title,
            metaDescription: data.meta_description || data.excerpt || "",
            excerpt: data.excerpt || "",
            heroImage: data.hero_image || "/images/blog/default.webp",
            publishedAt: data.published_at,
            updatedAt: data.updated_at,
            author: data.author || "DevPik Team",
            readingTime: data.reading_time || "5 min read",
            tags: data.tags || [],
            relatedToolSlugs: data.related_tool_slugs || [],
            content: data.content || [],
            faqs: data.faqs || [],
        };
    } catch {
        return null;
    }
}

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const { slug } = await props.params;
    const post = getBlogPost(slug) || await getSupabaseBlog(slug);
    if (!post) return {};

    return {
        title: post.metaTitle,
        description: post.metaDescription,
        alternates: { canonical: `https://www.devpik.com/blog/${post.slug}` },
        openGraph: {
            title: post.metaTitle,
            description: post.metaDescription,
            url: `https://www.devpik.com/blog/${post.slug}`,
            type: "article",
            publishedTime: post.publishedAt,
            modifiedTime: post.updatedAt,
            authors: [post.author],
            images: [
                {
                    url: `https://www.devpik.com${post.heroImage}`,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
    };
}

export default async function BlogPostPage(props: Props) {
    const { slug } = await props.params;
    const post = getBlogPost(slug) || await getSupabaseBlog(slug);
    if (!post) notFound();

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: "Home", url: "https://www.devpik.com" },
        { name: "Blog", url: "https://www.devpik.com/blog" },
        { name: post.title, url: `https://www.devpik.com/blog/${post.slug}` },
    ]);

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.metaDescription,
        image: `https://www.devpik.com${post.heroImage}`,
        url: `https://www.devpik.com/blog/${post.slug}`,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: {
            "@type": "Organization",
            name: "DevPik",
            url: "https://www.devpik.com",
        },
        publisher: {
            "@type": "Organization",
            name: "DevPik",
            url: "https://www.devpik.com",
            logo: {
                "@type": "ImageObject",
                url: "https://www.devpik.com/logo.png",
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://www.devpik.com/blog/${post.slug}`,
        },
        keywords: post.tags.join(", "),
        wordCount: post.content.reduce((acc, section) => acc + section.body.split(/\s+/).length, 0),
        articleSection: post.tags[0] || "Technology",
        inLanguage: "en-US",
    };

    const faqSchema =
        post.faqs.length > 0 ? generateFAQSchema(post.faqs) : null;

    // Get related tool data
    const relatedTools = post.relatedToolSlugs
        .map((ts) => toolsData.find((t) => t.slug === ts))
        .filter(Boolean);

    // Table of contents from content headings
    const toc = post.content.map((section, index) => ({
        id: `section-${index}`,
        title: section.heading,
    }));

    return (
        <div className="pb-16">
            <StructuredData data={breadcrumbSchema} />
            <StructuredData data={articleSchema} />
            {faqSchema && <StructuredData data={faqSchema} />}
            <PageViewTracker path={`/blog/${post.slug}`} />

            {/* Hero Section */}
            <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#001a3d] via-[#002a5c] to-[#003F87] -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12 mb-10">
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                        }}
                    />
                </div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-10 md:py-16">
                    {/* Breadcrumbs */}
                    <nav
                        aria-label="Breadcrumb"
                        className="text-sm text-white/80 mb-6"
                    >
                        <ol className="flex items-center gap-1.5 flex-wrap">
                            <li>
                                <Link
                                    href="/"
                                    className="hover:text-white transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <ChevronRight className="h-3.5 w-3.5 inline" />
                            </li>
                            <li>
                                <Link
                                    href="/blog"
                                    className="hover:text-white transition-colors"
                                >
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <ChevronRight className="h-3.5 w-3.5 inline" />
                            </li>
                            <li className="text-white/80 font-medium line-clamp-1">
                                {post.title}
                            </li>
                        </ol>
                    </nav>

                    <div className="grid md:grid-cols-[1fr_280px] gap-8 items-center">
                        <div className="space-y-5">
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white/90 backdrop-blur-sm border border-white/10"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-white">
                                {post.title}
                            </h1>

                            <p className="text-base md:text-lg text-white/80 leading-relaxed">
                                {post.excerpt}
                            </p>

                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-white/75 pt-2">
                                <span className="flex items-center gap-1.5">
                                    <User className="h-4 w-4" />
                                    {post.author}
                                </span>
                                <span className="h-4 w-px bg-white/20" />
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(
                                        post.publishedAt
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                                <span className="h-4 w-px bg-white/20" />
                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    {post.readingTime}
                                </span>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="hidden md:block relative">
                            <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/30">
                                <Image
                                    src={post.heroImage}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="280px"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto grid lg:grid-cols-[1fr_220px] gap-10">
                {/* Article Body */}
                <div className="min-w-0">
                    {/* Back Link */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Blog
                    </Link>

                    {/* Mobile Hero Image */}
                    <div className="md:hidden mb-8 relative w-full aspect-video rounded-xl overflow-hidden border border-border/60">
                        <Image
                            src={post.heroImage}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 768px"
                        />
                    </div>

                    {/* Article Sections */}
                    <article>
                        {post.content.map((section, index) => (
                            <section
                                key={index}
                                id={`section-${index}`}
                                className="mb-10 scroll-mt-24"
                            >
                                <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground flex items-center gap-3">
                                    <span
                                        className="inline-block w-1 h-6 rounded-full"
                                        style={{
                                            background:
                                                "linear-gradient(180deg, #003F87 0%, #006BD6 100%)",
                                        }}
                                    />
                                    {section.heading}
                                </h2>
                                <MarkdownRenderer content={section.body} />
                            </section>
                        ))}
                    </article>

                    {/* Related Tool CTA */}
                    {relatedTools.length > 0 && (
                        <section className="relative overflow-hidden rounded-2xl p-6 md:p-8 mb-10 border border-primary/20">
                            <div
                                className="absolute inset-0 -z-10"
                                style={{
                                    background:
                                        "linear-gradient(135deg, rgba(0,63,135,0.06) 0%, rgba(0,107,214,0.1) 50%, rgba(0,63,135,0.04) 100%)",
                                }}
                            />
                            <div
                                className="absolute top-0 right-0 w-40 h-40 -z-10 opacity-30"
                                style={{
                                    background:
                                        "radial-gradient(circle, rgba(0,107,214,0.3) 0%, transparent 70%)",
                                }}
                            />
                            <h2 className="text-xl font-bold mb-2 text-foreground">
                                🛠️ Try It Yourself
                            </h2>
                            <p className="text-muted-foreground mb-5">
                                Put what you&apos;ve learned into practice with
                                our free tools:
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {relatedTools.map((tool) =>
                                    tool ? (
                                        <Link
                                            key={tool.slug}
                                            href={`/${tool.category}/${tool.slug}`}
                                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:scale-[1.03] hover:shadow-lg active:scale-[0.98]"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, #003F87 0%, #0059B3 50%, #006BD6 100%)",
                                                boxShadow:
                                                    "0 4px 14px rgba(0, 63, 135, 0.3)",
                                            }}
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                            {tool.name}
                                        </Link>
                                    ) : null
                                )}
                            </div>
                        </section>
                    )}

                    {/* FAQ Section */}
                    {post.faqs.length > 0 && (
                        <section className="mb-10">
                            <h2 className="text-2xl font-bold mb-5 text-foreground flex items-center gap-3">
                                <span
                                    className="inline-block w-1 h-6 rounded-full"
                                    style={{
                                        background:
                                            "linear-gradient(180deg, #003F87 0%, #006BD6 100%)",
                                    }}
                                />
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-3">
                                {post.faqs.map((faq, index) => (
                                    <details
                                        key={index}
                                        className="group bg-card border border-border/60 rounded-xl overflow-hidden hover:border-primary/30 transition-colors"
                                    >
                                        <summary className="flex items-center justify-between cursor-pointer p-4 md:p-5 font-semibold text-foreground hover:bg-muted/30 transition-colors">
                                            <span className="pr-4">
                                                {faq.question}
                                            </span>
                                            <span className="shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-open:rotate-180 transition-transform text-sm">
                                                ▾
                                            </span>
                                        </summary>
                                        <div className="px-4 pb-4 md:px-5 md:pb-5 text-muted-foreground text-[15px] leading-relaxed border-t border-border/40">
                                            <div className="pt-4">
                                                {faq.answer}
                                            </div>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* More Posts */}
                    <section>
                        <h2 className="text-2xl font-bold mb-5 text-foreground">
                            More Articles
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {blogPosts
                                .filter((p) => p.slug !== post.slug)
                                .slice(0, 4)
                                .map((p) => (
                                    <Link
                                        key={p.slug}
                                        href={`/blog/${p.slug}`}
                                        className="group bg-card border border-border/60 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all"
                                    >
                                        <div className="relative w-full h-32 overflow-hidden">
                                            <Image
                                                src={p.heroImage}
                                                alt={p.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 640px) 100vw, 280px"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <div className="flex flex-wrap gap-1.5 mb-2">
                                                {p.tags.slice(0, 2).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                                                {p.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                                                {p.excerpt}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar - Table of Contents (Desktop only) */}
                <aside className="hidden lg:block">
                    <div className="sticky top-24">
                        <div className="bg-card border border-border/60 rounded-xl p-5">
                            <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                                On This Page
                            </h3>
                            <nav className="space-y-1">
                                {toc.map((item) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 border-l-2 border-border pl-3 hover:border-primary"
                                    >
                                        {item.title}
                                    </a>
                                ))}
                            </nav>
                        </div>

                        {/* Quick CTA in sidebar */}
                        {relatedTools.length > 0 && relatedTools[0] && (
                            <Link
                                href={`/${relatedTools[0].category}/${relatedTools[0].slug}`}
                                className="mt-4 block bg-gradient-to-br from-[#003F87] to-[#006BD6] text-white rounded-xl p-4 text-center hover:shadow-lg transition-shadow"
                            >
                                <span className="text-xs font-medium text-white/70 block mb-1">
                                    Try the tool
                                </span>
                                <span className="font-bold text-sm">
                                    {relatedTools[0].name} →
                                </span>
                            </Link>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}
