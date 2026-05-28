import {
  getStandardLocalKnowledgeNodes,
  printValidationResult,
  validateLocalKnowledgeNodes,
} from "./node-validation";

const isWriteMode = process.argv.includes("--write");
const nodes = getStandardLocalKnowledgeNodes();
const validationResult = validateLocalKnowledgeNodes(nodes);

if (validationResult.errors.length > 0) {
  printValidationResult(validationResult);
  process.exit(1);
}

if (isWriteMode) {
  console.log("写入模式尚未启用，请先配置 Supabase 写入逻辑。");
  process.exit(0);
}

console.log(`待同步节点总数：${nodes.length}`);
console.log("");

for (const node of nodes) {
  const { frontmatter } = node;

  console.log(
    `- ${frontmatter.title} | slug: ${frontmatter.slug} | module: ${frontmatter.module} | code: ${frontmatter.code} | status: ${frontmatter.status}`,
  );
}

console.log("");
console.log("当前为 dry-run，没有写入 Supabase。");
