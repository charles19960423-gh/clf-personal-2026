import Link from "next/link";
import { notFound } from "next/navigation";
import { SystemBadge } from "@/components/site/system-badge";
import { getKnowledgeNodeBySlug, getKnowledgeNodes } from "@/lib/data";
import type { KnowledgeNode } from "@/types";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="border-b border-zinc-300 pb-3 text-sm font-medium uppercase tracking-[0.28em] text-zinc-500">
      {children}
    </h2>
  );
}

export async function generateStaticParams() {
  const knowledgeNodes = await getKnowledgeNodes();

  return knowledgeNodes.map((node) => ({
    slug: node.slug,
  }));
}

function getRelatedNodes(node: KnowledgeNode, nodes: KnowledgeNode[], limit = 4) {
  const sameSystemNodes = nodes.filter(
    (item) => item.systemKey === node.systemKey && item.slug !== node.slug,
  );
  const otherNodes = nodes.filter((item) => item.systemKey !== node.systemKey);

  return [...sameSystemNodes, ...otherNodes].slice(0, limit);
}

export default async function NodeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [node, knowledgeNodes] = await Promise.all([
    getKnowledgeNodeBySlug(slug),
    getKnowledgeNodes(),
  ]);

  if (!node) {
    notFound();
  }

  const relatedNodes = getRelatedNodes(node, knowledgeNodes);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-10 lg:px-16">
      <Link className="text-sm text-zinc-500 hover:text-zinc-950" href="/nodes">
        返回知识库
      </Link>

      <article className="mt-8">
        <header className="border-y border-zinc-300 py-10">
          <div className="flex flex-wrap items-center gap-4">
            <SystemBadge systemKey={node.systemKey} />
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
              {node.code}
            </span>
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-zinc-950 sm:text-6xl">
            {node.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">
            {node.summary}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {node.tags.map((tag) => (
              <span
                className="border border-zinc-300 px-3 py-1 text-xs text-zinc-500"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-12">
            <section>
              <SectionTitle>一句话定义</SectionTitle>
              <p className="mt-6 border-l border-zinc-950 pl-6 text-2xl leading-10 text-zinc-950">
                {node.definition}
              </p>
            </section>

            <section>
              <SectionTitle>核心观点</SectionTitle>
              <div className="mt-6 divide-y divide-zinc-200 border-y border-zinc-300">
                {node.coreIdea.map((idea, index) => (
                  <div className="grid gap-4 py-5 sm:grid-cols-[4rem_1fr]" key={idea}>
                    <span className="font-mono text-xs text-zinc-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-base leading-8 text-zinc-700">{idea}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionTitle>系统解释</SectionTitle>
              <p className="mt-6 text-base leading-8 text-zinc-700">
                {node.explanation}
              </p>
            </section>

            <section>
              <SectionTitle>现实案例</SectionTitle>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {node.examples.map((example) => (
                  <p
                    className="border border-zinc-300 p-5 text-sm leading-7 text-zinc-600"
                    key={example}
                  >
                    {example}
                  </p>
                ))}
              </div>
            </section>

            <section>
              <SectionTitle>视频化表达</SectionTitle>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {node.videoAngles.map((angle, index) => (
                  <div className="border border-zinc-300 p-5" key={angle}>
                    <p className="font-mono text-xs text-zinc-500">
                      Angle {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-5 text-sm leading-7 text-zinc-700">
                      {angle}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-10 lg:border-l lg:border-zinc-300 lg:pl-8">
            <section>
              <SectionTitle>关联节点</SectionTitle>
              <div className="mt-5 space-y-3">
                {relatedNodes.map((relatedNode) => (
                  <Link
                    className="block border border-zinc-300 p-4 transition-colors hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
                    href={`/node/${relatedNode.slug}`}
                    key={relatedNode.slug}
                  >
                    <span className="font-mono text-xs opacity-60">
                      {relatedNode.code}
                    </span>
                    <span className="mt-2 block text-sm">
                      {relatedNode.title}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <SectionTitle>延伸阅读</SectionTitle>
              <ol className="mt-5 space-y-3">
                {node.readingPath.map((item, index) => (
                  <li
                    className="grid grid-cols-[2rem_1fr] gap-3 text-sm leading-6 text-zinc-600"
                    key={item}
                  >
                    <span className="font-mono text-xs text-zinc-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </section>
          </aside>
        </div>
      </article>
    </main>
  );
}
