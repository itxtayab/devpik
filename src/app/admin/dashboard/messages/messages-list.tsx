"use client";

import { useState } from "react";
import useSupabaseBrowser from "@/lib/supabase/client";
import { Mail, MailOpen, ChevronDown, ChevronUp } from "lucide-react";

interface Message {
    id: string;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    is_read: boolean;
    created_at: string;
}

export function MessagesList({ initialMessages }: { initialMessages: Message[] }) {
    const [messages, setMessages] = useState(initialMessages);
    const [expanded, setExpanded] = useState<string | null>(null);
    const supabase = useSupabaseBrowser();

    const markAsRead = async (id: string) => {
        await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
        setMessages(messages.map((m) => m.id === id ? { ...m, is_read: true } : m));
    };

    const toggleExpand = (id: string) => {
        setExpanded(expanded === id ? null : id);
        const msg = messages.find((m) => m.id === id);
        if (msg && !msg.is_read) markAsRead(id);
    };

    return (
        <div className="space-y-3">
            {messages.length === 0 ? (
                <p className="text-center py-10 text-white/40">No messages yet</p>
            ) : (
                messages.map((msg) => (
                    <div key={msg.id} className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                        <button
                            onClick={() => toggleExpand(msg.id)}
                            className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-all text-left"
                        >
                            {msg.is_read ? (
                                <MailOpen className="w-4 h-4 text-white/30 shrink-0" />
                            ) : (
                                <Mail className="w-4 h-4 text-[#60a5fa] shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-medium ${msg.is_read ? "text-white/60" : "text-white/90"}`}>
                                        {msg.name}
                                    </span>
                                    {!msg.is_read && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#60a5fa]/20 text-[#60a5fa] font-medium">New</span>
                                    )}
                                </div>
                                <p className="text-xs text-white/40 truncate">
                                    {msg.subject || msg.message.slice(0, 60)}
                                </p>
                            </div>
                            <span className="text-xs text-white/30 shrink-0">
                                {new Date(msg.created_at).toLocaleDateString()}
                            </span>
                            {expanded === msg.id ? (
                                <ChevronUp className="w-4 h-4 text-white/30" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-white/30" />
                            )}
                        </button>

                        {expanded === msg.id && (
                            <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-2">
                                <div className="flex gap-4 text-xs text-white/40">
                                    <span>From: {msg.email}</span>
                                    {msg.subject && <span>Subject: {msg.subject}</span>}
                                </div>
                                <p className="text-sm text-white/70 whitespace-pre-wrap">{msg.message}</p>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
