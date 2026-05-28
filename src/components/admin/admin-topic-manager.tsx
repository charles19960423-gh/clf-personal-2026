"use client";

import { AdminActionButton } from "@/components/admin/ui/admin-action-button";
import { AdminFormField } from "@/components/admin/ui/admin-form-field";
import { AdminSection } from "@/components/admin/ui/admin-section";
import { AdminStatCard } from "@/components/admin/ui/admin-stat-card";
import type { Topic } from "@/types";
import { useState } from "react";

type AdminTopicManagerProps = {
  topics: Topic[];
};

const formFields = [
  { label: "标题 title", name: "title", placeholder: "例如：成为自己" },
  { label: "slug", name: "slug", placeholder: "例如：being-yourself-path" },
  {
    label: "专题说明 description",
    name: "description",
    placeholder: "说明这个专题解决什么问题、适合谁阅读",
    textarea: true,
  },
  {
    label: "关联知识节点 relatedNodes",
    name: "relatedNodes",
    placeholder: "例如：being-yourself, inner-order",
  },
  {
    label: "关联视频 relatedVideos",
    name: "relatedVideos",
    placeholder: "例如：video-001, video-005",
  },
  { label: "排序 order", name: "order", placeholder: "例如：1" },
  { label: "状态 status", name: "status", placeholder: "draft / published" },
];

export function AdminTopicManager({ topics }: AdminTopicManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <section>
      <div className="flex flex-col gap-5 border-y border-zinc-300 py-6 sm:flex-row sm:items-center sm:justify-between">
        <AdminStatCard label="当前专题数量" value={topics.length} />
        <AdminActionButton
          className="px-5 py-3"
          onClick={() => setShowCreateForm((value) => !value)}
        >
          新建专题
        </AdminActionButton>
      </div>

      {showCreateForm ? (
        <AdminSection
          className="mt-8"
          description="这是静态表单占位，暂时不会保存或写入 Supabase。"
          title="新建专题"
          variant="panel"
        >
          <form className="grid gap-5 md:grid-cols-2">
            {formFields.map((field) => (
              <AdminFormField
                className={field.textarea ? "md:col-span-2" : ""}
                fieldType={field.textarea ? "textarea" : "input"}
                key={field.name}
                label={field.label}
                name={field.name}
                placeholder={field.placeholder}
              />
            ))}
          </form>
        </AdminSection>
      ) : null}

      <AdminSection
        className="mt-10"
        description="当前展示统一数据源中的专题路径，操作按钮仅作为后续编辑入口占位。"
        title="专题列表"
      >
        <div className="divide-y divide-zinc-200 border-y border-zinc-300">
          {[...topics]
            .sort((a, b) => a.order - b.order)
            .map((topic) => (
              <TopicRow key={topic.id} topic={topic} />
            ))}
        </div>
      </AdminSection>
    </section>
  );
}

function TopicRow({ topic }: { topic: Topic }) {
  return (
    <article className="grid gap-5 py-6 xl:grid-cols-[8rem_minmax(0,1fr)_12rem_7rem_8rem_8rem_5rem_auto] xl:items-center">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
        {topic.id}
      </p>
      <div>
        <h3 className="text-xl font-medium text-zinc-950">{topic.title}</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          {topic.description}
        </p>
      </div>
      <p className="font-mono text-xs text-zinc-500">{topic.slug}</p>
      <span className="w-fit border border-zinc-300 px-3 py-1 text-xs text-zinc-500">
        {topic.status === "published" ? "已发布" : "草稿"}
      </span>
      <p className="text-sm text-zinc-600">{topic.relatedNodes.length} 节点</p>
      <p className="text-sm text-zinc-600">
        {topic.relatedVideos.length} 视频
      </p>
      <p className="font-mono text-sm text-zinc-500">{topic.order}</p>
      <AdminActionButton variant="secondary">
        编辑
      </AdminActionButton>
    </article>
  );
}
