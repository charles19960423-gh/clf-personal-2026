import { getSupabaseClient } from "@/lib/supabase/client";

export async function getKnowledgeNodesFromSupabase() {
  const supabase = getSupabaseClient();

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

export async function getKnowledgeNodeBySlugFromSupabase(slug: string) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("knowledge_nodes")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}

export async function getVideoTopicsFromSupabase() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("video_topics")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function getTopicsFromSupabase() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return [];
  }

  return data ?? [];
}
