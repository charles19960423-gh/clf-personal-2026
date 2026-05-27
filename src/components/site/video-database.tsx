"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { KnowledgeNode, VideoTopic } from "@/types";

type VideoFilter = VideoTopic["status"] | "all";

type VideoDatabaseProps = {
  nodes: KnowledgeNode[];
  topics: VideoTopic[];
};

const statusOptions: { label: string; value: VideoFilter }[] = [
  { label: "全部", value: "all" },
  { label: "灵感", value: "inspiration" },
  { label: "写脚本", value: "scripting" },
  { label: "待拍摄", value: "ready-to-shoot" },
  { label: "已拍摄", value: "shot" },
  { label: "已发布", value: "published" },
];

const statusLabels: Record<VideoTopic["status"], string> = {
  inspiration: "灵感",
  scripting: "写脚本",
  "ready-to-shoot": "待拍摄",
  shot: "已拍摄",
  published: "已发布",
};

function formatDate(date: string | null) {
  return date ?? "未发布";
}

export function VideoDatabase({ nodes, topics }: VideoDatabaseProps) {
  const [filter, setFilter] = useState<VideoFilter>("all");
  const [selectedId, setSelectedId] = useState(topics[0]?.id ?? "");
  const [generatorNotice, setGeneratorNotice] = useState(false);

  const filteredTopics = useMemo(() => {
    if (filter === "all") {
      return topics;
    }

    return topics.filter((topic) => topic.status === filter);
  }, [filter, topics]);

  const selectedTopic =
    filteredTopics.find((topic) => topic.id === selectedId) ??
    filteredTopics[0] ??
    topics[0];

  const relatedNodes = useMemo(() => {
    if (!selectedTopic) {
      return [];
    }

    return selectedTopic.relatedNodes
      .map((slug) => nodes.find((node) => node.slug === slug))
      .filter((node): node is KnowledgeNode => Boolean(node));
  }, [nodes, selectedTopic]);

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="min-w-0">
        <div className="flex flex-col gap-5 border-y border-zinc-300 py-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => {
                const isActive = option.value === filter;

                return (
                  <button
                    className={[
                      "border px-4 py-2 text-sm transition-colors",
                      isActive
                        ? "border-zinc-950 bg-zinc-950 text-white"
                        : "border-zinc-300 text-zinc-600 hover:border-zinc-950 hover:text-zinc-950",
                    ].join(" ")}
                    key={option.value}
                    onClick={() => setFilter(option.value)}
                    type="button"
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <button
              className="w-fit border border-zinc-950 px-5 py-3 text-sm text-zinc-950 transition-colors hover:bg-zinc-950 hover:text-white"
              onClick={() => setGeneratorNotice(true)}
              type="button"
            >
              从知识节点生成选题
            </button>
          </div>

          {generatorNotice ? (
            <p className="border-l border-zinc-950 pl-4 text-sm leading-7 text-zinc-600">
              占位说明：后续这里会读取知识节点的定义、核心观点和视频化表达，自动生成视频选题草稿。
            </p>
          ) : null}
        </div>

        <div className="mt-6 grid gap-4">
          {filteredTopics.map((topic) => (
            <VideoTopicCard
              isSelected={topic.id === selectedTopic?.id}
              key={topic.id}
              nodes={nodes}
              onSelect={() => setSelectedId(topic.id)}
              topic={topic}
            />
          ))}
        </div>
      </div>

      <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
        {selectedTopic ? (
          <div className="border border-zinc-300 p-6">
            <div className="flex items-start justify-between gap-5 border-b border-zinc-200 pb-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
                  {selectedTopic.id}
                </p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight text-zinc-950">
                  {selectedTopic.title}
                </h2>
              </div>
              <span className="shrink-0 border border-zinc-300 px-3 py-1 text-xs text-zinc-500">
                {statusLabels[selectedTopic.status]}
              </span>
            </div>

            <DetailBlock title="选题来源">
              <div className="space-y-3">
                {relatedNodes.map((node) => (
                  <Link
                    className="block border border-zinc-300 p-3 text-sm transition-colors hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
                    href={`/node/${node.slug}`}
                    key={node.slug}
                  >
                    <span className="font-mono text-xs opacity-60">
                      {node.code}
                    </span>
                    <span className="mt-1 block">{node.title}</span>
                  </Link>
                ))}
              </div>
            </DetailBlock>

            <DetailBlock title="视频大纲">
              <ol className="space-y-3">
                {selectedTopic.outline.map((item, index) => (
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
            </DetailBlock>

            <DetailBlock title="脚本片段">
              <p className="border-l border-zinc-950 pl-4 text-sm leading-7 text-zinc-700">
                {selectedTopic.script}
              </p>
            </DetailBlock>

            <DetailBlock title="发布信息">
              <div className="space-y-3 text-sm leading-6 text-zinc-600">
                <p>平台：{selectedTopic.platform.join(" / ")}</p>
                <p>发布日期：{formatDate(selectedTopic.publishDate)}</p>
                <p>
                  链接：
                  {selectedTopic.publishUrl ? (
                    <a
                      className="text-zinc-950 underline underline-offset-4"
                      href={selectedTopic.publishUrl}
                    >
                      查看发布页
                    </a>
                  ) : (
                    "暂无"
                  )}
                </p>
              </div>
            </DetailBlock>

            <DetailBlock title="复盘结论">
              <p className="text-sm leading-7 text-zinc-600">
                {selectedTopic.review.conclusion}
              </p>
            </DetailBlock>
          </div>
        ) : null}
      </aside>
    </section>
  );
}

function VideoTopicCard({
  isSelected,
  nodes,
  onSelect,
  topic,
}: {
  isSelected: boolean;
  nodes: KnowledgeNode[];
  onSelect: () => void;
  topic: VideoTopic;
}) {
  const relatedNodes = topic.relatedNodes
    .map((slug) => nodes.find((node) => node.slug === slug))
    .filter((node): node is KnowledgeNode => Boolean(node));

  return (
    <button
      className={[
        "w-full border p-5 text-left transition-colors",
        isSelected
          ? "border-zinc-950 bg-white/45"
          : "border-zinc-300 hover:border-zinc-950",
      ].join(" ")}
      onClick={onSelect}
      type="button"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
            {topic.id}
          </p>
          <h2 className="mt-4 text-2xl font-medium leading-snug text-zinc-950">
            {topic.title}
          </h2>
        </div>
        <span className="w-fit border border-zinc-300 px-3 py-1 text-xs text-zinc-500">
          {statusLabels[topic.status]}
        </span>
      </div>

      <p className="mt-5 text-sm leading-7 text-zinc-600">{topic.coreIdea}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {relatedNodes.map((node) => (
          <span
            className="border border-zinc-300 px-3 py-1 text-xs text-zinc-500"
            key={node.slug}
          >
            {node.title}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-2 border-t border-zinc-200 pt-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <span>{topic.platform.join(" / ")}</span>
        <span>{topic.publishDate ?? topic.review.updatedAt}</span>
      </div>
    </button>
  );
}

function DetailBlock({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="border-b border-zinc-200 py-6 last:border-b-0 last:pb-0">
      <h3 className="mb-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
        {title}
      </h3>
      {children}
    </section>
  );
}
