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
        const { url, expires_at } = await request.json();

        if (!url) {
            return NextResponse.json(
                { success: false, message: "URL is required." },
                { status: 400 }
            );
        }

        try {
            new URL(url);
        } catch {
            return NextResponse.json(
                { success: false, message: "Please enter a valid URL." },
                { status: 400 }
            );
        }

        const short_code = generateCode(6);
        const supabase = await createClient();
        const { error } = await supabase.from("short_urls").insert({
            short_code,
            original_url: url,
            expires_at: expires_at || null,
        });

        if (error) throw error;

        return NextResponse.json({
            success: true,
            short_code,
            short_url: `/u/${short_code}`,
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Something went wrong." },
            { status: 500 }
        );
    }
}
