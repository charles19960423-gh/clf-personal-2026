"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { KnowledgeNode, SystemKey, SystemModule } from "@/types";

type CognitiveMapProps = {
  systems: SystemModule[];
};

function getInitialSystem(systems: SystemModule[]) {
  return systems.find((system) => system.key === "human") ?? systems[0];
}

export function CognitiveMap({ systems }: CognitiveMapProps) {
  const initialSystem = getInitialSystem(systems);
  const [activeSystemKey, setActiveSystemKey] = useState<SystemKey>(
    initialSystem.key,
  );
  const [selectedNodeSlug, setSelectedNodeSlug] = useState(
    initialSystem.nodes[0]?.slug ?? "",
  );

  const activeSystem = useMemo(
    () =>
      systems.find((system) => system.key === activeSystemKey) ??
      initialSystem,
    [activeSystemKey, initialSystem, systems],
  );

  const selectedNode =
    activeSystem.nodes.find((node) => node.slug === selectedNodeSlug) ??
    activeSystem.nodes[0];

  function switchSystem(system: SystemModule) {
    setActiveSystemKey(system.key);
    setSelectedNodeSlug(system.nodes[0]?.slug ?? "");
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[12rem_minmax(0,1fr)_20rem]">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <p className="mb-4 text-xs uppercase tracking-[0.32em] text-zinc-500">
          五大系统
        </p>
        <div className="grid grid-cols-5 gap-2 lg:grid-cols-1">
          {systems.map((system) => {
            const isActive = system.key === activeSystem.key;
            const isHuman = system.key === "human";

            return (
              <button
                className={[
                  "group min-w-0 border p-3 text-left transition-colors sm:p-4",
                  isActive
                    ? "border-zinc-950 bg-zinc-950 text-white"
                    : "border-zinc-300 text-zinc-700 hover:border-zinc-950",
                  isHuman && !isActive ? "bg-white/35" : "",
                ].join(" ")}
                key={system.key}
                onClick={() => switchSystem(system)}
                type="button"
              >
                <span className="block text-2xl font-light sm:text-4xl">
                  {system.symbol}
                </span>
                <span className="mt-2 hidden text-xs text-current/65 sm:block">
                  {system.name}
                </span>
                {isHuman ? (
                  <span className="mt-3 hidden border-t border-current/20 pt-3 text-[10px] uppercase tracking-[0.18em] text-current/70 lg:block">
                    Being Yourself
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </aside>

      <div className="min-w-0 border-y border-zinc-300 py-6">
        <div className="flex flex-col gap-6 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Current System
            </p>
            <div className="mt-4 flex items-baseline gap-4">
              <span className="text-6xl font-light text-zinc-950">
                {activeSystem.symbol}
              </span>
              <div>
                <h2 className="text-3xl font-semibold text-zinc-950">
                  {activeSystem.name}
                </h2>
                {activeSystem.key === "human" ? (
                  <p className="mt-2 text-xs uppercase tracking-[0.28em] text-zinc-500">
                    BEING YOURSELF
                  </p>
                ) : null}
              </div>
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-600">
              {activeSystem.description}
            </p>
          </div>
          <div className="w-fit border border-zinc-300 px-4 py-3 text-sm text-zinc-500">
            <span className="font-mono text-2xl text-zinc-950">
              {activeSystem.nodes.length}
            </span>{" "}
            个知识节点
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {activeSystem.nodes.map((node) => (
            <NodeListItem
              isSelected={node.slug === selectedNode?.slug}
              key={node.slug}
              node={node}
              onSelect={() => setSelectedNodeSlug(node.slug)}
            />
          ))}
        </div>
      </div>

      <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
        {selectedNode ? (
          <div
            className={[
              "border p-6",
              activeSystem.key === "human"
                ? "border-zinc-950 bg-zinc-950 text-white"
                : "border-zinc-300 text-zinc-950",
            ].join(" ")}
          >
            <p className="font-mono text-xs uppercase tracking-[0.22em] opacity-60">
              {selectedNode.code}
            </p>
            <h3 className="mt-5 text-3xl font-semibold leading-tight">
              {selectedNode.title}
            </h3>
            <p className="mt-5 text-sm leading-7 opacity-70">
              {selectedNode.definition}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {selectedNode.tags.map((tag) => (
                <span
                  className="border border-current/25 px-3 py-1 text-xs opacity-70"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-8 border-t border-current/20 pt-6">
              <p className="text-xs uppercase tracking-[0.22em] opacity-50">
                Preview
              </p>
              <p className="mt-4 text-sm leading-7 opacity-75">
                {selectedNode.coreIdea[0]}
              </p>
            </div>
            <Link
              className={[
                "mt-8 inline-flex w-full justify-center border px-5 py-3 text-sm transition-colors",
                activeSystem.key === "human"
                  ? "border-white/35 text-white hover:bg-white hover:text-zinc-950"
                  : "border-zinc-950 text-zinc-950 hover:bg-zinc-950 hover:text-white",
              ].join(" ")}
              href={`/node/${selectedNode.slug}`}
            >
              进入节点详情
            </Link>
          </div>
        ) : null}
      </aside>
    </section>
  );
}

function NodeListItem({
  isSelected,
  node,
  onSelect,
}: {
  isSelected: boolean;
  node: KnowledgeNode;
  onSelect: () => void;
}) {
  return (
    <article
      className={[
        "grid gap-4 border p-5 transition-colors sm:grid-cols-[1fr_auto] sm:items-center",
        isSelected ? "border-zinc-950 bg-white/45" : "border-zinc-300",
      ].join(" ")}
    >
      <button className="min-w-0 text-left" onClick={onSelect} type="button">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
            {node.code}
          </span>
          {isSelected ? (
            <span className="border border-zinc-950 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-zinc-950">
              Selected
            </span>
          ) : null}
        </div>
        <h3 className="mt-4 text-2xl font-medium leading-snug text-zinc-950">
          {node.title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-zinc-600">{node.summary}</p>
      </button>
      <Link
        className="w-fit border border-zinc-300 px-4 py-2 text-sm text-zinc-700 transition-colors hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
        href={`/node/${node.slug}`}
      >
        进入节点
      </Link>
    </article>
  );
}
