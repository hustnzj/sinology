document.addEventListener("DOMContentLoaded", function () {
  /**
   * 功能：主题配色来设置基本颜色，一些特定区域的颜色在CSS中来具体设置
   * 用法：
   * 首次开发时间：2024-08-29 15:00:48
   * 最新更改时间：
   * 备注：
   */
  // 检查用户的操作系统配色偏好
  const prefersDarkScheme = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  // 根据系统的配色偏好设置 theme
  if (prefersDarkScheme) {
    document.documentElement.setAttribute("data-bs-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-bs-theme", "light");
  }

  // 如果用户手动切换操作系统的配色偏好，也要及时响应
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      if (event.matches) {
        document.documentElement.setAttribute("data-bs-theme", "dark");
      } else {
        document.documentElement.setAttribute("data-bs-theme", "light");
      }
    });
});
