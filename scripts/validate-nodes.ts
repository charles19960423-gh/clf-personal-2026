import {
  printValidationResult,
  validateLocalKnowledgeNodes,
} from "./node-validation";

const result = validateLocalKnowledgeNodes();

printValidationResult(result);

if (result.errors.length > 0) {
  process.exit(1);
}

console.log("所有 Markdown 节点校验通过。");
