import { createClient } from "@/lib/supabase/server";
import { PostEditor } from "@/components/admin/PostEditor";

export default async function NewPostPage() {
    const supabase = await createClient();
    const { data: categories } = await supabase.from("categories").select("id, name, slug").order("name");

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">New Blog Post</h2>
            <PostEditor categories={categories || []} />
        </div>
    );
}
