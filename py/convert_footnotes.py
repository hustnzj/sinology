import re
import pyperclip

def convert_to_footnotes(text):
    """
    功能： 将剪贴板内容中的所有<u>标签替换为md脚注的形式，如果剪贴板内容中已经有md脚注，那么找到其最大编号，接下来的新编号是从之前最大编号+1开始。
    用法：命令行输入： python <this-file-path>
    首次开发时间：2024-07-24 18:08:43
    最新更改时间：
    备注：
    """
    # 找到已有的脚注编号
    existing_footnote_pattern = r'\[\^(\d+)\](?!:)'
    existing_numbers = re.findall(existing_footnote_pattern, text)
    existing_numbers = list(map(int, existing_numbers))
    max_existing_number = max(existing_numbers) if existing_numbers else 0

    # 匹配<u>标签
    pattern = r'<u>(.*?)</u>'
    matches = re.findall(pattern, text)
    footnotes = {}

    # 创建新的脚注编号
    for i, match in enumerate(matches, start=max_existing_number + 1):
        footnotes[match] = f"[^{i}]"

    # 替换<u>标签为脚注引用
    def replace_tag(match):
        content = match.group(1)
        return f"{content}{footnotes[content]}"

    updated_text = re.sub(pattern, replace_tag, text) + "\n## 解释下面的脚注："

        # Append footnotes at the end
    for i, match in enumerate(matches, start=max_existing_number + 1):
        updated_text += f"\n[^{i}]: {match}"

    return updated_text

def main():
    input_text = pyperclip.paste()
    if input_text:
        converted_text = convert_to_footnotes(input_text)
        pyperclip.copy(converted_text)
        print("转换后的文本已复制到剪贴板。")
    else:
        print("您还没有复制任何内容！请复制后再运行本脚本！")

if __name__ == "__main__":
    main()
