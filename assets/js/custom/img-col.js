document.addEventListener("DOMContentLoaded", function () {
  /**
   * 功能：将所有包含 img 的 <p> 标签 转换为 Bootstrap 的动态布局
   * 如果 <p> 中包含非 <img> 元素或文本，则跳过处理，并根据屏幕宽度和图片数量动态设置 .img-container 高度
   * 用法：直接在 md 文档中输入多个 md 超链接:
   *
   * ![仪门](image-26.png)
   * ![仪门2](image-27.png)
   * ![仪门3](image-28.png)
   *
   * 首次开发时间：2024-09-04 15:09:35
   * 最新更改时间：2024-09-11 16:06:51
   * 备注：
   */
  // 动态调整图片布局的函数
  function adjustImageLayout() {
    // 查找所有包含 img 的 <p> 标签
    const pTags = document.querySelectorAll("p");

    pTags.forEach(function (pTag) {
      const imgs = pTag.querySelectorAll("img");

      // 如果 <p> 中没有 <img> 或包含其他非 <img> 元素和文本，则跳过
      const hasNonImgElements = Array.from(pTag.childNodes).some((node) => {
        return (
          (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== "") ||
          (node.nodeType === Node.ELEMENT_NODE &&
            node.tagName.toLowerCase() !== "img")
        );
      });

      if (imgs.length > 0 && !hasNonImgElements) {
        let colClass = "";
        let imgContainerClass = "img-container";

        // 获取当前屏幕宽度
        const screenWidth = window.innerWidth;

        // 如果是小屏幕（小于 md，即 < 768px），固定高度为 200px
        if (screenWidth >= 768) {
          // 根据图片数量动态调整列的宽度和 img-container 高度
          if (imgs.length === 1) {
            colClass = "col-sm-12"; // 单张图片占整行
            imgContainerClass = "img-container-1";
          } else if (imgs.length === 2) {
            colClass = "col-sm-6"; // 两张图片每个占一半
            imgContainerClass = "img-container-2";
          } else if (imgs.length === 3) {
            colClass = "col-sm-4"; // 三张图片每个占三分之一
            imgContainerClass = "img-container-3";
          } else if (imgs.length >= 4) {
            colClass = "col-sm-6 col-lg-4 col-xl-3"; // 四张或更多，根据屏幕大小来确定每个占多少区域
            imgContainerClass = "img-container-4";
          }
        } else if (screenWidth >= 576) {
          if (imgs.length === 1) {
            colClass = "col-sm-12"; // 单张图片占整行
            imgContainerClass = "img-container-1";
          } else if (imgs.length === 2) {
            colClass = "col-sm-6"; // 两张图片每个占一半
            imgContainerClass = "img-container-2";
          }
        } else {
          if (imgs.length === 1) {
            colClass = "col-sm-12"; // 单张图片占整行
            imgContainerClass = "img-container-1";
          }
        }

        let html = '<div class="row mt-4 mb-4">';

        imgs.forEach((img) => {
          const title = img.alt;

          // 创建每一个 col
          html += `
                   <div class="${colClass}">
                       <div class="card">
                           <div class="card-img-top img-container ${imgContainerClass}" >
                               <img src="${img.src}" alt="${title}" />
                           </div>
                           <div class="card-body">
                               <h5 class="card-title text-center">${title}</h5>
                           </div>
                       </div>
                   </div>
               `;
        });

        html += "</div>"; // 结束 .row

        // 用生成的 HTML 替换 <p> 标签
        pTag.outerHTML = html;
      }
    });
  }

  // 页面加载时调整布局
  adjustImageLayout();

  // 监听窗口大小变化，实时调整布局
  window.addEventListener("resize", adjustImageLayout);
});
