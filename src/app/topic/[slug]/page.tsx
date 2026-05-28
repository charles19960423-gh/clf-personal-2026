import Link from "next/link";
import { notFound } from "next/navigation";
import { getKnowledgeNodes, getTopics, getVideoTopics } from "@/lib/data";

export async function generateStaticParams() {
  const topics = await getTopics();

  return topics.map((topic) => ({
    slug: topic.slug,
  }));
}

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [topics, knowledgeNodes, videoTopics] = await Promise.all([
    getTopics(),
    getKnowledgeNodes(),
    getVideoTopics(),
  ]);
  const topic = topics.find((item) => item.slug === slug);

  if (!topic) {
    notFound();
  }

  const relatedNodes = topic.relatedNodes
    .map((nodeSlug) => knowledgeNodes.find((node) => node.slug === nodeSlug))
    .filter((node) => node !== undefined);
  const relatedVideos = topic.relatedVideos
    .map((videoId) => videoTopics.find((video) => video.id === videoId))
    .filter((video) => video !== undefined);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-10 lg:px-16">
      <Link className="text-sm text-zinc-500 hover:text-zinc-950" href="/topics">
        返回专题列表
      </Link>

      <header className="mt-8 border-y border-zinc-300 py-10">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
          {topic.id}
        </p>
        <h1 className="mt-5 text-4xl font-semibold leading-tight text-zinc-950 sm:text-6xl">
          {topic.title}
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-600 sm:text-lg">
          {topic.description}
        </p>
      </header>

      <section className="mt-12">
        <SectionTitle title="推荐阅读顺序" />
        <div className="mt-6 divide-y divide-zinc-200 border-y border-zinc-300">
          {relatedNodes.map((node, index) => (
            <Link
              className="grid gap-5 py-6 transition-colors hover:text-zinc-950 sm:grid-cols-[4rem_1fr_auto] sm:items-center"
              href={`/node/${node.slug}`}
              key={node.slug}
            >
              <span className="font-mono text-xs text-zinc-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
                  {node.code}
                </span>
                <span className="mt-2 block text-2xl font-medium text-zinc-950">
                  {node.title}
                </span>
                <span className="mt-2 block text-sm leading-7 text-zinc-600">
                  {node.definition}
                </span>
              </span>
              <span className="w-fit border border-zinc-300 px-4 py-2 text-sm text-zinc-600">
                进入节点
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <SectionTitle title="关联知识节点" />
          <div className="mt-6 grid gap-4">
            {relatedNodes.map((node) => (
              <Link
                className="border border-zinc-300 p-5 transition-colors hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
                href={`/node/${node.slug}`}
                key={node.slug}
              >
                <p className="font-mono text-xs uppercase tracking-[0.18em] opacity-55">
                  {node.code}
                </p>
                <h3 className="mt-3 text-xl font-medium">{node.title}</h3>
                <p className="mt-3 text-sm leading-7 opacity-65">
                  {node.summary}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <SectionTitle title="关联视频选题" />
          <div className="mt-6 grid gap-4">
            {relatedVideos.map((video) => (
              <Link
                className="border border-zinc-300 p-5 transition-colors hover:border-zinc-950"
                href="/videos"
                key={video.id}
              >
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
                  {video.id}
                </p>
                <h3 className="mt-3 text-xl font-medium text-zinc-950">
                  {video.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600">
                  {video.coreIdea}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="border-b border-zinc-300 pb-4 text-2xl font-medium text-zinc-950">
      {title}
    </h2>
  );
}
