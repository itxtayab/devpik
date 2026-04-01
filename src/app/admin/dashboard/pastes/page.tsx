import { createClient } from "@/lib/supabase/server";
import { PastesList } from "./pastes-list";

export default async function AdminPastesPage() {
    const supabase = await createClient();
    const { data: pastes } = await supabase
        .from("pastes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Pastes</h2>
            <PastesList initialPastes={pastes || []} />
        </div>
    );
}
