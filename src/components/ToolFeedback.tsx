"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Send } from "lucide-react";

export function ToolFeedback({ toolSlug }: { toolSlug: string }) {
    const [voted, setVoted] = useState(false);
    const [showComment, setShowComment] = useState(false);
    const [comment, setComment] = useState("");
    const [commentSent, setCommentSent] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const key = `feedback_${toolSlug}`;
            if (localStorage.getItem(key)) setVoted(true);
        }
    }, [toolSlug]);

    const handleVote = async (rating: "up" | "down") => {
        if (voted) return;
        setVoted(true);
        localStorage.setItem(`feedback_${toolSlug}`, rating);
        setShowComment(true);

        await fetch("/api/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tool_slug: toolSlug, rating }),
        });
    };

    const handleComment = async () => {
        if (!comment.trim()) return;
        setCommentSent(true);
        await fetch("/api/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tool_slug: toolSlug,
                rating: localStorage.getItem(`feedback_${toolSlug}`) || "up",
                comment,
            }),
        });
    };

    if (voted && !showComment) {
        return (
            <div className="mt-8 text-center text-sm text-muted-foreground">
                Thanks for your feedback!
            </div>
        );
    }

    return (
        <div className="mt-8 flex flex-col items-center gap-3 py-6 border-t border-border/40">
            {!voted ? (
                <>
                    <p className="text-sm font-medium text-muted-foreground">
                        Was this tool helpful?
                    </p>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleVote("up")}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/60 bg-card text-sm font-medium transition-all hover:border-green-500/40 hover:bg-green-500/5 hover:text-green-600"
                        >
                            <ThumbsUp className="h-4 w-4" />
                            Yes
                        </button>
                        <button
                            onClick={() => handleVote("down")}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/60 bg-card text-sm font-medium transition-all hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-600"
                        >
                            <ThumbsDown className="h-4 w-4" />
                            No
                        </button>
                    </div>
                </>
            ) : (
                <div className="w-full max-w-md space-y-3">
                    <p className="text-sm font-medium text-center text-muted-foreground">
                        Thanks for your feedback! Any additional comments?
                    </p>
                    {!commentSent ? (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Optional comment..."
                                className="flex-1 rounded-xl px-4 py-2 text-sm border border-border/60 bg-card outline-none focus:border-primary/40 transition-all"
                            />
                            <button
                                onClick={handleComment}
                                className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all"
                                style={{ background: "linear-gradient(135deg, #003F87, #006BD6)" }}
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <p className="text-sm text-center text-green-600">Comment sent!</p>
                    )}
                </div>
            )}
        </div>
    );
}
