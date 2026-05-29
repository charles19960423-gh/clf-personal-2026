# Supabase Schema Design

当前目录保存 Supabase 数据库结构、示例数据与权限策略。项目已经接入 Supabase 读取与知识节点后台写入通道，但默认不创建 `.env.local`，线上部署也可以继续回退到 Markdown / Mock 数据。

## Tables

### `knowledge_nodes`

知识节点主表，用于存储林峰系统论中的概念、观点、案例与方法论。

- `id`: 数据库主键，UUID。
- `code`: 节点编号，如 `R-001`。
- `slug`: 前端路由与 Obsidian 文件的稳定标识。
- `title`: 节点标题。
- `module`: 所属系统，如 `国`、`族`、`家`、`企`、`人`。
- `parent_code`: 父级节点编号，用于认知地图树状结构。
- `level`: 节点层级，由 `code` 段数推导。
- `source`: 数据来源，如 `supabase`、`markdown`、`mock`。
- `file_path`: Obsidian Markdown 本地文件路径，用于同步追踪。
- `summary`: 节点摘要。
- `definition`: 一句话定义。
- `core_idea`: 核心观点文本。
- `explanation`: 系统解释。
- `examples`: 现实案例，使用 `jsonb` 存储数组或结构化案例。
- `tags`: 标签数组。
- `relations`: 关联节点 slug 数组。
- `status`: 内容状态，如 `draft`、`published`。
- `created_at` / `updated_at`: 创建与更新时间。

### `video_topics`

视频内容生产数据库，用于管理选题、脚本、发布和复盘。

- `id`: 数据库主键，UUID。
- `title`: 视频标题。
- `core_idea`: 核心观点。
- `related_nodes`: 关联知识节点 slug 数组。
- `status`: 生产状态，如 `inspiration`、`scripting`、`ready-to-shoot`、`shot`、`published`。
- `platform`: 发布平台文本。
- `outline`: 视频大纲。
- `script`: 脚本片段或完整脚本。
- `publish_url`: 发布链接。
- `publish_date`: 发布日期。
- `review`: 复盘结论。
- `created_at` / `updated_at`: 创建与更新时间。

### `topics`

专题路径表，用于把知识节点和视频选题组织成内容学习路径。

- `id`: 数据库主键，UUID。
- `title`: 专题标题。
- `slug`: 专题路由标识。
- `description`: 专题说明。
- `related_nodes`: 关联知识节点 slug 数组。
- `related_videos`: 关联视频选题标识数组。
- `sort_order`: 展示顺序。
- `status`: 专题状态。
- `created_at` / `updated_at`: 创建与更新时间。

### `tags`

标签字典表，用于统一管理节点、视频与专题标签。

- `id`: 数据库主键，UUID。
- `name`: 标签名称。
- `type`: 标签类型，如 `node`、`video`、`topic`。
- `description`: 标签说明。
- `created_at` / `updated_at`: 创建与更新时间。

## Updated At Triggers

`knowledge_nodes`、`video_topics`、`topics`、`tags` 都挂载了 `set_updated_at` 触发器。每次更新记录时，`updated_at` 会自动写入当前时间。

## Row Level Security

`policies.sql` 用于上线前收紧数据库权限：

- 匿名用户可读取 `published` 状态的知识节点、视频选题和专题。
- 匿名用户可读取标签。
- authenticated 用户预留管理权限。
- 登录权限完成前，不建议在线上配置 Supabase 环境变量并开放后台写入。

如果只是在本地隔离测试项目中验证 `/admin/nodes` 写入，可以先不执行 `policies.sql`；正式线上项目应先执行权限策略，再接入登录。

## Obsidian Markdown Sync Plan

未来同步流程：

1. 从 Obsidian Vault 读取 `content/nodes/*.md`。
2. 使用 `gray-matter` 解析 frontmatter。
3. 将 `slug`、`title`、`module`、`code`、`parent_code`、`level`、`source`、`file_path`、`summary`、`definition`、`tags` 等字段映射到 `knowledge_nodes`。
4. 将正文中的章节解析为 `core_idea`、`explanation`、`examples` 等字段。
5. 以 `slug` 为稳定键执行 upsert。
6. 同步完成后更新搜索索引。

## Video Production Database Plan

`video_topics` 会作为内容生产流程的核心表：

1. 从知识节点或专题生成选题。
2. 管理状态流转：灵感 → 写脚本 → 待拍摄 → 已拍摄 → 已发布。
3. 保存平台、脚本、大纲、发布链接和复盘结论。
4. 通过 `related_nodes` 回连知识节点，形成“知识节点 → 视频内容 → 复盘反馈”的闭环。
