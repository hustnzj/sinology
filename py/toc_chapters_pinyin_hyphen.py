from tools.my_pinyin import pinyin_hyphen
from common import remove_last_line_and_append

import os


def auto_toc(*texts, base_url=None):
    """
    功能：自动生成 toc 文件中的 chapters 数组，并写入 base_url 中的 toc 文件中，并自动在 base_url 下创建对应的文件. 为在本地项目文件夹中正确找到或创建这些文件，base_url第一个`/`需要替换为 `_`
    用法：python py/toc_chapters_pinyin_hyphen.py --array "归园田居(其一) 陶渊明[东晋]" "登池上楼 谢灵运[南朝]" "山居秋瞑 王维[唐]" "过故人庄 孟浩然[唐]" --base_url /contents/sinology/si-ci-ge-fu/poetry
    首次开发时间：2024-07-25 17:42:18
    最新更改时间：2024-07-29 10:34:21
    备注：
    """
    titles, pageNames = pinyin_hyphen(*texts)
    toc_chapters_text = ''
    for title, pageName in zip(titles, pageNames):
        url = os.path.join(base_url, f"{pageName}.html")
        toc_chapters_text += f"  - title: {title}\n    url: {url}\n"
        md_file_url = url.replace('/', '_', 1).replace('html','md')
        if not os.path.exists(md_file_url):
            with open(md_file_url, 'w') as file:
                file.write(f"""
---
title: {title}
---
""".strip())
        else:
            print(f"{md_file_url} 文件已存在！")

    toc_path = os.path.join(base_url.replace('/', '_', 1), 'toc.md')
    remove_last_line_and_append(toc_path, toc_chapters_text)

array_values = [
  "前言",
  "原序",
  "卷1. 五言古诗",
  "卷2. 七言古诗",
  "卷3. 七言古诗",
  "卷4. 七言乐府",
  "卷5. 五言律诗",
  "卷6. 七言律诗",
  "卷7. 五言绝句",
  "卷8. 七言绝句",
  "附录"
]
base_url = "/contents/sinology/si-ci-ge-fu/research-monograph/newNotesOnThreeHundredTangPoems"

auto_toc(*array_values, base_url=base_url)
