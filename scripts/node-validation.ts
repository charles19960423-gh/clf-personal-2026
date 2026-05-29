import path from "node:path";
import {
  getLocalKnowledgeNodes,
  type LocalMarkdownNode,
  type MarkdownFrontmatter,
} from "../src/lib/markdown";

export type NodeValidationError = {
  file: string;
  reason: string;
};

export type NodeValidationResult = {
  errors: NodeValidationError[];
  nodes: LocalMarkdownNode[];
  passedCount: number;
  totalCount: number;
};

const requiredFields: Array<keyof MarkdownFrontmatter> = [
  "slug",
  "title",
  "module",
  "code",
  "summary",
  "definition",
  "status",
];

const nodesDirectory = path.join(process.cwd(), "content", "nodes");

function isFilled(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function formatRelativePath(filePath: string) {
  return path.relative(process.cwd(), filePath);
}

function isStandardNodeFile(node: LocalMarkdownNode) {
  const basename = path.basename(node.filePath);
  const isRootNode =
    path.dirname(node.filePath) === nodesDirectory && basename.endsWith(".md");
  const isNumberedNestedNode =
    node.filePath.startsWith(`${nodesDirectory}${path.sep}`) &&
    node.filePath.includes(`${path.sep}20260528清洗${path.sep}`) &&
    /[/\\]0[1-5]-[^/\\]+模块[/\\]/.test(node.filePath) &&
    /^\d{2}(?:-\d{2})*-/.test(basename) &&
    basename.endsWith(".md");

  return (
    (isRootNode || isNumberedNestedNode) &&
    basename !== "README.md" &&
    basename !== "index.md"
  );
}

export function getStandardLocalKnowledgeNodes(): LocalMarkdownNode[] {
  return getLocalKnowledgeNodes()
    .filter(isStandardNodeFile)
    .sort((a, b) => a.filePath.localeCompare(b.filePath));
}

export function validateLocalKnowledgeNodes(
  nodes: LocalMarkdownNode[] = getStandardLocalKnowledgeNodes(),
): NodeValidationResult {
  const errors: NodeValidationError[] = [];
  const slugs = new Map<string, string[]>();
  const codes = new Map<string, string[]>();

  for (const node of nodes) {
    const relativeFile = formatRelativePath(node.filePath);
    const meta = node.frontmatter;

    for (const field of requiredFields) {
      if (!isFilled(meta[field])) {
        errors.push({
          file: relativeFile,
          reason: `缺少或为空：${field}`,
        });
      }
    }

    if (isFilled(meta.slug)) {
      const slug = meta.slug.trim();
      slugs.set(slug, [...(slugs.get(slug) ?? []), relativeFile]);
    }

    if (isFilled(meta.code)) {
      const code = meta.code.trim();
      codes.set(code, [...(codes.get(code) ?? []), relativeFile]);
    }
  }

  for (const [slug, duplicateFiles] of slugs.entries()) {
    if (duplicateFiles.length > 1) {
      for (const file of duplicateFiles) {
        errors.push({
          file,
          reason: `slug 不唯一：${slug}`,
        });
      }
    }
  }

  for (const [code, duplicateFiles] of codes.entries()) {
    if (duplicateFiles.length > 1) {
      for (const file of duplicateFiles) {
        errors.push({
          file,
          reason: `code 不唯一：${code}`,
        });
      }
    }
  }

  const filesWithErrors = new Set(errors.map((error) => error.file));

  return {
    errors,
    nodes,
    passedCount: nodes.length - filesWithErrors.size,
    totalCount: nodes.length,
  };
}

export function printValidationResult(result: NodeValidationResult) {
  console.log(`总节点数：${result.totalCount}`);
  console.log(`通过数量：${result.passedCount}`);
  console.log(`错误数量：${result.errors.length}`);

  if (result.errors.length > 0) {
    console.log("");
    console.log("错误详情：");

    for (const error of result.errors) {
      console.log(`- ${error.file}：${error.reason}`);
    }
  }
}
