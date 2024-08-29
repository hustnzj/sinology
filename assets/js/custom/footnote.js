document.addEventListener("DOMContentLoaded", function () {
  // 页面上的脚注显示bootstrap提示框
  document
    .querySelectorAll("sup>a.footnote")
    .forEach(function (tooltipElement) {
      var targetId = tooltipElement.getAttribute("href");
      // Escaping colons and other special characters
      var escapedId = targetId.replace(/(:|\.|\[|\]|,|=|@)/g, "\\$1");
      var targetElement = document.querySelector(escapedId);
      if (targetElement) {
        var textContent = targetElement.textContent.replace("↩", "").trim();
        tooltipElement.setAttribute("title", textContent);
        new bootstrap.Tooltip(tooltipElement);
      }
    });

  //确保只有当两个 <sup> 标签紧邻时才在其中显示“选择性”的斜杠
  const supElements = document.querySelectorAll("sup");

  for (let i = 0; i < supElements.length - 1; i++) {
    const currentSup = supElements[i];
    const nextSup = supElements[i + 1];

    // 检查当前 <sup> 和下一个 <sup> 之间是否有其他元素或文本
    if (currentSup.nextSibling === nextSup) {
      nextSup.classList.add('alternative')
    }
  }
});
