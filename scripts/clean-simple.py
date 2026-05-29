#!/usr/bin/env python3
import os
import re
import glob

def main():
    source_base = '/Users/jx-charles/Documents/个人知识库/linfeng-system/content/nodes/框架20260528'
    dest_base = '/Users/jx-charles/Documents/个人知识库/linfeng-system/content/nodes/20260528清洗'
    
    modules = ['01-国模块', '02-族模块', '03-家模块', '04-企模块', '05-人模块']
    module_map = {
        '01-国模块': ('国', 'country', 'G'),
        '02-族模块': ('族', 'ethnos', 'Z'),
        '03-家模块': ('家', 'family', 'J'),
        '04-企模块': ('企', 'enterprise', 'Q'),
        '05-人模块': ('人', 'human', 'R'),
    }
    
    for module in modules:
        module_dir = os.path.join(source_base, module)
        if not os.path.isdir(module_dir):
            continue
        
        dest_module_dir = os.path.join(dest_base, module)
        os.makedirs(dest_module_dir, exist_ok=True)
        
        md_files = glob.glob(os.path.join(module_dir, '*.md'))
        
        for md_file in md_files:
            filename = os.path.basename(md_file)
            if filename in ['index.md', 'README.md']:
                continue
            
            # 读取源文件内容
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 提取 frontmatter
            frontmatter_match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
            frontmatter_text = frontmatter_match.group(1) if frontmatter_match else ''
            body = content[frontmatter_match.end():] if frontmatter_match else content
            
            # 从文件名提取信息
            code_match = re.match(r'^(\d{2}(-\d{2})*)', filename)
            code = code_match.group(1) if code_match else ''
            
            # 提取标题（去掉编号和-总览.md）
            title = re.sub(r'^\d{2}(-\d{2})*[-–—]\s*', '', filename.replace('-总览.md', '').replace('.md', ''))
            
            module_name, module_key, prefix = module_map.get(module, ('人', 'human', 'R'))
            node_id = f"{prefix}-{code}" if code else f"{prefix}-001"
            
            # 生成英文slug
            slug_map = {
                '核心': 'core', '目标': 'goal', '设定': 'setting', '战略': 'strategy',
                '逻辑': 'logic', '拆解': 'analysis', '系统': 'system', '边界': 'boundary',
                '定义': 'definition', '决策': 'decision', '记录': 'record', '资源': 'resource',
                '匹配': 'matching', '项目': 'project', '落地': 'implementation', '管控': 'control',
                '业务': 'business', '运营': 'operation', '推进': 'promotion', '执行': 'execution',
                '动作': 'action', '卡点': 'bottleneck', '验收': 'acceptance',
                '数据': 'data', '统计': 'statistics', '用户': 'user', '市场': 'market',
                '反馈': 'feedback', '分析': 'analysis', '报告': 'report', '优化': 'optimization',
                '方案': 'plan', '验证': 'validation', '团队': 'team', '能力': 'capability',
                '提升': 'improvement', '外部': 'external', '链接': 'connection', '行业': 'industry',
                '认知': 'cognition', '沉淀': 'accumulation', '商务': 'business', '合作': 'cooperation',
                '维护': 'maintenance', '风险': 'risk', '防控': 'prevention', '管理': 'management',
                '内容': 'content', '输出': 'output', '成果': 'achievement', '复盘': 'review',
                '迭代': 'iteration', '经验': 'experience', '复用': 'reuse', '推广': 'promotion',
                '日程': 'schedule', '待办': 'todo', '会议': 'meeting', '协同': 'collaboration',
                '节点': 'milestone', '时间': 'time', '分配': 'allocation', '跨部门': 'cross-department',
                '归档': 'archive', '历史': 'history', '年度': 'annual', '过期': 'expired', '检索': 'search',
                '总览': 'overview', '宏观': 'macro', '经济': 'economy', '产业': 'industry',
                '结构': 'structure', '个人': 'personal', '财富': 'wealth', '国家': 'national',
                '制度': 'system', '政策': 'policy', '法规': 'regulation', '公民': 'citizen',
                '参与': 'participation', '政治': 'politics', '国防': 'national-defense',
                '军工': 'military-industry', '意识': 'awareness', '军事': 'military',
                '顶层': 'top-level', '制定': 'formulation', '全局': 'global', '把控': 'control',
                '官': 'official', '流程': 'process', '组织': 'organization', '协调': 'coordination',
                '吏': 'bureaucracy', '社会': 'society', '基础': 'foundation', '需求': 'demand',
                '表达': 'expression', '文化': 'culture', '传承': 'inheritance', '民': 'people',
                '事': 'affairs', '资源': 'resource', '禀赋': 'endowment', '生态': 'ecology',
                '环境': 'environment', '可持续': 'sustainable', '发展': 'development',
                '自然': 'nature', '历史': 'history', '价值': 'value', '观念': 'concept',
                '规范': 'norm', '人文': 'humanities', '技术': 'technology', '创新': 'innovation',
                '驱动': 'driving', '数字': 'digital', '能力': 'capability', '科学': 'science',
                '物': 'material', '预测': 'prediction', '收集': 'collection', '高层': 'top',
                '中层': 'middle', '底层': 'bottom', '规划': 'planning', '人力': 'human-resource',
                '财力': 'financial', '物力': 'material-resource', '调度': 'dispatch',
                '士': 'scholar', '统筹': 'coordination', '人员': 'personnel', '地点': 'location',
                '事情': 'matter', '指导': 'guidance', '总结': 'summary', '认清': 'recognition',
                '认知': 'cognition', '认识': 'understanding', '实践': 'practice', '掌握': 'mastery',
                '入门': 'introduction', '学习': 'learning', '工农': 'workers-peasants',
                '己': 'self', '父': 'father', '母': 'mother', '血缘': 'blood-relation', '亲': 'close',
                '近': 'near', '疏远': 'distant', '姓缘': 'surname-relation', '爱人': 'lover',
                '恋人': 'beloved', '情人': 'mistress', '亲缘': 'kinship', '缘': 'fate',
                '亲情': 'family-affection', '爱情': 'love', '友情': 'friendship', '生活': 'life',
                '世界观': 'worldview', '人生观': 'outlook-on-life', '价值观': 'values',
                '生命': 'life', '评估': 'evaluation', '核算': 'accounting', '利差': 'spread',
                '生存': 'survival', '生': 'life', '道德': 'morality', '规则': 'rules',
                '秩序': 'order', '心欲': 'desire', '灵魂': 'soul', '空间': 'space',
                '内欲': 'inner-desire', '精神': 'spirit', '肉体': 'body', '外欲': 'outer-desire',
                '欲': 'desire', '思维': 'thinking', '模式': 'pattern', '记忆': 'memory',
                '方法': 'method', '问题': 'problem', '解决': 'solving', '情感': 'emotion',
                '情绪': 'emotion', '压力': 'stress', '应对': 'coping', '健康': 'health',
                '幸福': 'happiness', '行为': 'behavior', '习惯': 'habit', '养成': 'formation',
                '决策': 'decision', '力': 'power', '矫正': 'correction', '关系': 'relationship',
                '人际': 'interpersonal', '家庭': 'family', '职场': 'workplace', '社交': 'social',
                '沟通': 'communication', '技巧': 'skills', '成长': 'growth', '职业': 'career',
                '技能': 'skill', '突破': 'breakthrough', '终身': 'lifelong', '人生': 'life',
                '意义': 'meaning', '信念': 'belief', '体系': 'system', '伦理': 'ethics',
                '潜能': 'potential', '天赋': 'talent', '发现': 'discovery', '创造': 'creativity',
                '领导': 'leadership', '自我': 'self', '实现': 'actualization', '能力': 'ability',
                '开发': 'development', '创新': 'innovation',
            }
            
            slug_parts = []
            for char in title:
                if char in slug_map:
                    slug_parts.append(slug_map[char])
            slug = '-'.join(slug_parts).lower() if slug_parts else code.lower().replace('-', '')
            
            # 提取 tags
            tags = []
            tag_match = re.search(r'tags:\s*(.+?)\n', frontmatter_text)
            if tag_match:
                tag_content = tag_match.group(1)
                if '[' in tag_content:
                    tag_list = re.findall(r'["\']([^"\']+)["\']', tag_content)
                    for tag in tag_list:
                        if tag.startswith('#林峰系统论/'):
                            parts = tag[len('#林峰系统论/'):].split('/')
                            tags.extend(parts)
                        else:
                            tags.append(tag.lstrip('#'))
                else:
                    tags.append(tag_content.strip().lstrip('#'))
            
            tags = list(set(tags))
            if module_name + '模块' not in tags:
                tags.append(module_name + '模块')
            
            # 提取 summary 和 definition
            summary = ''
            summary_match = re.search(r'summary:\s*(.+?)\n', frontmatter_text)
            if summary_match:
                summary = summary_match.group(1).strip()
            
            definition = ''
            def_match = re.search(r'definition:\s*(.+?)\n', frontmatter_text)
            if def_match:
                definition = def_match.group(1).strip()
            
            # 如果没有，从内容提取
            if not summary:
                summary = body[:100].strip().replace('\n', ' ')
            if not definition:
                definition = body[:150].strip().replace('\n', ' ')
            
            # 提取各章节内容
            core_idea = ''
            core_match = re.search(r'# 核心观点\n([\s\S]*?)(?=\n# |$)', body)
            if core_match:
                core_idea = core_match.group(1).strip()
            if not core_idea:
                core_match = re.search(r'### 核心概念\n([\s\S]*?)(?=\n### |\n## |$)', body)
                if core_match:
                    core_idea = core_match.group(1).strip()
            if not core_idea:
                core_idea = summary
            
            explanation = ''
            exp_match = re.search(r'# 系统解释\n([\s\S]*?)(?=\n# |$)', body)
            if exp_match:
                explanation = exp_match.group(1).strip()
            if not explanation:
                exp_match = re.search(r'### 模块使命\n([\s\S]*?)(?=\n### |\n## |$)', body)
                if exp_match:
                    explanation = exp_match.group(1).strip()
            if not explanation:
                exp_match = re.search(r'### 核心内涵\n([\s\S]*?)(?=\n### |\n## |$)', body)
                if exp_match:
                    explanation = exp_match.group(1).strip()
            if not explanation:
                explanation = definition
            
            cases = ''
            case_match = re.search(r'# 现实案例\n([\s\S]*?)(?=\n# |$)', body)
            if case_match:
                cases = case_match.group(1).strip()
            
            video = ''
            video_match = re.search(r'# 视频化表达\n([\s\S]*?)(?=\n# |$)', body)
            if video_match:
                video = video_match.group(1).strip()
            if not video:
                video_match = re.search(r'### 核心问题清单\n([\s\S]*?)(?=\n### |\n## |$)', body)
                if video_match:
                    video = video_match.group(1).strip()
            
            reading = ''
            read_match = re.search(r'# 延伸阅读\n([\s\S]*?)(?=\n# |$)', body)
            if read_match:
                reading = read_match.group(1).strip()
            if not reading:
                read_match = re.search(r'### 延伸研究方向\n([\s\S]*?)(?=\n### |\n## |$)', body)
                if read_match:
                    reading = read_match.group(1).strip()
            
            # 构建输出内容
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

{video if video else '待补充'}

# 延伸阅读

{reading if reading else '待补充'}
"""
            
            # 生成目标文件名（去掉-总览）
            dest_filename = filename.replace('-总览.md', '.md')
            dest_path = os.path.join(dest_module_dir, dest_filename)
            
            with open(dest_path, 'w', encoding='utf-8') as f:
                f.write(output)
            
            print(f"Processed: {md_file} -> {dest_path}")
    
    print("Cleaning complete!")

if __name__ == '__main__':
    main()
