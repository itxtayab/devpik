import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
    try {
        const { path } = await request.json();
        if (!path || typeof path !== "string") {
            return NextResponse.json({ error: "Invalid path" }, { status: 400 });
        }

        const supabase = await createClient();

        // Upsert: increment view_count if exists, otherwise insert with count 1
        const { data: existing } = await supabase
            .from("page_views")
            .select("view_count")
            .eq("page_path", path)
            .single();

        if (existing) {
            await supabase
                .from("page_views")
                .update({
                    view_count: existing.view_count + 1,
                    last_viewed_at: new Date().toISOString(),
                })
                .eq("page_path", path);
        } else {
            await supabase.from("page_views").insert({
                page_path: path,
                view_count: 1,
                last_viewed_at: new Date().toISOString(),
            });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to track view" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const path = searchParams.get("path");

        const supabase = await createClient();

        if (path) {
            const { data } = await supabase
                .from("page_views")
                .select("view_count")
                .eq("page_path", path)
                .single();

            return NextResponse.json({ views: data?.view_count || 0 });
        }

        // Return all page views
        const { data } = await supabase
            .from("page_views")
            .select("*")
            .order("view_count", { ascending: false });

        return NextResponse.json({ views: data || [] });
    } catch {
        return NextResponse.json({ error: "Failed to get views" }, { status: 500 });
    }
}
