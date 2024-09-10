document.addEventListener("DOMContentLoaded", function () {
  // 自动转换属于诗词的 p 标签 为 ruby + rt 的格式：——————————————————————————START
  // 获取所有的 <p> 标签
  const pTags = document.querySelectorAll("p");
  // const hanziRegex = /[\u4E00-\u9FFF㸌]/g; //有不能匹配的汉字都直接加到这里。

  pTags.forEach(pTag => {
    const lines = pTag.innerHTML.split('\n').map(line => line.trim());

    if (lines.length >= 2) {
      const firstLine = lines[0];
      const secondLine = lines[1];

      // 检查第一行是否只包含拼音、空格和可选的《
      const isPinyinLine = /^[《]?[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ\s]*[》]?[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ\s]*$/.test(firstLine);
      // 检查第二行是否只包含汉字、 《 和 <sup> 标签，且 sup 标签外只有汉字和 《
      // const isChineseLine = /^[《]?[\u4E00-\u9FFF㸌]+[》]?(\s*<sup[^>]*>.*?<\/sup>)?[\u4E00-\u9FFF㸌]*$/.test(secondLine);
      const isChineseLine = new RegExp(
        `^[《]?${hanziRegex.source}+[》]?(\\s*<sup[^>]*>.*?<\\/sup>)?${hanziRegex.source}*$`
      ).test(secondLine);  // 在 JavaScript 中，直接使用正则表达式字面量 `/.../` 时，反斜杠 `\` 无需双重转义，而通过 `new RegExp()` 并以字符串创建正则表达式时，反斜杠 `\` 需双重转义，如 `\s` 要写成 `\\s` 。 

      if (isPinyinLine && isChineseLine) {
        // 此处插入处理函数，将符合条件的内容转换为带 <ruby><rt> 标签的格式
        const htmlFragment = generateRubyHTML(lines);
        pTag.outerHTML = htmlFragment;
      }
    }
  });

  function generateRubyHTML(lines) {
    let htmlOutput = '';
    // 中文标点
    const chinesePunStr = "，。！？；：（）《》“”‘’——·";
    const chinesePunRegex = new RegExp(`[${chinesePunStr}]`, 'g');
    // const chinesePunRegex = /[\u3000-\u303F\uFF00-\uFFEF]/g;
    // sup 脚注
    const supFootNoteRegex = /<sup[^>]*>.*?<\/sup>/g
    //汉字行正则，用于提取汉字、中文标点、脚注sup
    const chineseSegRegex = new RegExp(`(${hanziRegex.source})|(${chinesePunRegex.source})|(${supFootNoteRegex.source})`, 'g');

    // 依次遍历拼音行和汉字行
    for (let i = 0; i < lines.length; i += 2) {
      const pinyinLine = lines[i].trim();
      const chineseLine = lines[i + 1].trim();

      // 生成 ruby, rt 标签
      let rubyHTML = '';

      //获得拼音行数组
      const pinyinSegments = pinyinLine.replace(supFootNoteRegex, '').replace(chinesePunRegex, ' ').split(' ').filter(Boolean);

      //汉字行数组
      const chineseSegments = chineseLine.match(chineseSegRegex).filter(Boolean);

      let pinyinIndex = 0;
      for (let i = 0; i < chineseSegments.length; i++) {
        let segment = chineseSegments[i];
        if (segment.startsWith('<sup')) {
          // 如果 segment 是 sup 标签表示的脚注，则直接添加到 rubyHTML
          rubyHTML += segment;
        } else if (chinesePunStr.includes(segment)) { // 此方法直接检查字符串是否包含特定的子字符串，它在底层处理的是字符，而不是使用正则表达式。因此，它可以正确识别和匹配输入的字符，比如全角标点符号。这是因为它不涉及编码转换或复杂的匹配机制，只是逐字符比较。
          // } else if (chinesePunRegex.test(segment)) { // 如果要使用这句，则必须使用\u模式的正则，而不能直接使用中文标点（全角字符编码）作为正则!
          // 如果 segment 是中文标点，则添加到 rubyHTML，但不添加拼音
          rubyHTML += `<ruby>${segment}<rt></rt></ruby>`;
        } else {
          // 否则，添加拼音和汉字
          let pinyinSegment = pinyinSegments[pinyinIndex] || ''; // 处理可能不存在的拼音段
          rubyHTML += `<ruby><a href="https://dict.baidu.com/s?wd=${segment}" target="_blank">${segment}</a><rt> ${pinyinSegment} </rt></ruby>`; //并添加上百度汉语的超链接
          pinyinIndex++; // 递增拼音索引
        }
      }

      // 判断是否是标题
      if (rubyHTML.startsWith('<ruby>《')) {
        htmlOutput += `<h3><span class="poetry">${rubyHTML}</span></h3><p ><span class="poetry text-muted">本诗有 ${countChineseCharacters(lines)} 个字</span></p>`;
      } else {
        htmlOutput += `<p><span class="poetry">${rubyHTML}</span></p>`;
      }
    }

    function countChineseCharacters(lines) {
      return lines.reduce((count, line) => {
        const matches = line.match(hanziRegex);
        return count + (matches ? matches.length : 0);
      }, 0);
    }

    return htmlOutput;
  }
  // 自动转换属于诗词的 p 标签 为 ruby + rt 的格式：——————————————————————————END
})