import { createSupabaseServerClient } from "@/lib/supabase/server";

export type KnowledgeNodeMutationInput = {
  code: string;
  slug: string;
  title: string;
  module: string;
  summary: string;
  definition: string;
  coreIdea: string;
  explanation: string;
  examples: string[];
  tags: string[];
  relations: string[];
  status: string;
};

type MutationResult<T> = {
  data: T | null;
  error: string | null;
};

type SupabaseMutationError = {
  code?: string;
  message: string;
};

function toKnowledgeNodePayload(input: KnowledgeNodeMutationInput) {
  return {
    code: input.code,
    slug: input.slug,
    title: input.title,
    module: input.module,
    summary: input.summary,
    definition: input.definition,
    core_idea: input.coreIdea,
    explanation: input.explanation,
    examples: input.examples,
    tags: input.tags,
    relations: input.relations,
    status: input.status,
  };
}

function formatSupabaseError(error: SupabaseMutationError) {
  if (error.code === "23505") {
    return "slug 或唯一字段已存在，请更换后再保存。";
  }

  if (error.code === "PGRST116") {
    return "没有找到可更新的知识节点，请确认 slug 是否存在。";
  }

  if (error.code === "42501") {
    return "Supabase 表权限不足。请在 SQL Editor 执行 grant 权限脚本后重试。";
  }

  return error.message;
}

export async function createKnowledgeNodeInSupabase(
  input: KnowledgeNodeMutationInput,
): Promise<MutationResult<unknown>> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      data: null,
      error: "Supabase 未配置，当前仅可预览表单，无法保存。",
    };
  }

  const { data, error } = await supabase
    .from("knowledge_nodes")
    .insert(toKnowledgeNodePayload(input))
    .select("*")
    .single();

  if (error) {
    return { data: null, error: formatSupabaseError(error) };
  }

  return { data, error: null };
}

export async function updateKnowledgeNodeInSupabase(
  currentSlug: string,
  input: KnowledgeNodeMutationInput,
): Promise<MutationResult<unknown>> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      data: null,
      error: "Supabase 未配置，当前仅可预览表单，无法保存。",
    };
  }

  const { data, error } = await supabase
    .from("knowledge_nodes")
    .update(toKnowledgeNodePayload(input))
    .eq("slug", currentSlug)
    .select("*")
    .single();

  if (error) {
    return { data: null, error: formatSupabaseError(error) };
  }

  return { data, error: null };
}
