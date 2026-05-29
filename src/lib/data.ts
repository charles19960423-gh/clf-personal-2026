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

export type SupabaseKnowledgeNode = {
  code?: string | null;
  slug?: string | null;
  title?: string | null;
  module?: string | null;
  parent_code?: string | null;
  level?: number | null;
  source?: string | null;
  file_path?: string | null;
  summary?: string | null;
  definition?: string | null;
  core_idea?: string | null;
  explanation?: string | null;
  examples?: unknown;
  tags?: string[] | null;
  relations?: string[] | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
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
  "01": "country",
  "02": "ethnos",
  "03": "family",
  "04": "enterprise",
  "05": "human",
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

function getStructureCode(code: string | null | undefined) {
  const match = code?.match(/^(\d{2}(?:-\d{2})*)/);

  return match?.[1];
}

function getModuleFromCode(code: string | null | undefined) {
  const rootCode = getStructureCode(code)?.split("-")[0];

  if (!rootCode) {
    return undefined;
  }

  const codeToModule: Record<string, string> = {
    "01": "国",
    "02": "族",
    "03": "家",
    "04": "企",
    "05": "人",
  };

  return codeToModule[rootCode];
}

function getParentCode(code: string | null | undefined) {
  const structureCode = getStructureCode(code);

  if (!structureCode || !structureCode.includes("-")) {
    return undefined;
  }

  return structureCode.split("-").slice(0, -1).join("-");
}

function getLevel(code: string | null | undefined) {
  const structureCode = getStructureCode(code);

  if (!structureCode) {
    return undefined;
  }

  return structureCode.split("-").length;
}

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

function normalizeSystemKeyFromNode(module: string | null | undefined, code?: string | null) {
  return normalizeSystemKey(module ?? getModuleFromCode(code));
}

export function normalizeKnowledgeNode(row: SupabaseKnowledgeNode): KnowledgeNode | null {
  if (!row.slug || !row.title) {
    return null;
  }

  return {
    slug: row.slug,
    code: row.code ?? row.slug,
    title: row.title,
    systemKey: normalizeSystemKeyFromNode(row.module, row.code),
    module: row.module ?? getModuleFromCode(row.code),
    parentCode: row.parent_code ?? getParentCode(row.code),
    level: row.level ?? getLevel(row.code),
    source: row.source === "markdown" || row.source === "mock" ? row.source : "supabase",
    filePath: row.file_path ?? undefined,
    summary: row.summary ?? "",
    definition: row.definition ?? row.summary ?? "",
    coreIdea: toStringArray(row.core_idea),
    explanation: row.explanation ?? "",
    examples: toStringArray(row.examples),
    videoAngles: [],
    readingPath: [],
    tags: row.tags ?? [],
    relations: row.relations ?? [],
    status: row.status ?? "draft",
    createdAt: row.created_at ?? undefined,
    updatedAt: row.updated_at ?? undefined,
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

  if (
    !frontmatter.slug ||
    !frontmatter.title ||
    !frontmatter.module ||
    !frontmatter.code ||
    !frontmatter.summary ||
    !frontmatter.definition ||
    !frontmatter.status
  ) {
    return null;
  }

  const sections = parseMarkdownSections(content);
  const summary = frontmatter.summary ?? "";
  const definition = frontmatter.definition ?? summary;

  return {
    slug: frontmatter.slug,
    code: frontmatter.code ?? frontmatter.id ?? frontmatter.slug,
    title: frontmatter.title,
    systemKey: normalizeSystemKeyFromNode(frontmatter.module, frontmatter.code),
    module: frontmatter.module ?? getModuleFromCode(frontmatter.code),
    parentCode: frontmatter.parentCode ?? getParentCode(frontmatter.code),
    level: frontmatter.level ?? getLevel(frontmatter.code),
    source: "markdown",
    filePath: node.filePath,
    summary,
    definition,
    coreIdea: sections.coreIdea.length > 0 ? sections.coreIdea : [definition],
    explanation: sections.explanation || summary,
    examples: sections.examples,
    videoAngles: sections.videoAngles,
    readingPath: sections.readingPath,
    tags: frontmatter.tags ?? [],
    status: frontmatter.status ?? "draft",
  };
}

export function getMarkdownKnowledgeNodes(): KnowledgeNode[] {
  try {
    return getLocalKnowledgeNodes()
      .map(normalizeMarkdownNode)
      .filter(isKnowledgeNode);
  } catch {
    return [];
  }
}

function withMockSource(node: KnowledgeNode): KnowledgeNode {
  return {
    ...node,
    module:
      node.module ??
      mockSystems.find((system) => system.key === node.systemKey)?.symbol,
    parentCode: node.parentCode ?? getParentCode(node.code),
    level: node.level ?? getLevel(node.code),
    source: node.source ?? "mock",
  };
}

function mergeKnowledgeNodes(
  supabaseNodes: KnowledgeNode[],
  markdownNodes: KnowledgeNode[],
  mockNodes: KnowledgeNode[],
) {
  const nodesBySlug = new Map<string, KnowledgeNode>();

  for (const node of mockNodes.map(withMockSource)) {
    nodesBySlug.set(node.slug, node);
  }

  for (const node of markdownNodes) {
    nodesBySlug.set(node.slug, node);
  }

  for (const node of supabaseNodes) {
    nodesBySlug.set(node.slug, node);
  }

  return Array.from(nodesBySlug.values()).sort((a, b) =>
    (getStructureCode(a.code) ?? a.code).localeCompare(
      getStructureCode(b.code) ?? b.code,
      "zh-CN",
    ),
  );
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

export function isKnowledgeNode(node: KnowledgeNode | null): node is KnowledgeNode {
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
  const markdownNodes = getMarkdownKnowledgeNodes();

  return mergeKnowledgeNodes(nodes, markdownNodes, mockKnowledgeNodes);
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
    mockKnowledgeNodes.map(withMockSource).find((item) => item.slug === slug) ??
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

export async function getKnowledgeTree(): Promise<KnowledgeNode[]> {
  const nodes = await getKnowledgeNodes();
  const nodesByCode = new Map<string, KnowledgeNode>(
    nodes.map((node) => [node.code, { ...node, children: [] }]),
  );
  const nodesByStructureCode = new Map<string, KnowledgeNode>();
  const roots: KnowledgeNode[] = [];

  for (const node of nodesByCode.values()) {
    const structureCode = getStructureCode(node.code);

    if (structureCode) {
      nodesByStructureCode.set(structureCode, node);
    }
  }

  for (const node of nodesByCode.values()) {
    const parent =
      (node.parentCode ? nodesByCode.get(node.parentCode) : undefined) ??
      (node.parentCode
        ? nodesByStructureCode.get(node.parentCode)
        : undefined);

    if (parent) {
      parent.children?.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots.sort((a, b) =>
    (getStructureCode(a.code) ?? a.code).localeCompare(
      getStructureCode(b.code) ?? b.code,
      "zh-CN",
    ),
  );
}

export async function getNodeChildren(code: string): Promise<KnowledgeNode[]> {
  const nodes = await getKnowledgeNodes();
  const structureCode = getStructureCode(code);

  return nodes
    .filter((node) => node.parentCode === code || node.parentCode === structureCode)
    .sort((a, b) =>
      (getStructureCode(a.code) ?? a.code).localeCompare(
        getStructureCode(b.code) ?? b.code,
        "zh-CN",
      ),
    );
}

export async function getNodeAncestors(code: string): Promise<KnowledgeNode[]> {
  const nodes = await getKnowledgeNodes();
  const nodesByCode = new Map(nodes.map((node) => [node.code, node]));
  const nodesByStructureCode = new Map(
    nodes
      .map((node) => {
        const structureCode = getStructureCode(node.code);

        return structureCode ? ([structureCode, node] as const) : null;
      })
      .filter((item): item is readonly [string, KnowledgeNode] => item !== null),
  );
  const ancestors: KnowledgeNode[] = [];
  let currentParentCode = getParentCode(code);

  while (currentParentCode) {
    const parent =
      nodesByCode.get(currentParentCode) ??
      nodesByStructureCode.get(currentParentCode);

    if (!parent) {
      break;
    }

    ancestors.unshift(parent);
    currentParentCode = parent.parentCode;
  }

  return ancestors;
}
