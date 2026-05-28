import Link from "next/link";
import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { AdminSection } from "@/components/admin/ui/admin-section";
import { AdminStatCard } from "@/components/admin/ui/admin-stat-card";
import { getKnowledgeNodes, getSystems, getVideoTopics } from "@/lib/data";

const pendingVideoStatuses = ["inspiration", "scripting", "ready-to-shoot", "shot"];

const adminFeatures = [
  {
    title: "知识节点管理",
    description: "维护定义、核心观点、案例、阅读路径与关联节点。",
    href: "/admin/nodes",
  },
  {
    title: "视频选题管理",
    description: "管理选题状态、脚本、平台、发布与复盘记录。",
    href: "/admin/videos",
  },
  {
    title: "认知地图管理",
    description: "调整国、族、家、企、人五大系统与节点结构。",
    href: "/admin/systems",
  },
  {
    title: "专题管理",
    description: "预留专题策划入口，用于组织系列化内容。",
    href: "/admin/topics",
  },
  {
    title: "标签管理",
    description: "预留标签体系入口，用于统一内容分类与检索。",
    href: "/admin/tags",
  },
  {
    title: "Obsidian 同步设置",
    description: "预留 Markdown 内容同步配置，不接入真实同步。",
    href: "/admin/obsidian",
  },
];

const workflowSteps = [
  "灵感",
  "知识节点",
  "视频选题",
  "脚本",
  "拍摄",
  "发布",
  "复盘",
];

const videoStatusLabels = {
  inspiration: "灵感",
  scripting: "写脚本",
  "ready-to-shoot": "待拍摄",
  shot: "已拍摄",
  published: "已发布",
};

function getSystemSymbol(
  systems: Awaited<ReturnType<typeof getSystems>>,
  systemKey: Awaited<ReturnType<typeof getKnowledgeNodes>>[number]["systemKey"],
) {
  return systems.find((system) => system.key === systemKey)?.symbol ?? "";
}

function getSystemName(
  systems: Awaited<ReturnType<typeof getSystems>>,
  systemKey: Awaited<ReturnType<typeof getKnowledgeNodes>>[number]["systemKey"],
) {
  return systems.find((system) => system.key === systemKey)?.name ?? "";
}

function getFirstRelatedNodeTitle(
  knowledgeNodes: Awaited<ReturnType<typeof getKnowledgeNodes>>,
  slug: string,
) {
  return knowledgeNodes.find((node) => node.slug === slug)?.title ?? "未关联节点";
}

export default async function AdminPage() {
  const [knowledgeNodes, systems, videoTopics] = await Promise.all([
    getKnowledgeNodes(),
    getSystems(),
    getVideoTopics(),
  ]);
  const overviewEntries = [
    {
      title: "知识节点数量",
      value: knowledgeNodes.length,
      description: "当前知识库节点总量。",
    },
    {
      title: "视频选题数量",
      value: videoTopics.length,
      description: "从知识节点转化而来的内容选题。",
    },
    {
      title: "五大系统数量",
      value: systems.length,
      description: "国、族、家、企、人系统结构。",
    },
    {
      title: "待处理内容数量",
      value: videoTopics.filter((topic) =>
        pendingVideoStatuses.includes(topic.status),
      ).length,
      description: "未发布的视频选题与内容任务。",
    },
  ];
  const recentNodes = knowledgeNodes.slice(-4).reverse();
  const recentVideos = [...videoTopics]
    .sort(
      (a, b) =>
        new Date(b.review.updatedAt).getTime() -
        new Date(a.review.updatedAt).getTime(),
    )
    .slice(0, 4);

  return (
    <AdminLayout>
      <AdminPageHeader
        description="用于管理知识节点、视频选题、专题与系统结构。"
        eyebrow="Admin Console"
        title="系统管理后台"
      />

      <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {overviewEntries.map((entry) => (
          <AdminStatCard
            description={entry.description}
            key={entry.title}
            label={entry.title}
            value={entry.value}
          />
        ))}
      </section>

      <AdminSection
        className="mt-14"
        description="当前仅作为入口与信息架构占位，不做真实新增、编辑、登录或数据库写入。"
        title="后台功能入口"
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {adminFeatures.map((feature) => (
            <Link
              className="group border border-zinc-300 p-6 transition-colors hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
              href={feature.href}
              key={feature.title}
            >
              <div className="flex items-start justify-between gap-5">
                <h3 className="text-xl font-medium">{feature.title}</h3>
                <span className="font-mono text-xs uppercase tracking-[0.2em] opacity-50">
                  Entry
                </span>
              </div>
              <p className="mt-5 text-sm leading-7 opacity-65">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </AdminSection>

      <section className="mt-14 grid gap-8 lg:grid-cols-2">
        <AdminSection
          description="展示最近纳入系统结构的知识节点。"
          title="最近更新：知识节点"
        >
          <div className="divide-y divide-zinc-200 border-y border-zinc-300">
            {recentNodes.map((node) => (
              <Link
                className="grid gap-4 py-5 transition-colors hover:text-zinc-950 sm:grid-cols-[4rem_1fr]"
                href={`/node/${node.slug}`}
                key={node.slug}
              >
                <span className="flex size-14 items-center justify-center border border-zinc-300 text-2xl font-light text-zinc-950">
                  {getSystemSymbol(systems, node.systemKey)}
                </span>
                <span>
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
                    {node.code} · {getSystemName(systems, node.systemKey)}
                  </span>
                  <span className="mt-2 block text-lg font-medium text-zinc-950">
                    {node.title}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-zinc-600">
                    {node.summary}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </AdminSection>

        <AdminSection
          description="展示最近推进的视频选题与内容生产状态。"
          title="最近更新：视频选题"
        >
          <div className="divide-y divide-zinc-200 border-y border-zinc-300">
            {recentVideos.map((topic) => (
              <Link className="block py-5" href="/videos" key={topic.id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
                      {topic.id} · {topic.review.updatedAt}
                    </p>
                    <h3 className="mt-2 text-lg font-medium text-zinc-950">
                      {topic.title}
                    </h3>
                  </div>
                  <span className="w-fit border border-zinc-300 px-3 py-1 text-xs text-zinc-500">
                    {videoStatusLabels[topic.status]}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  来源：{getFirstRelatedNodeTitle(
                    knowledgeNodes,
                    topic.relatedNodes[0],
                  )}
                </p>
              </Link>
            ))}
          </div>
        </AdminSection>
      </section>

      <AdminSection
        className="mt-14"
        description="把零散灵感沉淀为知识结构，再转化为可发布、可复盘的视频内容。"
        title="内容生产流程"
      >
        <div className="grid gap-3 md:grid-cols-7">
          {workflowSteps.map((step, index) => (
            <div
              className="relative border border-zinc-300 p-5 md:min-h-36"
              key={step}
            >
              <p className="font-mono text-xs text-zinc-400">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-8 text-lg font-medium text-zinc-950">{step}</h3>
              {index < workflowSteps.length - 1 ? (
                <span className="absolute bottom-4 right-5 text-zinc-400 md:-right-2 md:bottom-auto md:top-1/2 md:-translate-y-1/2">
                  →
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </AdminSection>

      <div className="mt-14 border-y border-zinc-300 py-8">
        <p className="text-sm leading-7 text-zinc-600">
          当前后台为静态管理骨架。真实新增、编辑、登录、权限、Supabase
          持久化与 Obsidian 同步将在后续阶段逐步接入。
        </p>
      </div>
    </AdminLayout>
  );
}
