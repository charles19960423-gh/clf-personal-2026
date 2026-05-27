import { KnowledgeNodeLibrary } from "@/components/site/knowledge-node-library";
import { PageHeader } from "@/components/site/page-header";
import { knowledgeNodes, systems } from "@/lib/mock-data";

export default function NodesPage() {
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
          当前内容来自 mock 数据；未来将从 Obsidian Markdown 与 Supabase
          同步，实现本地知识库、数据库与前端展示的一体化更新。
        </p>
      </section>
    </main>
  );
}
