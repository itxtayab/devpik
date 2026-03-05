import { MetadataRoute } from "next";
import { CATEGORIES, toolsData } from "@/lib/tools-data";
import { getAllBlogSlugs } from "@/lib/blog-data";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://devpik.com";

    // Static routes
    const staticRoutes = ["", "/about", "/contact", "/privacy-policy", "/terms", "/disclaimer"].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
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

    // Blog routes — static
    const blogListingRoute = {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    };

    const staticBlogRoutes = getAllBlogSlugs().map((slug) => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    // Blog routes — Supabase
    let supabaseBlogRoutes: MetadataRoute.Sitemap = [];
    try {
        const supabase = await createClient();
        const { data } = await supabase
            .from("blogs")
            .select("slug, updated_at")
            .eq("is_published", true);

        if (data) {
            const staticSlugs = new Set(getAllBlogSlugs());
            supabaseBlogRoutes = data
                .filter((b) => !staticSlugs.has(b.slug))
                .map((b) => ({
                    url: `${baseUrl}/blog/${b.slug}`,
                    lastModified: new Date(b.updated_at),
                    changeFrequency: "monthly" as const,
                    priority: 0.7,
                }));
        }
    } catch {
        // Silently fail — still use static slugs
    }

    return [
        ...staticRoutes,
        ...categoryRoutes,
        ...toolRoutes,
        blogListingRoute,
        ...staticBlogRoutes,
        ...supabaseBlogRoutes,
    ];
}
