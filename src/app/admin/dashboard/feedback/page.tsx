import { createClient } from "@/lib/supabase/server";
import { FeedbackList } from "./feedback-list";

export default async function AdminFeedbackPage() {
    const supabase = await createClient();
    const { data: feedback } = await supabase
        .from("tool_feedback")
        .select("*")
        .order("created_at", { ascending: false });

    // Get unique tool slugs for filter
    const toolSlugs = [...new Set((feedback || []).map((f) => f.tool_slug))].sort();

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Feedback</h2>
            <FeedbackList initialFeedback={feedback || []} toolSlugs={toolSlugs} />
        </div>
    );
}
