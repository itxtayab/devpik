"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface Feedback {
    id: string;
    tool_slug: string;
    rating: string;
    comment: string | null;
    created_at: string;
}

export function FeedbackList({ initialFeedback, toolSlugs }: { initialFeedback: Feedback[]; toolSlugs: string[] }) {
    const [filterTool, setFilterTool] = useState("");
    const [filterRating, setFilterRating] = useState("");

    const filtered = initialFeedback.filter((f) => {
        if (filterTool && f.tool_slug !== filterTool) return false;
        if (filterRating && f.rating !== filterRating) return false;
        return true;
    });

    return (
        <div>
            <div className="flex gap-3 mb-4">
                <select
                    value={filterTool}
                    onChange={(e) => setFilterTool(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                >
                    <option value="" className="text-black">All Tools</option>
                    {toolSlugs.map((slug) => (
                        <option key={slug} value={slug} className="text-black">{slug}</option>
                    ))}
                </select>
                <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                >
                    <option value="" className="text-black">All Ratings</option>
                    <option value="up" className="text-black">Positive</option>
                    <option value="down" className="text-black">Negative</option>
                </select>
            </div>

            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <p className="text-center py-10 text-white/40">No feedback yet</p>
                ) : (
                    filtered.map((f) => (
                        <div key={f.id} className="bg-white/5 border border-white/5 rounded-2xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                                {f.rating === "up" ? (
                                    <ThumbsUp className="w-4 h-4 text-green-400" />
                                ) : (
                                    <ThumbsDown className="w-4 h-4 text-red-400" />
                                )}
                                <span className="text-sm font-medium text-white/80">{f.tool_slug}</span>
                                <span className="text-xs text-white/30 ml-auto">
                                    {new Date(f.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            {f.comment && (
                                <p className="text-sm text-white/60 ml-7">{f.comment}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
