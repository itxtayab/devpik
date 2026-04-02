import { MetadataRoute } from "next";
import { CATEGORIES, toolsData } from "@/lib/tools-data";
import { getAllBlogSlugs } from "@/lib/blog-data";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://www.devpik.com";

    // Static routes (fixed lastModified to avoid false freshness signals)
    const staticLastModified = new Date("2025-12-01");
    const staticRoutes = ["", "/about", "/contact", "/privacy-policy", "/terms", "/disclaimer"].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: route === "" ? new Date() : staticLastModified,
        changeFrequency: route === "" ? "weekly" as const : "monthly" as const,
        priority: route === "" ? 1.0 : 0.5,
    }));

    // Categories routes
    const categoryRoutes = Object.keys(CATEGORIES).map((category) => ({
        url: `${baseUrl}/${category}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    // Tool routes
    const toolRoutes = toolsData.map((tool) => ({
        url: `${baseUrl}/${tool.category}/${tool.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.9,
    }));

    // Blog listing
    const blogListingRoute = {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    };

    // Static blog routes
    const staticBlogRoutes = getAllBlogSlugs().map((slug) => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    // Dynamic blog routes from posts table + paste routes
    let dynamicBlogRoutes: MetadataRoute.Sitemap = [];
    let pasteRoutes: MetadataRoute.Sitemap = [];

    try {
        const supabase = await createClient();

        // Published posts from new posts table
        const { data: posts } = await supabase
            .from("posts")
            .select("slug, updated_at")
            .eq("status", "published");

        if (posts) {
            const staticSlugs = new Set(getAllBlogSlugs());
            dynamicBlogRoutes = posts
                .filter((p) => !staticSlugs.has(p.slug))
                .map((p) => ({
                    url: `${baseUrl}/blog/${p.slug}`,
                    lastModified: new Date(p.updated_at),
                    changeFrequency: "monthly" as const,
                    priority: 0.7,
                }));
        }

        // Non-expired pastes
        const { data: pastes } = await supabase
            .from("pastes")
            .select("short_code, created_at")
            .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

        if (pastes) {
            pasteRoutes = pastes.map((p) => ({
                url: `${baseUrl}/p/${p.short_code}`,
                lastModified: new Date(p.created_at),
                changeFrequency: "never" as const,
                priority: 0.3,
            }));
        }
    } catch {
        // Silently fail
    }

    return [
        ...staticRoutes,
        ...categoryRoutes,
        ...toolRoutes,
        blogListingRoute,
        ...staticBlogRoutes,
        ...dynamicBlogRoutes,
        ...pasteRoutes,
    ];
}
