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