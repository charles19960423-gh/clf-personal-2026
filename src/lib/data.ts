import {
  getKnowledgeNodeBySlugFromSupabase,
  getKnowledgeNodesFromSupabase,
  getTopicsFromSupabase,
  getVideoTopicsFromSupabase,
} from "@/lib/supabase/queries";
import {
  getLocalKnowledgeNodes,
  type LocalMarkdownNode,
} from "@/lib/markdown";
import {
  knowledgeNodes as mockKnowledgeNodes,
  systems as mockSystems,
  topics as mockTopics,
  videoTopics as mockVideoTopics,
} from "@/lib/mock-data";
import type {
  KnowledgeNode,
  SystemKey,
  SystemModule,
  Topic,
  VideoTopic,
} from "@/types";

type SupabaseKnowledgeNode = {
  code?: string | null;
  slug?: string | null;
  title?: string | null;
  module?: string | null;
  summary?: string | null;
  definition?: string | null;
  core_idea?: string | null;
  explanation?: string | null;
  examples?: unknown;
  tags?: string[] | null;
  relations?: string[] | null;
  status?: string | null;
};

type SupabaseVideoTopic = {
  id?: string | null;
  title?: string | null;
  core_idea?: string | null;
  related_nodes?: string[] | null;
  status?: VideoTopic["status"] | string | null;
  platform?: string | null;
  outline?: string | null;
  script?: string | null;
  publish_url?: string | null;
  publish_date?: string | null;
  review?: string | null;
  updated_at?: string | null;
};

type SupabaseTopic = {
  id?: string | null;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  related_nodes?: string[] | null;
  related_videos?: string[] | null;
  sort_order?: number | null;
  status?: Topic["status"] | string | null;
};

type MarkdownSections = {
  coreIdea: string[];
  explanation: string;
  examples: string[];
  videoAngles: string[];
  readingPath: string[];
};

const moduleToSystemKey: Record<string, SystemKey> = {
  国: "country",
  国家系统: "country",
  族: "ethnos",
  族群系统: "ethnos",
  家: "family",
  家庭系统: "family",
  企: "enterprise",
  组织系统: "enterprise",
  人: "human",
  个体系统: "human",
};

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(/\n|。|；|;/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeSystemKey(module: string | null | undefined): SystemKey {
  if (!module) {
    return "human";
  }

  return moduleToSystemKey[module] ?? "human";
}

function normalizeKnowledgeNode(row: SupabaseKnowledgeNode): KnowledgeNode | null {
  if (!row.slug || !row.title) {
    return null;
  }

  return {
    slug: row.slug,
    code: row.code ?? row.slug,
    title: row.title,
    systemKey: normalizeSystemKey(row.module),
    summary: row.summary ?? "",
    definition: row.definition ?? row.summary ?? "",
    coreIdea: toStringArray(row.core_idea),
    explanation: row.explanation ?? "",
    examples: toStringArray(row.examples),
    videoAngles: [],
    readingPath: [],
    tags: row.tags ?? [],
  };
}

function getMarkdownSection(content: string, heading: string) {
  const pattern = new RegExp(
    `^# ${heading}\\s*\\n([\\s\\S]*?)(?=\\n# |$)`,
    "m",
  );
  const match = content.match(pattern);

  return match?.[1]?.trim() ?? "";
}

function sectionToList(section: string): string[] {
  return section
    .split("\n")
    .map((line) => line.replace(/^[-*]\s+/, "").trim())
    .filter(Boolean);
}

function parseMarkdownSections(content: string): MarkdownSections {
  const coreIdeaSection = getMarkdownSection(content, "核心观点");
  const explanation = getMarkdownSection(content, "系统解释");
  const examplesSection = getMarkdownSection(content, "现实案例");
  const videoAnglesSection = getMarkdownSection(content, "视频化表达");
  const readingPathSection = getMarkdownSection(content, "延伸阅读");

  return {
    coreIdea: sectionToList(coreIdeaSection),
    explanation,
    examples: sectionToList(examplesSection),
    videoAngles: sectionToList(videoAnglesSection),
    readingPath: sectionToList(readingPathSection),
  };
}

function normalizeMarkdownNode(node: LocalMarkdownNode): KnowledgeNode | null {
  const { content, frontmatter } = node;

  if (!frontmatter.slug || !frontmatter.title) {
    return null;
  }

  const sections = parseMarkdownSections(content);
  const summary = frontmatter.summary ?? "";
  const definition = frontmatter.definition ?? summary;

  return {
    slug: frontmatter.slug,
    code: frontmatter.code ?? frontmatter.id ?? frontmatter.slug,
    title: frontmatter.title,
    systemKey: normalizeSystemKey(frontmatter.module),
    summary,
    definition,
    coreIdea: sections.coreIdea.length > 0 ? sections.coreIdea : [definition],
    explanation: sections.explanation || summary,
    examples: sections.examples,
    videoAngles: sections.videoAngles,
    readingPath: sections.readingPath,
    tags: frontmatter.tags ?? [],
  };
}

function getMarkdownKnowledgeNodes(): KnowledgeNode[] {
  try {
    return getLocalKnowledgeNodes()
      .map(normalizeMarkdownNode)
      .filter(isKnowledgeNode);
  } catch {
    return [];
  }
}

function normalizeVideoStatus(status: string | null | undefined): VideoTopic["status"] {
  const validStatuses: VideoTopic["status"][] = [
    "inspiration",
    "scripting",
    "ready-to-shoot",
    "shot",
    "published",
  ];

  return validStatuses.includes(status as VideoTopic["status"])
    ? (status as VideoTopic["status"])
    : "inspiration";
}

function normalizeVideoTopic(row: SupabaseVideoTopic): VideoTopic | null {
  if (!row.id || !row.title) {
    return null;
  }

  return {
    id: row.id,
    title: row.title,
    coreIdea: row.core_idea ?? "",
    relatedNodes: row.related_nodes ?? [],
    status: normalizeVideoStatus(row.status),
    platform: toStringArray(row.platform),
    outline: toStringArray(row.outline),
    script: row.script ?? "",
    publishUrl: row.publish_url ?? null,
    publishDate: row.publish_date ?? null,
    review: {
      updatedAt: row.updated_at?.slice(0, 10) ?? "",
      conclusion: row.review ?? "",
    },
  };
}

function normalizeTopicStatus(status: string | null | undefined): Topic["status"] {
  return status === "published" ? "published" : "draft";
}

function normalizeTopic(row: SupabaseTopic): Topic | null {
  if (!row.id || !row.slug || !row.title) {
    return null;
  }

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description ?? "",
    relatedNodes: row.related_nodes ?? [],
    relatedVideos: row.related_videos ?? [],
    order: row.sort_order ?? 0,
    status: normalizeTopicStatus(row.status),
  };
}

function isKnowledgeNode(node: KnowledgeNode | null): node is KnowledgeNode {
  return node !== null;
}

function isVideoTopic(topic: VideoTopic | null): topic is VideoTopic {
  return topic !== null;
}

function isTopic(topic: Topic | null): topic is Topic {
  return topic !== null;
}

export async function getKnowledgeNodes(): Promise<KnowledgeNode[]> {
  const rows = (await getKnowledgeNodesFromSupabase()) as SupabaseKnowledgeNode[];
  const nodes = rows.map(normalizeKnowledgeNode).filter(isKnowledgeNode);

  if (nodes.length > 0) {
    return nodes;
  }

  const markdownNodes = getMarkdownKnowledgeNodes();

  return markdownNodes.length > 0 ? markdownNodes : mockKnowledgeNodes;
}

export async function getKnowledgeNodeBySlug(
  slug: string,
): Promise<KnowledgeNode | null> {
  const row = (await getKnowledgeNodeBySlugFromSupabase(
    slug,
  )) as SupabaseKnowledgeNode | null;
  const node = row ? normalizeKnowledgeNode(row) : null;
  const markdownNode = getMarkdownKnowledgeNodes().find(
    (item) => item.slug === slug,
  );

  return (
    node ??
    markdownNode ??
    mockKnowledgeNodes.find((item) => item.slug === slug) ??
    null
  );
}

export async function getVideoTopics(): Promise<VideoTopic[]> {
  const rows = (await getVideoTopicsFromSupabase()) as SupabaseVideoTopic[];
  const topics = rows.map(normalizeVideoTopic).filter(isVideoTopic);

  return topics.length > 0 ? topics : mockVideoTopics;
}

export async function getTopics(): Promise<Topic[]> {
  const rows = (await getTopicsFromSupabase()) as SupabaseTopic[];
  const topics = rows.map(normalizeTopic).filter(isTopic);

  return topics.length > 0 ? topics : mockTopics;
}

export async function getSystems(): Promise<SystemModule[]> {
  const nodes = await getKnowledgeNodes();

  return mockSystems.map((system) => ({
    ...system,
    nodes: nodes.filter((node) => node.systemKey === system.key),
  }));
}
