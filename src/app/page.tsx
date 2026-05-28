import Link from "next/link";
import { SearchBox } from "@/components/site/search-box";
import {
  getKnowledgeNodes,
  getSystems,
  getTopics,
  getVideoTopics,
} from "@/lib/data";

const systemIntroductions = {
  country: "理解世界结构、秩序与文明运行",
  ethnos: "理解群体、文化、身份与共同记忆",
  family: "理解亲密关系、代际传承与生命根系",
  enterprise: "理解组织协作、价值创造与结构效率",
  human: "理解心性、选择、能力结构与成为自己的路径",
};

export default async function Home() {
  const [knowledgeNodes, systems, topics, videoTopics] = await Promise.all([
    getKnowledgeNodes(),
    getSystems(),
    getTopics(),
    getVideoTopics(),
  ]);
  const latestNodes = knowledgeNodes
    .filter((node) => node.systemKey === "human")
    .slice(0, 3);
  const latestVideos = videoTopics.slice(0, 3);
  const explorationPaths = [...topics].sort((a, b) => a.order - b.order);

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)]">
      <section className="mx-auto grid min-h-[calc(100vh-73px)] w-full max-w-7xl items-center gap-14 px-6 py-16 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-16">
        <div>
          <p className="text-sm uppercase tracking-[0.45em] text-zinc-500">
            LIN FENG SYSTEM
          </p>
          <h1 className="mt-8 text-5xl font-semibold leading-tight text-zinc-950 sm:text-7xl lg:text-8xl">
            BEING
            <span className="block font-light text-zinc-500">YOURSELF</span>
          </h1>
          <div className="mt-10 border-l border-zinc-950 pl-6">
            <p className="text-2xl font-medium text-zinc-950 sm:text-4xl">
              成为你自己
            </p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg">
              林峰系统论，一个关于世界、组织、人性与个体成长的认知操作系统。
            </p>
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex justify-center border border-zinc-950 bg-zinc-950 px-5 py-3 text-sm text-white transition-colors hover:bg-transparent hover:text-zinc-950"
              href="/map"
            >
              进入认知地图
            </Link>
            <Link
              className="inline-flex justify-center border border-zinc-300 px-5 py-3 text-sm text-zinc-950 transition-colors hover:border-zinc-950"
              href="/nodes"
            >
              浏览知识库
            </Link>
          </div>
        </div>

        <div className="border-y border-zinc-300 py-6">
          <p className="mb-5 text-sm text-zinc-500">五大系统入口</p>
          <div className="divide-y divide-zinc-200">
            {systems.map((system) => {
              const isHuman = system.key === "human";

              return (
                <Link
                  className={[
                    "group grid grid-cols-[4rem_1fr] gap-5 py-5",
                    isHuman ? "text-zinc-950" : "",
                  ].join(" ")}
                  href="/map"
                  key={system.key}
                >
                  <div
                    className={[
                      "flex size-16 items-center justify-center border text-3xl font-light transition-colors group-hover:border-zinc-950 group-hover:bg-zinc-950 group-hover:text-white",
                      isHuman
                        ? "border-zinc-950 bg-zinc-950 text-white"
                        : "border-zinc-300 text-zinc-950",
                    ].join(" ")}
                  >
                    {system.symbol}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-medium text-zinc-950">
                        {system.name}
                      </h2>
                      {isHuman ? (
                        <span className="border border-zinc-300 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                          Core
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      {systemIntroductions[system.key]}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <SectionShell eyebrow="Search" title="快速搜索知识节点">
        <SearchBox
          maxResults={5}
          nodes={knowledgeNodes}
          systems={systems}
        />
      </SectionShell>

      <SectionShell eyebrow="Paths" title="推荐探索路径">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {explorationPaths.map((path) => (
            <article className="border border-zinc-300 p-6" key={path.title}>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
                {path.relatedNodes.length} Nodes
              </p>
              <h3 className="mt-5 text-2xl font-medium text-zinc-950">
                {path.title}
              </h3>
              <p className="mt-4 min-h-20 text-sm leading-7 text-zinc-600">
                {path.description}
              </p>
              <Link
                className="mt-6 inline-flex border border-zinc-950 px-4 py-2 text-sm text-zinc-950 transition-colors hover:bg-zinc-950 hover:text-white"
                href={`/topic/${path.slug}`}
              >
                进入路径
              </Link>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell eyebrow="Knowledge" title="最新知识节点">
        <div className="grid gap-5 md:grid-cols-3">
          {latestNodes.map((node) => (
            <Link
              className="group border border-zinc-300 p-6 transition-colors hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
              href={`/node/${node.slug}`}
              key={node.slug}
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500 group-hover:text-white/55">
                {node.code}
              </p>
              <h3 className="mt-5 text-2xl font-medium">{node.title}</h3>
              <p className="mt-4 text-sm leading-7 opacity-65">
                {node.definition}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {node.tags.map((tag) => (
                  <span
                    className="border border-current/20 px-3 py-1 text-xs opacity-65"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </SectionShell>

      <SectionShell eyebrow="Video" title="最新视频选题">
        <div className="grid gap-5 md:grid-cols-3">
          {latestVideos.map((topic) => (
            <Link
              className="border border-zinc-300 p-6 transition-colors hover:border-zinc-950"
              href="/videos"
              key={topic.id}
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
                {topic.id}
              </p>
              <h3 className="mt-5 text-2xl font-medium leading-snug text-zinc-950">
                {topic.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-zinc-600">
                {topic.coreIdea}
              </p>
              <p className="mt-6 border-t border-zinc-200 pt-4 text-xs text-zinc-500">
                {topic.platform.join(" / ")}
              </p>
            </Link>
          ))}
        </div>
      </SectionShell>

      <section className="mx-auto w-full max-w-7xl px-6 pb-16 pt-6 sm:px-10 lg:px-16">
        <div className="border-y border-zinc-950 py-12 text-center">
          <p className="mx-auto max-w-3xl text-3xl font-light leading-tight text-zinc-950 sm:text-5xl">
            系统不是为了定义你，而是为了帮助你看清自己。
          </p>
        </div>
      </section>
    </main>
  );
}

function SectionShell({
  children,
  eyebrow,
  title,
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10 lg:px-16">
      <div className="mb-8 border-b border-zinc-300 pb-5">
        <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
          {eyebrow}
        </p>
        <h2 className="mt-4 text-3xl font-semibold text-zinc-950 sm:text-5xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
