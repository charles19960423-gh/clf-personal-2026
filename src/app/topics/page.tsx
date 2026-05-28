import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";
import { getTopics } from "@/lib/data";

export default async function TopicsPage() {
  const topics = await getTopics();
  const sortedTopics = [...topics].sort((a, b) => a.order - b.order);

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-10 lg:px-16">
      <PageHeader
        description="把知识节点与视频选题组织成可阅读、可学习、可行动的内容路径。"
        eyebrow="Topics"
        title="专题路径"
      />

      <section className="mt-10 grid gap-5 md:grid-cols-2">
        {sortedTopics.map((topic) => (
          <article className="border border-zinc-300 p-6" key={topic.id}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
                  {topic.id}
                </p>
                <h2 className="mt-4 text-3xl font-medium text-zinc-950">
                  {topic.title}
                </h2>
              </div>
              <span className="w-fit border border-zinc-300 px-3 py-1 text-xs text-zinc-500">
                {topic.status === "published" ? "已发布" : "草稿"}
              </span>
            </div>
            <p className="mt-6 text-sm leading-7 text-zinc-600">
              {topic.description}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 border-y border-zinc-200 py-4 text-sm text-zinc-500">
              <p>
                <span className="font-mono text-2xl text-zinc-950">
                  {topic.relatedNodes.length}
                </span>{" "}
                个知识节点
              </p>
              <p>
                <span className="font-mono text-2xl text-zinc-950">
                  {topic.relatedVideos.length}
                </span>{" "}
                个视频选题
              </p>
            </div>
            <Link
              className="mt-6 inline-flex border border-zinc-950 px-5 py-3 text-sm text-zinc-950 transition-colors hover:bg-zinc-950 hover:text-white"
              href={`/topic/${topic.slug}`}
            >
              进入专题
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
