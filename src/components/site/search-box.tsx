"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { KnowledgeNode, SystemModule } from "@/types";

type SearchBoxProps = {
  nodes: KnowledgeNode[];
  systems: SystemModule[];
  compact?: boolean;
  maxResults?: number;
  onSearch?: (keyword: string) => void;
  placeholder?: string;
  showResults?: boolean;
};

export function SearchBox({
  compact = false,
  maxResults,
  nodes,
  onSearch,
  placeholder = "按标题、摘要、标签、系统搜索",
  showResults = true,
  systems,
}: SearchBoxProps) {
  const [inputValue, setInputValue] = useState("");
  const [keyword, setKeyword] = useState("");

  const systemByKey = useMemo(
    () => new Map(systems.map((system) => [system.key, system])),
    [systems],
  );

  const results = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) {
      return [];
    }

    const matchedNodes = nodes.filter((node) => {
      const system = systemByKey.get(node.systemKey);
      const searchableText = [
        node.title,
        node.summary,
        node.definition,
        ...node.tags,
        system?.name,
        system?.symbol,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedKeyword);
    });

    return typeof maxResults === "number"
      ? matchedNodes.slice(0, maxResults)
      : matchedNodes;
  }, [keyword, maxResults, nodes, systemByKey]);

  function submitSearch() {
    const normalizedValue = inputValue.trim();
    setKeyword(normalizedValue);
    onSearch?.(normalizedValue);
  }

  return (
    <div>
      <div
        className={[
          "grid gap-3",
          compact ? "sm:grid-cols-[minmax(0,1fr)_auto]" : "lg:grid-cols-[minmax(0,1fr)_auto]",
        ].join(" ")}
      >
        <label className="block min-w-0">
          <span className="text-xs uppercase tracking-[0.28em] text-zinc-500">
            Search
          </span>
          <input
            className="mt-3 w-full border border-zinc-300 bg-transparent px-4 py-3 text-base text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-950"
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                submitSearch();
              }
            }}
            placeholder={placeholder}
            type="search"
            value={inputValue}
          />
        </label>
        <button
          className="h-fit self-end border border-zinc-950 bg-zinc-950 px-5 py-3 text-sm text-white transition-colors hover:bg-transparent hover:text-zinc-950"
          onClick={submitSearch}
          type="button"
        >
          搜索
        </button>
      </div>

      {showResults && keyword ? (
        <div className="mt-5">
          {results.length > 0 ? (
            <div className="grid gap-4">
              {results.map((node) => {
                const system = systemByKey.get(node.systemKey);

                return (
                  <article className="border border-zinc-300 p-5" key={node.slug}>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
                          {node.code} · {system?.symbol} {system?.name}
                        </p>
                        <h3 className="mt-3 text-2xl font-medium text-zinc-950">
                          {node.title}
                        </h3>
                      </div>
                      <Link
                        className="w-fit border border-zinc-950 px-4 py-2 text-sm text-zinc-950 transition-colors hover:bg-zinc-950 hover:text-white"
                        href={`/node/${node.slug}`}
                      >
                        进入节点
                      </Link>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-zinc-600">
                      {node.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
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
              })}
            </div>
          ) : (
            <div className="border border-zinc-300 p-5 text-sm text-zinc-600">
              暂时没有找到相关节点。
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
