import { PageHeader } from "@/components/site/page-header";
import { VideoDatabase } from "@/components/site/video-database";
import { knowledgeNodes, videoTopics } from "@/lib/mock-data";

export default function VideosPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-10 lg:px-16">
      <PageHeader
        description="把知识节点转化为选题、脚本、拍摄与发布记录。"
        eyebrow="Video Database"
        title="视频内容数据库"
      />

      <div className="mt-10">
        <VideoDatabase nodes={knowledgeNodes} topics={videoTopics} />
      </div>
    </main>
  );
}
