// 本文件用来准备合适的HTML，便于后面其它脚本来处理
document.addEventListener("DOMContentLoaded", function () {
  /**
   * 功能：清除所有多余的<p></p>标签
   * 用法：
   * 首次开发时间：2024-09-22 14:18:32
   * 最新更改时间：
   * 备注：必须放在其他js代码之前，否则可能会导致事件、状态丢失，破坏其他JS代码的功能！https://chatgpt.com/c/66ee0aa1-1bc4-8007-8a4f-a0d11e5d03f5
   */
  let contentArea = document.querySelector(".content");
  contentArea.innerHTML = contentArea.innerHTML.replace(/<p><\/p>/g, "");

  /**
   * 功能：将 自定义的 `@ details xx @`标签转换为 `details`, `summary` HTML标记
   * 用法：
   * 首次开发时间：2024-09-22 19:23:35
   * 最新更改时间：
   * 备注：
   */
  contentArea.innerHTML = contentArea.innerHTML
    .replace(
      /<p>@ details (.*?) @<\/p>/g,
      '<details>\n  <summary>$1</summary>\n  <div class="content">'
    )
    .replace(/<p>@ enddetails @<\/p>/g, "  </div>\n</details>");
});
