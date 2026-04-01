"use client";

import { useEffect } from "react";

export function trackToolUsage(toolSlug: string) {
    fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool_slug: toolSlug, event: "tool_used" }),
    }).catch(() => {});
}

export function ToolAnalytics({ toolSlug }: { toolSlug: string }) {
    useEffect(() => {
        fetch("/api/analytics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tool_slug: toolSlug, event: "page_view" }),
        }).catch(() => {});
    }, [toolSlug]);

    return null;
}
