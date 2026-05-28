"use client";

import { AdminActionButton } from "@/components/admin/ui/admin-action-button";
import { AdminFormField } from "@/components/admin/ui/admin-form-field";
import { AdminSection } from "@/components/admin/ui/admin-section";
import { AdminStatCard } from "@/components/admin/ui/admin-stat-card";
import type { KnowledgeNode, SystemModule } from "@/types";
import { useState } from "react";

type AdminNodeManagerProps = {
  nodes: KnowledgeNode[];
  systems: SystemModule[];
};

const formFields = [
  { label: "标题", name: "title", placeholder: "例如：成为你自己" },
  { label: "slug", name: "slug", placeholder: "例如：being-yourself" },
  { label: "编号 code", name: "code", placeholder: "例如：R-001" },
  { label: "所属系统 module", name: "module", placeholder: "国 / 族 / 家 / 企 / 人" },
  {
    label: "一句话定义 definition",
    name: "definition",
    placeholder: "用一句话定义这个知识节点",
  },
  {
    label: "核心观点 coreIdea",
    name: "coreIdea",
    placeholder: "每行一条核心观点",
    textarea: true,
  },
  {
    label: "系统解释 explanation",
    name: "explanation",
    placeholder: "解释这个节点在系统中的位置与作用",
    textarea: true,
  },
  { label: "标签 tags", name: "tags", placeholder: "用逗号分隔标签" },
  { label: "状态 status", name: "status", placeholder: "draft / published" },
];

export function AdminNodeManager({ nodes, systems }: AdminNodeManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <section>
      <div className="flex flex-col gap-5 border-y border-zinc-300 py-6 sm:flex-row sm:items-center sm:justify-between">
        <AdminStatCard label="当前知识节点数量" value={nodes.length} />
        <AdminActionButton
          className="px-5 py-3"
          onClick={() => setShowCreateForm((value) => !value)}
        >
          新建知识节点
        </AdminActionButton>
      </div>

      {showCreateForm ? (
        <AdminSection
          className="mt-8"
          description="这是静态表单占位，暂时不会保存、写入 Markdown 或写入 Supabase。"
          title="新建知识节点"
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
        description="当前展示统一数据源中的知识节点，操作按钮仅作为后续编辑入口占位。"
        title="知识节点列表"
      >
        <div className="divide-y divide-zinc-200 border-y border-zinc-300">
          {nodes.map((node) => (
            <NodeRow key={node.slug} node={node} systems={systems} />
          ))}
        </div>
      </AdminSection>
    </section>
  );
}

function NodeRow({
  node,
  systems,
}: {
  node: KnowledgeNode;
  systems: SystemModule[];
}) {
  const system = systems.find((item) => item.key === node.systemKey);

  return (
    <article className="grid gap-5 py-6 lg:grid-cols-[8rem_minmax(0,1fr)_8rem_8rem_10rem_auto] lg:items-center">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
          {node.code}
        </p>
      </div>
      <div>
        <h3 className="text-xl font-medium text-zinc-950">{node.title}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {node.tags.map((tag) => (
            <span
              className="border border-zinc-300 px-3 py-1 text-xs text-zinc-500"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <p className="text-sm text-zinc-600">
        {system?.symbol} {system?.name}
      </p>
      <span className="w-fit border border-zinc-300 px-3 py-1 text-xs text-zinc-500">
        published
      </span>
      <p className="text-sm text-zinc-500">本地内容</p>
      <AdminActionButton variant="secondary">
        编辑
      </AdminActionButton>
    </article>
  );
}
