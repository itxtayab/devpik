import { createClient } from "@/lib/supabase/server";
import { MessagesList } from "./messages-list";

export default async function AdminMessagesPage() {
    const supabase = await createClient();
    const { data: messages } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Contact Messages</h2>
            <MessagesList initialMessages={messages || []} />
        </div>
    );
}
