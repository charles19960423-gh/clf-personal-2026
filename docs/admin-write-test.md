# 后台知识节点写入测试清单

本文档用于验证 `/admin/nodes` 到 Supabase `knowledge_nodes` 的写入链路。当前阶段只测试知识节点，不测试视频、专题、标签或系统结构写入。

## 1. 测试前准备

确认本地已经完成：

```bash
npm run validate-nodes
npm run lint
npm run build
```

确认 Supabase 已完成：

- 已创建项目。
- 已执行 `supabase/schema.sql`。
- 已按需要执行 `supabase/seed.sql`。
- 已在 Authentication → Users 中创建管理员用户。
- 本地 `.env.local` 已填写：

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

注意：`.env.local` 只用于本地测试，不要提交到 Git。

## 2. 本地未配置 Supabase 的提示测试

在没有 `.env.local` 的情况下：

1. 访问 `/admin/nodes`。
2. 系统应跳转到 `/login`。

预期结果：

- 页面不崩溃。
- 显示 Supabase 环境变量尚未配置提示。
- `content/nodes` 不会被修改。
- Supabase 不会产生新数据。

## 3. 后台登录测试

在本地配置 Supabase 后：

1. 访问 `/admin/nodes`。
2. 未登录时应跳转到 `/login?redirect=/admin/nodes`。
3. 输入 Supabase Authentication 中创建的管理员邮箱和密码。
4. 点击“登录后台”。

预期结果：

- 登录成功后回到 `/admin/nodes`。
- 后台顶部显示当前登录邮箱。
- 点击“退出登录”后回到 `/login`。

## 4. 创建知识节点测试

在本地配置 Supabase 后：

1. 访问 `/admin/nodes`。
2. 点击“新建知识节点”。
3. 填写测试数据：

```txt
标题：测试知识节点
slug：test-knowledge-node
编号 code：T-001
所属系统 module：人
摘要 summary：用于验证 Supabase 写入链路的测试节点。
一句话定义 definition：一个用于确认后台写入是否正常的测试节点。
核心观点 coreIdea：写入链路应该可验证、可回滚、可追踪。
标签 tags：测试，Supabase
状态 status：published
```

4. 点击“保存节点”。

预期结果：

- 页面提示：`知识节点已写入 Supabase。`
- 后台列表刷新后出现该节点。
- Supabase Table Editor 中 `knowledge_nodes` 出现该记录。

## 5. 编辑知识节点测试

1. 在 `/admin/nodes` 找到刚刚创建的测试节点。
2. 点击“编辑”。
3. 修改摘要或标签。
4. 点击“更新节点”。

预期结果：

- 页面提示：`知识节点已更新到 Supabase。`
- Supabase 中对应记录被更新。
- `updated_at` 自动变化。

## 6. 前台读取测试

创建或编辑成功后，检查以下页面：

- `/nodes`
- `/map`
- `/node/test-knowledge-node`
- `/`

预期结果：

- 前台优先读取 Supabase 数据。
- 知识库列表可看到测试节点。
- 详情页不会报错。
- 认知地图中对应系统节点数量正常。

## 7. 错误提示测试

可测试以下错误：

- slug 使用中文或空格。
- 必填字段为空。
- 使用重复 slug。

预期结果：

- 前端表单或 Server Action 给出明确提示。
- 页面不崩溃。
- 不产生脏数据。

## 8. 回滚测试数据

测试结束后，可在 Supabase SQL Editor 中删除测试节点：

```sql
delete from public.knowledge_nodes
where slug = 'test-knowledge-node';
```

删除后重新访问 `/nodes`，确认测试节点不再展示。

## 9. 上线前注意事项

- Vercel 配置 Supabase 环境变量前，应先执行 `supabase/policies.sql`。
- 不要使用 service role key。
- 不要把高权限密钥放入 `NEXT_PUBLIC_*` 环境变量。
- 当前后台写入依赖 Supabase Auth session 和 RLS 策略共同保护。
