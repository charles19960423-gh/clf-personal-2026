"use client";

import { AdminActionButton } from "@/components/admin/ui/admin-action-button";
import { AdminFormField } from "@/components/admin/ui/admin-form-field";
import { AdminSection } from "@/components/admin/ui/admin-section";
import { AdminStatCard } from "@/components/admin/ui/admin-stat-card";
import type { SystemModule } from "@/types";
import { useState } from "react";

type AdminSystemManagerProps = {
  systems: SystemModule[];
};

const formFields = [
  { label: "系统名称 name", name: "name", placeholder: "例如：个体系统" },
  { label: "系统 key", name: "key", placeholder: "例如：human" },
  { label: "符号 symbol", name: "symbol", placeholder: "例如：人" },
  {
    label: "系统说明 description",
    name: "description",
    placeholder: "说明该系统的范围、作用与入口文案",
    textarea: true,
  },
  { label: "排序 sortOrder", name: "sortOrder", placeholder: "例如：5" },
  { label: "是否核心 isCore", name: "isCore", placeholder: "true / false" },
];

export function AdminSystemManager({ systems }: AdminSystemManagerProps) {
  const [showEditForm, setShowEditForm] = useState(false);

  return (
    <section>
      <div className="flex flex-col gap-5 border-y border-zinc-300 py-6 sm:flex-row sm:items-center sm:justify-between">
        <AdminStatCard label="当前系统数量" value={systems.length} />
        <AdminActionButton
          className="px-5 py-3"
          onClick={() => setShowEditForm((value) => !value)}
        >
          编辑系统
        </AdminActionButton>
      </div>

      {showEditForm ? (
        <AdminSection
          className="mt-8"
          description="这是静态表单占位，暂时不会保存或写入 Supabase。"
          title="编辑系统结构"
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
        description="当前展示系统结构的静态配置，操作按钮仅作为后续编辑入口占位。"
        title="五大系统列表"
      >
        <div className="divide-y divide-zinc-200 border-y border-zinc-300">
          {systems.map((system, index) => (
            <SystemRow
              key={system.key}
              onEdit={() => setShowEditForm(true)}
              sortOrder={index + 1}
              system={system}
            />
          ))}
        </div>
      </AdminSection>
    </section>
  );
}

function SystemRow({
  onEdit,
  sortOrder,
  system,
}: {
  onEdit: () => void;
  sortOrder: number;
  system: SystemModule;
}) {
  const isCore = system.key === "human";

  return (
    <article className="grid gap-5 py-6 xl:grid-cols-[5rem_minmax(0,1fr)_8rem_minmax(0,1.5fr)_6rem_7rem_auto] xl:items-center">
      <span
        className={[
          "flex size-16 items-center justify-center border text-3xl font-light",
          isCore ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-300 text-zinc-950",
        ].join(" ")}
      >
        {system.symbol}
      </span>
      <h3 className="text-xl font-medium text-zinc-950">{system.name}</h3>
      <p className="font-mono text-xs text-zinc-500">{system.key}</p>
      <p className="text-sm leading-7 text-zinc-600">{system.description}</p>
      <p className="font-mono text-sm text-zinc-500">{sortOrder}</p>
      <span className="w-fit border border-zinc-300 px-3 py-1 text-xs text-zinc-500">
        {isCore ? "core" : "normal"}
      </span>
      <AdminActionButton onClick={onEdit} variant="secondary">
        编辑
      </AdminActionButton>
    </article>
  );
}
