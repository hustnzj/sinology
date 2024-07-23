import pyperclip
from tools.my_pinyin import pinyin_hyphen


def auto_toc(text, base_url):
  """
  功能： 快速生成 toc 页面的 chapters 数组
  用法：
  首次开发时间：2024-07-23 19:35:44
  最新更改时间：
  备注：
  """
  base_url = base_url.replace('_contents', '/contents').replace('/toc.md', '')
  yaml_output = ''
  for line in text.strip().split('\n'):
    title = line.strip()
    title_pinyin = pinyin_hyphen(title)
    url = f"{base_url}/{title_pinyin}/toc.html"
    yaml_output += f"  - title: {title}\n    url: {url}\n"

  pyperclip.copy(yaml_output)
  print("转换后的文本已复制到剪贴板。")


data = """
1. 陈胜项籍传
2. 张耳陈馀传
3. 魏豹田儋韩王信传
4. 韩彭英卢吴传
5. 荆燕吴传
6. 楚元王传
7. 季布栾布田叔传
8. 高五王传
9. 萧何曹参传
10. 张陈王周传
11. 樊郦滕灌傅靳周传
12. 张周赵任申屠传
13. 郦陆朱刘叔孙传
14. 淮南衡山济北王传
15. 蒯伍江息夫传
16. 万石卫直周张传
17. 文三王传
18. 贾谊传
19. 爰盎晁错传
20. 张冯汲郑传
21. 贾邹枚路传
22. 窦田灌韩传
23. 景十三王传
24. 李广苏建传
25. 卫青霍去病传
26. 董仲舒传
27. 司马相如传
28. 公孙弘卜式儿宽传
29. 张汤传
30. 杜周传
31. 张骞李广利传
32. 司马迁传
33. 武五子传
34. 严朱吾丘主父徐严终王贾传
35. 东方朔传
36. 公孙刘田王杨蔡陈郑传
37. 杨胡朱梅云传
38. 霍光金日磾传
39. 赵充国辛庆忌传
40. 傅常郑甘陈段传
41. 隽疏于薛平彭传
42. 王贡两龚鲍传
43. 韦贤传
44. 魏相丙吉传
45. 眭两夏侯京翼李传
46. 赵尹韩张两王传
47. 盖诸葛刘郑孙毌将何传
48. 萧望之传
49. 冯奉世传
50. 宣元六王传
51. 匡张孔马传
52. 王商史丹傅喜传
53. 薛宣朱博传
54. 翟方进传
55. 谷永杜邺传
56. 何武王嘉师丹传
57. 儒林传
58. 扬雄传
59. 循吏传
60. 酷吏传
61. 货殖传
62. 游侠传
63. 佞幸传
64. 匈奴传
65. 西南夷两粤朝鲜传
66. 西域传
67. 外戚传
68. 元后传
69. 王莽传
70. 叙传
"""

base_url = "_contents/sinology/twenty-four-histories/han-shu/zhuan/toc.md"

auto_toc(data, base_url)