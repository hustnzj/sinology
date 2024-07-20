from tools.my_pinyin import pinyin_hyphen

def toc_book_chapters_yaml(book_name, chapters_data):
    """
    功能：批量生成_tocs 文件夹中 md 文件的 front matters 中的 chapters 数组。只针对具体的某一本书而言，有现成目录且每一章都有固定编号的。对于没有编号的，随看随入的比如诗词歌赋，则使用 `py/toc_chapters_pinyin_hyphen_for_poetry.py`中的 toc_poetry_chapters_yaml(folder_path).
    用法：
    首次开发时间：2024-07-20 11:13:31
    最新更改时间：
    备注：
    """
    book_name = pinyin_hyphen(book_name)
    # Split the data into lines
    lines = chapters_data.strip().split('\n')

    # Create a list of chapter dictionaries
    chapters = []
    for line in lines:
        # Extract chapter number and title
        number, title = line.split(' ', 1)
        # line = pinyin_hyphen(line)
        chapter_url = f"/chapters/{book_name}/{number}{pinyin_hyphen(title)}.html"
        chapters.append({'title': title, 'url': chapter_url})

    # Format as YAML
    yaml_output = "chapters:\n"
    for chapter in chapters:
        yaml_output += f"  - title: {chapter['title']}\n    url: {chapter['url']}\n"

    print(yaml_output)

# 用法
chapters_data = """
1. 德行
2. 言语
3. 政事
4. 文学
5. 方正
6. 雅量
7. 识鉴
8. 赏誉
9. 品藻
10. 规箴
11. 捷悟
12. 夙惠
13. 豪爽
14. 容止
15. 自新
16. 企羡
17. 伤逝
18. 栖逸
19. 贤媛
20. 术解
21. 巧蓺
22. 宠礼
23. 任诞
24. 简傲
25. 排调
26. 轻诋
27. 假谲
28. 黜免
29. 俭啬
30. 汰侈
31. 忿狷
32. 谗险
33. 尤悔
34. 纰漏
35. 惑溺
36. 仇隙
"""
book_name = "世说新语"
toc_book_chapters_yaml(book_name, chapters_data)