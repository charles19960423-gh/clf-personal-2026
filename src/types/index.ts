export type SystemKey = "country" | "ethnos" | "family" | "enterprise" | "human";

export type KnowledgeNode = {
  slug: string;
  code: string;
  title: string;
  systemKey: SystemKey;
  summary: string;
  definition: string;
  coreIdea: string[];
  explanation: string;
  examples: string[];
  videoAngles: string[];
  readingPath: string[];
  tags: string[];
};

export type SystemModule = {
  key: SystemKey;
  symbol: string;
  name: string;
  description: string;
  nodes: KnowledgeNode[];
};

export type VideoTopic = {
  id: string;
  title: string;
  coreIdea: string;
  relatedNodes: string[];
  status:
    | "inspiration"
    | "scripting"
    | "ready-to-shoot"
    | "shot"
    | "published";
  platform: string[];
  outline: string[];
  script: string;
  publishUrl: string | null;
  publishDate: string | null;
  review: {
    updatedAt: string;
    conclusion: string;
  };
};
