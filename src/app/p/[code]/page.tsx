import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PasteViewer } from "./paste-viewer";

interface Props {
    params: Promise<{ code: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const { code } = await props.params;
    const supabase = await createClient();
    const { data } = await supabase
        .from("pastes")
        .select("title, content")
        .eq("short_code", code)
        .single();

    if (!data) return { title: "Paste Not Found | DevPik" };

    return {
        title: `${data.title || "Untitled"} | DevPik Code Share`,
        description: data.content.slice(0, 100) + (data.content.length > 100 ? "..." : ""),
        robots: { index: false, follow: false },
    };
}

export default async function PastePage(props: Props) {
    const { code } = await props.params;
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("pastes")
        .select("*")
        .eq("short_code", code)
        .single();

    if (error || !data) notFound();

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
        notFound();
    }

    // Increment view count
    await supabase
        .from("pastes")
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq("id", data.id);

    return (
        <div className="mx-auto max-w-4xl pb-12">
            <PasteViewer
                title={data.title}
                content={data.content}
                language={data.language}
                createdAt={data.created_at}
                viewCount={(data.view_count || 0) + 1}
                shortCode={code}
            />
        </div>
    );
}
