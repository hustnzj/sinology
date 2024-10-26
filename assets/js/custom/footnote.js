document.addEventListener("DOMContentLoaded", function () {
  // 页面上的脚注显示bootstrap提示框
  let activeTooltip = null; // 全局变量，追踪当前显示的tooltip

  document.querySelectorAll("sup>a.footnote").forEach(function (tooltipElement) {
    var targetId = tooltipElement.getAttribute("href");
    // Escaping colons and other special characters
    var escapedId = targetId.replace(/(:|\.|\[|\]|,|=|@)/g, "\\$1");
    var targetElement = document.querySelector(escapedId);
    if (targetElement) {
      var htmlContent = targetElement.innerHTML.replace("↩", "").trim();
      tooltipElement.setAttribute("data-bs-html", "true");
      tooltipElement.setAttribute("title", htmlContent);

      var tooltip = new bootstrap.Tooltip(tooltipElement, { trigger: 'manual', html: true });

      // 鼠标移到 tooltipElement 上显示 tooltip
      tooltipElement.addEventListener('mouseenter', function () {
        // 检查当前是否有激活的 tooltip
        if (activeTooltip && activeTooltip !== tooltip) {
          activeTooltip.hide(); // 隐藏之前的 tooltip
        }
        tooltip.show(); // 显示新的 tooltip
        activeTooltip = tooltip; // 更新当前激活的 tooltip
      });

      // 鼠标移开时不会立即隐藏，延迟检查是否要隐藏
      tooltipElement.addEventListener('mouseleave', function () {
        setTimeout(function () {
          if (!tooltipElement.matches(':hover') && activeTooltip === tooltip) {
            tooltip.hide(); // 如果鼠标不在上面，隐藏tooltip
            activeTooltip = null; // 清空激活的tooltip
          }
        }, 1000000); // 1000s
      });
    }

    // 点击空白区域时隐藏所有 tooltip
    document.addEventListener('click', function (e) {
      if (!tooltipElement.contains(e.target) && activeTooltip) {
        activeTooltip.hide();
        activeTooltip = null; // 清空激活的tooltip
      }
    });
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
