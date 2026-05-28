"use client";

import { AdminActionButton } from "@/components/admin/ui/admin-action-button";
import { AdminFormField } from "@/components/admin/ui/admin-form-field";
import { AdminSection } from "@/components/admin/ui/admin-section";
import { AdminStatCard } from "@/components/admin/ui/admin-stat-card";
import type { VideoTopic } from "@/types";
import { useState } from "react";

type AdminVideoManagerProps = {
  videos: VideoTopic[];
};

const formFields = [
  { label: "标题 title", name: "title", placeholder: "例如：为什么人最重要的是成为自己？" },
  {
    label: "核心观点 coreIdea",
    name: "coreIdea",
    placeholder: "用一句话说明视频核心观点",
    textarea: true,
  },
  {
    label: "关联知识节点 relatedNodes",
    name: "relatedNodes",
    placeholder: "例如：being-yourself, inner-order",
  },
  { label: "状态 status", name: "status", placeholder: "inspiration / scripting / ready-to-shoot / shot / published" },
  { label: "平台 platform", name: "platform", placeholder: "例如：视频号, B站, 小红书" },
  {
    label: "大纲 outline",
    name: "outline",
    placeholder: "每行一个大纲段落",
    textarea: true,
  },
  {
    label: "脚本 script",
    name: "script",
    placeholder: "填写脚本片段或完整脚本",
    textarea: true,
  },
  { label: "发布链接 publishUrl", name: "publishUrl", placeholder: "https://..." },
  { label: "发布日期 publishDate", name: "publishDate", placeholder: "YYYY-MM-DD" },
  {
    label: "复盘 review",
    name: "review",
    placeholder: "记录发布后的数据反馈、问题与下一步调整",
    textarea: true,
  },
];

const statusLabels: Record<VideoTopic["status"], string> = {
  inspiration: "灵感",
  scripting: "写脚本",
  "ready-to-shoot": "待拍摄",
  shot: "已拍摄",
  published: "已发布",
};

export function AdminVideoManager({ videos }: AdminVideoManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <section>
      <div className="flex flex-col gap-5 border-y border-zinc-300 py-6 sm:flex-row sm:items-center sm:justify-between">
        <AdminStatCard label="当前视频选题数量" value={videos.length} />
        <AdminActionButton
          className="px-5 py-3"
          onClick={() => setShowCreateForm((value) => !value)}
        >
          新建视频选题
        </AdminActionButton>
      </div>

      {showCreateForm ? (
        <AdminSection
          className="mt-8"
          description="这是静态表单占位，暂时不会保存或写入 Supabase。"
          title="新建视频选题"
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
        description="当前展示统一数据源中的视频选题，操作按钮仅作为后续编辑入口占位。"
        title="视频选题列表"
      >
        <div className="divide-y divide-zinc-200 border-y border-zinc-300">
          {videos.map((video) => (
            <VideoRow key={video.id} video={video} />
          ))}
        </div>
      </AdminSection>
    </section>
  );
}

function VideoRow({ video }: { video: VideoTopic }) {
  return (
    <article className="grid gap-5 py-6 xl:grid-cols-[7rem_minmax(0,1fr)_7rem_10rem_minmax(0,14rem)_8rem_auto] xl:items-center">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
        {video.id}
      </p>
      <div>
        <h3 className="text-xl font-medium text-zinc-950">{video.title}</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          {video.coreIdea}
        </p>
      </div>
      <span className="w-fit border border-zinc-300 px-3 py-1 text-xs text-zinc-500">
        {statusLabels[video.status]}
      </span>
      <p className="text-sm text-zinc-600">{video.platform.join(" / ")}</p>
      <div className="flex flex-wrap gap-2">
        {video.relatedNodes.map((node) => (
          <span
            className="border border-zinc-300 px-3 py-1 text-xs text-zinc-500"
            key={node}
          >
            {node}
          </span>
        ))}
      </div>
      <p className="text-sm text-zinc-500">{video.publishDate ?? "未发布"}</p>
      <AdminActionButton variant="secondary">
        编辑
      </AdminActionButton>
    </article>
  );
}
