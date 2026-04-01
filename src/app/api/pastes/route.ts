import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function generateCode(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function POST(request: Request) {
    try {
        const { title, content, language, expires_at } = await request.json();

        if (!content || !content.trim()) {
            return NextResponse.json(
                { success: false, message: "Content is required." },
                { status: 400 }
            );
        }

        const short_code = generateCode(8);
        const supabase = await createClient();
        const { error } = await supabase.from("pastes").insert({
            short_code,
            title: title || "Untitled",
            content,
            language: language || "plaintext",
            expires_at: expires_at || null,
        });

        if (error) throw error;

        return NextResponse.json({
            success: true,
            short_code,
            url: `/p/${short_code}`,
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Something went wrong." },
            { status: 500 }
        );
    }
}
