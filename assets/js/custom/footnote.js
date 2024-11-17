document.addEventListener("DOMContentLoaded", function () {
  // 页面上的脚注显示bootstrap提示框
  let activeTooltip = null; // 全局变量，追踪当前显示的tooltip

  document.querySelectorAll("sup>a.footnote").forEach(function (tooltipElement) {
    var targetId = tooltipElement.getAttribute("href");
    // Escaping colons and other special characters
    var escapedId = targetId.replace(/(:|\.|\[|\]|,|=|@)/g, "\\$1");
    var targetElement = document.querySelector(escapedId);
    if (targetElement) {
      // 获取并解析 JSON 数据
      let rawContent = targetElement.innerHTML.replace("↩", "").trim();
      rawContent = rawContent.replace(/&nbsp;<a.*<\/a>/, "").replace(/<p>|<\/p>/g, '').replace(/<code>|<\/code>/g, ''); // 去除末尾链接部分
      let dataObj = JSON.parse(rawContent);

      // 标题
      const title = dataObj.wd || "词条";

      // 网站字典名称和链接
      const dictNames = dataObj.dict_names || [];
      const spiderUrls = dataObj.spider_urls || [];

      // 图标字典，用于映射 dict_names 到图标
      const dictIconMapping = {
        'zdic': '📖', // 可替换为真实的图标路径
        'baidu_hanyu': '🔍',
        'MoeTw': '📚'
      };

      // 解释数据
      const explanationsData = dataObj.data || {};

      // 构建 HTML 结构
      let htmlContent = `<div class="text-center wordTitle">${title}</div>`;

      // 添加字典图标和链接
      htmlContent += `<div class="dict-icons"><span>搜索来源：</span>`;
      dictNames.forEach((dictName, index) => {
        const icon = dictIconMapping[dictName] || '📚';
        const url = spiderUrls[index] || '#';
        htmlContent += `
          <a href="${url}" target="_blank" class="dict-icon" title="${dictName}">
            <span class="icon">${icon}</span>
          </a>
        `;
      });
      htmlContent += `</div>`;

      // 解释展示
      htmlContent += `<div class="explanations">`;
      Object.keys(explanationsData).forEach(pinyin => {
        const meanings = explanationsData[pinyin];
        htmlContent += `
          <div class="pinyin-section">
            <div class="pinyin-title">[${pinyin}]</div>
            <ul class="meaning-list">
              ${meanings.map(meaning => {
                // 使用正则检测并替换 a 标签（因为，HTML 标准中，<li> 标签本身可以包含超链接 <a>，但如果浏览器或某些渲染环境存在限制（尤其是在 Bootstrap Tooltip 这种组件中），会导致嵌套的 <a> 标签被转义，显示为纯文本。）
                meaning = meaning.replace(/&lt;a(.*?)&gt;/g, "<a$1 target='_blank'>");
                meaning = meaning.replace(/&lt;\/a&gt;/g, "</a>");
                return `<li>${meaning}</li>`;
              }).join('')}
            </ul>
          </div>
        `;
      });
      htmlContent += `</div>`;

      // 设置 Bootstrap Tooltip
      tooltipElement.setAttribute("data-bs-html", "true");
      // tooltipElement.setAttribute("title", htmlContent);
      // tooltipElement.setAttribute("data-bs-title", htmlContent);
      tooltipElement.dataset.tooltipContent = htmlContent; // 使用 dataset 存储 HTML 内容

      tooltipElement.removeAttribute("title");

      let tooltip = new bootstrap.Tooltip(tooltipElement, { 
        trigger: 'manual', 
        html: true,
        title: function(){
          return tooltipElement.dataset.tooltipContent
        }
      });

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
      // 获取 tooltip 的 DOM 节点
      const tooltipNode = document.querySelector('.tooltip.show'); // `.tooltip.show` 
      if (!tooltipElement.contains(e.target) && !tooltipNode.contains(e.target) && activeTooltip) {
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
