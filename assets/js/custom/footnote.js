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
      // 处理 htmlContent
      // 1. 移除 <p> 标签
      htmlContent = htmlContent.replace(/<p>/g, '').replace(/<\/p>/g, '');

      // 2. 用 <br> 标签分隔内容
      var contentParts = htmlContent.split(/<br\s*\/?>/i);
      var title = contentParts[0].replace(':', '').trim(); // 第一项为 title

      // 3. 解析 contentParts[1] 中的特殊标记内容
      var dict_name = (contentParts[1].match(/《(.*?)》/) || [])[1] || ''; // 《》内的内容
      var type_name = (contentParts[1].match(/【(.*?)】/) || [])[1] || ''; // 【】内的内容
      var pinyin = (contentParts[1].match(/\[(.*?)\]/) || [])[1] || ''; // []内的内容

      const dictNameMapping = {
        '百度百科': 'baidu_baike',
        '百度汉语': 'baidu_hanyu',
        '国语辞典': 'moe_tw',
        '汉典': 'zdic'
      };
      
      const dict_class_name = dictNameMapping[dict_name] || '';

      // 4. 使用解析出的内容生成 HTML
      var secondPartHtml = `
        <div class="dict_name ${dict_class_name}">${dict_name}</div>

        <div class="lemmaTitleBox">
          <span class="lemmaTitle">${title}</span>
          <span class="lemmaPinyin">[${pinyin}]</span>
        </div>
        <div class="lemmaDesc">${type_name}</div>
      `;

      // 5. 组合 contentParts[2] 开始的其余内容
      var content = contentParts.slice(2).map(part => `<p>${part.trim()}</p>`).join('');

      // 6. 将 title、secondPartHtml 和 content 组合成最终的 htmlContent
      htmlContent = `<div class="text-center wordTitle">${title}</div>${secondPartHtml}${content}`;
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
