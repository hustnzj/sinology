document.addEventListener("DOMContentLoaded", function () {
  // 处理所有需要检查的容器元素，比如 p, ul, li 等
  let containers = document.querySelectorAll("p, ul, li");

  containers.forEach((container) => {
    // 递归处理容器的所有子节点
    processNodes(container);
  });

  // 处理节点的函数
  function processNodes(parentNode) {
    let nodes = Array.from(parentNode.childNodes);
    let fragment = document.createDocumentFragment();
    let insideWavy = false; // 标识是否在 `##` 包裹的部分
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
        if (insideWavy) {
          // 如果在 `##` 包裹中，处理嵌套的标签
          if (node.tagName.toLowerCase() === "ruby") {
            // 对 <ruby> 元素及其子元素添加 class="wavylines"
            node.classList.add("wavylines");
          }
          // 克隆并暂存节点，递归处理它的子节点
          tempContainer.appendChild(node.cloneNode(true));
        } else {
          // 不在 `##` 包裹中，递归处理子节点
          processNodes(node);
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

    // 清空容器并插入处理后的内容
    parentNode.innerHTML = ""; // 清空原始内容
    parentNode.appendChild(fragment); // 插入新的文档片段
  }
});
