# linfeng-system

林峰系统论，一个关于世界、组织、人性与个体成长的认知操作系统。

核心理念：`BEING YOURSELF｜成为你自己`

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 部署文档

- Vercel 部署准备：[docs/vercel-deploy.md](docs/vercel-deploy.md)
- Supabase 接入准备：[docs/supabase-setup.md](docs/supabase-setup.md)
- 后台写入测试：[docs/admin-write-test.md](docs/admin-write-test.md)
- 版本说明：[docs/versioning.md](docs/versioning.md)

## Git 使用说明

当前项目使用 Git 管理版本。常用流程：

```bash
git status
git add .
git commit -m "feat: describe your change"
```

创建版本标签：

```bash
git tag v0.1.0
```

当前阶段只做本地版本管理；远程推送可在确认 GitHub 仓库状态后单独执行。

## Obsidian 内容规范

本项目预留从 Obsidian Markdown 同步内容的能力。当前阶段已经支持把标准 Markdown 知识节点接入前台统一数据层，并与知识库、认知地图、节点详情页联动。

### 内容目录

```txt
content/
  nodes/   # 知识节点
  videos/  # 视频内容
  topics/  # 专题内容
```

### 知识节点 frontmatter

```md
---
id: R-001
slug: being-yourself
title: 成为你自己
module: 人
code: R-001
tags:
  - 成为自己
  - 个体系统
summary: 成为自己不是任性，而是把外部期待、真实愿望和长期责任重新对齐。
definition: 一个人从外部评价系统回到内部生命系统的过程。
status: published
---
```

层级型节点可以继续补充结构字段：

```md
parentCode: 01-01
level: 3
relations:
  - country-01-01
```

如果未显式填写 `parentCode` 与 `level`，系统会优先根据 `code` 自动推导父级与层级。例如 `01-01-01-01` 会被识别为 `01-01-01` 的子节点，并归入“国”模块。

### 正文结构

```md
# 核心观点

# 系统解释

# 现实案例

# 视频化表达

# 延伸阅读
```

### 本地导入预留

- `src/lib/markdown.ts` 提供 `getMarkdownFiles`、`parseMarkdownFrontmatter`、`getLocalKnowledgeNodes`。
- `scripts/sync-obsidian.ts` 是 Obsidian 同步脚本占位。
- 后续同步流程：读取 Obsidian Vault Markdown → 解析 frontmatter → 写入 Supabase → 更新搜索索引。

### 如何创建新的 Markdown 知识节点

可以使用本地脚本快速生成 `content/nodes` 下的标准知识节点文件：

```bash
npm run create-node -- --title "自我叙事" --slug self-narrative --module 人 --code R-004
```

脚本会生成：

```txt
content/nodes/self-narrative.md
```

生成的文件默认 `status: draft`，并包含标准 frontmatter 与正文结构。若同名 slug 文件已经存在，脚本会提示并退出，不会覆盖现有内容。

### 如何校验 Markdown 知识节点

可以使用校验脚本检查标准 Markdown 知识节点是否符合基础规范：

```bash
npm run validate-nodes
```

校验内容包括：

- `slug`、`title`、`module`、`code`、`summary`、`definition`、`status` 是否存在且不为空。
- `slug` 是否唯一。
- `code` 是否唯一。

如果存在错误，脚本会输出总节点数、通过数量、错误数量，以及每个错误对应的文件名和原因，并以失败状态退出。

### Markdown 同步到 Supabase 的当前策略

当前同步脚本只做 dry-run 预览，不会写入数据库：

```bash
npm run sync-obsidian
```

脚本会读取标准 Markdown 节点，复用节点校验逻辑，输出待同步节点总数，以及每个节点的 `title`、`slug`、`module`、`code`、`status`。

也可以传入写入参数：

```bash
npm run sync-obsidian -- --write
```

当前 `--write` 仍不会真实写入 Supabase，只会提示写入模式尚未启用。后续接入写入逻辑时，计划流程为：Markdown 校验 → 字段规范化 → upsert 到 `knowledge_nodes` → 更新搜索索引。

## Supabase 接入说明

真实 Supabase 项目接入步骤请参考：[docs/supabase-setup.md](docs/supabase-setup.md)。

当前项目已安装 `@supabase/supabase-js`，并预留 Supabase 客户端与查询封装：

- `src/lib/supabase/client.ts`
- `src/lib/supabase/queries.ts`
- `src/lib/supabase/mutations.ts`

页面读取已通过 `src/lib/data.ts` 统一封装。知识节点采用统一合并数据层：Mock 提供基础兜底，Markdown 接入本地 Obsidian 内容，Supabase 覆盖同 slug 的线上内容。

### 创建 Supabase 项目

1. 登录 Supabase 控制台。
2. 创建一个新项目。
3. 进入 Project Settings，找到 Project URL 和 anon public key。

### 执行数据库结构

在 Supabase SQL Editor 中打开并执行：

```txt
supabase/schema.sql
```

该文件会创建：

- `knowledge_nodes`
- `video_topics`
- `topics`
- `tags`

并为需要更新时间的表配置 `updated_at` 自动更新时间触发器。

### 执行种子数据

数据库结构创建完成后，在 SQL Editor 中执行：

```txt
supabase/seed.sql
```

该文件会写入少量示例知识节点、视频选题、专题和标签。

### 配置环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

然后填写：

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

如果没有配置环境变量，Supabase client 会返回 `null`，查询函数会返回空数组或 `null`，不会影响 `npm run build`。

### 知识节点后台写入

`/admin/nodes` 已接入知识节点创建与更新的 Server Action：

- 未配置 `.env.local` 时，表单不会写入数据库，会在页面提示 Supabase 未配置。
- 配置 Supabase 环境变量并执行 `supabase/schema.sql` 后，表单会写入 `knowledge_nodes`。
- 当前只接入知识节点写入，不包含登录权限、Markdown 写回或视频/专题写入。

## 数据源策略

项目现在通过 `src/lib/data.ts` 统一读取页面数据。

- 知识节点采用合并策略：Mock 基础数据 → Markdown 本地内容 → Supabase 线上内容。
- 合并时以 `slug` 为唯一键；同一个 `slug` 下，Supabase 优先级最高，Markdown 次之，Mock 最后兜底。
- Markdown 节点必须包含标准 frontmatter：`slug`、`title`、`module`、`code`、`summary`、`definition`、`status`。
- 认知地图会根据 `code` 自动识别模块、父级和层级；例如 `01` 归入“国”，`01-01-01` 会挂到 `01-01` 下面。
- 当前已清洗的国模块标准内容位于 `content/nodes/20260528清洗/01-国模块`。
- `/nodes` 支持按系统、标签、层级和数据源筛选。
- `/map` 支持按系统展示 Obsidian 编号形成的节点树。
- `/node/[slug]` 支持展示上级节点、下级节点、同级节点和显式关联节点。
- 视频选题和专题暂时仍保持 Supabase → Mock 的数据源策略，不从 Markdown 读取。
- 当前页面展示逻辑不依赖真实 Supabase 项目；没有 `.env.local` 也可以正常开发和构建。
