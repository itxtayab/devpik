import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/lib/blog-data";
import { StructuredData, generateBreadcrumbSchema } from "@/components/seo/StructuredData";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
    title: "Blog - Developer Tips, Guides & Tutorials | DevPik",
    description:
        "Explore developer guides, tutorials, and tips on Base64, JSON formatting, UUIDs, URL encoding, and more. Learn best practices and boost your workflow with DevPik.",
    alternates: { canonical: "https://devpik.com/blog" },
};

interface SupabaseBlog {
    slug: string;
    title: string;
    excerpt: string;
    hero_image: string;
    published_at: string;
    reading_time: string;
    tags: string[];
    is_published: boolean;
}

export default async function BlogListingPage() {
    // Fetch published blogs from Supabase
    let supabaseBlogs: SupabaseBlog[] = [];
    try {
        const supabase = await createClient();
        const { data } = await supabase
            .from("blogs")
            .select("slug, title, excerpt, hero_image, published_at, reading_time, tags, is_published")
            .eq("is_published", true)
            .order("published_at", { ascending: false });
        supabaseBlogs = data || [];
    } catch {
        // Silently fail — still show static blogs
    }

    // Convert Supabase blogs to match static format
    const dynamicPosts = supabaseBlogs.map((b) => ({
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        heroImage: b.hero_image || "/images/blog/default.webp",
        publishedAt: b.published_at,
        readingTime: b.reading_time,
        tags: b.tags || [],
    }));

    // Merge: Supabase posts first, then static posts (skip duplicates by slug)
    const supabaseSlugs = new Set(dynamicPosts.map((p) => p.slug));
    const staticPosts = blogPosts
        .filter((p) => !supabaseSlugs.has(p.slug))
        .map((p) => ({
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            heroImage: p.heroImage,
            publishedAt: p.publishedAt,
            readingTime: p.readingTime,
            tags: p.tags,
        }));

    const allPosts = [...dynamicPosts, ...staticPosts];
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: "Home", url: "https://devpik.com" },
        { name: "Blog", url: "https://devpik.com/blog" },
    ]);

    const collectionPageSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "DevPik Blog",
        description: metadata.description,
        url: "https://devpik.com/blog",
        publisher: {
            "@type": "Organization",
            name: "DevPik",
            url: "https://devpik.com",
        },
    };

    return (
        <div className="flex flex-col gap-10 pb-12">
            <StructuredData data={breadcrumbSchema} />
            <StructuredData data={collectionPageSchema} />

            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
                <ol className="flex items-center gap-1.5">
                    <li>
                        <Link href="/" className="hover:text-primary transition-colors">
                            Home
                        </Link>
                    </li>
                    <li className="text-border">/</li>
                    <li className="text-foreground font-medium">Blog</li>
                </ol>
            </nav>

            {/* Hero */}
            <section className="text-center space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Developer Tips, Guides & Tutorials
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Practical guides and deep dives into the tools and concepts developers use every day.
                    From encoding to formatting, we've got you covered.
                </p>
            </section>

            {/* Blog Posts Grid */}
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {allPosts.map((post) => (
                    <article
                        key={post.slug}
                        className="group bg-card border border-border/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
                    >
                        {/* Hero Image */}
                        <Link href={`/blog/${post.slug}`} className="relative w-full h-44 overflow-hidden block">
                            <Image
                                src={post.heroImage}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                        </Link>
                        <div className="p-6 flex flex-col flex-1">
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {post.tags.slice(0, 2).map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Title */}
                            <h2 className="text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
                                <Link href={`/blog/${post.slug}`} className="hover:underline underline-offset-2">
                                    {post.title}
                                </Link>
                            </h2>

                            {/* Excerpt */}
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                                {post.excerpt}
                            </p>

                            {/* Meta */}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {post.readingTime}
                                </span>
                            </div>

                            {/* CTA */}
                            <Link
                                href={`/blog/${post.slug}`}
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
                            >
                                Read more
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </article>
                ))}
            </section>
        </div>
    );
}
