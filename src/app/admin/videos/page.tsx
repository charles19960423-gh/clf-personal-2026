import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminVideoManager } from "@/components/admin/admin-video-manager";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { getVideoTopics } from "@/lib/data";

export default async function AdminVideosPage() {
  const videos = await getVideoTopics();

  return (
    <AdminLayout>
      <AdminPageHeader
        description="用于管理选题、脚本、平台、发布状态与复盘记录。"
        eyebrow="Admin Videos"
        title="视频选题管理"
      />

      <div className="mt-10">
        <AdminVideoManager videos={videos} />
      </div>
    </AdminLayout>
  );
}
