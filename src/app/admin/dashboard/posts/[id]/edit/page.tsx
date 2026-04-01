import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostEditor } from "@/components/admin/PostEditor";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditPostPage(props: Props) {
    const { id } = await props.params;
    const supabase = await createClient();

    const [{ data: post }, { data: categories }] = await Promise.all([
        supabase.from("posts").select("*").eq("id", id).single(),
        supabase.from("categories").select("id, name, slug").order("name"),
    ]);

    if (!post) notFound();

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Edit Post</h2>
            <PostEditor categories={categories || []} existingPost={post} />
        </div>
    );
}
