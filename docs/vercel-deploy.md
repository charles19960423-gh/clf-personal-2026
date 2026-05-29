# Vercel 部署准备清单

本文档用于将 `linfeng-system` 部署到 Vercel。当前项目可以在不配置 Supabase 环境变量的情况下部署，数据会自动回退到 Markdown / Mock。

## A. 部署前检查

部署前建议在本地依次运行：

```bash
npm run lint
npm run build
npm run validate-nodes
npm run sync-obsidian
```

也可以直接运行统一检查脚本：

```bash
npm run predeploy
```

该脚本会依次执行 Markdown 节点校验、Obsidian dry-run、代码检查和生产构建。

## B. GitHub 准备

如果仓库尚未初始化：

```bash
git init
```

提交代码：

```bash
git add .
git commit -m "Prepare Vercel deployment"
```

推送到 GitHub 仓库：

```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

如果项目已经绑定远程仓库，只需要正常提交并推送即可。

## C. Vercel 导入项目

1. 登录 Vercel。
2. 选择 Add New Project。
3. 使用 GitHub 导入本项目仓库。
4. Framework Preset 选择 `Next.js`。
5. Build Command 使用：

```bash
npm run build
```

6. Output Directory 保持默认。
7. 点击 Deploy。

## D. 环境变量

当前项目可以不配置 Supabase 环境变量也能部署。

原因是系统数据源策略为：

```txt
Supabase → Markdown → Mock
```

如果后续接入真实 Supabase，需要在 Vercel Project Settings → Environment Variables 中配置：

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

配置后重新部署即可让前台优先读取 Supabase 数据，并让后台登录保护生效。

上线注意：

- 配置 Vercel 环境变量前，请先在 Supabase SQL Editor 执行 `supabase/policies.sql`。
- 在 Supabase Authentication 中手动创建管理员用户。
- 不要配置 service role key，也不要把高权限密钥写入 `NEXT_PUBLIC_*`。
- 当前 `/admin/nodes` 已有知识节点写入通道；生产环境必须依赖登录 session 和 RLS 策略共同保护。

## E. 部署后检查路径

部署完成后，建议依次检查：

- `/`
- `/map`
- `/nodes`
- `/videos`
- `/topics`
- `/admin`

重点确认首页、认知地图、知识库、视频库、专题列表均能正常打开。访问 `/admin` 时：

- 未配置 Supabase 环境变量：应跳转到登录页并提示未配置。
- 已配置 Supabase 环境变量：未登录应跳转登录页，登录后进入后台。

## F. 当前注意事项

- `/admin/nodes` 已接入知识节点创建与编辑的 Supabase 写入通道，但应先用于本地测试。
- `/admin` 与后台子页面已经启用 Supabase Auth 登录保护。
- 其他后台表单暂时是静态占位，不会新增、编辑或保存数据。
- Markdown 内容来自项目内 `content/nodes`。
- Supabase 未配置时，会自动回退到 Markdown / Mock 数据。
- `npm run sync-obsidian` 当前只做 dry-run 预览，不会写入 Supabase。
