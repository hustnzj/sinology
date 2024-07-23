import re
import pyperclip

def wrap_four_char_phrases(text):
    pattern = r'([\u4e00-\u9fa5]{4})'
    return re.sub(pattern, r'<u>\1</u>', text)

def main():
    text = pyperclip.paste()
    wrapped_text = wrap_four_char_phrases(text)
    pyperclip.copy(wrapped_text)
    print("Wrapped text copied to clipboard.")

if __name__ == "__main__":
    main()
