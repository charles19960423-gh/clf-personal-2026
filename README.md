# linfeng-system

林峰系统论，一个关于世界、组织、人性与个体成长的认知操作系统。

核心理念：`BEING YOURSELF｜成为你自己`

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Obsidian 内容规范

本项目预留从 Obsidian Markdown 同步内容的能力。当前阶段只建立本地内容目录、Markdown 规范和解析工具，不替换现有 mock 数据，不接入 Supabase。

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
