import { createClient } from "@/lib/supabase/server";
import { SubscribersList } from "./subscribers-list";

export default async function AdminSubscribersPage() {
    const supabase = await createClient();
    const { data: subscribers } = await supabase
        .from("subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Subscribers</h2>
            <SubscribersList initialSubscribers={subscribers || []} />
        </div>
    );
}
