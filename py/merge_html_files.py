import os
import re
import argparse

def merge_body_contents(folder_path, output_file):
    """
    功能：快速将指定文件夹中的所有 HTML文件 的 <body>标签中的内容全部合并到一个文件中！
    用法：
    首次开发时间：2024-07-27 15:36:31
    最新更改时间：
    备注：
    """
    files = [f for f in os.listdir(folder_path) if f.endswith('.html')]
    files.sort()  # 对文件名进行排序

    with open(output_file, 'w', encoding='utf-8') as outfile:
        for file in files:
            file_path = os.path.join(folder_path, file)
            with open(file_path, 'r', encoding='utf-8') as infile:
                content = infile.read()
                # 使用正则表达式提取<body>标签中的内容
                body_content = re.findall(r'<body>(.*?)</body>', content, re.DOTALL)
                if body_content:
                    outfile.write(body_content[0] + '\n')


parser = argparse.ArgumentParser()
parser.add_argument("-f", "--folder_path", default='.', help="需要处理的文件夹路径")
parser.add_argument("-o", "--output_file", default='merge.html', help="默认生成的合并文件路径")
args = parser.parse_args()
folder_path = args.folder_path
output_file = args.output_file

merge_body_contents(folder_path, output_file)