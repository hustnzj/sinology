from setuptools import setup

setup(
    name='zj_resize_png',
    version='1.0',
    py_modules=['_py.batch_resize_png',
                '_py.convert_html_to_md',
                '_py.convert_footnotes',
                '_py.word_pinyin',
                '_py.poetry_pinyin',
                ],
    entry_points={
        'console_scripts': [
            'resize_png = _py.batch_resize_png:main',
            'html2md = _py.convert_html_to_md:main',
            'ask_footnotes = _py.convert_footnotes:main',
            'word_pinyin = _py.word_pinyin:main',
            'poetry_pinyin = _py.poetry_pinyin:main',
        ],
    },
    install_requires=[
        'Pillow',  # 确保安装Pillow库
    ],
)
