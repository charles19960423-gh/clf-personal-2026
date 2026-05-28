import fs from "node:fs";
import path from "node:path";

type CreateNodeArgs = {
  code?: string;
  module?: string;
  slug?: string;
  title?: string;
};

const requiredArgs: Array<keyof CreateNodeArgs> = [
  "title",
  "slug",
  "module",
  "code",
];

function parseArgs(argv: string[]): CreateNodeArgs {
  const args: CreateNodeArgs = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];

    if (!current.startsWith("--")) {
      continue;
    }

    const key = current.slice(2) as keyof CreateNodeArgs;
    const value = argv[index + 1];

    if (requiredArgs.includes(key) && value && !value.startsWith("--")) {
      args[key] = value;
      index += 1;
    }
  }

  return args;
}

function validateArgs(args: CreateNodeArgs) {
  const missingArgs = requiredArgs.filter((key) => !args[key]);

  if (missingArgs.length > 0) {
    console.error(`缺少必要参数：${missingArgs.map((key) => `--${key}`).join(", ")}`);
    console.error(
      '示例：npm run create-node -- --title "自我叙事" --slug self-narrative --module 人 --code R-004',
    );
    process.exit(1);
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(args.slug ?? "")) {
    console.error("slug 只能使用小写字母、数字和连字符，例如：self-narrative");
    process.exit(1);
  }
}

function createMarkdownTemplate(args: Required<CreateNodeArgs>) {
  return `---
id: ${args.code}
slug: ${args.slug}
title: ${args.title}
module: ${args.module}
code: ${args.code}
tags:
summary:
definition:
status: draft
---

# 核心观点

# 系统解释

# 现实案例

# 视频化表达

# 延伸阅读
`;
}

const args = parseArgs(process.argv.slice(2));
validateArgs(args);

const nodeArgs = args as Required<CreateNodeArgs>;
const nodesDirectory = path.join(process.cwd(), "content", "nodes");
const targetFile = path.join(nodesDirectory, `${nodeArgs.slug}.md`);

if (fs.existsSync(targetFile)) {
  console.error(`节点文件已存在：${path.relative(process.cwd(), targetFile)}`);
  console.error("已退出，未覆盖现有文件。");
  process.exit(1);
}

fs.mkdirSync(nodesDirectory, { recursive: true });
fs.writeFileSync(targetFile, createMarkdownTemplate(nodeArgs), "utf8");

console.log(`已创建 Markdown 知识节点：${path.relative(process.cwd(), targetFile)}`);
