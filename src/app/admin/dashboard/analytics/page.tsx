import { createClient } from "@/lib/supabase/server";

export default async function AdminAnalyticsPage() {
    const supabase = await createClient();

    // Top 10 most viewed tools
    const { data: topViewed } = await supabase
        .from("tool_usage")
        .select("tool_slug")
        .eq("event", "page_view");

    // Top 10 most used tools
    const { data: topUsed } = await supabase
        .from("tool_usage")
        .select("tool_slug")
        .eq("event", "tool_used");

    // Top referrers
    const { data: referrerData } = await supabase
        .from("tool_usage")
        .select("referrer")
        .not("referrer", "is", null);

    // Aggregate counts
    const viewCounts: Record<string, number> = {};
    topViewed?.forEach((r) => { viewCounts[r.tool_slug] = (viewCounts[r.tool_slug] || 0) + 1; });
    const sortedViews = Object.entries(viewCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

    const useCounts: Record<string, number> = {};
    topUsed?.forEach((r) => { useCounts[r.tool_slug] = (useCounts[r.tool_slug] || 0) + 1; });
    const sortedUses = Object.entries(useCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

    const referrerCounts: Record<string, number> = {};
    referrerData?.forEach((r) => {
        if (r.referrer) {
            try {
                const host = new URL(r.referrer).hostname;
                referrerCounts[host] = (referrerCounts[host] || 0) + 1;
            } catch { /* ignore */ }
        }
    });
    const sortedReferrers = Object.entries(referrerCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

    return (
        <div className="p-6 space-y-8">
            <h2 className="text-2xl font-bold">Analytics</h2>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Top Viewed */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                    <h3 className="font-semibold text-white/80 mb-4">Top 10 Most Viewed Tools</h3>
                    {sortedViews.length === 0 ? (
                        <p className="text-white/40 text-sm">No data yet</p>
                    ) : (
                        <div className="space-y-2">
                            {sortedViews.map(([slug, count], i) => (
                                <div key={slug} className="flex items-center justify-between py-1.5">
                                    <span className="text-sm text-white/70">
                                        <span className="text-white/30 mr-2">{i + 1}.</span>
                                        {slug}
                                    </span>
                                    <span className="text-sm font-medium text-[#60a5fa]">{count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Used */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                    <h3 className="font-semibold text-white/80 mb-4">Top 10 Most Used Tools</h3>
                    {sortedUses.length === 0 ? (
                        <p className="text-white/40 text-sm">No data yet</p>
                    ) : (
                        <div className="space-y-2">
                            {sortedUses.map(([slug, count], i) => (
                                <div key={slug} className="flex items-center justify-between py-1.5">
                                    <span className="text-sm text-white/70">
                                        <span className="text-white/30 mr-2">{i + 1}.</span>
                                        {slug}
                                    </span>
                                    <span className="text-sm font-medium text-[#34d399]">{count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Referrers */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 lg:col-span-2">
                    <h3 className="font-semibold text-white/80 mb-4">Top Referrers</h3>
                    {sortedReferrers.length === 0 ? (
                        <p className="text-white/40 text-sm">No data yet</p>
                    ) : (
                        <div className="grid gap-2 sm:grid-cols-2">
                            {sortedReferrers.map(([host, count]) => (
                                <div key={host} className="flex items-center justify-between py-1.5">
                                    <span className="text-sm text-white/70 truncate">{host}</span>
                                    <span className="text-sm font-medium text-[#fbbf24] ml-2">{count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
