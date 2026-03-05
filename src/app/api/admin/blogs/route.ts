import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Helper: check admin auth
function isAuthenticated(request: NextRequest): boolean {
    return request.cookies.get("admin_session")?.value === "authenticated";
}

// GET: Fetch all blogs (admin only)
export async function GET(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ blogs: data });
}

// POST: Create a new blog
export async function POST(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("blogs")
        .insert({
            slug: body.slug,
            title: body.title,
            meta_title: body.meta_title || "",
            meta_description: body.meta_description || "",
            excerpt: body.excerpt || "",
            hero_image: body.hero_image || "",
            published_at: body.published_at || new Date().toISOString().split("T")[0],
            author: body.author || "DevPik Team",
            reading_time: body.reading_time || "5 min read",
            tags: body.tags || [],
            related_tool_slugs: body.related_tool_slugs || [],
            content: body.content || [],
            faqs: body.faqs || [],
            is_published: body.is_published || false,
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ blog: data });
}

// PUT: Update a blog
export async function PUT(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("blogs")
        .update({
            slug: body.slug,
            title: body.title,
            meta_title: body.meta_title,
            meta_description: body.meta_description,
            excerpt: body.excerpt,
            hero_image: body.hero_image,
            published_at: body.published_at,
            author: body.author,
            reading_time: body.reading_time,
            tags: body.tags,
            related_tool_slugs: body.related_tool_slugs,
            content: body.content,
            faqs: body.faqs,
            is_published: body.is_published,
            updated_at: new Date().toISOString(),
        })
        .eq("id", body.id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ blog: data });
}

// DELETE: Delete a blog
export async function DELETE(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "Blog ID required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("blogs").delete().eq("id", id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
