import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminNodeManager } from "@/components/admin/admin-node-manager";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { getAdminKnowledgeNodes, getAdminSystems } from "@/lib/admin-data";

export default async function AdminNodesPage() {
  const [nodes, systems] = await Promise.all([
    getAdminKnowledgeNodes(),
    getAdminSystems(),
  ]);

  return (
    <AdminLayout>
      <AdminPageHeader
        description="用于管理定义、核心观点、案例、阅读路径与关联节点。"
        eyebrow="Admin Nodes"
        title="知识节点管理"
      />

      <div className="mt-10">
        <AdminNodeManager nodes={nodes} systems={systems} />
      </div>
    </AdminLayout>
  );
}
