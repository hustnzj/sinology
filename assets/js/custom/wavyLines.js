document.addEventListener("DOMContentLoaded", function () {
  // 获取所有 <p> 标签
  let paragraphs = document.querySelectorAll("p");

  paragraphs.forEach((p) => {
    // 先判断是否包含 `##` 包裹的内容
    if (p.innerHTML.includes("##")) {
      // 创建一个文档片段，避免直接修改 DOM
      let fragment = document.createDocumentFragment();
      let nodes = Array.from(p.childNodes); // 获取所有子节点

      let insideWavy = false; // 是否在 `##` 包裹的部分
      let tempContainer = document.createElement("div"); // 暂存 `##` 包裹的内容

      nodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          let text = node.textContent;

          while (text.length > 0) {
            if (insideWavy) {
              // 查找结束的 `##`
              let endIdx = text.indexOf("##");

              if (endIdx !== -1) {
                // 找到结束的 `##`
                tempContainer.appendChild(
                  document.createTextNode(text.slice(0, endIdx))
                );
                let span = document.createElement("span");
                span.classList.add("wavylines");
                span.innerHTML = tempContainer.innerHTML; // 打包成 span
                fragment.appendChild(span);

                // 清空暂存容器
                tempContainer.innerHTML = "";

                // 处理剩余文本
                text = text.slice(endIdx + 2);
                insideWavy = false;
              } else {
                // 如果找不到结束的 `##`，将所有文本暂存
                tempContainer.appendChild(document.createTextNode(text));
                text = ""; // 清空当前文本
              }
            } else {
              // 查找起始的 `##`
              let startIdx = text.indexOf("##");

              if (startIdx !== -1) {
                // 找到起始的 `##`
                fragment.appendChild(
                  document.createTextNode(text.slice(0, startIdx))
                );

                // 将之后的文本暂存到 tempContainer
                text = text.slice(startIdx + 2);
                insideWavy = true;
              } else {
                // 如果没有 `##`，直接添加文本
                fragment.appendChild(document.createTextNode(text));
                text = ""; // 清空当前文本
              }
            }
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // 元素节点
          if (insideWavy) {
            // 如果在 `##` 包裹中，处理嵌套的标签
            if (node.tagName.toLowerCase() === "ruby") {
              // 对 <ruby> 元素添加 class="wavylines"
              node.classList.add("wavylines");
            }
            tempContainer.appendChild(node.cloneNode(true)); // 克隆并暂存节点
          } else {
            // 不在 `##` 包裹中，直接加入片段，保留事件
            fragment.appendChild(node);
          }
        }
      });

      // 处理未闭合的 `##`
      if (insideWavy && tempContainer.innerHTML) {
        let span = document.createElement("span");
        span.classList.add("wavylines");
        span.innerHTML = tempContainer.innerHTML;
        fragment.appendChild(span);
      }

      // 清空 <p>，插入新的片段
      p.innerHTML = ""; // 直接操作整个 p 的文本内容
      p.appendChild(fragment);
    }
  });
});
