document.addEventListener("DOMContentLoaded", function () {
  /**
   * 功能：将所有含有 img-col-A-B 的 <span> 的 <p>标签 转换为 bootstrap的A行B列布局
   * 用法：直接在md文档中输入：
    <span class="img-col-2-2">![白鹭](image-1.png)</span>
    <span class="img-col-2-2">![白鹤](image-2.png)</span>
    <span class="img-col-2-2">![朱鹭](image-3.png)</span>
    <span class="img-col-2-2">![灰鹭](image-4.png)</span>

   * 首次开发时间：2024-09-04 15:09:35
   * 最新更改时间：
   * 备注：
   */
  // 查找所有包含 img-col-* 的 <p> 标签
  const pTags = document.querySelectorAll("p");

  pTags.forEach(function (pTag) {
    // 检查 <p> 标签内是否有 .img-col-*-* 的 <span>
    const spans = pTag.querySelectorAll("span[class^='img-col-']");
    if (spans.length > 0) {
      // 获取布局信息（例如 img-col-2-2 表示 2x2 布局）
      const layoutClass = spans[0].className.match(/img-col-(\d+)-(\d+)/);
      if (!layoutClass) return; // 如果没有匹配到布局信息，则跳过处理

      const rows = parseInt(layoutClass[1], 10);
      const cols = parseInt(layoutClass[2], 10);
      const itemsPerRow = spans.length / rows;

      let html = "";
      spans.forEach((span, index) => {
        // 每行开始
        if (index % itemsPerRow === 0) {
          if (index !== 0) {
            html += "</div>"; // 结束上一个.row
          }
          html += '<div class="row mt-4 mb-4">';
        }

        // 创建每一个col-md-x
        const img = span.querySelector("img");
        const title = img.alt;

        html += `
                  <div class="col-md-${12 / cols}">
                      <div class="card">
                          <div class="card-img-top img-container">
                              <img src="${img.src}" alt="${title}" />
                          </div>
                          <div class="card-body">
                              <h5 class="card-title text-center">${title}</h5>
                          </div>
                      </div>
                  </div>
              `;
      });

      html += "</div>"; // 结束最后一个.row

      // 用生成的 HTML 替换 <p> 标签
      pTag.outerHTML = html;
    }
  });
});
