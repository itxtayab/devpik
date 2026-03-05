"use client";

import { useEffect } from "react";

export function PageViewTracker({ path }: { path: string }) {
    useEffect(() => {
        // Track the page view
        fetch("/api/views", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path }),
        }).catch(() => {
            // Silently fail — don't break the page if tracking fails
        });
    }, [path]);

    return null;
}
