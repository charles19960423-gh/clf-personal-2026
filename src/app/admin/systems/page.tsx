import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminSystemManager } from "@/components/admin/admin-system-manager";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { getSystems } from "@/lib/data";

export default async function AdminSystemsPage() {
  const systems = await getSystems();

  return (
    <AdminLayout>
      <AdminPageHeader
        description="用于管理国、族、家、企、人五大系统的名称、说明、排序与首页展示。"
        eyebrow="Admin Systems"
        title="系统结构管理"
      />

      <div className="mt-10">
        <AdminSystemManager systems={systems} />
      </div>
    </AdminLayout>
  );
}
