"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSupabaseBrowser from "@/lib/supabase/client";
import { Loader2, Save, Upload } from "lucide-react";

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface PostData {
    id?: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    cover_image_url: string;
    category_id: string;
    tags: string[];
    status: string;
    meta_title: string;
    meta_description: string;
    published_at: string | null;
}

function slugify(text: string): string {
    return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

function calculateReadTime(content: string): number {
    const words = content.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
}

export function PostEditor({
    categories,
    existingPost,
}: {
    categories: Category[];
    existingPost?: PostData & { id: string; read_time?: number };
}) {
    const router = useRouter();
    const supabase = useSupabaseBrowser();

    const [form, setForm] = useState({
        title: existingPost?.title || "",
        slug: existingPost?.slug || "",
        content: existingPost?.content || "",
        excerpt: existingPost?.excerpt || "",
        cover_image_url: existingPost?.cover_image_url || "",
        category_id: existingPost?.category_id || "",
        tags: existingPost?.tags?.join(", ") || "",
        status: existingPost?.status || "draft",
        meta_title: existingPost?.meta_title || "",
        meta_description: existingPost?.meta_description || "",
    });

    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleTitleBlur = () => {
        if (!form.slug && form.title) {
            setForm({ ...form, slug: slugify(form.title) });
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);

        const ext = file.name.split(".").pop();
        const path = `${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from("blog-images").upload(path, file);

        if (!error) {
            const { data: { publicUrl } } = supabase.storage.from("blog-images").getPublicUrl(path);
            setForm({ ...form, cover_image_url: publicUrl });
        }
        setUploading(false);
    };

    const handleSave = async () => {
        if (!form.title || !form.slug || !form.content) {
            setError("Title, slug, and content are required.");
            return;
        }

        setSaving(true);
        setError("");

        const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
        const read_time = calculateReadTime(form.content);
        const isPublishing = form.status === "published";

        const postData = {
            title: form.title,
            slug: form.slug,
            content: form.content,
            excerpt: form.excerpt,
            cover_image_url: form.cover_image_url || null,
            category_id: form.category_id || null,
            tags,
            status: form.status,
            meta_title: form.meta_title || form.title,
            meta_description: form.meta_description || form.excerpt,
            read_time,
            updated_at: new Date().toISOString(),
            ...(isPublishing && !existingPost?.published_at ? { published_at: new Date().toISOString() } : {}),
        };

        let result;
        if (existingPost?.id) {
            result = await supabase.from("posts").update(postData).eq("id", existingPost.id);
        } else {
            result = await supabase.from("posts").insert(postData);
        }

        if (result.error) {
            setError(result.error.message);
        } else {
            router.push("/admin/dashboard/posts");
            router.refresh();
        }
        setSaving(false);
    };

    const update = (field: string, value: string) => setForm({ ...form, [field]: value });

    return (
        <div className="max-w-4xl space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-white/70 text-sm font-medium mb-1.5">Title *</label>
                    <input
                        value={form.title}
                        onChange={(e) => update("title", e.target.value)}
                        onBlur={handleTitleBlur}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#003F87] transition-all"
                        placeholder="Post title"
                    />
                </div>
                <div>
                    <label className="block text-white/70 text-sm font-medium mb-1.5">Slug *</label>
                    <input
                        value={form.slug}
                        onChange={(e) => update("slug", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#003F87] transition-all font-mono text-sm"
                        placeholder="post-slug"
                    />
                </div>
            </div>

            <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">Content (Markdown) *</label>
                <textarea
                    value={form.content}
                    onChange={(e) => update("content", e.target.value)}
                    rows={20}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#003F87] transition-all font-mono text-sm resize-none"
                    placeholder="Write your blog post in markdown..."
                />
            </div>

            <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">Excerpt</label>
                <textarea
                    value={form.excerpt}
                    onChange={(e) => update("excerpt", e.target.value)}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#003F87] transition-all resize-none"
                    placeholder="Short description for previews..."
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-white/70 text-sm font-medium mb-1.5">Category</label>
                    <select
                        value={form.category_id}
                        onChange={(e) => update("category_id", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#003F87] transition-all"
                    >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id} className="text-black">{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-white/70 text-sm font-medium mb-1.5">Tags (comma-separated)</label>
                    <input
                        value={form.tags}
                        onChange={(e) => update("tags", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#003F87] transition-all"
                        placeholder="javascript, react, tutorial"
                    />
                </div>
            </div>

            <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">Cover Image</label>
                <div className="flex items-center gap-3">
                    {form.cover_image_url && (
                        <img src={form.cover_image_url} alt="Cover" className="h-20 rounded-lg object-cover" />
                    )}
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-white/70 cursor-pointer hover:bg-white/10 transition-all">
                        <Upload className="w-4 h-4" />
                        {uploading ? "Uploading..." : "Upload Image"}
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-white/70 text-sm font-medium mb-1.5">Meta Title</label>
                    <input
                        value={form.meta_title}
                        onChange={(e) => update("meta_title", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#003F87] transition-all"
                        placeholder="SEO title"
                    />
                </div>
                <div>
                    <label className="block text-white/70 text-sm font-medium mb-1.5">Meta Description</label>
                    <input
                        value={form.meta_description}
                        onChange={(e) => update("meta_description", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#003F87] transition-all"
                        placeholder="SEO description"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <label className="block text-white/70 text-sm font-medium">Status:</label>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => update("status", "draft")}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${form.status === "draft" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-white/5 text-white/40 border border-white/10"}`}
                    >
                        Draft
                    </button>
                    <button
                        type="button"
                        onClick={() => update("status", "published")}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${form.status === "published" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-white/5 text-white/40 border border-white/10"}`}
                    >
                        Published
                    </button>
                </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:shadow-lg disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #003F87 0%, #006BD6 100%)" }}
            >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {existingPost ? "Update Post" : "Create Post"}
            </button>
        </div>
    );
}
