import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { AdminSection } from "@/components/admin/ui/admin-section";
import { AdminStatCard } from "@/components/admin/ui/admin-stat-card";
import { getLocalKnowledgeNodes, type LocalMarkdownNode } from "@/lib/markdown";

function readMarkdownNodes(): LocalMarkdownNode[] {
  try {
    return getLocalKnowledgeNodes();
  } catch {
    return [];
  }
}

export default function ObsidianSourcePage() {
  const markdownNodes = readMarkdownNodes();

  return (
    <AdminLayout>
      <AdminPageHeader
        description="用于预览本地 Markdown 节点，未来可同步到 Supabase。"
        eyebrow="Obsidian Source"
        title="Obsidian 内容源"
      />

      <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          description="当前读取自项目本地的 content/nodes 目录。"
          label="Markdown 节点数量"
          value={markdownNodes.length}
        />
      </section>

      <AdminSection
        className="mt-14"
        description="这里只做本地内容预览，不写入 Supabase，也不替换前台数据源。"
        title="已读取的 Markdown 节点列表"
      >
        {markdownNodes.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {markdownNodes.map((node) => (
              <MarkdownNodeCard key={node.filePath} node={node} />
            ))}
          </div>
        ) : (
          <div className="border border-zinc-300 p-8 text-sm text-zinc-600">
            暂时没有读取到 Markdown 节点。
          </div>
        )}
      </AdminSection>
    </AdminLayout>
  );
}

function MarkdownNodeCard({ node }: { node: LocalMarkdownNode }) {
  const { frontmatter } = node;

  return (
    <article className="border border-zinc-300 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
            {frontmatter.code ?? frontmatter.id ?? "No Code"}
          </p>
          <h3 className="mt-4 text-2xl font-medium leading-snug text-zinc-950">
            {frontmatter.title ?? "未命名节点"}
          </h3>
        </div>
        <span className="w-fit border border-zinc-300 px-3 py-1 text-xs text-zinc-500">
          {frontmatter.status ?? "unknown"}
        </span>
      </div>

      <dl className="mt-6 grid gap-3 text-sm text-zinc-600 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-zinc-400">
            Slug
          </dt>
          <dd className="mt-1 text-zinc-950">{frontmatter.slug ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-zinc-400">
            Module
          </dt>
          <dd className="mt-1 text-zinc-950">{frontmatter.module ?? "-"}</dd>
        </div>
      </dl>

      <p className="mt-6 text-sm leading-7 text-zinc-600">
        {frontmatter.summary ?? "暂无摘要。"}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {(frontmatter.tags ?? []).map((tag) => (
          <span
            className="border border-zinc-300 px-3 py-1 text-xs text-zinc-500"
            key={tag}
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
