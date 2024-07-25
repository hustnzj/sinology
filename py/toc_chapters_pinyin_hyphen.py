from tools.my_pinyin import pinyin_hyphen

import argparse
import os


def auto_toc(*texts, base_url=None):
    """
    功能：自动生成 toc 文件中的 chapters 数组，并写入 base_url 中的 toc 文件中，并自动在 base_url 下创建对应的文件. 为在本地项目文件夹中正确找到或创建这些文件，base_url第一个`/`需要替换为 `_`
    用法：python py/toc_chapters_pinyin_hyphen.py --array "赵钱孙李，周吴郑王。冯陈褚卫，蒋沈韩杨。" "朱秦尤许，何吕施张。孔曹严华，金魏陶姜。" "戚谢邹喻，柏水窦章。云苏潘葛，奚范彭郎。" "鲁韦昌马，苗凤花方。俞任袁柳，酆鲍史唐。" "费廉岑薛，雷贺倪汤。滕殷罗毕，郝邬安常。" "乐于时傅，皮卞齐康。伍余元卜，顾孟平黄。" "和穆萧尹，姚邵湛汪。祁毛禹狄，米贝明臧。" "计伏成戴，谈宋茅庞。熊纪舒屈，项祝董梁。" "杜阮蓝闵，席季麻强。贾路娄危，江童颜郭。" "梅盛林刁，钟徐邱骆。高夏蔡田，樊胡凌霍。" "虞万支柯，昝管卢莫。经房裘缪，干解应宗。" "丁宣贲邓，郁单杭洪。包诸左石，崔吉钮龚。" "程嵇邢滑，裴陆荣翁。荀羊於惠，甄麴家封。" "芮羿储靳，汲邴糜松。井段富巫，乌焦巴弓。" "牧隗山谷，车侯宓 蓬。全郗班仰，秋仲伊宫。" "宁仇栾暴，甘钭厉戎。祖武符刘，景詹束龙。" "叶幸司韶，郜黎蓟薄。印宿白怀，蒲邰从鄂。" "索咸籍赖，卓蔺屠蒙。池乔阴郁，胥能苍双。" "闻莘党翟，谭贡劳逄。姬申扶堵，冉宰郦雍。" "郤璩桑桂，濮牛寿通。边扈燕冀，郏浦 尚农。" "温别庄晏，柴瞿阎充。慕连茹习，宦艾鱼容。" "向古易慎，戈廖庾终。暨居衡步，都耿满弘。" "匡国文寇，广禄阙东。欧殳沃利，蔚越夔隆。" "师巩厍聂，晁勾敖融。冷訾辛阚，那简饶空。" "曾毋沙乜，养鞠须丰。巢关蒯相，查後荆红。" "游竺权逯，盖益桓公。万俟司马，上官欧阳。" "夏侯诸葛，闻人东方。赫连皇甫，尉迟公羊。" "澹台公冶，宗政濮阳。淳于单于，太叔申屠。" "公孙仲孙，轩辕令狐。钟离宇文，长孙慕容。" "鲜于闾丘，司徒司空。亓官司寇，仉督子车。" "颛孙端木，巫马公西。漆雕乐正 ，壤驷公良。" "拓跋夹谷，宰父穀梁。晋楚闫法，汝鄢涂钦。" "段干百里，东郭南门。呼延归海，羊舌微生。" "岳帅缑亢，況后有琴。梁丘左丘，东门西门。" "商牟佘佴，伯赏南宫。墨哈谯笪，年爱阳佟。" "第五言福，百家姓终。" --base_url /contents/sinology/guo-xue-qi-meng/bai-jia-xing
    首次开发时间：2024-07-25 17:42:18
    最新更改时间：
    备注：
    """
    titles, pageNames = pinyin_hyphen(*texts)
    toc_chapters_text = ''
    for title, pageName in zip(titles, pageNames):
        url = os.path.join(base_url, f"{pageName}.html")
        toc_chapters_text += f"  - title: {title}\n    url: {url}\n"
        md_file_url = url.replace('/', '_', 1).replace('html','md')
        with open(md_file_url, 'w') as file:
            file.write(f"""
---
title: {title}
---
""".strip())

    toc_path = os.path.join(base_url.replace('/', '_', 1), 'toc.md')
    remove_last_line_and_append(toc_path, toc_chapters_text)

def remove_last_line_and_append(toc_path, toc_chapters_text):
    """
    功能：在追加内容之前删除文件的最后一行
    用法：
    首次开发时间：2024-07-25 19:40:45
    最新更改时间：
    备注：
    """
    # 读取文件内容
    with open(toc_path, 'r') as file:
        lines = file.readlines()

    # 如果文件有内容，删除最后一行
    if lines:
        lines.pop()

    # 以写入模式打开文件，清空原有内容并写入修改后的内容
    with open(toc_path, 'w') as file:
        file.writelines(lines)

    # 以追加模式打开文件，写入新的内容
    with open(toc_path, 'a') as file:
        file.write(toc_chapters_text + '\n---')

parser = argparse.ArgumentParser()
parser.add_argument("--array", nargs='+', help="输入字符串列表")
parser.add_argument("--base_url", help="输入基础 URL")
args = parser.parse_args()
array_values = args.array
base_url = args.base_url

auto_toc(*array_values, base_url=base_url)
