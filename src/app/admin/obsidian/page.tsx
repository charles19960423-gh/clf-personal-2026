import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { AdminSection } from "@/components/admin/ui/admin-section";
import { AdminStatCard } from "@/components/admin/ui/admin-stat-card";
import { getMarkdownKnowledgeNodes } from "@/lib/data";
import { getLocalKnowledgeNodes, type LocalMarkdownNode } from "@/lib/markdown";
import type { KnowledgeNode } from "@/types";

function readMarkdownNodes(): LocalMarkdownNode[] {
  try {
    return getLocalKnowledgeNodes();
  } catch {
    return [];
  }
}

export default function ObsidianSourcePage() {
  const markdownNodes = readMarkdownNodes();
  const standardNodes = getMarkdownKnowledgeNodes();
  const invalidCount = Math.max(markdownNodes.length - standardNodes.length, 0);
  const moduleEntries = getCountEntries(
    standardNodes.map((node) => node.module ?? node.systemKey),
  );
  const levelEntries = getCountEntries(
    standardNodes.map((node) => `Level ${node.level ?? "-"}`),
  );

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
        <AdminStatCard
          description="已具备标准 frontmatter，可进入统一数据层。"
          label="标准节点数量"
          value={standardNodes.length}
        />
        <AdminStatCard
          description="缺少 slug/title 等标准字段，暂不进入前台。"
          label="异常节点数量"
          value={invalidCount}
        />
        <AdminStatCard
          description="当前 Markdown 节点覆盖的系统模块数量。"
          label="模块数量"
          value={moduleEntries.length}
        />
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-2">
        <AdminSection
          description="按照 module 字段或 code 前缀自动归属五大系统。"
          title="模块分布"
        >
          <StatRows entries={moduleEntries} />
        </AdminSection>
        <AdminSection
          description="按照 code 的层级段数自动推导节点层级。"
          title="层级分布"
        >
          <StatRows entries={levelEntries} />
        </AdminSection>
      </section>

      <AdminSection
        className="mt-14"
        description="这里只做本地内容结构预览，不写入 Supabase。标准节点已可进入前台统一数据层。"
        title="标准 Markdown 节点列表"
      >
        {standardNodes.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {standardNodes.map((node) => (
              <MarkdownNodeCard key={node.slug} node={node} />
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

function MarkdownNodeCard({ node }: { node: KnowledgeNode }) {
  return (
    <article className="border border-zinc-300 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
            {node.code}
          </p>
          <h3 className="mt-4 text-2xl font-medium leading-snug text-zinc-950">
            {node.title}
          </h3>
        </div>
        <span className="w-fit border border-zinc-300 px-3 py-1 text-xs text-zinc-500">
          {node.status ?? "unknown"}
        </span>
      </div>

      <dl className="mt-6 grid gap-3 text-sm text-zinc-600 sm:grid-cols-4">
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-zinc-400">
            Slug
          </dt>
          <dd className="mt-1 text-zinc-950">{node.slug}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-zinc-400">
            Module
          </dt>
          <dd className="mt-1 text-zinc-950">{node.module ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-zinc-400">
            Level
          </dt>
          <dd className="mt-1 text-zinc-950">{node.level ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-zinc-400">
            Parent
          </dt>
          <dd className="mt-1 text-zinc-950">{node.parentCode ?? "-"}</dd>
        </div>
      </dl>

      <p className="mt-6 text-sm leading-7 text-zinc-600">
        {node.summary || "暂无摘要。"}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {node.tags.map((tag) => (
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

function getCountEntries(values: string[]) {
  const map = new Map<string, number>();

  for (const value of values) {
    map.set(value, (map.get(value) ?? 0) + 1);
  }

  return Array.from(map.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => a.label.localeCompare(b.label, "zh-CN"));
}

function StatRows({ entries }: { entries: Array<{ label: string; value: number }> }) {
  return (
    <div className="divide-y divide-zinc-200 border-y border-zinc-300">
      {entries.map((entry) => (
        <div
          className="flex items-center justify-between gap-5 py-4 text-sm"
          key={entry.label}
        >
          <span className="text-zinc-600">{entry.label}</span>
          <span className="font-mono text-xl text-zinc-950">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}
