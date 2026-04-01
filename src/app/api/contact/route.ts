import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { name, email, subject, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, message: "Name, email, and message are required." },
                { status: 400 }
            );
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { success: false, message: "Please enter a valid email address." },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        const { error } = await supabase
            .from("contact_messages")
            .insert({ name, email: email.toLowerCase().trim(), subject, message });

        if (error) throw error;

        return NextResponse.json({ success: true, message: "Message sent successfully!" });
    } catch {
        return NextResponse.json(
            { success: false, message: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
