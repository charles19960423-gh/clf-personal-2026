import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminTopicManager } from "@/components/admin/admin-topic-manager";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { getTopics } from "@/lib/data";

export default async function AdminTopicsPage() {
  const topics = await getTopics();

  return (
    <AdminLayout>
      <AdminPageHeader
        description="用于管理专题、内容路径、关联知识节点与关联视频。"
        eyebrow="Admin Topics"
        title="专题管理"
      />

      <div className="mt-10">
        <AdminTopicManager topics={topics} />
      </div>
    </AdminLayout>
  );
}
