"use client";

import { useState } from "react";
import useSupabaseBrowser from "@/lib/supabase/client";
import { Download } from "lucide-react";

interface Subscriber {
    id: string;
    email: string;
    source: string;
    is_active: boolean;
    subscribed_at: string;
}

export function SubscribersList({ initialSubscribers }: { initialSubscribers: Subscriber[] }) {
    const [subscribers, setSubscribers] = useState(initialSubscribers);
    const supabase = useSupabaseBrowser();

    const toggleActive = async (id: string, currentlyActive: boolean) => {
        await supabase.from("subscribers").update({ is_active: !currentlyActive }).eq("id", id);
        setSubscribers(subscribers.map((s) =>
            s.id === id ? { ...s, is_active: !currentlyActive } : s
        ));
    };

    const exportCSV = () => {
        const csv = [
            "Email,Source,Active,Subscribed At",
            ...subscribers.map((s) =>
                `${s.email},${s.source},${s.is_active},${s.subscribed_at}`
            ),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "subscribers.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button
                    onClick={exportCSV}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-all"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="px-5 py-3 text-left text-white/40 font-medium text-xs uppercase tracking-wider">Email</th>
                            <th className="px-5 py-3 text-left text-white/40 font-medium text-xs uppercase tracking-wider">Source</th>
                            <th className="px-5 py-3 text-left text-white/40 font-medium text-xs uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3 text-left text-white/40 font-medium text-xs uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscribers.map((sub) => (
                            <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5">
                                <td className="px-5 py-3 text-white/80">{sub.email}</td>
                                <td className="px-5 py-3 text-white/50">{sub.source}</td>
                                <td className="px-5 py-3">
                                    <button
                                        onClick={() => toggleActive(sub.id, sub.is_active)}
                                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${sub.is_active ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}
                                    >
                                        {sub.is_active ? "Active" : "Inactive"}
                                    </button>
                                </td>
                                <td className="px-5 py-3 text-white/40">{new Date(sub.subscribed_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {subscribers.length === 0 && (
                    <p className="text-center py-10 text-white/40">No subscribers yet</p>
                )}
            </div>
        </div>
    );
}
