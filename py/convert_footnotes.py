import re
import pyperclip

def convert_to_footnotes(text):
    pattern = r'<u>(.*?)</u>'
    matches = re.findall(pattern, text)
    footnotes = {}

    for i, match in enumerate(matches, start=1):
        footnotes[match] = f"[^{i}]"

    def replace_tag(match):
        content = match.group(1)
        return f"{content}{footnotes[content]}"

    updated_text = re.sub(pattern, replace_tag, text)

    for i, match in enumerate(matches, start=1):
        updated_text += f"\n[^{i}]: {match}"

    return updated_text

def main():
    input_text = pyperclip.paste()
    converted_text = convert_to_footnotes(input_text)
    pyperclip.copy(converted_text)
    print("转换后的文本已复制到剪贴板。")

if __name__ == "__main__":
    main()
