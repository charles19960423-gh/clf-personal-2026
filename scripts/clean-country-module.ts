import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import matter from "gray-matter";

const fallbackSourceDir = path.join(
  process.cwd(),
  "content/nodes/20260528清洗/01-国模块",
);
const outputDir = path.join(
  process.cwd(),
  "content/nodes/20260528清洗/01-国模块",
);
const gitSourcePrefix = "content/nodes/框架20260528/01-国模块";

function getMarkdownFiles(directory: string): string[] {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return getMarkdownFiles(entryPath);
      }

      return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : [];
    })
    .filter((filePath) => /^\d{2}(?:-\d{2})*-/.test(path.basename(filePath)))
    .sort((a, b) => a.localeCompare(b, "zh-CN"));
}

function getGitMarkdownSources() {
  try {
    const files = execFileSync(
      "git",
      ["-c", "core.quotepath=false", "ls-files", gitSourcePrefix],
      {
        encoding: "utf8",
      },
    )
      .split("\n")
      .map((file) => file.trim())
      .filter((file) => file.endsWith(".md"))
      .filter((file) => /^\d{2}(?:-\d{2})*-/.test(path.basename(file)))
      .sort((a, b) => a.localeCompare(b, "zh-CN"));

    return files.map((filePath) => ({
      filePath,
      source: execFileSync(
        "git",
        ["-c", "core.quotepath=false", "show", `HEAD:${filePath}`],
        {
          encoding: "utf8",
        },
      ),
    }));
  } catch {
    return [];
  }
}

function getFilesystemMarkdownSources() {
  return getMarkdownFiles(fallbackSourceDir).map((filePath) => ({
    filePath,
    source: fs.readFileSync(filePath, "utf8"),
  }));
}

function parseFileName(filePath: string) {
  const basename = path.basename(filePath, ".md");
  const match = basename.match(/^(\d{2}(?:-\d{2})*)-(.+)$/);

  if (!match) {
    throw new Error(`无法解析文件名：${basename}`);
  }

  return {
    code: match[1],
    title: match[2].replace(/总览$/, ""),
  };
}

function cleanWikiLinks(value: string) {
  return value
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1");
}

function removeVitePressBlocks(value: string) {
  return value
    .replace(/<Footer\s*\/>\s*/g, "")
    .replace(/<script setup>[\s\S]*?<\/script>\s*/g, "")
    .trim();
}

function normalizeBody(value: string) {
  return removeVitePressBlocks(cleanWikiLinks(value)).trim();
}

function stripMarkdown(value: string) {
  return (
    cleanWikiLinks(value)
      .replace(/```[\s\S]*?```/g, "")
      .replace(/\|.*\|/g, "")
      .replace(/^#+\s+/gm, "")
      .replace(/^[-*]\s+/gm, "")
      .replace(/^\d+\.\s+/gm, "")
      .replace(/\*\*/g, "")
      .replace(/`/g, "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .find(Boolean) ?? ""
  );
}

function extractHeadingSection(body: string, heading: string) {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `^## ${escapedHeading}\\s*\\n([\\s\\S]*?)(?=\\n## |(?![\\s\\S]))`,
    "m",
  );
  const match = body.match(pattern);

  return match?.[1]?.trim() ?? "";
}

function extractSubheadingText(body: string, heading: string) {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `^### ${escapedHeading}\\s*\\n([\\s\\S]*?)(?=\\n### |\\n## |(?![\\s\\S]))`,
    "m",
  );
  const match = body.match(pattern);

  return stripMarkdown(match?.[1] ?? "");
}

function compactText(value: string) {
  return value
    .replace(/\s+/g, "")
    .replace(/[。；;，,：:]+$/, "")
    .trim();
}

function ensureSentence(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  return /[。！？!?]$/.test(trimmed) ? trimmed : `${trimmed}。`;
}

function buildSummary(body: string, title: string) {
  const candidates = [
    extractSubheadingText(body, "核心内涵"),
    extractSubheadingText(body, "核心目标"),
    extractSubheadingText(body, "模块使命"),
    stripMarkdown(extractHeadingSection(body, "模块定位")),
    stripMarkdown(extractHeadingSection(body, "核心框架")),
  ].filter(Boolean);

  return ensureSentence(
    candidates[0] || `${title}是国模块中用于理解国家系统运行的知识节点`,
  );
}

function buildDefinition(title: string, summary: string) {
  if (title === "国模块") {
    return "国模块用于理解国家层面的结构、秩序、治理、资源与文明运行。";
  }

  return ensureSentence(`「${title}」是国模块中用于理解${compactText(summary)}的知识节点`);
}

function buildTags(rawTags: unknown, title: string, code: string) {
  const tags = new Set(["国模块", "总览"]);
  const originalTags = Array.isArray(rawTags) ? rawTags : [];

  for (const rawTag of originalTags) {
    String(rawTag)
      .replace(/^#/, "")
      .split("/")
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item) => {
        if (item !== "林峰系统论") {
          tags.add(item);
        }
      });
  }

  if (title !== "国模块") {
    tags.add(title);
  }

  if (code.split("-").length >= 2) {
    tags.add(code.split("-").slice(0, 2).join("-"));
  }

  return Array.from(tags);
}

function joinSections(sections: string[]) {
  return sections
    .map((section) => section.trim())
    .filter(Boolean)
    .join("\n\n");
}

function buildStandardBody(body: string, title: string) {
  const coreIdea = joinSections([
    extractHeadingSection(body, "核心理念"),
    extractHeadingSection(body, "核心分析框架"),
    extractHeadingSection(body, "核心框架"),
  ]);
  const explanation = joinSections([
    extractHeadingSection(body, "模块定位"),
    extractHeadingSection(body, "模块结构与笔记索引"),
  ]);
  const videoAngles = joinSections([
    extractHeadingSection(body, "研究要点"),
    extractHeadingSection(body, "模块迭代计划"),
    extractHeadingSection(body, "研究方向"),
    extractHeadingSection(body, "应用价值"),
  ]);
  const readingPath = joinSections([
    extractHeadingSection(body, "笔记索引"),
    extractHeadingSection(body, "模块结构与笔记索引"),
    extractHeadingSection(body, "关键概念术语表"),
    extractHeadingSection(body, "关联分析"),
  ]);

  return `# 核心观点

${coreIdea || `待补充：提炼「${title}」在国模块中的核心判断。`}

# 系统解释

${explanation || `待补充：说明「${title}」在国模块结构中的位置、边界与作用。`}

# 现实案例

待补充：结合现实国家运行、公共治理、产业变化或个人观察案例补充。

# 视频化表达

${videoAngles || `可以围绕「${title}为什么重要」「${title}如何影响个人与组织」展开短视频选题。`}

# 延伸阅读

${readingPath || `- 国模块
- ${title}
- 国家系统`}
`;
}

const sources = getGitMarkdownSources();
const files = sources.length > 0 ? sources : getFilesystemMarkdownSources();

for (const { filePath, source } of files) {
  const parsed = matter(source);
  const { code, title } = parseFileName(filePath);
  const body = normalizeBody(parsed.content);
  const summary = buildSummary(body, title);
  const frontmatter = {
    id: `G-${code}`,
    slug: `country-${code}`,
    title,
    module: "国",
    code,
    tags: buildTags(parsed.data.tags, title, code),
    summary,
    definition: buildDefinition(title, summary),
    status: "published",
  };

  const outputFileName = path.basename(filePath).replace(/总览(?=\.md$)/, "");
  const outputPath = path.join(outputDir, outputFileName);

  fs.writeFileSync(
    outputPath,
    matter.stringify(buildStandardBody(body, title), frontmatter),
    "utf8",
  );
}

console.log(`已清洗国模块 Markdown 节点：${files.length} 个`);
console.log(`来源：${sources.length > 0 ? "git HEAD 原始内容" : fallbackSourceDir}`);
console.log(`输出目录：${outputDir}`);
