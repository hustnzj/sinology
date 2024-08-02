import os
import yaml
from tools.my_pinyin import pinyin_hyphen
from common import remove_last_line_and_append


def auto_toc(toc_chapters_data_path):
    """
    功能：自动生成 toc 文件中的 chapters 数组，并写入 toc_dir_path 中的 toc 文件中，并自动在 toc_dir_path 下创建对应的文件.
    用法：python py/toc_chapters_pinyin_hyphen.py
    首次开发时间：2024-07-25 17:42:18
    最新更改时间：2024-08-01 21:27:47
    备注：
    """
    with open(toc_chapters_data_path, 'r', encoding='utf-8') as file:
        data = yaml.safe_load(file)

    titles = data['to_be_created_files']
    toc_dir_url = data['toc_file_path'].replace(
        '_', '/', 1).replace('toc.md', '')
    toc_dir_path = data['toc_file_path'].replace('toc.md', '')
    titles, pageNames = pinyin_hyphen(*titles)
    toc_chapters_text = ''
    for title, pageName in zip(titles, pageNames):
        url = os.path.join(toc_dir_url, f"{pageName}.html")
        toc_chapters_text += f"  - title: {title}\n    url: {url}\n"
        md_file_url = os.path.join(toc_dir_path, f"{pageName}.md")
        if not os.path.exists(md_file_url):
            with open(md_file_url, 'w') as file:
                file.write(f"""
---
title: {title}
---
""".strip())
        else:
            print(f"{md_file_url} 文件已存在！")

    # toc_path = os.path.join(toc_dir_path.replace('/', '_', 1), 'toc.md')
    remove_last_line_and_append(data['toc_file_path'], toc_chapters_text)


# 数据文件路径
toc_chapters_data_path = '_data/toc_chapters.yml'
auto_toc(toc_chapters_data_path)
