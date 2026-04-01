"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import useSupabaseBrowser from "@/lib/supabase/client";
import {
    LayoutDashboard, FileText, Users, BarChart3, MessageSquare,
    ThumbsUp, Code2, LogOut, Menu, X, PlusCircle,
} from "lucide-react";

const NAV_ITEMS = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/dashboard/posts", label: "Blog Posts", icon: FileText },
    { href: "/admin/dashboard/subscribers", label: "Subscribers", icon: Users },
    { href: "/admin/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/dashboard/feedback", label: "Feedback", icon: ThumbsUp },
    { href: "/admin/dashboard/messages", label: "Messages", icon: MessageSquare },
    { href: "/admin/dashboard/pastes", label: "Pastes", icon: Code2 },
];

export function AdminSidebar() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const supabase = useSupabaseBrowser();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin");
        router.refresh();
    };

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-[#0d1529] border border-white/10 text-white/60 hover:text-white"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Overlay */}
            {open && (
                <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0d1529] border-r border-white/5 transform transition-transform lg:translate-x-0 lg:static ${open ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex flex-col h-full">
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
                        <button onClick={() => setOpen(false)} className="lg:hidden text-white/40 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {NAV_ITEMS.map((item) => {
                            const active = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                        active
                                            ? "bg-[#003F87]/20 text-[#60a5fa] border border-[#003F87]/30"
                                            : "text-white/50 hover:text-white/80 hover:bg-white/5"
                                    }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="px-4 pb-4 space-y-2">
                        <Link
                            href="/admin/dashboard/posts/new"
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
        </>
    );
}
