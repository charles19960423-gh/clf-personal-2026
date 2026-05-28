"use client";

import { AdminActionButton } from "@/components/admin/ui/admin-action-button";
import { AdminFormField } from "@/components/admin/ui/admin-form-field";
import { AdminSection } from "@/components/admin/ui/admin-section";
import { AdminStatCard } from "@/components/admin/ui/admin-stat-card";
import { useState } from "react";

export type AdminTag = {
  name: string;
  type: string;
  description: string;
  usageCount: number;
};

type AdminTagManagerProps = {
  tags: AdminTag[];
};

const formFields = [
  { label: "标签名称 name", name: "name", placeholder: "例如：成为自己" },
  { label: "标签类型 type", name: "type", placeholder: "node / video / topic" },
  {
    label: "标签说明 description",
    name: "description",
    placeholder: "说明这个标签的使用范围与含义",
    textarea: true,
  },
];

export function AdminTagManager({ tags }: AdminTagManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <section>
      <div className="flex flex-col gap-5 border-y border-zinc-300 py-6 sm:flex-row sm:items-center sm:justify-between">
        <AdminStatCard label="当前标签数量" value={tags.length} />
        <AdminActionButton
          className="px-5 py-3"
          onClick={() => setShowCreateForm((value) => !value)}
        >
          新建标签
        </AdminActionButton>
      </div>

      {showCreateForm ? (
        <AdminSection
          className="mt-8"
          description="这是静态表单占位，暂时不会保存或写入 Supabase。"
          title="新建标签"
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
        description="当前展示从内容数据中汇总的标签，操作按钮仅作为后续编辑入口占位。"
        title="标签列表"
      >
        <div className="divide-y divide-zinc-200 border-y border-zinc-300">
          {tags.map((tag) => (
            <TagRow key={`${tag.type}-${tag.name}`} tag={tag} />
          ))}
        </div>
      </AdminSection>
    </section>
  );
}

function TagRow({ tag }: { tag: AdminTag }) {
  return (
    <article className="grid gap-5 py-6 lg:grid-cols-[minmax(0,1fr)_8rem_minmax(0,1.5fr)_8rem_auto] lg:items-center">
      <h3 className="text-xl font-medium text-zinc-950">{tag.name}</h3>
      <span className="w-fit border border-zinc-300 px-3 py-1 text-xs text-zinc-500">
        {tag.type}
      </span>
      <p className="text-sm leading-7 text-zinc-600">{tag.description}</p>
      <p className="text-sm text-zinc-500">
        <span className="font-mono text-2xl text-zinc-950">
          {tag.usageCount}
        </span>{" "}
        次
      </p>
      <AdminActionButton variant="secondary">
        编辑
      </AdminActionButton>
    </article>
  );
}
