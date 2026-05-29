import {
  getMarkdownKnowledgeNodes,
  isKnowledgeNode,
  normalizeKnowledgeNode,
  type SupabaseKnowledgeNode,
} from "@/lib/data";
import { knowledgeNodes as mockKnowledgeNodes, systems as mockSystems } from "@/lib/mock-data";
import { getKnowledgeNodesFromSupabaseForAdmin } from "@/lib/supabase/admin-queries";
import type { KnowledgeNode, SystemModule } from "@/types";

export async function getAdminKnowledgeNodes(): Promise<KnowledgeNode[]> {
  const rows = (await getKnowledgeNodesFromSupabaseForAdmin()) as SupabaseKnowledgeNode[];
  const nodes = rows.map(normalizeKnowledgeNode).filter(isKnowledgeNode);

  if (nodes.length > 0) {
    return nodes;
  }

  const markdownNodes = getMarkdownKnowledgeNodes();

  return markdownNodes.length > 0 ? markdownNodes : mockKnowledgeNodes;
}

export async function getAdminSystems(): Promise<SystemModule[]> {
  const nodes = await getAdminKnowledgeNodes();

  return mockSystems.map((system) => ({
    ...system,
    nodes: nodes.filter((node) => node.systemKey === system.key),
  }));
}
