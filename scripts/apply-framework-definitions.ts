import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

type FrameworkDefinition = {
  code: string;
  definition: string;
  module: string;
  moduleDir: string;
  pathTitles: string[];
  title: string;
};

type ModuleState = {
  code: string;
  directory: string;
  module: string;
  secondIndex: number;
  secondTitle: string;
  thirdIndex: number;
  thirdTitle: string;
};

const docxPath = "/Users/jx-charles/Downloads/林峰系统论-框架.docx";
const cleanedRoot = path.join(process.cwd(), "content/nodes/20260528清洗");

const moduleConfig: Record<string, { code: string; directory: string }> = {
  国: { code: "01", directory: "01-国模块" },
  族: { code: "02", directory: "02-族模块" },
  家: { code: "03", directory: "03-家模块" },
};

function decodeXml(value: string) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function getDocxParagraphs(filePath: string) {
  const xml = execFileSync("unzip", ["-p", filePath, "word/document.xml"], {
    encoding: "utf8",
  });

  return xml
    .split("</w:p>")
    .map((paragraph) =>
      Array.from(paragraph.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g))
        .map((match) => decodeXml(match[1]))
        .join("")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);
}

function padIndex(value: number) {
  return String(value).padStart(2, "0");
}

function cleanTitle(value: string) {
  return value
    .replace(/^[-\s]+/, "")
    .replace(/（.*?）/g, "")
    .replace(/\(.*?\)/g, "")
    .replace(/总览$/, "")
    .trim();
}

function parseDefinitions(lines: string[]): FrameworkDefinition[] {
  const definitions: FrameworkDefinition[] = [];
  let state: ModuleState | null = null;

  for (const line of lines) {
    const firstMatch = line.match(/^一级分类[:：]\s*([国族家])/);

    if (firstMatch) {
      const moduleSymbol = firstMatch[1];
      const config = moduleConfig[moduleSymbol];

      state = {
        code: config.code,
        directory: config.directory,
        module: moduleSymbol,
        secondIndex: 0,
        secondTitle: "",
        thirdIndex: 0,
        thirdTitle: "",
      };
      continue;
    }

    if (!state) {
      continue;
    }

    const secondMatch = line.match(/^二级分类[:：]\s*(.+)$/);

    if (secondMatch) {
      state.secondIndex += 1;
      state.secondTitle = cleanTitle(secondMatch[1]);
      state.thirdIndex = 0;
      state.thirdTitle = "";
      continue;
    }

    const thirdMatch = line.match(/^三级分类[:：]\s*(.+)$/);

    if (thirdMatch) {
      state.thirdIndex += 1;
      state.thirdTitle = cleanTitle(thirdMatch[1]);
      continue;
    }

    const fourthMatch = line.match(
      /^-\s*四级分类[:：]\s*(.+?)\s*→\s*核心内涵[:：]\s*(.+)$/,
    );

    if (fourthMatch && state.secondIndex > 0 && state.thirdIndex > 0) {
      const title = cleanTitle(fourthMatch[1]);
      const definition = fourthMatch[2].trim();
      const siblingCount =
        definitions.filter(
          (item) =>
            item.module === state?.module &&
            item.pathTitles[0] === state?.secondTitle &&
            item.pathTitles[1] === state?.thirdTitle,
        ).length + 1;

      definitions.push({
        code: [
          state.code,
          padIndex(state.secondIndex),
          padIndex(state.thirdIndex),
          padIndex(siblingCount),
        ].join("-"),
        definition,
        module: state.module,
        moduleDir: state.directory,
        pathTitles: [state.secondTitle, state.thirdTitle, title],
        title,
      });
    }
  }

  return definitions;
}

function getMarkdownFiles(directory: string): string[] {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return getMarkdownFiles(entryPath);
      }

      return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : [];
    });
}

function getNumberCodeFromFile(filePath: string) {
  return path.basename(filePath).match(/^(\d{2}(?:-\d{2})*)-/)?.[1];
}

function normalizeSentence(value: string) {
  const trimmed = value.trim();

  return /[。！？!?]$/.test(trimmed) ? trimmed : `${trimmed}。`;
}

function buildCoreIdea(item: FrameworkDefinition) {
  const pathText = `${item.module} → ${item.pathTitles.join(" → ")}`;

  return `${item.title}的核心在于${item.definition}。它不是孤立概念，而是${pathText}这一结构中的关键观察点，用来帮助理解该板块如何从抽象分类进入现实判断。`;
}

function buildSystemExplanation(item: FrameworkDefinition) {
  const [secondTitle, thirdTitle] = item.pathTitles;
  const moduleName = `${item.module}模块`;

  return `${item.title}用于理解${item.definition}。在${moduleName}中，它位于“${secondTitle}—${thirdTitle}”分支下，承担把上层分类转化为具体判断对象的作用。理解${item.title}，不是停留在概念命名，而是看清它如何影响系统运行中的资源配置、关系组织、行动选择与风险识别。它把抽象结构落到具体场景，让人能够判断边界、优先级与行动方向。对林峰系统论而言，${item.title}提供了一个可操作的观察入口：既能帮助个人识别自身处境，也能帮助组织或家庭理解外部结构的变化，从而在复杂现实中形成更稳定的判断、协同与成长路径。`;
}

function replaceSection(content: string, heading: string, replacement: string) {
  const pattern = new RegExp(
    `(^# ${heading}\\s*\\n)([\\s\\S]*?)(?=\\n# |(?![\\s\\S]))`,
    "m",
  );

  if (!pattern.test(content)) {
    return `${content.trim()}\n\n# ${heading}\n\n${replacement.trim()}\n`;
  }

  return content.replace(pattern, `$1${replacement.trim()}\n`);
}

function updateMarkdownFile(filePath: string, item: FrameworkDefinition) {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const summary = normalizeSentence(item.definition);
  const definition = normalizeSentence(
    `${item.title}是${item.module}模块中用于理解${item.definition}的结构性节点`,
  );
  let content = parsed.content.trim();

  content = replaceSection(content, "核心观点", buildCoreIdea(item));
  content = replaceSection(content, "系统解释", buildSystemExplanation(item));

  const data = {
    ...parsed.data,
    summary,
    definition,
  };

  fs.writeFileSync(filePath, matter.stringify(content, data), "utf8");
}

const definitions = parseDefinitions(getDocxParagraphs(docxPath));
const files = getMarkdownFiles(cleanedRoot);
const filesByNumberCode = new Map<string, string>();

for (const file of files) {
  const numberCode = getNumberCodeFromFile(file);

  if (numberCode) {
    filesByNumberCode.set(numberCode, file);
  }
}

const unmatched: FrameworkDefinition[] = [];
let updatedCount = 0;

for (const definition of definitions) {
  const filePath = filesByNumberCode.get(definition.code);

  if (!filePath) {
    unmatched.push(definition);
    continue;
  }

  updateMarkdownFile(filePath, definition);
  updatedCount += 1;
}

console.log(`已解析定义：${definitions.length} 条`);
console.log(`成功更新节点：${updatedCount} 个`);
console.log(`未匹配节点：${unmatched.length} 个`);

if (unmatched.length > 0) {
  console.log("");
  console.log("未匹配节点：");

  for (const item of unmatched) {
    console.log(`- ${item.code} ${item.module} ${item.pathTitles.join(" / ")}`);
  }
}
