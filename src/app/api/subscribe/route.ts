import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email, source = "footer" } = await request.json();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { success: false, message: "Please enter a valid email address." },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        const { error } = await supabase
            .from("subscribers")
            .insert({ email: email.toLowerCase().trim(), source });

        if (error) {
            if (error.code === "23505") {
                return NextResponse.json(
                    { success: false, message: "You're already subscribed!" },
                    { status: 409 }
                );
            }
            throw error;
        }

        return NextResponse.json({ success: true, message: "You're subscribed!" });
    } catch {
        return NextResponse.json(
            { success: false, message: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
