#!/usr/bin/env python3
import os
import re
import glob

def fix_file(file_path):
    """修复单个文件的 code 字段"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 提取 id 和 code
    id_match = re.search(r'id:\s*(.+?)\n', content)
    code_match = re.search(r'code:\s*(.+?)\n', content)
    
    if id_match and code_match:
        current_id = id_match.group(1).strip()
        current_code = code_match.group(1).strip()
        
        if current_code != current_id:
            # 替换 code 字段
            new_content = re.sub(r'code:\s*.+?\n', f'code: {current_id}\n', content, count=1)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Fixed: {file_path} - "{current_code}" -> "{current_id}"')
            return True
        else:
            print(f'Already correct: {file_path}')
            return False
    else:
        print(f'Could not find id or code in: {file_path}')
        return False

def main():
    base_path = '/Users/jx-charles/Documents/个人知识库/linfeng-system/content/nodes/20260528清洗'
    modules = ['01-国模块', '02-族模块', '03-家模块', '04-企模块', '05-人模块']
    
    fixed_count = 0
    total_count = 0
    
    for module in modules:
        module_dir = os.path.join(base_path, module)
        if not os.path.isdir(module_dir):
            continue
        
        md_files = glob.glob(os.path.join(module_dir, '*.md'))
        for md_file in md_files:
            total_count += 1
            if fix_file(md_file):
                fixed_count += 1
    
    print(f'\nDone! Fixed {fixed_count}/{total_count} files.')

if __name__ == '__main__':
    main()
