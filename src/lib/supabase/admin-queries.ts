import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getKnowledgeNodesFromSupabaseForAdmin() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("knowledge_nodes")
    .select("*")
    .order("code", { ascending: true });

  if (error) {
    return [];
  }

  return data ?? [];
}
