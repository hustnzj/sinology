document.addEventListener("DOMContentLoaded", function () {
  // 页面上的脚注显示bootstrap提示框
  document.querySelectorAll('sup>a.footnote').forEach(function (tooltipElement) {
    var targetId = tooltipElement.getAttribute('href');
    // Escaping colons and other special characters
    var escapedId = targetId.replace(/(:|\.|\[|\]|,|=|@)/g, '\\$1');
    var targetElement = document.querySelector(escapedId);
    if (targetElement) {
      var textContent = targetElement.textContent.replace('↩', '').trim();
      tooltipElement.setAttribute('title', textContent);
      new bootstrap.Tooltip(tooltipElement);
    }
  });

});