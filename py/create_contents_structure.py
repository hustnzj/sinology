import os
import yaml
from common import remove_last_line_and_append

def create_structure(data, base_path='_contents'):
    """
    功能： 根据 `_data/navigation.yaml`的数据 来创建目录并修改有关的 toc 文件。
    用法：
    首次开发时间：2024-07-23 12:23:00
    最新更改时间：2024-08-04 14:35:14
    备注：
    """
    if not os.path.exists(base_path):
        os.makedirs(base_path)

    for item in data:
        url = item.get('url', '')
        if '/contents/' in url:
            parts = url.split('/')[2:-1]  # Extract path components
            dir_path = os.path.join(base_path, *parts)
            os.makedirs(dir_path, exist_ok=True)

            # 检查 toc 文件是否存在
            toc_path = os.path.join(dir_path, 'toc.md')
            if not os.path.exists(toc_path): # 如果当前toc文件不存在，则是首次创建，就直接写入当前 toc 文件。
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
            
            # 检查父级的 toc 文件是否存在，如果存在，再判断当前 toc 文件的信息是否在该文件中，如果不在才添加（父级 toc 文件中过时的信息暂时手动删除，以后确认没有其他问题再自动化）
            update_parent_toc = False
            parent_dir_path = os.path.dirname(dir_path)
            parent_toc_path = os.path.join(parent_dir_path, 'toc.md')
            appended_text = f"  - title: {item['title']}\n    url:  {url}"

            if os.path.exists(parent_toc_path):
                with open(parent_toc_path, 'r', encoding='utf-8') as parent_toc_file:
                    if appended_text not in parent_toc_file.read():
                        remove_last_line_and_append(parent_toc_path, appended_text)
            
        if 'submenu' in item:
            create_structure(item['submenu'], base_path)


with open('_data/navigation.yaml', 'r', encoding='utf-8') as file:
    nav_data = yaml.safe_load(file)

create_structure(nav_data)
print('_contents 目录已更新！')
