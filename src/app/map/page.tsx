import { CognitiveMap } from "@/components/site/cognitive-map";
import { PageHeader } from "@/components/site/page-header";
import { SearchBox } from "@/components/site/search-box";
import { getKnowledgeNodes, getSystems } from "@/lib/data";

export default async function MapPage() {
  const [knowledgeNodes, systems] = await Promise.all([
    getKnowledgeNodes(),
    getSystems(),
  ]);

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-10 lg:px-16">
      <PageHeader
        description="以国、族、家、企、人为主轴，把世界结构、组织运行、人性理解与个体成长放入同一张可操作的认知地图。"
        eyebrow="Cognitive Map"
        title="林峰系统论认知地图"
      />

      <section className="mt-10 border-y border-zinc-300 py-6">
        <h2 className="mb-5 text-2xl font-medium text-zinc-950">
          快速搜索知识节点
        </h2>
        <SearchBox
          compact
          maxResults={4}
          nodes={knowledgeNodes}
          systems={systems}
        />
      </section>

      <div className="mt-12">
        <CognitiveMap systems={systems} />
      </div>
    </main>
  );
}
