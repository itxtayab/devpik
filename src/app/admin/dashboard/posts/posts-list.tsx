"use client";

import { useState } from "react";
import Link from "next/link";
import useSupabaseBrowser from "@/lib/supabase/client";
import { Edit, Trash2, ChevronRight } from "lucide-react";

interface Post {
    id: string;
    title: string;
    slug: string;
    status: string;
    published_at: string | null;
    tags: string[];
    created_at: string;
}

export function PostsList({ initialPosts }: { initialPosts: Post[] }) {
    const [posts, setPosts] = useState(initialPosts);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const supabase = useSupabaseBrowser();

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        setDeletingId(id);
        const { error } = await supabase.from("posts").delete().eq("id", id);
        if (!error) {
            setPosts(posts.filter((p) => p.id !== id));
        }
        setDeletingId(null);
    };

    if (posts.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-white/40 text-lg font-medium">No blog posts yet</p>
                <p className="text-white/20 text-sm mt-1">Create your first blog post to get started</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {posts.map((post) => (
                <div key={post.id} className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                    post.status === "published"
                                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                }`}>
                                    {post.status}
                                </span>
                            </div>
                            <h3 className="font-semibold text-white/90 truncate">{post.title}</h3>
                            <div className="flex items-center gap-3 mt-2 text-xs text-white/30">
                                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                {post.tags?.length > 0 && (
                                    <>
                                        <span>&#x2022;</span>
                                        <span className="truncate">{post.tags.slice(0, 3).join(", ")}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/admin/dashboard/posts/${post.id}/edit`} className="p-2 rounded-lg text-white/40 hover:text-[#60a5fa] hover:bg-[#003F87]/20 transition-all" title="Edit">
                                <Edit className="w-4 h-4" />
                            </Link>
                            <Link href={`/blog/${post.slug}`} target="_blank" className="p-2 rounded-lg text-white/40 hover:text-green-400 hover:bg-green-500/10 transition-all" title="View">
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                            <button onClick={() => handleDelete(post.id)} disabled={deletingId === post.id} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50" title="Delete">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
