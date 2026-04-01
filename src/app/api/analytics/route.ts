import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { tool_slug, event } = await request.json();

        if (!tool_slug || !event || !["page_view", "tool_used"].includes(event)) {
            return NextResponse.json(
                { success: false, message: "Invalid analytics data." },
                { status: 400 }
            );
        }

        const country =
            request.headers.get("x-vercel-ip-country") ||
            request.headers.get("cf-ipcountry") ||
            null;
        const referrer = request.headers.get("referer") || null;

        const supabase = await createClient();
        const { error } = await supabase
            .from("tool_usage")
            .insert({ tool_slug, event, country, referrer });

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
