#!/usr/bin/env python3
import os
import re
import glob
import yaml

def parse_markdown(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    frontmatter_match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
    frontmatter = {}
    body = content
    
    if frontmatter_match:
        frontmatter_text = frontmatter_match.group(1)
        body = content[frontmatter_match.end():]
        try:
            frontmatter = yaml.safe_load(frontmatter_text)
        except:
            pass
    
    return frontmatter, body

def extract_tags(tag_str):
    tags = []
    if isinstance(tag_str, list):
        for tag in tag_str:
            if tag.startswith('#林峰系统论/'):
                parts = tag[len('#林峰系统论/'):].split('/')
                tags.extend(parts)
            else:
                tags.append(tag.lstrip('#'))
    elif isinstance(tag_str, str):
        tags.append(tag_str.lstrip('#'))
    return list(set(tags))

def extract_content(body, section_name):
    pattern = rf'# {section_name}\n([\s\S]*?)(?=\n# |$)'
    match = re.search(pattern, body)
    if match:
        return match.group(1).strip()
    return ''

def extract_core_ideas(body):
    core_idea = extract_content(body, '核心观点')
    if core_idea:
        return core_idea
    
    pattern = r'## 核心理念[\s\S]*?### 核心概念\n([\s\S]*?)(?=\n### |\n## |$)'
    match = re.search(pattern, body)
    if match:
        return match.group(1).strip()
    
    return ''

def extract_system_explanation(body):
    explanation = extract_content(body, '系统解释')
    if explanation:
        return explanation
    
    pattern = r'### 模块使命\n([\s\S]*?)(?=\n### |\n## |$)'
    match = re.search(pattern, body)
    if match:
        return match.group(1).strip()
    
    pattern = r'### 核心内涵\n([\s\S]*?)(?=\n### |\n## |$)'
    match = re.search(pattern, body)
    if match:
        return match.group(1).strip()
    
    return ''

def extract_cases(body):
    cases = extract_content(body, '现实案例')
    if cases and cases != '待补充：结合现实国家运行、公共治理、产业变化或个人观察案例补充。':
        return cases
    return ''

def extract_video_angles(body):
    video = extract_content(body, '视频化表达')
    if video:
        return video
    
    pattern = r'### 核心问题清单\n([\s\S]*?)(?=\n### |\n## |$)'
    match = re.search(pattern, body)
    if match:
        return match.group(1).strip()
    
    return ''

def extract_reading_path(body):
    reading = extract_content(body, '延伸阅读')
    if reading:
        return reading
    
    pattern = r'### 延伸研究方向\n([\s\S]*?)(?=\n### |\n## |$)'
    match = re.search(pattern, body)
    if match:
        return match.group(1).strip()
    
    return ''

def generate_slug(title):
    """生成英文slug"""
    # 去掉编号前缀
    title_clean = re.sub(r'^\d{2}(-\d{2})*[-–—]\s*', '', title)
    # 简单的中文转英文映射
    char_map = {
        '核心': 'core', '目标': 'goal', '设定': 'setting', '战略': 'strategy',
        '逻辑': 'logic', '拆解': 'analysis', '系统': 'system', '边界': 'boundary',
        '定义': 'definition', '决策': 'decision', '记录': 'record', '资源': 'resource',
        '匹配': 'matching', '项目': 'project', '落地': 'implementation', '管控': 'control',
        '业务': 'business', '运营': 'operation', '推进': 'promotion', '执行': 'execution',
        '动作': 'action', '拆解': 'breakdown', '卡点': 'bottleneck', '验收': 'acceptance',
        '数据': 'data', '统计': 'statistics', '用户': 'user', '市场': 'market',
        '反馈': 'feedback', '分析': 'analysis', '报告': 'report', '优化': 'optimization',
        '方案': 'plan', '验证': 'validation', '团队': 'team', '能力': 'capability',
        '提升': 'improvement', '外部': 'external', '链接': 'connection', '行业': 'industry',
        '认知': 'cognition', '沉淀': 'accumulation', '商务': 'business', '合作': 'cooperation',
        '维护': 'maintenance', '风险': 'risk', '防控': 'prevention', '管理': 'management',
        '内容': 'content', '输出': 'output', '成果': 'achievement', '沉淀': 'accumulation',
        '复盘': 'review', '迭代': 'iteration', '经验': 'experience', '复用': 'reuse',
        '推广': 'promotion', '日程': 'schedule', '待办': 'todo', '会议': 'meeting',
        '协同': 'collaboration', '节点': 'milestone', '时间': 'time', '分配': 'allocation',
        '跨部门': 'cross-department', '归档': 'archive', '历史': 'history', '年度': 'annual',
        '过期': 'expired', '检索': 'search', '总览': 'overview', '宏观': 'macro',
        '经济': 'economy', '产业': 'industry', '结构': 'structure', '个人': 'personal',
        '财富': 'wealth', '国家': 'national', '制度': 'system', '政策': 'policy',
        '法规': 'regulation', '公民': 'citizen', '参与': 'participation', '政治': 'politics',
        '国防': 'national-defense', '战略': 'strategy', '军工': 'military-industry',
        '意识': 'awareness', '军事': 'military', '顶层': 'top-level', '制定': 'formulation',
        '全局': 'global', '把控': 'control', '官': 'official', '政策': 'policy',
        '流程': 'process', '组织': 'organization', '协调': 'coordination', '吏': 'bureaucracy',
        '社会': 'society', '基础': 'foundation', '需求': 'demand', '表达': 'expression',
        '文化': 'culture', '传承': 'inheritance', '民': 'people', '事': 'affairs',
        '资源': 'resource', '禀赋': 'endowment', '生态': 'ecology', '环境': 'environment',
        '可持续': 'sustainable', '发展': 'development', '自然': 'nature', '历史': 'history',
        '价值': 'value', '观念': 'concept', '规范': 'norm', '人文': 'humanities',
        '技术': 'technology', '创新': 'innovation', '驱动': 'driving', '数字': 'digital',
        '能力': 'capability', '科学': 'science', '物': 'material', '数据': 'data',
        '预测': 'prediction', '分析': 'analysis', '收集': 'collection', '高层': 'top',
        '中层': 'middle', '底层': 'bottom', '规划': 'planning', '人力': 'human-resource',
        '财力': 'financial', '物力': 'material-resource', '调度': 'dispatch', '士': 'scholar',
        '统筹': 'coordination', '节点': 'node', '区域': 'region', '人员': 'personnel',
        '管理': 'management', '时间': 'time', '地点': 'location', '事情': 'matter',
        '指导': 'guidance', '复盘': 'review', '总结': 'summary', '认清': 'recognition',
        '认知': 'cognition', '认识': 'understanding', '实践': 'practice', '掌握': 'mastery',
        '入门': 'introduction', '基础': 'foundation', '学习': 'learning', '工农': 'workers-peasants',
        '己': 'self', '父': 'father', '母': 'mother', '血缘': 'blood-relation', '亲': 'close',
        '近': 'near', '疏远': 'distant', '姓缘': 'surname-relation', '爱人': 'lover',
        '恋人': 'beloved', '情人': 'mistress', '亲缘': 'kinship', '缘': 'fate',
        '亲情': 'family-affection', '爱情': 'love', '友情': 'friendship', '生活': 'life',
        '世界观': 'worldview', '人生观': 'outlook-on-life', '价值观': 'values',
        '生命': 'life', '评估': 'evaluation', '核算': 'accounting', '利差': 'spread',
        '生存': 'survival', '生': 'life', '道德': 'morality', '规则': 'rules',
        '秩序': 'order', '心欲': 'desire', '灵魂': 'soul', '空间': 'space',
        '时间': 'time', '内欲': 'inner-desire', '精神': 'spirit', '肉体': 'body',
        '物质': 'material', '外欲': 'outer-desire', '欲': 'desire', '思维': 'thinking',
        '模式': 'pattern', '学习': 'learning', '记忆': 'memory', '方法': 'method',
        '问题': 'problem', '解决': 'solving', '创新': 'innovation', '情感': 'emotion',
        '情绪': 'emotion', '管理': 'management', '表达': 'expression', '压力': 'stress',
        '应对': 'coping', '健康': 'health', '幸福': 'happiness', '行为': 'behavior',
        '习惯': 'habit', '养成': 'formation', '决策': 'decision', '制定': 'making',
        '执行': 'execution', '力': 'power', '时间': 'time', '矫正': 'correction',
        '关系': 'relationship', '人际': 'interpersonal', '家庭': 'family', '职场': 'workplace',
        '社交': 'social', '沟通': 'communication', '技巧': 'skills', '成长': 'growth',
        '发展': 'development', '职业': 'career', '规划': 'planning', '技能': 'skill',
        '提升': 'enhancement', '突破': 'breakthrough', '终身': 'lifelong', '价值': 'value',
        '人生': 'life', '意义': 'meaning', '目标': 'goal', '信念': 'belief', '体系': 'system',
        '道德': 'morality', '伦理': 'ethics', '潜能': 'potential', '天赋': 'talent',
        '发现': 'discovery', '能力': 'ability', '开发': 'development', '创造': 'creativity',
        '领导': 'leadership', '自我': 'self', '实现': 'actualization'
    }
    
    # 尝试用映射生成slug
    slug_parts = []
    for char in title_clean:
        if char in char_map:
            slug_parts.append(char_map[char])
        elif char == ' ':
            slug_parts.append('-')
    
    # 如果生成的slug为空，使用code作为fallback
    if slug_parts:
        return '-'.join(slug_parts).lower()
    else:
        return title_clean.lower().replace(' ', '-').replace('_', '-')

def clean_file(src_path, dest_base):
    frontmatter, body = parse_markdown(src_path)
    
    filename = os.path.basename(src_path)
    # 提取标题（去掉编号和-总览.md）
    title = re.sub(r'^\d{2}(-\d{2})*[-–—]\s*', '', filename.replace('-总览.md', '').replace('.md', ''))
    
    module_dir = os.path.basename(os.path.dirname(src_path))
    module_map = {
        '01-国模块': ('国', 'country', 'G'),
        '02-族模块': ('族', 'ethnos', 'Z'),
        '03-家模块': ('家', 'family', 'J'),
        '04-企模块': ('企', 'enterprise', 'Q'),
        '05-人模块': ('人', 'human', 'R'),
    }
    
    module_name, module_key, prefix = module_map.get(module_dir, ('人', 'human', 'R'))
    
    code_match = re.match(r'^(\d{2}(-\d{2})*)', filename)
    code = code_match.group(1) if code_match else ''
    
    node_id = f"{prefix}-{code}" if code else f"{prefix}-001"
    slug = generate_slug(title)
    
    # 处理tags
    tags = frontmatter.get('tags', [])
    tags = extract_tags(tags)
    if module_name + '模块' not in tags:
        tags.append(module_name + '模块')
    
    # 处理summary和definition
    summary = frontmatter.get('summary', '')
    definition = frontmatter.get('definition', '')
    
    if not summary:
        summary = extract_content(body, '核心观点')[:100] or extract_system_explanation(body)[:100]
    if not definition:
        definition = extract_system_explanation(body)[:150] or summary
    
    # 提取各章节内容
    core_idea = extract_core_ideas(body) or summary
    explanation = extract_system_explanation(body) or definition
    cases = extract_cases(body)
    video_angles = extract_video_angles(body)
    reading_path = extract_reading_path(body)
    
    # 构建输出内容（正确的格式）
    output = f"""---
id: {node_id}
slug: {slug}
title: {title}
module: {module_name}
code: {code}
tags:
{chr(10).join(f'  - {tag}' for tag in tags)}
summary: {summary}
definition: {definition}
status: published
---

# 核心观点

{core_idea}

# 系统解释

{explanation}

# 现实案例

{cases if cases else '待补充'}

# 视频化表达

{video_angles if video_angles else '待补充'}

# 延伸阅读

{reading_path if reading_path else '待补充'}
"""
    
    dest_dir = os.path.join(dest_base, module_dir)
    # 去掉文件名中的"-总览"字样
    dest_filename = re.sub(r'-总览\.md$', '.md', filename)
    dest_path = os.path.join(dest_dir, dest_filename)
    
    os.makedirs(dest_dir, exist_ok=True)
    
    with open(dest_path, 'w', encoding='utf-8') as f:
        f.write(output)
    
    print(f"Processed: {src_path} -> {dest_path}")
    return dest_path

def main():
    source_base = '/Users/jx-charles/Documents/个人知识库/linfeng-system/content/nodes/框架20260528'
    dest_base = '/Users/jx-charles/Documents/个人知识库/linfeng-system/content/nodes/20260528清洗'
    
    os.makedirs(dest_base, exist_ok=True)
    
    modules = ['01-国模块', '02-族模块', '03-家模块', '04-企模块', '05-人模块']
    
    for module in modules:
        module_dir = os.path.join(source_base, module)
        if not os.path.isdir(module_dir):
            continue
        
        os.makedirs(os.path.join(dest_base, module), exist_ok=True)
        
        md_files = glob.glob(os.path.join(module_dir, '*.md'))
        
        for md_file in md_files:
            filename = os.path.basename(md_file)
            if filename in ['index.md', 'README.md']:
                continue
            
            try:
                clean_file(md_file, dest_base)
            except Exception as e:
                print(f"Error processing {md_file}: {e}")
    
    print("Cleaning complete!")

if __name__ == '__main__':
    main()
