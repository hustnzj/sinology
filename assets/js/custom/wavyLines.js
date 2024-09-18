document.addEventListener("DOMContentLoaded", function () {
  // 限制范围，不能在 #sidebar 中，否则会导致toc打不开
  let content = document.querySelector('.content') 
  // 处理所有需要检查的容器元素，比如 p, ul, li 等
  let containers = content.querySelectorAll("p, ul, li");

  containers.forEach((container) => {
    // 简单处理容器的内容
    container.innerHTML = processText(container.innerHTML);
  });

  // 处理文本的函数，将 ## 包裹的内容转换为 <span class="wavylines">
  function processText(text) {
    return text.replace(/##(.*?)##/g, '<span class="wavylines">$1</span>');
  }
});
