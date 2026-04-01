import { createClient } from "@/lib/supabase/server";
import { Eye, Users, ThumbsUp, MessageSquare, ThumbsDown } from "lucide-react";

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    const [
        { count: totalViews },
        { count: totalSubscribers },
        { count: feedbackUp },
        { count: feedbackDown },
        { count: unreadMessages },
    ] = await Promise.all([
        supabase.from("tool_usage").select("*", { count: "exact", head: true }).eq("event", "page_view"),
        supabase.from("subscribers").select("*", { count: "exact", head: true }),
        supabase.from("tool_feedback").select("*", { count: "exact", head: true }).eq("rating", "up"),
        supabase.from("tool_feedback").select("*", { count: "exact", head: true }).eq("rating", "down"),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
    ]);

    const stats = [
        { label: "Total Page Views", value: (totalViews || 0).toLocaleString(), icon: Eye, color: "#60a5fa" },
        { label: "Subscribers", value: (totalSubscribers || 0).toLocaleString(), icon: Users, color: "#34d399" },
        { label: "Positive Feedback", value: (feedbackUp || 0).toLocaleString(), icon: ThumbsUp, color: "#34d399" },
        { label: "Negative Feedback", value: (feedbackDown || 0).toLocaleString(), icon: ThumbsDown, color: "#f87171" },
        { label: "Unread Messages", value: (unreadMessages || 0).toLocaleString(), icon: MessageSquare, color: "#fbbf24" },
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white/5 border border-white/5 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                            <p className="text-white/40 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                        </div>
                        <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
