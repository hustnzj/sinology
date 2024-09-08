document.addEventListener("DOMContentLoaded", function () {
  /**
   * 功能：给指定文本添加各种样式
   * 用法：直接在md文档中输入：
    <span class="...">苍鹭,苍鹭(节选)</span>

    然后下面的JS代码会自动将span的类名转移到p上，并去掉span标签

   * 首次开发时间：2024-09-05 17:49:56
   * 最新更改时间：2024-09-06 09:17:43
   * 备注：
   */
  // 获取所有的<p>标签
  const paragraphs = document.querySelectorAll("p");

  // 遍历每一个<p>标签
  paragraphs.forEach(function (paragraph) {
    // 查找<p>标签内所有的子元素
    const children = paragraph.children;

    // 检查<p>标签内是否只有一个子元素，且这个子元素是<span>
    if (children.length === 1 && children[0].tagName.toLowerCase() === "span") {
      const span = children[0];

      // 检查<span>是否有类名
      if (span.className && !span.className.includes('poetry')) {
        // 将<span>的类名转移到<p>标签上
        paragraph.className = span.className;

        // 将<span>的内容移到<p>标签内，移除<span>标签
        paragraph.innerHTML = span.innerHTML;
      }
    }
  });
});
