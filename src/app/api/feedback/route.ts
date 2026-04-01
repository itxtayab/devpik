import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { tool_slug, rating, comment } = await request.json();

        if (!tool_slug || !rating || !["up", "down"].includes(rating)) {
            return NextResponse.json(
                { success: false, message: "Invalid feedback data." },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        const { error } = await supabase
            .from("tool_feedback")
            .insert({ tool_slug, rating, comment: comment || null });

        if (error) throw error;

        return NextResponse.json({ success: true, message: "Thanks for your feedback!" });
    } catch {
        return NextResponse.json(
            { success: false, message: "Something went wrong." },
            { status: 500 }
        );
    }
}
