"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SearchBox } from "@/components/site/search-box";
import type { KnowledgeNode, SystemKey, SystemModule } from "@/types";

type SystemFilter = SystemKey | "all";

type KnowledgeNodeLibraryProps = {
  nodes: KnowledgeNode[];
  systems: SystemModule[];
};

export function KnowledgeNodeLibrary({
  nodes,
  systems,
}: KnowledgeNodeLibraryProps) {
  const [query, setQuery] = useState("");
  const [systemFilter, setSystemFilter] = useState<SystemFilter>("human");
  const [tagFilter, setTagFilter] = useState<string>("all");

  const tags = useMemo(
    () => Array.from(new Set(nodes.flatMap((node) => node.tags))).sort(),
    [nodes],
  );

  const orderedNodes = useMemo(
    () =>
      [...nodes].sort((a, b) => {
        if (a.systemKey === "human" && b.systemKey !== "human") {
          return -1;
        }

        if (a.systemKey !== "human" && b.systemKey === "human") {
          return 1;
        }

        return a.code.localeCompare(b.code);
      }),
    [nodes],
  );

  const filteredNodes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return orderedNodes.filter((node) => {
      const system = systems.find((item) => item.key === node.systemKey);
      const matchesQuery =
        !normalizedQuery ||
        [
          node.title,
          node.summary,
          node.definition,
          ...node.tags,
          system?.name,
          system?.symbol,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesSystem =
        systemFilter === "all" || node.systemKey === systemFilter;
      const matchesTag = tagFilter === "all" || node.tags.includes(tagFilter);

      return matchesQuery && matchesSystem && matchesTag;
    });
  }, [orderedNodes, query, systemFilter, systems, tagFilter]);

  return (
    <section>
      <div className="border-y border-zinc-300 py-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <SearchBox
            nodes={nodes}
            onSearch={setQuery}
            placeholder="按标题、摘要、标签、系统搜索"
            showResults={false}
            systems={systems}
          />

          <div className="text-sm text-zinc-500">
            当前显示{" "}
            <span className="font-mono text-2xl text-zinc-950">
              {filteredNodes.length}
            </span>{" "}
            个节点
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <FilterButton
            isActive={systemFilter === "all"}
            label="全部"
            onClick={() => setSystemFilter("all")}
          />
          {systems.map((system) => (
            <FilterButton
              isActive={systemFilter === system.key}
              key={system.key}
              label={`${system.symbol} ${system.name}`}
              onClick={() => setSystemFilter(system.key)}
            />
          ))}
        </div>

        <div className="mt-6">
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-zinc-500">
            Tags
          </p>
          <div className="flex flex-wrap gap-2">
            <FilterButton
              isActive={tagFilter === "all"}
              label="全部标签"
              onClick={() => setTagFilter("all")}
            />
            {tags.map((tag) => (
              <FilterButton
                isActive={tagFilter === tag}
                key={tag}
                label={tag}
                onClick={() => setTagFilter(tag)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {filteredNodes.map((node) => (
          <KnowledgeNodeCard key={node.slug} node={node} systems={systems} />
        ))}
      </div>

      {filteredNodes.length === 0 ? (
        <div className="mt-8 border border-zinc-300 p-8 text-sm leading-7 text-zinc-600">
          没有找到匹配的知识节点。可以调整搜索关键词、系统筛选或标签筛选。
        </div>
      ) : null}
    </section>
  );
}

function FilterButton({
  isActive,
  label,
  onClick,
}: {
  isActive: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={[
        "border px-4 py-2 text-sm transition-colors",
        isActive
          ? "border-zinc-950 bg-zinc-950 text-white"
          : "border-zinc-300 text-zinc-600 hover:border-zinc-950 hover:text-zinc-950",
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function KnowledgeNodeCard({
  node,
  systems,
}: {
  node: KnowledgeNode;
  systems: SystemModule[];
}) {
  const system = systems.find((item) => item.key === node.systemKey);
  const isHuman = node.systemKey === "human";

  return (
    <article
      className={[
        "flex min-w-0 flex-col border p-6",
        isHuman ? "border-zinc-950 bg-white/45" : "border-zinc-300",
      ].join(" ")}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
            {node.code}
          </p>
          <h2 className="mt-4 text-2xl font-medium leading-snug text-zinc-950">
            {node.title}
          </h2>
        </div>
        <span className="inline-flex items-center gap-2 border border-zinc-300 px-3 py-2 text-xs text-zinc-500">
          <span className="text-zinc-950">{system?.symbol}</span>
          {system?.name}
        </span>
      </div>

      <p className="mt-6 text-sm leading-7 text-zinc-600">
        {node.definition || node.summary}
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

      <div className="mt-8 flex flex-col gap-4 border-t border-zinc-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <span className="w-fit border border-zinc-300 px-3 py-1 text-xs text-zinc-500">
          已发布
        </span>
        <Link
          className="w-fit border border-zinc-950 px-4 py-2 text-sm text-zinc-950 transition-colors hover:bg-zinc-950 hover:text-white"
          href={`/node/${node.slug}`}
        >
          进入节点
        </Link>
      </div>
    </article>
  );
}
