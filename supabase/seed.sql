insert into public.knowledge_nodes (
  code,
  slug,
  title,
  module,
  summary,
  definition,
  core_idea,
  explanation,
  examples,
  tags,
  relations,
  status
) values
(
  'R-001',
  'being-yourself',
  '成为你自己',
  '人',
  '成长不是变成别人，而是回到真实的能力与愿望。',
  '成为你自己，是一个人识别外部期待、整理内在秩序，并用行动把真实自我带入现实的过程。',
  '成为自己不是任性，而是对自身结构的清醒负责。',
  '它要求一个人把外部声音、家庭脚本、社会评价和内在愿望区分开来，再用持续行动验证什么才真正属于自己。',
  '["放弃体面但消耗自己的路径，转向更符合能力结构的长期事业。"]'::jsonb,
  array['自我', '成长', '选择'],
  array['inner-order', 'individual-system'],
  'published'
),
(
  'R-002',
  'inner-order',
  '内在秩序',
  '人',
  '稳定的人不是没有冲突，而是能安放冲突。',
  '内在秩序，是个体对欲望、恐惧、价值与行动优先级的持续整理能力。',
  '稳定不是没有情绪，而是不被情绪完全接管。',
  '一个人越清楚什么重要，越能从噪音中脱身。',
  '["面对机会时，判断它是否服务长期目标，而不是只被短期认可吸引。"]'::jsonb,
  array['心性', '秩序', '价值'],
  array['being-yourself', 'individual-system'],
  'published'
),
(
  'J-001',
  'family-system',
  '家庭系统',
  '家',
  '家庭是个体情感结构、关系模式与安全感的最初系统。',
  '家庭系统，是由亲密关系、代际模式、情绪规则与责任结构共同组成的生命根系。',
  '家庭不是单个成员的相加，而是一套互动系统。',
  '家庭系统塑造人的底层情绪、关系预期和安全感模型。',
  '["一个总是替别人负责的人，可能来自边界不清的家庭结构。"]'::jsonb,
  array['家庭', '安全感', '关系模式'],
  array['intergenerational-pattern', 'intimacy-order'],
  'published'
)
on conflict (slug) do nothing;

insert into public.video_topics (
  title,
  core_idea,
  related_nodes,
  status,
  platform,
  outline,
  script,
  publish_url,
  publish_date,
  review
) values
(
  '为什么人最重要的是成为自己？',
  '成为自己不是任性，而是把外部期待、真实愿望和长期责任重新对齐。',
  array['being-yourself', 'individual-system', 'inner-order'],
  'scripting',
  '抖音 / 视频号 / B站',
  '开场：很多人越努力越不像自己。展开：外部期待如何塑造人。结尾：三个问题回到自己。',
  '你以为你是在成长，其实你可能只是在变成一个更符合别人期待的人。',
  null,
  null,
  '适合作为账号主张视频，语气要克制。'
),
(
  '个人成长的底层逻辑',
  '个人成长不是靠一阵热情，而是靠输入、判断、行动和反馈组成的个人系统。',
  array['individual-system', 'inner-order', 'being-yourself'],
  'published',
  'B站 / 视频号',
  '输入、判断、行动、反馈四个环节构成个人成长系统。',
  '真正的成长不是每天告诉自己要努力，而是把努力放进一个能反馈、能修正、能沉淀的系统里。',
  'https://example.com/linfeng/video-005',
  '2026-05-20',
  '完播率较好，后续延展成三集系列。'
);

insert into public.topics (
  title,
  slug,
  description,
  related_nodes,
  related_videos,
  sort_order,
  status
) values
(
  '新手从这里开始',
  'start-here',
  '先建立五大系统的总体坐标，再进入核心概念与个人路径。',
  array['being-yourself', 'individual-system', 'country-order', 'family-system'],
  array['video-006', 'video-005'],
  1,
  'published'
),
(
  '成为自己',
  'being-yourself-path',
  '围绕 BEING YOURSELF 建立从自我识别到系统行动的成长路径。',
  array['being-yourself', 'inner-order', 'individual-system'],
  array['video-001', 'video-002', 'video-005'],
  4,
  'published'
)
on conflict (slug) do nothing;

insert into public.tags (name, type, description) values
('自我', 'node', '个体系统与自我认同相关标签'),
('成长', 'node', '个人成长与长期行动相关标签'),
('关系模式', 'node', '家庭与亲密关系中的互动结构'),
('组织', 'node', '组织系统与协作结构相关标签'),
('视频选题', 'video', '内容生产与视频数据库相关标签')
on conflict (name) do nothing;
