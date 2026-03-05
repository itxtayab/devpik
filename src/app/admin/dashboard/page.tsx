"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    FileText,
    PlusCircle,
    LogOut,
    Eye,
    Trash2,
    Edit,
    BarChart3,
    Menu,
    X,
    ChevronRight,
} from "lucide-react";

interface Blog {
    id: string;
    slug: string;
    title: string;
    is_published: boolean;
    published_at: string;
    tags: string[];
    created_at: string;
}

interface PageView {
    id: string;
    page_path: string;
    view_count: number;
    last_viewed_at: string;
}

export default function AdminDashboardPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [pageViews, setPageViews] = useState<PageView[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"blogs" | "views">("blogs");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();

    const checkAuth = useCallback(async () => {
        const res = await fetch("/api/admin/check");
        if (!res.ok) {
            router.push("/admin");
            return false;
        }
        return true;
    }, [router]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch blogs
            const blogsRes = await fetch("/api/admin/blogs");
            if (blogsRes.ok) {
                const data = await blogsRes.json();
                setBlogs(data.blogs || []);
            }

            // Fetch page views
            const viewsRes = await fetch("/api/views");
            if (viewsRes.ok) {
                const data = await viewsRes.json();
                setPageViews(data.views || []);
            }
        } catch {
            console.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth().then((ok) => {
            if (ok) fetchData();
        });
    }, [checkAuth, fetchData]);

    const handleLogout = async () => {
        await fetch("/api/admin/auth", { method: "DELETE" });
        router.push("/admin");
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this blog post?")) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/blogs?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setBlogs(blogs.filter((b) => b.id !== id));
            }
        } catch {
            alert("Failed to delete blog post");
        } finally {
            setDeletingId(null);
        }
    };

    const totalViews = pageViews.reduce((sum, pv) => sum + pv.view_count, 0);
    const publishedCount = blogs.filter((b) => b.is_published).length;

    return (
        <div className="min-h-screen bg-[#0a0f1e] text-white flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0d1529] border-r border-white/5 transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:static lg:block`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#003F87] to-[#006BD6] flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <LayoutDashboard className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-sm">DevPik Admin</h1>
                                <p className="text-[10px] text-white/40">Content Manager</p>
                            </div>
                        </div>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/40 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 px-4 py-4 space-y-1">
                        <button
                            onClick={() => setActiveTab("blogs")}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "blogs"
                                    ? "bg-[#003F87]/20 text-[#60a5fa] border border-[#003F87]/30"
                                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                                }`}
                        >
                            <FileText className="w-4 h-4" />
                            Blog Posts
                            <span className="ml-auto text-xs bg-white/10 px-2 py-0.5 rounded-full">
                                {blogs.length}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab("views")}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "views"
                                    ? "bg-[#003F87]/20 text-[#60a5fa] border border-[#003F87]/30"
                                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                                }`}
                        >
                            <BarChart3 className="w-4 h-4" />
                            Page Views
                            <span className="ml-auto text-xs bg-white/10 px-2 py-0.5 rounded-full">
                                {totalViews}
                            </span>
                        </button>
                    </nav>

                    {/* Actions */}
                    <div className="px-4 pb-4 space-y-2">
                        <Link
                            href="/admin/blog/new"
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:shadow-lg hover:shadow-blue-500/20"
                            style={{ background: "linear-gradient(135deg, #003F87 0%, #006BD6 100%)" }}
                        >
                            <PlusCircle className="w-4 h-4" />
                            New Blog Post
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-medium text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                {/* Top bar */}
                <header className="sticky top-0 z-20 bg-[#0a0f1e]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/60 hover:text-white">
                                <Menu className="w-5 h-5" />
                            </button>
                            <h2 className="text-lg font-bold">
                                {activeTab === "blogs" ? "Blog Posts" : "Page Views"}
                            </h2>
                        </div>
                        {activeTab === "blogs" && (
                            <Link
                                href="/admin/blog/new"
                                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm text-white hover:shadow-lg transition-all"
                                style={{ background: "linear-gradient(135deg, #003F87, #006BD6)" }}
                            >
                                <PlusCircle className="w-4 h-4" />
                                New Post
                            </Link>
                        )}
                    </div>
                </header>

                <div className="p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                            <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Total Posts</p>
                            <p className="text-2xl font-bold mt-1">{blogs.length}</p>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                            <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Published</p>
                            <p className="text-2xl font-bold mt-1 text-green-400">{publishedCount}</p>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                            <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Drafts</p>
                            <p className="text-2xl font-bold mt-1 text-amber-400">{blogs.length - publishedCount}</p>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                            <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Total Views</p>
                            <p className="text-2xl font-bold mt-1 text-[#60a5fa]">{totalViews.toLocaleString()}</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <svg className="animate-spin h-8 w-8 text-[#003F87]" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        </div>
                    ) : activeTab === "blogs" ? (
                        /* Blog List */
                        <div className="space-y-3">
                            {blogs.length === 0 ? (
                                <div className="text-center py-20">
                                    <FileText className="w-12 h-12 text-white/10 mx-auto mb-4" />
                                    <p className="text-white/40 text-lg font-medium">No blog posts yet</p>
                                    <p className="text-white/20 text-sm mt-1 mb-6">Create your first blog post to get started</p>
                                    <Link
                                        href="/admin/blog/new"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white"
                                        style={{ background: "linear-gradient(135deg, #003F87, #006BD6)" }}
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        Create Blog Post
                                    </Link>
                                </div>
                            ) : (
                                blogs.map((blog) => {
                                    const views = pageViews.find((pv) => pv.page_path === `/blog/${blog.slug}`);
                                    return (
                                        <div
                                            key={blog.id}
                                            className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <span
                                                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${blog.is_published
                                                                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                                                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                                }`}
                                                        >
                                                            {blog.is_published ? "Published" : "Draft"}
                                                        </span>
                                                        {views && (
                                                            <span className="text-[10px] text-white/30 flex items-center gap-1">
                                                                <Eye className="w-3 h-3" />
                                                                {views.view_count} views
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="font-semibold text-white/90 truncate">{blog.title}</h3>
                                                    <div className="flex items-center gap-3 mt-2 text-xs text-white/30">
                                                        <span>{new Date(blog.published_at).toLocaleDateString()}</span>
                                                        {blog.tags && blog.tags.length > 0 && (
                                                            <>
                                                                <span>•</span>
                                                                <span className="truncate">{blog.tags.slice(0, 3).join(", ")}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        href={`/admin/blog/${blog.id}/edit`}
                                                        className="p-2 rounded-lg text-white/40 hover:text-[#60a5fa] hover:bg-[#003F87]/20 transition-all"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/blog/${blog.slug}`}
                                                        target="_blank"
                                                        className="p-2 rounded-lg text-white/40 hover:text-green-400 hover:bg-green-500/10 transition-all"
                                                        title="View"
                                                    >
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(blog.id)}
                                                        disabled={deletingId === blog.id}
                                                        className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    ) : (
                        /* Page Views */
                        <div className="space-y-3">
                            {pageViews.length === 0 ? (
                                <div className="text-center py-20">
                                    <BarChart3 className="w-12 h-12 text-white/10 mx-auto mb-4" />
                                    <p className="text-white/40 text-lg font-medium">No page views recorded yet</p>
                                    <p className="text-white/20 text-sm mt-1">Page views will appear here once visitors start browsing</p>
                                </div>
                            ) : (
                                pageViews.map((pv) => (
                                    <div
                                        key={pv.id}
                                        className="bg-white/5 border border-white/5 rounded-2xl px-5 py-4 hover:border-white/10 transition-all flex items-center justify-between"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-white/80 truncate text-sm">{pv.page_path}</p>
                                            <p className="text-xs text-white/30 mt-0.5">
                                                Last viewed: {new Date(pv.last_viewed_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 text-[#60a5fa] shrink-0">
                                            <Eye className="w-4 h-4" />
                                            <span className="font-bold text-lg">{pv.view_count.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
