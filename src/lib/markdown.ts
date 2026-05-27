import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type MarkdownFrontmatter = {
  id?: string;
  slug?: string;
  title?: string;
  module?: string;
  code?: string;
  tags?: string[];
  summary?: string;
  definition?: string;
  status?: string;
};

export type LocalMarkdownNode = {
  filePath: string;
  content: string;
  frontmatter: MarkdownFrontmatter;
};

const contentRoot = path.join(process.cwd(), "content");

export function getMarkdownFiles(directory: string): string[] {
  const targetDirectory = path.isAbsolute(directory)
    ? directory
    : path.join(contentRoot, directory);

  if (!fs.existsSync(targetDirectory)) {
    return [];
  }

  return fs
    .readdirSync(targetDirectory, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = path.join(targetDirectory, entry.name);

      if (entry.isDirectory()) {
        return getMarkdownFiles(entryPath);
      }

      return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : [];
    })
    .sort();
}

export function parseMarkdownFrontmatter(filePath: string) {
  const file = fs.readFileSync(filePath, "utf8");
  const parsed = matter(file);

  return {
    content: parsed.content.trim(),
    frontmatter: parsed.data as MarkdownFrontmatter,
  };
}

export function getLocalKnowledgeNodes(): LocalMarkdownNode[] {
  return getMarkdownFiles("nodes").map((filePath) => {
    const parsed = parseMarkdownFrontmatter(filePath);

    return {
      filePath,
      ...parsed,
    };
  });
}
