import { NextRequest, NextResponse } from "next/server";

const DNS_TYPES: Record<string, number> = {
    A: 1,
    AAAA: 28,
    CNAME: 5,
    MX: 15,
    TXT: 16,
    NS: 2,
    SOA: 6,
};

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");
    const type = searchParams.get("type")?.toUpperCase();

    if (!domain || !/^[a-zA-Z0-9]([a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}$/.test(domain)) {
        return NextResponse.json(
            { error: "Invalid domain name" },
            { status: 400 }
        );
    }

    const typesToQuery =
        type === "ALL" || !type ? Object.keys(DNS_TYPES) : [type];

    if (type !== "ALL" && type && !DNS_TYPES[type]) {
        return NextResponse.json(
            { error: `Invalid record type: ${type}` },
            { status: 400 }
        );
    }

    try {
        const startTime = Date.now();

        const results = await Promise.allSettled(
            typesToQuery.map(async (t) => {
                const response = await fetch(
                    `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${DNS_TYPES[t]}`,
                    {
                        headers: { Accept: "application/dns-json" },
                        signal: AbortSignal.timeout(5000),
                    }
                );

                if (!response.ok) {
                    throw new Error(`DNS query failed for type ${t}: ${response.status}`);
                }

                const data = await response.json();
                return { type: t, data };
            })
        );

        const queryTime = Date.now() - startTime;

        const records: Record<string, { name: string; type: number; TTL: number; data: string }[]> = {};
        let hasError = false;

        for (const result of results) {
            if (result.status === "fulfilled") {
                const { type: recordType, data } = result.value;
                records[recordType] = data.Answer ?? [];
            } else {
                hasError = true;
            }
        }

        if (Object.values(records).every((r) => r.length === 0) && hasError) {
            return NextResponse.json(
                { error: "Could not resolve DNS for this domain. Please check the domain name and try again." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            domain,
            records,
            queryTime,
            timestamp: new Date().toISOString(),
        });
    } catch {
        return NextResponse.json(
            { error: "Could not resolve DNS for this domain. Please check the domain name and try again." },
            { status: 500 }
        );
    }
}
