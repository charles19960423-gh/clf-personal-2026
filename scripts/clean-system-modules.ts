import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { pinyin } from "pinyin-pro";

type ModuleConfig = {
  directory: string;
  idPrefix: string;
  module: string;
  moduleName: string;
  slugPrefix: string;
};

type MarkdownSource = {
  filePath: string;
  source: string;
};

type ParsedFile = MarkdownSource & {
  numberCode: string;
  title: string;
};

const sourceRoot = "content/nodes/框架20260528";
const outputRoot = path.join(process.cwd(), "content/nodes/20260528清洗");

const modules: ModuleConfig[] = [
  {
    directory: "02-族模块",
    idPrefix: "Z",
    module: "族",
    moduleName: "族模块",
    slugPrefix: "ethnos",
  },
  {
    directory: "03-家模块",
    idPrefix: "J",
    module: "家",
    moduleName: "家模块",
    slugPrefix: "family",
  },
  {
    directory: "04-企模块",
    idPrefix: "Q",
    module: "企",
    moduleName: "企模块",
    slugPrefix: "enterprise",
  },
  {
    directory: "05-人模块",
    idPrefix: "R",
    module: "人",
    moduleName: "人模块",
    slugPrefix: "human",
  },
];

function getGitMarkdownSources(directory: string): MarkdownSource[] {
  const prefix = `${sourceRoot}/${directory}`;

  const files = execFileSync(
    "git",
    ["-c", "core.quotepath=false", "ls-files", prefix],
    { encoding: "utf8" },
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
      { encoding: "utf8" },
    ),
  }));
}

function parseFileName(source: MarkdownSource): ParsedFile {
  const basename = path.basename(source.filePath, ".md");
  const match = basename.match(/^(\d{2}(?:-\d{2})*)-(.+)$/);

  if (!match) {
    throw new Error(`无法解析文件名：${basename}`);
  }

  return {
    ...source,
    numberCode: match[1],
    title: match[2].replace(/总览$/, ""),
  };
}

function getInitials(title: string) {
  return pinyin(title, {
    pattern: "first",
    toneType: "none",
    type: "array",
  })
    .join("")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();
}

function getDisplayCode(numberCode: string, title: string) {
  const initials = getInitials(title);

  return initials ? `${numberCode}-${initials}` : numberCode;
}

function getParentNumberCode(numberCode: string) {
  const parts = numberCode.split("-");

  if (parts.length <= 1) {
    return undefined;
  }

  return parts.slice(0, -1).join("-");
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
    `^## ${escapedHeading}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`,
    "m",
  );
  const match = body.match(pattern);

  return match?.[1]?.trim() ?? "";
}

function extractSubheadingText(body: string, heading: string) {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `^### ${escapedHeading}\\s*\\n([\\s\\S]*?)(?=\\n### |\\n## |$)`,
    "m",
  );
  const match = body.match(pattern);

  return stripMarkdown(match?.[1] ?? "");
}

function ensureSentence(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  return /[。！？!?]$/.test(trimmed) ? trimmed : `${trimmed}。`;
}

function compactText(value: string) {
  return value
    .replace(/\s+/g, "")
    .replace(/[。；;，,：:]+$/, "")
    .trim();
}

function buildSummary(body: string, title: string, config: ModuleConfig) {
  const candidates = [
    extractSubheadingText(body, "核心内涵"),
    extractSubheadingText(body, "核心目标"),
    extractSubheadingText(body, "模块使命"),
    stripMarkdown(extractHeadingSection(body, "模块定位")),
    stripMarkdown(extractHeadingSection(body, "核心框架")),
  ].filter(Boolean);

  return ensureSentence(
    candidates[0] ||
      `${title}是${config.moduleName}中用于理解系统结构、运行逻辑与现实表现的知识节点`,
  );
}

function buildDefinition(title: string, summary: string, config: ModuleConfig) {
  if (title === config.moduleName) {
    return `${config.moduleName}用于理解${config.module}系统中的核心结构、关系与运行逻辑。`;
  }

  return ensureSentence(
    `「${title}」是${config.moduleName}中用于理解${compactText(summary)}的结构性节点`,
  );
}

function buildTags(
  rawTags: unknown,
  title: string,
  numberCode: string,
  config: ModuleConfig,
) {
  const tags = new Set([config.moduleName, "总览"]);
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

  if (title !== config.moduleName) {
    tags.add(title);
  }

  if (numberCode.split("-").length >= 2) {
    tags.add(numberCode.split("-").slice(0, 2).join("-"));
  }

  return Array.from(tags);
}

function joinSections(sections: string[]) {
  return sections
    .map((section) => section.trim())
    .filter(Boolean)
    .join("\n\n");
}

function buildStandardBody(body: string, title: string, config: ModuleConfig) {
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

${coreIdea || `待补充：提炼「${title}」在${config.moduleName}中的核心判断。`}

# 系统解释

${explanation || `待补充：说明「${title}」在${config.moduleName}结构中的位置、边界与作用。`}

# 现实案例

待补充：结合现实关系、组织运行、个体成长或系统观察案例补充。

# 视频化表达

${videoAngles || `可以围绕「${title}为什么重要」「${title}如何影响系统运行」展开短视频选题。`}

# 延伸阅读

${readingPath || `- ${config.moduleName}
- ${title}
- 林峰系统论`}
`;
}

function cleanModule(config: ModuleConfig) {
  const sources = getGitMarkdownSources(config.directory).map(parseFileName);
  const outputDir = path.join(outputRoot, config.directory);
  const nodesByNumberCode = new Map(
    sources.map((source) => [source.numberCode, source]),
  );

  fs.mkdirSync(outputDir, { recursive: true });

  for (const source of sources) {
    const parsed = matter(source.source);
    const body = normalizeBody(parsed.content);
    const summary = buildSummary(body, source.title, config);
    const parentNumberCode = getParentNumberCode(source.numberCode);
    const parent = parentNumberCode
      ? nodesByNumberCode.get(parentNumberCode)
      : undefined;

    const frontmatter = {
      id: `${config.idPrefix}-${source.numberCode}`,
      slug: `${config.slugPrefix}-${source.numberCode}`,
      title: source.title,
      module: config.module,
      code: getDisplayCode(source.numberCode, source.title),
      level: source.numberCode.split("-").length,
      tags: buildTags(parsed.data.tags, source.title, source.numberCode, config),
      summary,
      definition: buildDefinition(source.title, summary, config),
      status: "published",
    };
    const frontmatterWithParent = parent
      ? {
          ...frontmatter,
          parentCode: getDisplayCode(parent.numberCode, parent.title),
        }
      : frontmatter;

    const outputFileName = path.basename(source.filePath).replace(/总览(?=\.md$)/, "");
    const outputPath = path.join(outputDir, outputFileName);

    fs.writeFileSync(
      outputPath,
      matter.stringify(
        buildStandardBody(body, source.title, config),
        frontmatterWithParent,
      ),
      "utf8",
    );
  }

  console.log(`${config.directory}：已清洗 ${sources.length} 个节点`);
}

for (const config of modules) {
  cleanModule(config);
}

console.log(`输出目录：${outputRoot}`);
