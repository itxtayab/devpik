import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { username, password } = await request.json();

    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (username === validUsername && password === validPassword) {
        const response = NextResponse.json({ success: true });
        // Set a simple auth cookie (httpOnly, expires in 7 days)
        response.cookies.set("admin_session", "authenticated", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });
        return response;
    }

    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
}

export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.delete("admin_session");
    return response;
}
