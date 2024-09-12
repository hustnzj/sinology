document.addEventListener('DOMContentLoaded', function() {
  /**
   * 功能：给 <table>标签自动添加上bootstrap的 table 类 来显示边框
   * 用法：
   * 首次开发时间：
   * 最新更改时间：
   * 备注：
   */
  // 查找所有的 table 元素
  var tables = document.querySelectorAll('table');
  
  // 遍历所有 table 并添加 Bootstrap 的类
  tables.forEach(function(table) {
    table.classList.add('table', 'table-bordered');
  });
});
