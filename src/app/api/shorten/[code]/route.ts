import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("short_urls")
            .select("*")
            .eq("short_code", code)
            .single();

        if (error || !data) {
            return NextResponse.json(
                { success: false, message: "URL not found." },
                { status: 404 }
            );
        }

        if (data.expires_at && new Date(data.expires_at) < new Date()) {
            return NextResponse.json(
                { success: false, message: "This link has expired." },
                { status: 404 }
            );
        }

        // Increment click count
        await supabase
            .from("short_urls")
            .update({ click_count: (data.click_count || 0) + 1 })
            .eq("id", data.id);

        return NextResponse.json({ success: true, original_url: data.original_url });
    } catch {
        return NextResponse.json(
            { success: false, message: "Something went wrong." },
            { status: 500 }
        );
    }
}
