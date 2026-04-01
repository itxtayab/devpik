import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface Props {
    params: Promise<{ code: string }>;
}

export default async function ShortUrlRedirect(props: Props) {
    const { code } = await props.params;
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("short_urls")
        .select("*")
        .eq("short_code", code)
        .single();

    if (error || !data) notFound();

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
        notFound();
    }

    // Increment click count
    await supabase
        .from("short_urls")
        .update({ click_count: (data.click_count || 0) + 1 })
        .eq("id", data.id);

    redirect(data.original_url);
}
