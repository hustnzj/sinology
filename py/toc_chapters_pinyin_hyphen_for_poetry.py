import os
import sys
from tools.my_pinyin import pinyin_hyphen
from pathlib import Path
from jinja2 import Template, Environment, FileSystemLoader
import yaml

# Jinja2 模板
yaml_template = """---
layout: toc
breadcrumbs:
  - name: 诗词歌赋
    url: \#
  - name: 诗
    url: /tocs/poetry.html
title: 诗目录
chapters:
{% for chapter in chapters %}
  - title: {{ chapter.title }}
    url: {{ chapter.url }}
{% endfor %}
---
"""

def load_existing_chapters(toc_file_path):
    """
    功能：处理 YAML 文件的读取
    用法：
    首次开发时间：2024-07-20 19:47:00
    最新更改时间：
    备注：
    """
    with open(toc_file_path, 'r', encoding='utf-8') as toc_file:
        content = toc_file.read()
        # print("File Content:\n", content)
        # 去除文件中的结束分隔符以便解析
        content_without_end = content.rstrip().rstrip('---')
        try:
            toc_data = yaml.safe_load(content_without_end)
            # print("Parsed Data:\n", toc_data)
        except yaml.YAMLError as e:
            print("Error parsing YAML:", e)
            sys.exit()
        return toc_data.get('chapters', []), toc_data

def save_chapters(toc_file_path, chapters, existing_data):
    """
    功能：处理 YAML 文件的写入, 将新的章节数据保存回 toc_file_path。
    用法：
    首次开发时间：2024-07-20 18:42:22
    最新更改时间：
    备注：
    """
    # 更新现有数据的 chapters 部分
    existing_data['chapters'] = chapters

    # 使用 Jinja2 模板生成 YAML 内容
    # template = Template(yaml_template)
    # yaml_content = template.render(chapters=chapters)

    # 创建 Jinja2 环境
    env = Environment(
        loader=FileSystemLoader('.'),
        trim_blocks=True,      # 去除块的前后的空行
        lstrip_blocks=True     # 去除行首的空白
    )

    # 载入模板
    template = env.from_string(yaml_template)
    yaml_content = template.render(chapters=chapters)

    # 写回完整的 YAML 文件
    with open(toc_file_path, 'w', encoding='utf-8') as toc_file:
        toc_file.write(yaml_content)
        print(f'\n{toc_file_path} 已经被自动更新!\n')

def toc_poetry_chapters_yaml(toc_file_path, folder_path="."):
    files = [f for f in os.listdir(folder_path) if f.endswith('.md')]
    existing_chapters, existing_data = load_existing_chapters(toc_file_path)

    existing_titles = {chapter['title'] for chapter in existing_chapters}

    poems = []
    for file in files:
        try:
            # Assuming filename format: 《title》——author（dynasty）
            cn_name = file.replace(' ', '%20').replace('md', '').replace('.', '').strip()
            cn_title = file.split('《')[1].split('》')[0].strip()
            cn_author_name = file.split('——')[1].split('（')[0].strip()
            cn_author_era = file.split('（')[1].split('）')[0].strip()
        except IndexError:
            continue
        
        # 重复检查：在处理每个文件时，检查是否已经存在于 toc_file_path 中的章节标题。
        if any(cn_title in title for title in existing_titles):
            print(f"当前 `{folder_path}` 中的 `{file}` 已经在 `{toc_file_path}` 中了，请核对")
            sys.exit()

        en_title = pinyin_hyphen(cn_title)
        en_author_name = pinyin_hyphen(cn_author_name)
        en_author_era = pinyin_hyphen(cn_author_era)

        poems.append((cn_name, en_title, en_author_name, en_author_era, file))

    # 合并和排序：将新文件和现有章节合并后排序。
    # Add existing chapters to poems 
    for chapter in existing_chapters:
        url = chapter['url']
        cn_name = chapter['title'].replace(' ', '%20')
        en_title = url.split('/')[3].split('——')[0]
        en_author_name = url.split('——')[1].split('(')[0]
        en_author_era = url.split('(')[1].split(')')[0]
        poems.append((cn_name, en_title, en_author_name, en_author_era, None))

    # Sort by author, then by title
    poems.sort(key=lambda x: (x[2], x[1]))

    # Generate the output structure
    result = {'chapters': []}
    for cn_name, en_title, en_author_name, en_author_era, file in poems:
        result['chapters'].append({
            'title': f"{cn_name}",
            'url': f"/chapters/poetry/{en_title}——{en_author_name}({en_author_era}).html"
        })
        if file:
            os.rename(os.path.join(folder_path, file), os.path.join(
                folder_path, f"{en_title}——{en_author_name}({en_author_era}).md"))
            print(f"\n已增加 `{cn_name}`")

    save_chapters(toc_file_path, result['chapters'], existing_data)

if __name__ == "__main__":
    poetry_toc_path = Path(__file__).resolve().parent.parent / '_tocs' / 'poetry.md'
    poetry_directory_path = Path(__file__).resolve().parent.parent / '_chapters' / 'poetry'
    toc_poetry_chapters_yaml(poetry_toc_path, poetry_directory_path)
