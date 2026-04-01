"use client";

import { useState } from "react";
import useSupabaseBrowser from "@/lib/supabase/client";
import { Trash2, Eye, Code2 } from "lucide-react";

interface Paste {
    id: string;
    short_code: string;
    title: string;
    language: string;
    view_count: number;
    created_at: string;
}

export function PastesList({ initialPastes }: { initialPastes: Paste[] }) {
    const [pastes, setPastes] = useState(initialPastes);
    const supabase = useSupabaseBrowser();

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this paste?")) return;
        const { error } = await supabase.from("pastes").delete().eq("id", id);
        if (!error) setPastes(pastes.filter((p) => p.id !== id));
    };

    return (
        <div className="space-y-3">
            {pastes.length === 0 ? (
                <p className="text-center py-10 text-white/40">No pastes yet</p>
            ) : (
                pastes.map((paste) => (
                    <div key={paste.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:border-white/10 transition-all group">
                        <Code2 className="w-5 h-5 text-white/20 shrink-0" />
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-white/80 truncate">{paste.title}</h3>
                            <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                                <span>{paste.language}</span>
                                <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {paste.view_count}
                                </span>
                                <span>{new Date(paste.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(paste.id)}
                            className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}
