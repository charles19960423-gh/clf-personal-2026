"use server";

import { revalidatePath } from "next/cache";
import {
  createKnowledgeNodeInSupabase,
  updateKnowledgeNodeInSupabase,
  type KnowledgeNodeMutationInput,
} from "@/lib/supabase/mutations";

export type KnowledgeNodeActionState = {
  ok: true;
  message: string;
} | {
  ok: false;
  message: string;
};

type KnowledgeNodeParseResult = {
  ok: true;
  input: KnowledgeNodeMutationInput;
} | {
  ok: false;
  message: string;
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function getRequiredString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function splitList(value: string) {
  return value
    .split(/[\n,，、]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseKnowledgeNodeForm(
  formData: FormData,
): KnowledgeNodeParseResult {
  const title = getRequiredString(formData, "title");
  const slug = getRequiredString(formData, "slug");
  const code = getRequiredString(formData, "code");
  const nodeModule = getRequiredString(formData, "module");
  const status = getRequiredString(formData, "status") || "draft";
  const summary = getRequiredString(formData, "summary");
  const definition = getRequiredString(formData, "definition");

  if (!title || !slug || !code || !nodeModule || !definition || !status) {
    return {
      ok: false,
      message: "请填写标题、slug、编号、所属系统、一句话定义和状态。",
    };
  }

  if (!slugPattern.test(slug)) {
    return {
      ok: false,
      message: "slug 只能使用小写字母、数字和连字符，例如 self-narrative。",
    };
  }

  return {
    ok: true,
    input: {
      code,
      slug,
      title,
      module: nodeModule,
      status,
      summary,
      definition,
      coreIdea: getRequiredString(formData, "coreIdea"),
      explanation: getRequiredString(formData, "explanation"),
      examples: splitList(getRequiredString(formData, "examples")),
      tags: splitList(getRequiredString(formData, "tags")),
      relations: splitList(getRequiredString(formData, "relations")),
    },
  };
}

function revalidateKnowledgeNodePaths(slug: string, previousSlug?: string) {
  revalidatePath("/");
  revalidatePath("/map");
  revalidatePath("/nodes");
  revalidatePath("/admin");
  revalidatePath("/admin/nodes");
  revalidatePath(`/node/${slug}`);

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/node/${previousSlug}`);
  }
}

export async function createKnowledgeNodeAction(
  formData: FormData,
): Promise<KnowledgeNodeActionState> {
  const parsed = parseKnowledgeNodeForm(formData);

  if (!parsed.ok) {
    return parsed;
  }

  const result = await createKnowledgeNodeInSupabase(parsed.input);

  if (result.error) {
    return { ok: false, message: result.error };
  }

  revalidateKnowledgeNodePaths(parsed.input.slug);

  return { ok: true, message: "知识节点已写入 Supabase。" };
}

export async function updateKnowledgeNodeAction(
  currentSlug: string,
  formData: FormData,
): Promise<KnowledgeNodeActionState> {
  const parsed = parseKnowledgeNodeForm(formData);

  if (!parsed.ok) {
    return parsed;
  }

  const result = await updateKnowledgeNodeInSupabase(currentSlug, parsed.input);

  if (result.error) {
    return { ok: false, message: result.error };
  }

  revalidateKnowledgeNodePaths(parsed.input.slug, currentSlug);

  return { ok: true, message: "知识节点已更新到 Supabase。" };
}
