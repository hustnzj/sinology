from setuptools import setup

setup(
    name='note_system_python_tools',
    version='1.1',
    py_modules=['_py.batch_resize_imgs',
                '_py.convert_html_to_md',
                '_py.convert_footnotes',
                '_py.word_pinyin',
                '_py.poetry_pinyin',
                '_py.batch_rename_png',
                ],
    entry_points={
        'console_scripts': [
            'resize_imgs = _py.batch_resize_imgs:main',
            'html2md = _py.convert_html_to_md:main',
            'ask_footnotes = _py.convert_footnotes:main',
            'word_pinyin = _py.word_pinyin:main',
            'poetry_pinyin = _py.poetry_pinyin:main',
            'rename_png = _py.batch_rename_png:main',
        ],
    },
    install_requires=[
        'Pillow',  # 确保安装Pillow库
    ],
)
