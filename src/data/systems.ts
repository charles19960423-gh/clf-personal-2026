export type SystemEntry = {
  key: string;
  name: string;
  label: string;
  description: string;
};

export const systemEntries: SystemEntry[] = [
  {
    key: "nation",
    name: "国",
    label: "国家系统",
    description: "秩序、边界与文明叙事。",
  },
  {
    key: "ethnos",
    name: "族",
    label: "族群系统",
    description: "血缘、文化与共同记忆。",
  },
  {
    key: "family",
    name: "家",
    label: "家庭系统",
    description: "关系、传承与生命根系。",
  },
  {
    key: "enterprise",
    name: "企",
    label: "组织系统",
    description: "协作、价值与结构效率。",
  },
  {
    key: "human",
    name: "人",
    label: "个体系统",
    description: "心性、选择与自我成长。",
  },
];
