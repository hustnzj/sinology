import os
import yaml
from common import remove_last_line_and_append
import sys

def create_structure(data, base_path='_contents'):
    if not os.path.exists(base_path):
        os.makedirs(base_path)

    for item in data:
        url = item.get('url', '')
        if '/contents/' in url:
            parts = url.split('/')[2:-1]  # Extract path components
            dir_path = os.path.join(base_path, *parts)
            os.makedirs(dir_path, exist_ok=True)

            toc_path = os.path.join(dir_path, 'toc.md')
            appended_text = f"  - title: {item['title']}\n    url:  {url}"
            
            # Check if toc_path exists and contains appended_text
            update_parent_toc = False
            if not os.path.exists(toc_path):
                update_parent_toc = True
                with open(toc_path, 'w', encoding='utf-8') as toc_file:
                    toc_content = f"""---
layout: toc
title: 《{item['title']}》目录
toc-style: blocks
chapters:
"""
                    if 'submenu' in item:
                        for sub_item in item['submenu']:
                            toc_content += f"  - title: {sub_item['title']}\n"
                            toc_content += f"    url:  {sub_item['url']}\n"
                    toc_content += "---"
                    toc_file.write(toc_content)
            else:
                parent_dir_path = os.path.dirname(dir_path)
                parent_toc_path = os.path.join(parent_dir_path, 'toc.md')
                if os.path.exists(parent_toc_path):
                    with open(parent_toc_path, 'r', encoding='utf-8') as toc_file:
                        if appended_text not in toc_file.read():
                            update_parent_toc = True
            
            # Update parent toc.md if necessary
            if update_parent_toc:
                remove_last_line_and_append(parent_toc_path, appended_text)

        if 'submenu' in item:
            create_structure(item['submenu'], base_path)


with open('_data/navigation.yaml', 'r', encoding='utf-8') as file:
    nav_data = yaml.safe_load(file)

create_structure(nav_data)
print('_contents 目录已更新！')
