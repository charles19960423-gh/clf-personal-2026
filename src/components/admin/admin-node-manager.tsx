"use client";

import {
  createKnowledgeNodeAction,
  updateKnowledgeNodeAction,
} from "@/app/admin/nodes/actions";
import { AdminActionButton } from "@/components/admin/ui/admin-action-button";
import { AdminFormField } from "@/components/admin/ui/admin-form-field";
import { AdminSection } from "@/components/admin/ui/admin-section";
import { AdminStatCard } from "@/components/admin/ui/admin-stat-card";
import type { KnowledgeNode, SystemModule } from "@/types";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";

type AdminNodeManagerProps = {
  nodes: KnowledgeNode[];
  systems: SystemModule[];
};

type FormMode = "create" | "edit";

type FieldName =
  | "title"
  | "slug"
  | "code"
  | "module"
  | "summary"
  | "definition"
  | "coreIdea"
  | "explanation"
  | "examples"
  | "status";

type FormField = {
  label: string;
  name: FieldName;
  options?: Array<{
    label: string;
    value: string;
  }>;
  placeholder: string;
  select?: boolean;
  required?: boolean;
  textarea?: boolean;
};

const formFields: FormField[] = [
  { label: "标题", name: "title", placeholder: "例如：成为你自己", required: true },
  { label: "slug", name: "slug", placeholder: "例如：being-yourself", required: true },
  { label: "编号 code", name: "code", placeholder: "例如：R-001", required: true },
  {
    label: "所属系统 module",
    name: "module",
    placeholder: "国 / 族 / 家 / 企 / 人",
    required: true,
    select: true,
  },
  {
    label: "摘要 summary",
    name: "summary",
    placeholder: "用于列表页展示的一句话摘要",
  },
  {
    label: "一句话定义 definition",
    name: "definition",
    placeholder: "用一句话定义这个知识节点",
    required: true,
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
  {
    label: "现实案例 examples",
    name: "examples",
    placeholder: "每行一个案例",
    textarea: true,
  },
  {
    label: "状态 status",
    name: "status",
    options: [
      { label: "草稿 draft", value: "draft" },
      { label: "已发布 published", value: "published" },
    ],
    placeholder: "draft / published",
    required: true,
    select: true,
  },
];

export function AdminNodeManager({ nodes, systems }: AdminNodeManagerProps) {
  const router = useRouter();
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  function openCreateForm() {
    setSelectedNode(null);
    setFeedback(null);
    setFormMode("create");
  }

  function openEditForm(node: KnowledgeNode) {
    setSelectedNode(node);
    setFeedback(null);
    setFormMode("edit");
  }

  function closeForm() {
    setFormMode(null);
    setSelectedNode(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const currentSlug = selectedNode?.slug;

    setFeedback({
      type: "success",
      message: "正在保存，请稍候...",
    });

    startTransition(() => {
      void (async () => {
        try {
          const result =
            formMode === "edit" && currentSlug
              ? await updateKnowledgeNodeAction(currentSlug, formData)
              : await createKnowledgeNodeAction(formData);

          setFeedback({
            type: result.ok ? "success" : "error",
            message: result.message,
          });

          if (result.ok) {
            closeForm();
            router.refresh();
          }
        } catch {
          setFeedback({
            type: "error",
            message: "保存失败，请检查 Supabase 表结构、登录状态或网络连接。",
          });
        }
      })();
    });
  }

  const formTitle = formMode === "edit" ? "编辑知识节点" : "新建知识节点";
  const formDescription =
    "当前表单会尝试写入 Supabase；如果本地未配置环境变量，会保留页面并显示原因。";
  const tagOptions = getTagOptions(nodes);

  return (
    <section>
      <div className="flex flex-col gap-5 border-y border-zinc-300 py-6 sm:flex-row sm:items-center sm:justify-between">
        <AdminStatCard label="当前知识节点数量" value={nodes.length} />
        <AdminActionButton
          className="px-5 py-3"
          onClick={openCreateForm}
        >
          新建知识节点
        </AdminActionButton>
      </div>

      {feedback ? (
        <div
          className={[
            "mt-6 border px-5 py-4 text-sm",
            feedback.type === "success"
              ? "border-zinc-950 text-zinc-950"
              : "border-zinc-400 text-zinc-600",
          ].join(" ")}
        >
          {feedback.message}
        </div>
      ) : null}

      {formMode ? (
        <AdminSection
          className="mt-8"
          description={formDescription}
          title={formTitle}
          variant="panel"
        >
          <form
            className="grid gap-5 md:grid-cols-2"
            key={`${formMode}-${selectedNode?.slug ?? "new"}`}
            noValidate
            onSubmit={handleSubmit}
          >
            {formFields.map((field) => {
              const options =
                field.name === "module"
                  ? systems.map((system) => ({
                      label: `${system.symbol} ${system.name}`,
                      value: system.symbol,
                    }))
                  : field.options;

              return (
                <AdminFormField
                  className={field.textarea ? "md:col-span-2" : ""}
                  defaultValue={getFieldDefaultValue(field.name, selectedNode, systems)}
                  fieldType={
                    field.select ? "select" : field.textarea ? "textarea" : "input"
                  }
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  options={options}
                  placeholder={field.placeholder}
                />
              );
            })}
            <TagSelectField
              className="md:col-span-2"
              defaultValue={selectedNode?.tags ?? []}
              options={tagOptions}
            />
            <RelationSelectField
              className="md:col-span-2"
              defaultValue={selectedNode?.relations ?? []}
              nodes={nodes}
              selectedSlug={selectedNode?.slug}
            />
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <AdminActionButton disabled={isPending} type="submit">
                {isPending ? "保存中..." : formMode === "edit" ? "更新节点" : "保存节点"}
              </AdminActionButton>
              <AdminActionButton
                disabled={isPending}
                onClick={closeForm}
                type="button"
                variant="secondary"
              >
                取消
              </AdminActionButton>
            </div>
            {feedback ? (
              <p
                className={[
                  "border px-4 py-3 text-sm leading-6 md:col-span-2",
                  feedback.type === "success"
                    ? "border-zinc-950 text-zinc-950"
                    : "border-zinc-400 text-zinc-600",
                ].join(" ")}
              >
                {feedback.message}
              </p>
            ) : null}
          </form>
        </AdminSection>
      ) : null}

      <AdminSection
        className="mt-10"
        description="当前展示统一数据源中的知识节点；编辑操作会优先写入 Supabase。"
        title="知识节点列表"
      >
        <div className="divide-y divide-zinc-200 border-y border-zinc-300">
          {nodes.map((node) => (
            <NodeRow
              key={node.slug}
              node={node}
              onEdit={openEditForm}
              systems={systems}
            />
          ))}
        </div>
      </AdminSection>
    </section>
  );
}

function RelationSelectField({
  className = "",
  defaultValue,
  nodes,
  selectedSlug,
}: {
  className?: string;
  defaultValue: string[];
  nodes: KnowledgeNode[];
  selectedSlug?: string;
}) {
  const [selectedRelations, setSelectedRelations] = useState<string[]>(defaultValue);
  const relationOptions = nodes.filter(
    (node) =>
      node.slug !== selectedSlug && !selectedRelations.includes(node.slug),
  );

  function addRelation(value: string) {
    if (!value || selectedRelations.includes(value)) {
      return;
    }

    setSelectedRelations((current) => [...current, value]);
  }

  function removeRelation(value: string) {
    setSelectedRelations((current) =>
      current.filter((relation) => relation !== value),
    );
  }

  function getRelationLabel(slug: string) {
    const node = nodes.find((item) => item.slug === slug);

    return node ? `${node.code} ${node.title}` : slug;
  }

  return (
    <div className={className}>
      <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
        关联节点 Relations
      </span>
      <input name="relations" type="hidden" value={selectedRelations.join("，")} />
      <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <select
          className="w-full border border-zinc-300 bg-transparent px-4 py-3 text-sm text-zinc-950 outline-none focus:border-zinc-950"
          defaultValue=""
          onChange={(event) => {
            addRelation(event.target.value);
            event.target.value = "";
          }}
        >
          <option value="">选择关联节点</option>
          {relationOptions.map((node) => (
            <option key={node.slug} value={node.slug}>
              {node.code} {node.title}
            </option>
          ))}
        </select>
        <span className="border border-zinc-300 px-4 py-3 text-sm text-zinc-500">
          {selectedRelations.length} 个关联
        </span>
      </div>
      <div className="mt-3 flex min-h-11 flex-wrap gap-2 border border-zinc-200 px-3 py-3">
        {selectedRelations.length > 0 ? (
          selectedRelations.map((slug) => (
            <button
              className="border border-zinc-300 px-3 py-1 text-xs text-zinc-600 transition-colors hover:border-zinc-950 hover:text-zinc-950"
              key={slug}
              onClick={() => removeRelation(slug)}
              type="button"
            >
              {getRelationLabel(slug)} ×
            </button>
          ))
        ) : (
          <span className="text-sm text-zinc-400">尚未选择关联节点</span>
        )}
      </div>
    </div>
  );
}

function TagSelectField({
  className = "",
  defaultValue,
  options,
}: {
  className?: string;
  defaultValue: string[];
  options: string[];
}) {
  const [selectedTags, setSelectedTags] = useState<string[]>(defaultValue);
  const availableOptions = options.filter((tag) => !selectedTags.includes(tag));

  function addTag(value: string) {
    if (!value || selectedTags.includes(value)) {
      return;
    }

    setSelectedTags((current) => [...current, value]);
  }

  function removeTag(value: string) {
    setSelectedTags((current) => current.filter((tag) => tag !== value));
  }

  return (
    <div className={className}>
      <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
        标签 Tags
      </span>
      <input name="tags" type="hidden" value={selectedTags.join("，")} />
      <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <select
          className="w-full border border-zinc-300 bg-transparent px-4 py-3 text-sm text-zinc-950 outline-none focus:border-zinc-950"
          defaultValue=""
          onChange={(event) => {
            addTag(event.target.value);
            event.target.value = "";
          }}
        >
          <option value="">选择标签</option>
          {availableOptions.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <span className="border border-zinc-300 px-4 py-3 text-sm text-zinc-500">
          {selectedTags.length} 个标签
        </span>
      </div>
      <div className="mt-3 flex min-h-11 flex-wrap gap-2 border border-zinc-200 px-3 py-3">
        {selectedTags.length > 0 ? (
          selectedTags.map((tag) => (
            <button
              className="border border-zinc-300 px-3 py-1 text-xs text-zinc-600 transition-colors hover:border-zinc-950 hover:text-zinc-950"
              key={tag}
              onClick={() => removeTag(tag)}
              type="button"
            >
              {tag} ×
            </button>
          ))
        ) : (
          <span className="text-sm text-zinc-400">尚未选择标签</span>
        )}
      </div>
    </div>
  );
}

function NodeRow({
  node,
  onEdit,
  systems,
}: {
  node: KnowledgeNode;
  onEdit: (node: KnowledgeNode) => void;
  systems: SystemModule[];
}) {
  const system = systems.find((item) => item.key === node.systemKey);
  const status = node.status ?? "published";
  const updatedAt = formatDate(node.updatedAt ?? node.createdAt);

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
        {getStatusLabel(status)}
      </span>
      <p className="text-sm text-zinc-500">{updatedAt}</p>
      <AdminActionButton onClick={() => onEdit(node)} variant="secondary">
        编辑
      </AdminActionButton>
    </article>
  );
}

function getFieldDefaultValue(
  name: FieldName,
  node: KnowledgeNode | null,
  systems: SystemModule[],
) {
  if (!node) {
    return name === "module" ? "人" : name === "status" ? "draft" : "";
  }

  const system = systems.find((item) => item.key === node.systemKey);

  switch (name) {
    case "title":
      return node.title;
    case "slug":
      return node.slug;
    case "code":
      return node.code;
    case "module":
      return system?.symbol ?? "人";
    case "summary":
      return node.summary;
    case "definition":
      return node.definition;
    case "coreIdea":
      return node.coreIdea.join("\n");
    case "explanation":
      return node.explanation;
    case "examples":
      return node.examples.join("\n");
    case "status":
      return node.status ?? "published";
    default:
      return "";
  }
}

function getTagOptions(nodes: KnowledgeNode[]) {
  const tags = nodes.flatMap((node) => node.tags);

  return Array.from(new Set(tags)).sort((a, b) => a.localeCompare(b, "zh-CN"));
}

function getStatusLabel(status: string) {
  if (status === "published") {
    return "已发布";
  }

  if (status === "draft") {
    return "草稿";
  }

  return status;
}

function formatDate(value: string | undefined) {
  if (!value) {
    return "本地内容";
  }

  return value.slice(0, 10);
}
