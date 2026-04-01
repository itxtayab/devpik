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
            .from("pastes")
            .select("*")
            .eq("short_code", code)
            .single();

        if (error || !data) {
            return NextResponse.json(
                { success: false, message: "Paste not found." },
                { status: 404 }
            );
        }

        if (data.expires_at && new Date(data.expires_at) < new Date()) {
            return NextResponse.json(
                { success: false, message: "This paste has expired." },
                { status: 404 }
            );
        }

        // Increment view count
        await supabase
            .from("pastes")
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq("id", data.id);

        return NextResponse.json({ success: true, paste: data });
    } catch {
        return NextResponse.json(
            { success: false, message: "Something went wrong." },
            { status: 500 }
        );
    }
}
