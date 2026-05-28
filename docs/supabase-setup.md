# Supabase 接入操作清单

本文档用于后续将 `linfeng-system` 连接到真实 Supabase 项目。当前阶段只做接入准备，不启用数据库写入。

## A. 创建 Supabase 项目

1. 登录 Supabase 控制台。
2. 创建新项目，项目名称建议使用：

```txt
linfeng-system
```

3. 区域选择建议：
   - 优先选择距离主要访问者更近的区域。
   - 如果主要在中国大陆开发和访问，可优先考虑亚太区域。
   - 如果未来主要面向海外用户，可选择离目标用户最近的区域。

4. 项目创建完成后，进入 Project Settings。
5. 在 API 设置中获取：
   - Project URL
   - anon public key

## B. 配置本地环境变量

项目根目录已有 `.env.example`。真实接入时，在本地创建 `.env.local`：

```bash
cp .env.example .env.local
```

填写 Supabase 项目信息：

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

注意：不要把 `.env.local` 提交到 Git。

## C. 初始化数据库

进入 Supabase 控制台的 SQL Editor，按顺序执行以下 SQL 文件。

第一步，执行数据库结构：

```txt
supabase/schema.sql
```

第二步，执行示例数据：

```txt
supabase/seed.sql
```

建议先执行 `schema.sql`，确认没有报错后，再执行 `seed.sql`。

## D. 验证数据库表

在 Supabase Table Editor 中确认以下表已经创建：

- `knowledge_nodes`
- `video_topics`
- `topics`
- `tags`

同时确认 `knowledge_nodes` 至少包含示例节点数据，便于后续验证前台读取。

## E. 验证前台读取

当前系统通过 `src/lib/data.ts` 统一读取数据。知识节点数据源优先级为：

```txt
Supabase → Markdown → Mock
```

也就是说：

- 配置 Supabase 环境变量后，系统会优先读取 Supabase。
- 如果 Supabase 未配置、查询失败或没有数据，则读取 `content/nodes` 下的 Markdown。
- 如果 Markdown 也没有数据，则回退到 `src/lib/mock-data.ts`。

完成 Supabase 配置后，可以运行：

```bash
npm run build
```

并打开前台页面验证知识库、详情页和认知地图是否正常展示。

## F. 当前不启用写入

当前后台表单仍然是静态占位：

- 不会新增数据库记录。
- 不会编辑数据库记录。
- 不会写入 Supabase。
- 不会写入 Markdown。

当前 `npm run sync-obsidian` 也只是 dry-run 预览，不会写入 Supabase。

## G. 后续计划

后续真实接入可以按以下顺序推进：

1. 启用 Supabase 读取，验证前台从 `knowledge_nodes`、`video_topics`、`topics` 读取真实数据。
2. 启用 Markdown 同步写入，将 `content/nodes` 标准节点 upsert 到 `knowledge_nodes`。
3. 启用后台表单写入，让知识节点、视频选题、专题、标签和系统结构进入真实管理流程。
4. 启用登录权限，限制后台管理与写入操作。
