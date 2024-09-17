document.addEventListener("DOMContentLoaded", function () {
  // 给所有非诗词正文的 ruby 标签中的汉字添加上百度汉语超链接
  const rubies_not_in_poetry = document.querySelectorAll('.content > p > ruby, .content > ol > li > ruby, .content > ol > li> p > ruby, .content > h1 > ruby, .content > p > strong > ruby');
  rubies_not_in_poetry.forEach(ruby => {
    const chineseCharacter = ruby.textContent.match(hanziRegex)[0];
    const newContent = `<ruby><a href="https://dict.baidu.com/s?wd=${chineseCharacter}" target="_blank">${chineseCharacter}</a><rt>${ruby.querySelector('rt').textContent}</rt></ruby>`;
    ruby.outerHTML = newContent;
  });

});