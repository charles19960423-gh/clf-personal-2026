import Link from "next/link";
import { systems } from "@/lib/mock-data";

export default function Home() {
  return (
    <main className="bg-[var(--background)] text-[var(--foreground)]">
      <section className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-16">
        <div className="grid flex-1 items-center gap-14 py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl">
            <p className="mb-7 text-sm uppercase tracking-[0.5em] text-zinc-500">
              Cognitive Operating System
            </p>
            <h1 className="text-5xl font-semibold leading-tight text-zinc-950 sm:text-7xl lg:text-8xl">
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
              <Link
                className="mt-8 inline-flex border border-zinc-950 px-5 py-3 text-sm text-zinc-950 transition-colors hover:bg-zinc-950 hover:text-white"
                href="/map"
              >
                进入认知地图
              </Link>
            </div>
          </div>

          <div className="border-y border-zinc-300 py-6">
            <p className="mb-5 text-sm text-zinc-500">五大系统入口</p>
            <div className="divide-y divide-zinc-200">
              {systems.map((system) => (
                <article
                  className="group grid grid-cols-[4rem_1fr] gap-5 py-5"
                  key={system.key}
                >
                  <div className="flex size-16 items-center justify-center border border-zinc-300 text-3xl font-light text-zinc-950 transition-colors group-hover:border-zinc-950 group-hover:bg-zinc-950 group-hover:text-white">
                    {system.symbol}
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-zinc-950">
                      {system.name}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      {system.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <footer className="border-t border-black/10 pt-5 text-xs uppercase tracking-[0.28em] text-zinc-500">
          国｜族｜家｜企｜人
        </footer>
      </section>
    </main>
  );
}
