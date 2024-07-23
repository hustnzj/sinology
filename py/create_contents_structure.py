import os
import yaml

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
            if not os.path.exists(toc_path):
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
        
        if 'submenu' in item:
            create_structure(item['submenu'], base_path)



with open('_data/navigation.yaml', 'r', encoding='utf-8') as file:
    nav_data = yaml.safe_load(file)

create_structure(nav_data)
print('_contents 目录已更新！')
