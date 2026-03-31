import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const forwarded = request.headers.get("x-forwarded-for");
        const raw = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";

        // Skip loopback/private IPs — let ip-api auto-detect the public IP
        const isLocal = !raw || raw === "::1" || raw === "127.0.0.1" || raw.startsWith("192.168.") || raw.startsWith("10.");
        const ipParam = isLocal ? "" : raw;

        const res = await fetch(
            `http://ip-api.com/json/${ipParam}?fields=query,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as`,
            { cache: "no-store" }
        );
        const data = await res.json();

        if (data.status === "fail") {
            return NextResponse.json({ error: data.message }, { status: 400 });
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: "Failed to fetch IP data" }, { status: 500 });
    }
}
