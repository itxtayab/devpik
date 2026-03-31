import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.arrayBuffer();
        return NextResponse.json({ received: body.byteLength });
    } catch {
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
