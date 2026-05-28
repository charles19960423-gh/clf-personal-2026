import type {
  KnowledgeNode,
  SystemKey,
  SystemModule,
  Topic,
  VideoTopic,
} from "@/types";

type NodeInput = Omit<KnowledgeNode, "systemKey">;

function createNode(systemKey: SystemKey, node: NodeInput): KnowledgeNode {
  return {
    ...node,
    systemKey,
  };
}

export const systems: SystemModule[] = [
  {
    key: "country",
    symbol: "国",
    name: "国家系统",
    description: "理解秩序、制度、边界与文明叙事的宏观结构。",
    nodes: [
      createNode("country", {
        slug: "country-order",
        code: "G-001",
        title: "国家秩序的生成",
        summary: "国家如何通过边界、法律与共识形成稳定秩序。",
        definition: "国家秩序，是公共权力、制度规则与共同叙事共同形成的稳定协作框架。",
        coreIdea: ["秩序不是自然存在的，而是被持续建构的。", "边界提供安全，制度提供预期，叙事提供认同。", "有效国家既要能行动，也要被约束。"],
        explanation: "国家系统关注宏观秩序的形成机制。它不是抽象权力的堆叠，而是边界、制度、资源配置与共同叙事之间的长期协调。",
        examples: ["城市交通依赖信号、执法、道路规划与公共习惯共同运作。", "重大公共危机中，国家能力会直接体现为组织动员与资源调配效率。"],
        videoAngles: ["用一座城市解释国家秩序如何被看见。", "为什么没有制度预期，努力也会失去方向。"],
        readingPath: ["国家为什么会形成", "制度如何降低社会交易成本", "共同叙事与现代国家"],
        tags: ["秩序", "制度", "边界"],
      }),
      createNode("country", {
        slug: "civilization-narrative",
        code: "G-002",
        title: "文明叙事与共同体",
        summary: "共同体如何借由历史叙事获得方向感。",
        definition: "文明叙事，是一个共同体解释自身来处、当下位置与未来方向的意义系统。",
        coreIdea: ["叙事决定共同体如何理解牺牲、责任与荣耀。", "没有共同故事，制度很难获得深层认同。", "叙事需要更新，否则会变成空洞口号。"],
        explanation: "文明叙事决定一个共同体如何理解过去、解释当下，并想象未来。它影响政策选择，也影响个体对身份与责任的感知。",
        examples: ["节日、纪念日、历史教育都在不断重述共同体故事。", "一个城市的更新规划常常会借用历史文脉来获得公共认同。"],
        videoAngles: ["为什么人需要一个比自己更大的故事。", "从节日看文明叙事的隐形力量。"],
        readingPath: ["共同体想象", "历史叙事的功能", "文明与现代身份"],
        tags: ["文明", "叙事", "共同体"],
      }),
      createNode("country", {
        slug: "public-power",
        code: "G-003",
        title: "公共权力的边界",
        summary: "权力有效运转必须同时拥有能力与边界。",
        definition: "公共权力的边界，是国家能力被授权、被监督、被限制的运行范围。",
        coreIdea: ["没有能力，公共目标无法落地。", "没有边界，公共权力会侵入生活本身。", "现代治理的关键，是能力与约束的平衡。"],
        explanation: "公共权力的关键不只是集中能力，也包括可预期的约束。边界让秩序不变成任意，能力让理想不停留在口号。",
        examples: ["审批流程既要防止滥用，也要避免把所有行动拖慢。", "公共安全管理需要授权，但也需要程序和透明度。"],
        videoAngles: ["为什么权力既要强，也要有限。", "一个审批窗口背后的治理逻辑。"],
        readingPath: ["公共权力的来源", "治理能力现代化", "程序正义"],
        tags: ["权力", "治理", "边界"],
      }),
    ],
  },
  {
    key: "ethnos",
    symbol: "族",
    name: "族群系统",
    description: "理解血缘、文化、身份与共同记忆如何塑造归属。",
    nodes: [
      createNode("ethnos", {
        slug: "ethnos-memory",
        code: "Z-001",
        title: "族群记忆",
        summary: "族群通过共同记忆维持连续性与身份感。",
        definition: "族群记忆，是由语言、仪式、故事与共同经历组成的身份连续性。",
        coreIdea: ["记忆让人知道自己从哪里来。", "共同记忆能形成凝聚，也可能形成偏见。", "成熟身份需要能继承，也能反思。"],
        explanation: "族群记忆由语言、仪式、故事与创伤经验组成。它让人知道自己从哪里来，也可能限制人看见新的可能。",
        examples: ["家族饭桌上的老故事，会悄悄塑造下一代对世界的理解。", "地方方言常常承载着比信息更多的亲密感。"],
        videoAngles: ["为什么一句乡音会让人瞬间放下防备。", "族群记忆如何影响一个人的选择。"],
        readingPath: ["记忆与身份", "仪式的社会功能", "文化传承与反思"],
        tags: ["记忆", "身份", "文化"],
      }),
      createNode("ethnos", {
        slug: "culture-boundary",
        code: "Z-002",
        title: "文化边界",
        summary: "文化边界既保护差异，也制造误解。",
        definition: "文化边界，是一群人对体面、正确、禁忌与归属的默认规则。",
        coreIdea: ["边界让文化保持辨识度。", "误解常发生在双方都以为自己只是常识。", "理解边界不是取消差异，而是看见差异。"],
        explanation: "文化边界是一套隐形规则，决定什么被视为自然、体面与正确。理解边界，是跨越边界的第一步。",
        examples: ["同一句直率表达，在不同文化里可能被理解为真诚或冒犯。", "婚礼、葬礼和节庆最容易显露文化边界。"],
        videoAngles: ["为什么你的常识，可能是别人的冒犯。", "用一顿饭解释文化边界。"],
        readingPath: ["文化差异", "边界与身份", "跨文化理解"],
        tags: ["文化", "边界", "差异"],
      }),
      createNode("ethnos", {
        slug: "identity-fluidity",
        code: "Z-003",
        title: "身份的流动性",
        summary: "现代人的身份不再单一，而是在多重关系中生成。",
        definition: "身份流动性，是个体在地域、语言、职业与价值选择中不断重组自我认同的过程。",
        coreIdea: ["现代身份越来越由多重关系构成。", "流动不等于无根，而是拥有多个坐标。", "清醒的人能选择身份，而不是被标签固定。"],
        explanation: "身份不是静态标签，而是在历史、地理、语言、职业与选择中不断被重写的关系结构。",
        examples: ["一个人可以同时是本地人、行业人、家庭成员和全球协作者。", "迁移经历会让人重新理解故乡与自我。"],
        videoAngles: ["现代人为什么越来越难用一个标签定义自己。", "从迁移经历谈身份重组。"],
        readingPath: ["现代性与身份", "流动社会", "自我认同"],
        tags: ["身份", "现代性", "关系"],
      }),
    ],
  },
  {
    key: "family",
    symbol: "家",
    name: "家庭系统",
    description: "理解亲密关系、代际传承、情感模式与生命根系。",
    nodes: [
      createNode("family", {
        slug: "family-system",
        code: "J-001",
        title: "家庭系统",
        summary: "家庭是个体情感结构、关系模式与安全感的最初系统。",
        definition: "家庭系统，是由亲密关系、代际模式、情绪规则与责任结构共同组成的生命根系。",
        coreIdea: ["家庭不是单个成员的相加，而是一套互动系统。", "很多个体问题，背后是关系结构长期塑造的结果。", "看懂家庭不是为了归罪，而是为了重新获得选择。"],
        explanation: "家庭系统塑造人的底层情绪、关系预期和安全感模型。一个人如何表达需求、处理冲突、理解爱与责任，往往先在家庭里学会。",
        examples: ["一个总是替别人负责的人，可能来自边界不清的家庭结构。", "一个害怕表达需求的人，可能曾经在亲密关系中反复被否定。"],
        videoAngles: ["为什么你长大后还在重复家里的关系模式。", "家庭系统不是宿命，而是一张可以被看见的地图。", "从一次争吵看见家庭里的隐形规则。"],
        readingPath: ["家庭系统理论入门", "原生家庭与个体选择", "边界感与亲密关系", "代际模式的识别"],
        tags: ["家庭", "安全感", "关系模式"],
      }),
      createNode("family", {
        slug: "intergenerational-pattern",
        code: "J-002",
        title: "代际模式",
        summary: "未被理解的模式，常以命运的形式重复。",
        definition: "代际模式，是家庭中未被觉察的情绪、信念与行为脚本在不同世代之间重复出现。",
        coreIdea: ["模式不一定通过说教传递，也会通过沉默传递。", "重复不是因为软弱，而是因为没有被识别。", "识别模式，就是把自动反应重新变成选择。"],
        explanation: "代际模式会通过语言、沉默、期待与恐惧传递。识别模式，是把自动反应重新变成清醒选择。",
        examples: ["父母从不表达脆弱，孩子也可能把求助理解为羞耻。", "上一代对匮乏的恐惧，可能变成下一代对金钱的焦虑。"],
        videoAngles: ["为什么我们会活成父母的某个影子。", "代际模式如何被看见、命名、松动。"],
        readingPath: ["代际创伤", "家庭脚本", "情绪传递"],
        tags: ["代际", "模式", "传承"],
      }),
      createNode("family", {
        slug: "intimacy-order",
        code: "J-003",
        title: "亲密关系的秩序",
        summary: "亲密不是混同，而是边界清楚后的靠近。",
        definition: "亲密关系的秩序，是爱、边界、责任与真实表达之间的动态平衡。",
        coreIdea: ["没有边界的亲密容易变成控制。", "没有表达的关系容易积累误解。", "成熟关系允许靠近，也允许不同。"],
        explanation: "稳定的亲密关系需要爱，也需要边界、责任与真实表达。关系的成熟，是既能靠近，也能保持自我。",
        examples: ["伴侣之间的争吵，常常不是事件本身，而是需求没有被听见。", "父母尊重孩子的边界，反而能建立更稳定的连接。"],
        videoAngles: ["为什么越亲近越需要边界。", "亲密关系里最容易被误解的责任感。"],
        readingPath: ["亲密关系心理学", "边界感", "非暴力沟通"],
        tags: ["亲密", "边界", "关系"],
      }),
    ],
  },
  {
    key: "enterprise",
    symbol: "企",
    name: "组织系统",
    description: "理解组织协作、价值创造、结构效率与管理心智。",
    nodes: [
      createNode("enterprise", {
        slug: "organization-structure",
        code: "Q-001",
        title: "组织结构",
        summary: "结构决定信息如何流动，责任如何落地。",
        definition: "组织结构，是权责、信息、资源与激励在组织内部的真实流动方式。",
        coreIdea: ["组织结构不是组织架构图。", "信息流决定决策质量。", "责任边界决定执行效率。"],
        explanation: "组织结构不是组织图，而是权责、信息、资源与激励的真实路径。好的结构让复杂协作变得可执行。",
        examples: ["同一个需求在三个部门之间来回传递，说明结构上缺少清晰 owner。", "扁平组织如果没有决策规则，也会变成隐形集权。"],
        videoAngles: ["为什么组织图不能说明一家公司的真实结构。", "用一次项目延期看组织结构问题。"],
        readingPath: ["组织设计", "责任机制", "信息流与决策"],
        tags: ["组织", "结构", "协作"],
      }),
      createNode("enterprise", {
        slug: "value-creation",
        code: "Q-002",
        title: "价值创造",
        summary: "企业存在的理由，是持续创造可交换的价值。",
        definition: "价值创造，是组织把用户问题转化为产品、服务与可持续交换关系的过程。",
        coreIdea: ["价值来自真实问题，而不是内部想象。", "交换机制让价值得以持续。", "增长必须回到价值本身校准。"],
        explanation: "价值创造连接用户问题、产品能力与商业模型。没有真实价值，增长只是噪音；没有交换机制，价值难以持续。",
        examples: ["用户愿意反复付费，说明产品进入了真实工作流。", "只靠补贴获得的增长，往往没有证明价值成立。"],
        videoAngles: ["为什么增长不能替代价值。", "一个好产品到底在交换什么。"],
        readingPath: ["用户问题", "商业模式", "产品价值"],
        tags: ["价值", "商业", "产品"],
      }),
      createNode("enterprise", {
        slug: "management-mindset",
        code: "Q-003",
        title: "管理心智",
        summary: "管理是通过他人与系统完成目标的能力。",
        definition: "管理心智，是从个人贡献转向目标、机制、反馈与人才发展的系统思考方式。",
        coreIdea: ["管理不是更忙，而是让系统更有效。", "目标需要被翻译成节奏和反馈。", "优秀管理者建设机制，而不只解决眼前问题。"],
        explanation: "管理心智从个人英雄转向系统建设。它关心目标、节奏、反馈、人才与机制，而不仅是勤奋本身。",
        examples: ["团队每次都靠负责人救火，说明机制还没有建立。", "清晰的周节奏能让复杂目标变得可跟踪。"],
        videoAngles: ["为什么优秀员工不一定天然会管理。", "管理者真正该盯住什么。"],
        readingPath: ["目标管理", "反馈机制", "人才密度"],
        tags: ["管理", "心智", "机制"],
      }),
    ],
  },
  {
    key: "human",
    symbol: "人",
    name: "个体系统",
    description: "理解心性、选择、能力结构与成为自己的路径。",
    nodes: [
      createNode("human", {
        slug: "being-yourself",
        code: "R-001",
        title: "成为你自己",
        summary: "成长不是变成别人，而是回到真实的能力与愿望。",
        definition: "成为你自己，是一个人识别外部期待、整理内在秩序，并用行动把真实自我带入现实的过程。",
        coreIdea: ["成为自己不是任性，而是对自身结构的清醒负责。", "真正的自我不是口号，而会体现在选择、边界和行动里。", "成长的方向不是复制成功模板，而是找到自己的能力、愿望与责任之间的稳定关系。"],
        explanation: "成为你自己，是个体系统的核心命题。它要求一个人把外部声音、家庭脚本、社会评价和内在愿望区分开来，再用持续行动验证什么才真正属于自己。",
        examples: ["一个人放弃体面但消耗自己的路径，转向更符合能力结构的长期事业。", "面对亲密关系或工作选择时，不再只问别人怎么看，而是问这是否符合自己的价值秩序。"],
        videoAngles: ["为什么你越努力，越不像自己。", "成为自己不是逃离责任，而是承担真正属于你的责任。", "用三个问题判断你是在成长，还是在讨好。"],
        readingPath: ["自我认同", "内在秩序", "边界感", "长期主义与人生选择"],
        tags: ["自我", "成长", "选择"],
      }),
      createNode("human", {
        slug: "inner-order",
        code: "R-002",
        title: "内在秩序",
        summary: "稳定的人不是没有冲突，而是能安放冲突。",
        definition: "内在秩序，是个体对欲望、恐惧、价值与行动优先级的持续整理能力。",
        coreIdea: ["稳定不是没有情绪，而是不被情绪完全接管。", "价值排序越清楚，选择成本越低。", "秩序来自反复校准，不来自一次顿悟。"],
        explanation: "内在秩序来自对欲望、恐惧、价值与能力的持续整理。一个人越清楚什么重要，越能从噪音中脱身。",
        examples: ["面对机会时，能判断它是否服务长期目标，而不是只被短期认可吸引。", "在冲突中先辨认自己的真实需求，再决定如何表达。"],
        videoAngles: ["稳定的人到底稳定在哪里。", "为什么你需要给人生做价值排序。"],
        readingPath: ["价值澄清", "情绪觉察", "注意力管理"],
        tags: ["心性", "秩序", "价值"],
      }),
      createNode("human", {
        slug: "individual-system",
        code: "R-003",
        title: "个体系统",
        summary: "用系统化方式管理注意力、判断、能力与行动。",
        definition: "个体系统，是一个人处理信息、形成判断、配置能力、采取行动并获得反馈的个人操作系统。",
        coreIdea: ["人不是靠意志力长期运行，而是靠系统运行。", "输入决定认知材料，判断决定行动质量，反馈决定迭代速度。", "个人系统越清楚，越不容易被环境牵着走。"],
        explanation: "个体系统包括信息输入、认知加工、决策原则和行动反馈。它让成长从情绪驱动变成结构驱动，从偶然努力变成可复盘的长期进化。",
        examples: ["固定记录阅读、判断和行动结果，让经验沉淀成方法。", "为工作、关系、健康分别建立可观察的反馈指标，减少模糊焦虑。"],
        videoAngles: ["为什么你需要一个个人操作系统。", "如何把焦虑拆成输入、判断、行动和反馈。", "成长不是鸡血，是系统升级。"],
        readingPath: ["个人知识管理", "决策模型", "复盘方法", "行动系统"],
        tags: ["系统", "行动", "认知"],
      }),
    ],
  },
];

export const knowledgeNodes: KnowledgeNode[] = systems.flatMap(
  (system) => system.nodes,
);

export const videoTopics: VideoTopic[] = [
  {
    id: "video-001",
    title: "为什么人最重要的是成为自己？",
    coreIdea: "成为自己不是任性，而是把外部期待、真实愿望和长期责任重新对齐。",
    relatedNodes: ["being-yourself", "individual-system", "inner-order"],
    status: "scripting",
    platform: ["抖音", "视频号", "B站"],
    outline: [
      "开场：很多人越努力越不像自己。",
      "拆解：外部期待、家庭脚本、社会评价如何塑造人。",
      "转折：成为自己不是逃离责任，而是承担真正属于自己的责任。",
      "收束：用三个问题判断自己是否正在回到内在秩序。",
    ],
    script:
      "你以为你是在成长，其实你可能只是在变成一个更符合别人期待的人。真正的成为自己，不是想做什么就做什么，而是知道什么对你重要，并愿意为它负责。",
    publishUrl: null,
    publishDate: null,
    review: {
      updatedAt: "2026-05-27",
      conclusion: "适合作为账号主张视频，语气要克制，不要做成鸡汤。",
    },
  },
  {
    id: "video-002",
    title: "什么是真正的内在秩序？",
    coreIdea: "稳定的人不是没有情绪，而是能把情绪、欲望和价值放回正确位置。",
    relatedNodes: ["inner-order", "being-yourself"],
    status: "ready-to-shoot",
    platform: ["视频号", "小红书"],
    outline: [
      "开场：稳定不是冷漠，也不是压抑。",
      "解释：内在秩序来自价值排序。",
      "案例：机会、关系、情绪冲突中的判断方式。",
      "结尾：给观众一个价值排序练习。",
    ],
    script:
      "真正稳定的人，不是没有冲突，而是知道冲突来了以后，自己应该先看见什么、放下什么、坚持什么。",
    publishUrl: null,
    publishDate: null,
    review: {
      updatedAt: "2026-05-27",
      conclusion: "可做成 90 秒短视频，画面以黑白字幕和静态人物为主。",
    },
  },
  {
    id: "video-003",
    title: "家庭关系为什么会失衡？",
    coreIdea: "家庭关系失衡，常常不是谁不够爱，而是边界、责任和情绪规则长期错位。",
    relatedNodes: ["family-system", "intergenerational-pattern", "intimacy-order"],
    status: "inspiration",
    platform: ["小红书", "视频号"],
    outline: [
      "开场：很多家庭的问题不是不爱，而是爱没有秩序。",
      "解释：家庭是一套互动系统。",
      "案例：替别人负责、害怕表达需求、代际重复。",
      "收束：看懂家庭不是归罪，而是重新获得选择。",
    ],
    script:
      "一个家庭最难的地方，不是有没有爱，而是爱有没有边界。没有边界的爱，很容易变成控制、愧疚和消耗。",
    publishUrl: null,
    publishDate: null,
    review: {
      updatedAt: "2026-05-27",
      conclusion: "适合做系列第一条，注意避免心理诊断化表达。",
    },
  },
  {
    id: "video-004",
    title: "组织为什么需要价值系统？",
    coreIdea: "组织没有价值系统，就只能靠短期目标、个人意志和反复救火维持运转。",
    relatedNodes: ["value-creation", "organization-structure", "management-mindset"],
    status: "shot",
    platform: ["B站", "视频号"],
    outline: [
      "开场：增长不能替代价值。",
      "解释：价值系统连接用户问题、产品能力和组织协作。",
      "案例：只靠补贴增长的项目为何脆弱。",
      "结尾：组织真正要建设的是可持续交换关系。",
    ],
    script:
      "一家组织如果没有价值系统，就会把忙碌误认为创造，把增长误认为健康，把救火误认为管理。",
    publishUrl: null,
    publishDate: null,
    review: {
      updatedAt: "2026-05-26",
      conclusion: "已拍摄，剪辑时需要增加结构图辅助理解。",
    },
  },
  {
    id: "video-005",
    title: "个人成长的底层逻辑",
    coreIdea: "个人成长不是靠一阵热情，而是靠输入、判断、行动和反馈组成的个人系统。",
    relatedNodes: ["individual-system", "inner-order", "being-yourself"],
    status: "published",
    platform: ["B站", "视频号"],
    outline: [
      "开场：为什么很多努力没有复利。",
      "解释：输入、判断、行动、反馈四个环节。",
      "案例：如何把焦虑拆成可处理的问题。",
      "结尾：成长不是鸡血，是系统升级。",
    ],
    script:
      "真正的成长不是每天告诉自己要努力，而是把努力放进一个能反馈、能修正、能沉淀的系统里。",
    publishUrl: "https://example.com/linfeng/video-005",
    publishDate: "2026-05-20",
    review: {
      updatedAt: "2026-05-21",
      conclusion: "完播率较好，标题可以更锋利，后续延展成三集系列。",
    },
  },
  {
    id: "video-006",
    title: "如何理解林峰系统论？",
    coreIdea: "林峰系统论用国、族、家、企、人五个层次，把世界结构与个体成长放进同一套认知操作系统。",
    relatedNodes: [
      "country-order",
      "ethnos-memory",
      "family-system",
      "value-creation",
      "being-yourself",
    ],
    status: "scripting",
    platform: ["B站", "视频号", "抖音"],
    outline: [
      "开场：一个人要理解自己，不能只看自己。",
      "展开：国、族、家、企、人分别解释什么。",
      "重点：人是系统的落点，BEING YOURSELF 是核心命题。",
      "结尾：系统不是答案，而是持续看见问题的方法。",
    ],
    script:
      "林峰系统论不是一套概念收藏，而是一套认知操作系统。它让你从世界、组织、关系和自己之间，看见那些原本分散的问题。",
    publishUrl: null,
    publishDate: null,
    review: {
      updatedAt: "2026-05-27",
      conclusion: "适合作为主页导流视频，脚本需要更有开场冲击力。",
    },
  },
];

export const topics: Topic[] = [
  {
    id: "topic-001",
    title: "新手从这里开始",
    slug: "start-here",
    description: "先建立五大系统的总体坐标，再进入核心概念与个人路径。",
    relatedNodes: [
      "being-yourself",
      "individual-system",
      "country-order",
      "family-system",
      "value-creation",
    ],
    relatedVideos: ["video-006", "video-005"],
    order: 1,
    status: "published",
  },
  {
    id: "topic-002",
    title: "理解人性",
    slug: "understand-human-nature",
    description: "从内在秩序、身份、选择与行动系统，看见人的底层运行。",
    relatedNodes: [
      "being-yourself",
      "inner-order",
      "individual-system",
      "identity-fluidity",
    ],
    relatedVideos: ["video-001", "video-002", "video-005"],
    order: 2,
    status: "published",
  },
  {
    id: "topic-003",
    title: "理解关系",
    slug: "understand-relationships",
    description: "进入家庭、亲密关系、族群记忆与组织协作中的关系结构。",
    relatedNodes: [
      "family-system",
      "intergenerational-pattern",
      "intimacy-order",
      "ethnos-memory",
      "organization-structure",
    ],
    relatedVideos: ["video-003", "video-004"],
    order: 3,
    status: "published",
  },
  {
    id: "topic-004",
    title: "成为自己",
    slug: "being-yourself-path",
    description: "围绕 BEING YOURSELF 建立从自我识别到系统行动的成长路径。",
    relatedNodes: ["being-yourself", "inner-order", "individual-system"],
    relatedVideos: ["video-001", "video-002", "video-005"],
    order: 4,
    status: "published",
  },
];

export function getSystemByKey(key: KnowledgeNode["systemKey"]) {
  return systems.find((system) => system.key === key);
}

export function getNodeBySlug(slug: string) {
  return knowledgeNodes.find((node) => node.slug === slug);
}

export function getTopicBySlug(slug: string) {
  return topics.find((topic) => topic.slug === slug);
}

export function getVideoTopicById(id: string) {
  return videoTopics.find((topic) => topic.id === id);
}

export function getRelatedNodes(node: KnowledgeNode, limit = 4) {
  const sameSystemNodes = knowledgeNodes.filter(
    (item) => item.systemKey === node.systemKey && item.slug !== node.slug,
  );
  const otherNodes = knowledgeNodes.filter(
    (item) => item.systemKey !== node.systemKey,
  );

  return [...sameSystemNodes, ...otherNodes].slice(0, limit);
}
