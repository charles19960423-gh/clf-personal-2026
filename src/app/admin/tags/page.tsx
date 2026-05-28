import { AdminLayout } from "@/components/admin/admin-layout";
import {
  AdminTagManager,
  type AdminTag,
} from "@/components/admin/admin-tag-manager";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { getKnowledgeNodes } from "@/lib/data";

function buildTags(nodes: Awaited<ReturnType<typeof getKnowledgeNodes>>) {
  const tagMap = new Map<string, AdminTag>();

  for (const node of nodes) {
    for (const tag of node.tags) {
      const current = tagMap.get(tag);

      tagMap.set(tag, {
        name: tag,
        type: "node",
        description: current?.description ?? "知识节点标签，后续可统一编辑说明。",
        usageCount: (current?.usageCount ?? 0) + 1,
      });
    }
  }

  return Array.from(tagMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

export default async function AdminTagsPage() {
  const nodes = await getKnowledgeNodes();
  const tags = buildTags(nodes);

  return (
    <AdminLayout>
      <AdminPageHeader
        description="用于管理知识节点、视频选题与专题使用的标签体系。"
        eyebrow="Admin Tags"
        title="标签管理"
      />

      <div className="mt-10">
        <AdminTagManager tags={tags} />
      </div>
    </AdminLayout>
  );
}
