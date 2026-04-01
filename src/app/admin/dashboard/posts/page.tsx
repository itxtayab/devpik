import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { PostsList } from "./posts-list";

export default async function AdminPostsPage() {
    const supabase = await createClient();
    const { data: posts } = await supabase
        .from("posts")
        .select("id, title, slug, status, published_at, tags, created_at")
        .order("created_at", { ascending: false });

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Blog Posts</h2>
                <Link
                    href="/admin/dashboard/posts/new"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm text-white hover:shadow-lg transition-all"
                    style={{ background: "linear-gradient(135deg, #003F87, #006BD6)" }}
                >
                    <PlusCircle className="w-4 h-4" />
                    New Post
                </Link>
            </div>
            <PostsList initialPosts={posts || []} />
        </div>
    );
}
