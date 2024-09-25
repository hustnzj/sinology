document.addEventListener("DOMContentLoaded", function () {
  /**
   * 功能：代替 details 默认的 toggle 事件，从而能有平滑的关闭效果。
   * 用法：
   * 首次开发时间：2024-09-22 16:42:07
   * 最新更改时间：
   * 备注：https://chatgpt.com/c/66efbd6e-88ac-8007-8d2c-da62c42143e6
   */
  document.querySelectorAll("details").forEach((detail) => {
    const summary = detail.querySelector('summary')
    const content = detail.querySelector("div");

    // 初始化时，设置为 max-height 0
    // content.style.maxHeight = "0";
    // content.style.overflow = "hidden";
    // content.style.transition = "max-height 0.2s ease";

    summary.addEventListener("click", function (e) {
      e.preventDefault(); // 手动控制打开和关闭逻辑

      if (detail.open) {
        // 开始关闭动画时，首先设置当前的高度
        content.style.maxHeight = content.scrollHeight + "px";

        // 下一帧内将高度设置为 0，触发收缩动画
        requestAnimationFrame(() => {
          content.style.maxHeight = "0";
        });

        // 监听动画结束后，再将 details 的 open 属性设为 false
        content.addEventListener("transitionend", function onClose() {
          detail.open = false;
          content.removeEventListener("transitionend", onClose); // 移除监听器避免重复
        });
      } else {
        // 设置为打开状态
        detail.open = true;

        // 下一帧将内容高度设置为 scrollHeight，触发展开动画
        requestAnimationFrame(() => {
          content.style.maxHeight = content.scrollHeight + "px";
        });

        // 监听动画结束后，移除 max-height 限制
        content.addEventListener("transitionend", function onOpen() {
          content.style.maxHeight = content.scrollHeight + "px";
          content.removeEventListener("transitionend", onOpen); // 移除监听器避免重复
        });
      }
    });
  });
});
