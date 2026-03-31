import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const sizeKB = Math.min(Math.max(parseInt(searchParams.get("size") || "1024"), 1), 10240);
    const totalBytes = sizeKB * 1024;

    // Stream random data in 64KB chunks (crypto.getRandomValues limit is 65536 bytes)
    const stream = new ReadableStream({
        start(controller) {
            let remaining = totalBytes;
            const chunkSize = 65536;
            while (remaining > 0) {
                const size = Math.min(remaining, chunkSize);
                const chunk = new Uint8Array(size);
                crypto.getRandomValues(chunk);
                controller.enqueue(chunk);
                remaining -= size;
            }
            controller.close();
        },
    });

    return new NextResponse(stream, {
        headers: {
            "Content-Type": "application/octet-stream",
            "Content-Length": String(totalBytes),
            "Cache-Control": "no-store, no-cache",
        },
    });
}
