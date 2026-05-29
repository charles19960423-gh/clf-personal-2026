import { KnowledgeNodeLibrary } from "@/components/site/knowledge-node-library";
import { PageHeader } from "@/components/site/page-header";
import { getKnowledgeNodes, getSystems } from "@/lib/data";

export default async function NodesPage() {
  const [knowledgeNodes, systems] = await Promise.all([
    getKnowledgeNodes(),
    getSystems(),
  ]);

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-10 lg:px-16">
      <PageHeader
        description="所有认知系统中的概念、观点、案例与方法论节点。"
        eyebrow="Knowledge Base"
        title="知识节点总库"
      />

      <div className="mt-10">
        <KnowledgeNodeLibrary nodes={knowledgeNodes} systems={systems} />
      </div>

      <section className="mt-14 border-y border-zinc-300 py-8">
        <h2 className="text-2xl font-medium text-zinc-950">内容来源说明</h2>
        <p className="mt-4 text-sm leading-7 text-zinc-600">
          当前知识节点由统一数据层合并读取：Supabase 优先覆盖同 slug
          节点，Obsidian Markdown 自动补齐本地结构内容，Mock 数据作为兜底。
        </p>
      </section>
    </main>
  );
}
