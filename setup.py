from setuptools import setup

setup(
    name='note_system_python_tools',
    version='1.4.0',
    author='david',
    author_email='your_email@example.com',
    description='自己的笔记系统',
    py_modules=['_py.batch_resize_imgs',
                '_py.convert_html_to_md',
                '_py.convert_footnotes_auto',
                '_py.convert_footnotes_ask',
                '_py.word_pinyin',
                '_py.poetry_pinyin',
                '_py.batch_rename_png',
                '_py.git_auto_commit',
                '_py.git_diff',
                ],
    entry_points={
        'console_scripts': [
            'resize_imgs = _py.batch_resize_imgs:main',
            'html2md = _py.convert_html_to_md:main',
            'footnotes_ask = _py.convert_footnotes_ask:main',
            'footnotes_auto = _py.convert_footnotes_auto:sync_main', # https://chatgpt.com/c/66fd59f0-57c4-8007-9e54-7b4fe627382d
            'word_pinyin = _py.word_pinyin:main',
            'poetry_pinyin = _py.poetry_pinyin:main',
            'rename_png = _py.batch_rename_png:main',
            'git_diff = _py.git_diff:main',
            'git_auto_commit = _py.git_auto_commit:main',
        ],
    },
    install_requires=[
        'Pillow',  # 确保安装Pillow库
    ],
)
