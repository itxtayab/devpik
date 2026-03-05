"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Save,
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
    Search,
    FileText,
    HelpCircle,
    Settings,
    Globe,
    Loader2,
} from "lucide-react";

interface ContentSection {
    heading: string;
    body: string;
}

interface FAQ {
    question: string;
    answer: string;
}

interface BlogFormData {
    id?: string;
    slug: string;
    title: string;
    meta_title: string;
    meta_description: string;
    excerpt: string;
    hero_image: string;
    published_at: string;
    author: string;
    reading_time: string;
    tags: string[];
    related_tool_slugs: string[];
    content: ContentSection[];
    faqs: FAQ[];
    is_published: boolean;
}

const defaultFormData: BlogFormData = {
    slug: "",
    title: "",
    meta_title: "",
    meta_description: "",
    excerpt: "",
    hero_image: "",
    published_at: new Date().toISOString().split("T")[0],
    author: "DevPik Team",
    reading_time: "5 min read",
    tags: [],
    related_tool_slugs: [],
    content: [{ heading: "", body: "" }],
    faqs: [],
    is_published: false,
};

export default function BlogEditorForm({ blogId }: { blogId?: string }) {
    const [form, setForm] = useState<BlogFormData>(defaultFormData);
    const [tagsInput, setTagsInput] = useState("");
    const [toolSlugsInput, setToolSlugsInput] = useState("");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(!!blogId);
    const [activeSection, setActiveSection] = useState<string>("basic");
    const router = useRouter();

    const fetchBlog = useCallback(async () => {
        if (!blogId) return;
        try {
            const res = await fetch("/api/admin/blogs");
            if (res.ok) {
                const data = await res.json();
                const blog = data.blogs?.find((b: BlogFormData & { id: string }) => b.id === blogId);
                if (blog) {
                    setForm({
                        id: blog.id,
                        slug: blog.slug || "",
                        title: blog.title || "",
                        meta_title: blog.meta_title || "",
                        meta_description: blog.meta_description || "",
                        excerpt: blog.excerpt || "",
                        hero_image: blog.hero_image || "",
                        published_at: blog.published_at || new Date().toISOString().split("T")[0],
                        author: blog.author || "DevPik Team",
                        reading_time: blog.reading_time || "5 min read",
                        tags: blog.tags || [],
                        related_tool_slugs: blog.related_tool_slugs || [],
                        content: blog.content || [{ heading: "", body: "" }],
                        faqs: blog.faqs || [],
                        is_published: blog.is_published || false,
                    });
                    setTagsInput((blog.tags || []).join(", "));
                    setToolSlugsInput((blog.related_tool_slugs || []).join(", "));
                }
            }
        } catch {
            console.error("Failed to fetch blog");
        } finally {
            setLoading(false);
        }
    }, [blogId]);

    useEffect(() => {
        // Check auth
        fetch("/api/admin/check").then((res) => {
            if (!res.ok) router.push("/admin");
        });
        fetchBlog();
    }, [fetchBlog, router]);

    const slugify = (text: string) =>
        text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

    const handleTitleChange = (title: string) => {
        setForm((prev) => ({
            ...prev,
            title,
            slug: prev.id ? prev.slug : slugify(title),
            meta_title: prev.meta_title || title,
        }));
    };

    const handleSave = async () => {
        if (!form.title.trim() || !form.slug.trim()) {
            alert("Title and slug are required");
            return;
        }
        setSaving(true);
        try {
            const method = form.id ? "PUT" : "POST";
            const res = await fetch("/api/admin/blogs", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    tags: tagsInput
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    related_tool_slugs: toolSlugsInput
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                }),
            });

            if (res.ok) {
                router.push("/admin/dashboard");
            } else {
                const data = await res.json();
                alert(data.error || "Failed to save blog");
            }
        } catch {
            alert("Failed to save blog");
        } finally {
            setSaving(false);
        }
    };

    // Content sections
    const addContentSection = () => {
        setForm((prev) => ({ ...prev, content: [...prev.content, { heading: "", body: "" }] }));
    };

    const removeContentSection = (index: number) => {
        setForm((prev) => ({ ...prev, content: prev.content.filter((_, i) => i !== index) }));
    };

    const updateContentSection = (index: number, field: "heading" | "body", value: string) => {
        setForm((prev) => ({
            ...prev,
            content: prev.content.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
        }));
    };

    const moveContentSection = (index: number, direction: "up" | "down") => {
        const newContent = [...form.content];
        const newIndex = direction === "up" ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newContent.length) return;
        [newContent[index], newContent[newIndex]] = [newContent[newIndex], newContent[index]];
        setForm((prev) => ({ ...prev, content: newContent }));
    };

    // FAQs
    const addFAQ = () => {
        setForm((prev) => ({ ...prev, faqs: [...prev.faqs, { question: "", answer: "" }] }));
    };

    const removeFAQ = (index: number) => {
        setForm((prev) => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== index) }));
    };

    const updateFAQ = (index: number, field: "question" | "answer", value: string) => {
        setForm((prev) => ({
            ...prev,
            faqs: prev.faqs.map((f, i) => (i === index ? { ...f, [field]: value } : f)),
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#003F87] animate-spin" />
            </div>
        );
    }

    const sections = [
        { id: "basic", label: "Basic Info", icon: FileText },
        { id: "content", label: "Content", icon: FileText },
        { id: "seo", label: "SEO", icon: Search },
        { id: "faqs", label: "FAQs", icon: HelpCircle },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#0a0f1e] text-white">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-[#0a0f1e]/90 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/dashboard"
                            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="font-bold text-lg">
                            {form.id ? "Edit Blog Post" : "New Blog Post"}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.is_published}
                                onChange={(e) => setForm((prev) => ({ ...prev, is_published: e.target.checked }))}
                                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#003F87] focus:ring-[#003F87]"
                            />
                            <Globe className="w-4 h-4 text-white/40" />
                            <span className="text-white/60">Published</span>
                        </label>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-blue-500/20"
                            style={{ background: "linear-gradient(135deg, #003F87, #006BD6)" }}
                        >
                            {saving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {saving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>

                {/* Section tabs */}
                <div className="max-w-5xl mx-auto px-6 flex gap-1 overflow-x-auto scrollbar-hide pb-3">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeSection === section.id
                                    ? "bg-[#003F87]/20 text-[#60a5fa] border border-[#003F87]/30"
                                    : "text-white/40 hover:text-white/60 hover:bg-white/5"
                                }`}
                        >
                            <section.icon className="w-4 h-4" />
                            {section.label}
                        </button>
                    ))}
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Basic Info */}
                {activeSection === "basic" && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-white/60 text-sm font-medium mb-2">Title *</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#003F87] focus:ring-1 focus:ring-[#003F87] transition-all"
                                placeholder="Enter blog title"
                            />
                        </div>
                        <div>
                            <label className="block text-white/60 text-sm font-medium mb-2">Slug *</label>
                            <input
                                type="text"
                                value={form.slug}
                                onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#003F87] focus:ring-1 focus:ring-[#003F87] transition-all font-mono text-sm"
                                placeholder="blog-url-slug"
                            />
                        </div>
                        <div>
                            <label className="block text-white/60 text-sm font-medium mb-2">Excerpt</label>
                            <textarea
                                value={form.excerpt}
                                onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                                rows={3}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#003F87] focus:ring-1 focus:ring-[#003F87] transition-all resize-none"
                                placeholder="Brief summary of the blog post"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white/60 text-sm font-medium mb-2">Hero Image URL</label>
                                <input
                                    type="text"
                                    value={form.hero_image}
                                    onChange={(e) => setForm((prev) => ({ ...prev, hero_image: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#003F87] focus:ring-1 focus:ring-[#003F87] transition-all"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-white/60 text-sm font-medium mb-2">Author</label>
                                <input
                                    type="text"
                                    value={form.author}
                                    onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#003F87] focus:ring-1 focus:ring-[#003F87] transition-all"
                                    placeholder="Author name"
                                />
                            </div>
                            <div>
                                <label className="block text-white/60 text-sm font-medium mb-2">Published Date</label>
                                <input
                                    type="date"
                                    value={form.published_at}
                                    onChange={(e) => setForm((prev) => ({ ...prev, published_at: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#003F87] focus:ring-1 focus:ring-[#003F87] transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-white/60 text-sm font-medium mb-2">Reading Time</label>
                                <input
                                    type="text"
                                    value={form.reading_time}
                                    onChange={(e) => setForm((prev) => ({ ...prev, reading_time: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#003F87] focus:ring-1 focus:ring-[#003F87] transition-all"
                                    placeholder="5 min read"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Sections */}
                {activeSection === "content" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <p className="text-white/40 text-sm">
                                Add content sections. Each section has a heading and body (markdown supported).
                            </p>
                            <button
                                onClick={addContentSection}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[#60a5fa] bg-[#003F87]/20 border border-[#003F87]/30 hover:bg-[#003F87]/30 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Add Section
                            </button>
                        </div>

                        {form.content.map((section, index) => (
                            <div
                                key={index}
                                className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-white/30 uppercase tracking-wider">
                                        Section {index + 1}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => moveContentSection(index, "up")}
                                            disabled={index === 0}
                                            className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 disabled:opacity-20 transition-all"
                                        >
                                            <ChevronUp className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => moveContentSection(index, "down")}
                                            disabled={index === form.content.length - 1}
                                            className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 disabled:opacity-20 transition-all"
                                        >
                                            <ChevronDown className="w-4 h-4" />
                                        </button>
                                        {form.content.length > 1 && (
                                            <button
                                                onClick={() => removeContentSection(index)}
                                                className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    value={section.heading}
                                    onChange={(e) => updateContentSection(index, "heading", e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#003F87] focus:ring-1 focus:ring-[#003F87] transition-all font-semibold"
                                    placeholder="Section heading"
                                />
                                <textarea
                                    value={section.body}
                                    onChange={(e) => updateContentSection(index, "body", e.target.value)}
                                    rows={8}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#003F87] focus:ring-1 focus:ring-[#003F87] transition-all font-mono text-sm resize-y"
                                    placeholder="Section body (supports markdown)"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* SEO Section */}
                {activeSection === "seo" && (
                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-6">
                            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
                                <Search className="w-4 h-4" />
                                Search Engine Optimization
                            </h3>
                            <div>
                                <label className="block text-white/60 text-sm font-medium mb-2">
                                    Meta Title
                                    <span className="text-white/30 ml-2">({form.meta_title.length}/60 chars)</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.meta_title}
                                    onChange={(e) => setForm((prev) => ({ ...prev, meta_title: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#003F87] focus:ring-1 focus:ring-[#003F87] transition-all"
                                    placeholder="SEO page title"
                                />
                            </div>
                            <div>
                                <label className="block text-white/60 text-sm font-medium mb-2">
                                    Meta Description
                                    <span className="text-white/30 ml-2">({form.meta_description.length}/160 chars)</span>
                                </label>
                                <textarea
                                    value={form.meta_description}
                                    onChange={(e) => setForm((prev) => ({ ...prev, meta_description: e.target.value }))}
                                    rows={3}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#003F87] focus:ring-1 focus:ring-[#003F87] transition-all resize-none"
                                    placeholder="Brief description for search engine results"
                                />
                            </div>
                            <div>
                                <label className="block text-white/60 text-sm font-medium mb-2">Tags (comma-separated)</label>
                                <input
                                    type="text"
                                    value={tagsInput}
                                    onChange={(e) => setTagsInput(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#003F87] focus:ring-1 focus:ring-[#003F87] transition-all"
                                    placeholder="SEO, Web Development, Tools"
                                />
                            </div>
                            <div>
                                <label className="block text-white/60 text-sm font-medium mb-2">
                                    Related Tool Slugs (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={toolSlugsInput}
                                    onChange={(e) => setToolSlugsInput(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#003F87] focus:ring-1 focus:ring-[#003F87] transition-all font-mono text-sm"
                                    placeholder="tool-slug-1, tool-slug-2"
                                />
                            </div>

                            {/* Google Preview */}
                            <div className="border-t border-white/5 pt-6">
                                <h4 className="text-xs font-bold text-white/30 uppercase tracking-wider mb-4">
                                    Search Preview
                                </h4>
                                <div className="bg-white rounded-xl p-4">
                                    <p className="text-[#1a0dab] text-lg leading-tight font-medium truncate">
                                        {form.meta_title || form.title || "Page Title"}
                                    </p>
                                    <p className="text-green-700 text-sm mt-1 truncate">
                                        devpik.com/blog/{form.slug || "your-slug"}
                                    </p>
                                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                        {form.meta_description || form.excerpt || "Meta description will appear here..."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* FAQs */}
                {activeSection === "faqs" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <p className="text-white/40 text-sm">
                                Add FAQs to generate FAQ structured data for better SEO.
                            </p>
                            <button
                                onClick={addFAQ}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[#60a5fa] bg-[#003F87]/20 border border-[#003F87]/30 hover:bg-[#003F87]/30 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Add FAQ
                            </button>
                        </div>

                        {form.faqs.length === 0 && (
                            <div className="text-center py-16">
                                <HelpCircle className="w-10 h-10 text-white/10 mx-auto mb-3" />
                                <p className="text-white/30 text-sm">No FAQs added yet</p>
                            </div>
                        )}

                        {form.faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-white/30 uppercase tracking-wider">
                                        FAQ {index + 1}
                                    </span>
                                    <button
                                        onClick={() => removeFAQ(index)}
                                        className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={faq.question}
                                    onChange={(e) => updateFAQ(index, "question", e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#003F87] focus:ring-1 focus:ring-[#003F87] transition-all font-semibold"
                                    placeholder="Question?"
                                />
                                <textarea
                                    value={faq.answer}
                                    onChange={(e) => updateFAQ(index, "answer", e.target.value)}
                                    rows={3}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#003F87] focus:ring-1 focus:ring-[#003F87] transition-all resize-none"
                                    placeholder="Answer"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Settings */}
                {activeSection === "settings" && (
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-6">
                        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Post Settings
                        </h3>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                            <div>
                                <p className="font-medium text-white/80">Published Status</p>
                                <p className="text-xs text-white/30 mt-0.5">
                                    Only published posts are visible on the website
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.is_published}
                                    onChange={(e) => setForm((prev) => ({ ...prev, is_published: e.target.checked }))}
                                    className="sr-only"
                                />
                                <div
                                    className={`w-11 h-6 rounded-full transition-colors ${form.is_published ? "bg-green-500" : "bg-white/10"
                                        }`}
                                >
                                    <div
                                        className={`w-5 h-5 rounded-full bg-white shadow-lg transform transition-transform mt-0.5 ${form.is_published ? "translate-x-5.5 ml-0.5" : "translate-x-0.5"
                                            }`}
                                    />
                                </div>
                            </label>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
