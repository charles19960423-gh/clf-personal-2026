# Supabase 接入操作清单

本文档用于将 `linfeng-system` 连接到真实 Supabase 项目。当前阶段已经接入后台登录保护和知识节点本地写入通道。

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

## C. 创建后台管理员用户

进入 Supabase 控制台：

1. 打开 Authentication。
2. 进入 Users。
3. 点击 Add user。
4. 使用你的管理员邮箱创建用户。
5. 设置一个强密码，并确认该用户已创建成功。

当前项目不开放注册入口，后台用户由 Supabase 控制台手动创建。

## D. 初始化数据库

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

可选安全策略：

```txt
supabase/policies.sql
```

`policies.sql` 会启用 RLS，并设置匿名用户只读 published 内容、authenticated 用户可管理内容。执行后，未登录的后台写入会被阻止；真正开放线上写入前，应先完成登录权限。

## E. 验证数据库表

在 Supabase Table Editor 中确认以下表已经创建：

- `knowledge_nodes`
- `video_topics`
- `topics`
- `tags`

同时确认 `knowledge_nodes` 至少包含示例节点数据，便于后续验证前台读取。

## F. 验证前台读取

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

## G. 本地后台登录验证

当前 `/admin` 与所有后台子页面都已启用登录保护：

- 未登录访问 `/admin` 会跳转到 `/login?redirect=/admin`。
- 登录成功后会回到原目标后台页面。
- 已登录访问 `/login` 会自动回到 `/admin`。
- 后台顶部会显示当前登录邮箱，并提供退出登录按钮。

本地测试步骤：

1. 确认 `.env.local` 已配置 Supabase URL 和 anon public key。
2. 启动开发服务。
3. 打开 `/admin`。
4. 使用 Supabase Authentication 中创建的管理员邮箱和密码登录。
5. 登录后访问 `/admin/nodes`。

如果 Supabase 未配置，后台会跳转到登录页，并显示环境变量未配置提示。

## H. 本地知识节点写入验证

当前 `/admin/nodes` 已接入知识节点创建与更新：

- 未配置 Supabase 环境变量时，表单会提示 `Supabase 未配置，当前仅可预览表单，无法保存。`
- 本地配置 `.env.local` 后，表单会尝试写入 `knowledge_nodes`。
- 写入成功后会刷新 `/admin/nodes`、`/nodes`、`/map`、`/` 和对应详情页缓存。
- 当前不会写入 Markdown。
- 当前不会写入视频、专题、标签或系统结构。

详细测试步骤见：[后台知识节点写入测试清单](admin-write-test.md)。

## I. 线上配置注意事项

如果要在 Vercel 配置 Supabase 环境变量，请先确认：

- 已执行 `supabase/policies.sql`。
- Supabase Authentication 中已经创建管理员用户。
- 后台登录流程已经在本地验证通过。
- 不使用 service role key，不把高权限密钥暴露给浏览器或 Vercel 前端环境变量。

当前项目只需要配置 anon public key。写入权限应通过 Supabase Auth session 与 RLS 共同控制。

## J. 后续计划

后续真实接入可以按以下顺序推进：

1. 本地验证 `/admin/nodes` 创建与更新知识节点。
2. 在生产 Supabase 项目执行 RLS 策略。
3. 在 Vercel 配置 Supabase 环境变量并验证后台登录。
4. 启用 Markdown 同步写入，将 `content/nodes` 标准节点 upsert 到 `knowledge_nodes`。
5. 逐步接入视频选题、专题、标签和系统结构写入。
