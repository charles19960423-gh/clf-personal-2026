import { CognitiveMap } from "@/components/site/cognitive-map";
import { PageHeader } from "@/components/site/page-header";
import { systems } from "@/lib/mock-data";

export default function MapPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-10 lg:px-16">
      <PageHeader
        description="以国、族、家、企、人为主轴，把世界结构、组织运行、人性理解与个体成长放入同一张可操作的认知地图。"
        eyebrow="Cognitive Map"
        title="林峰系统论认知地图"
      />

      <div className="mt-12">
        <CognitiveMap systems={systems} />
      </div>
    </main>
  );
}
