let isButtonActive = false; // 状态变量：标记是否已有活动按钮

document.addEventListener('mouseup', function (event) {
    var selection = window.getSelection();
    if (selection.toString().trim()) {
        var selectedText = selection.toString().trim();

        // 如果按钮已激活，直接返回，避免覆盖
        if (isButtonActive) {
            console.log('Button already active, skipping new creation.');
            return;
        }

        console.log('Mouseup event triggered. Selected text:', selectedText);

        // 创建按钮
        var button = document.createElement('button');
        button.classList.add('btn', 'btn-primary', 'btn-sm');
        button.innerText = '查看释义';

        // 设置按钮位置
        button.style.position = 'absolute';
        button.style.left = `${window.pageXOffset + event.pageX}px`;
        button.style.top = `${window.pageYOffset + event.pageY}px`;

        console.log('Button position:', button.style.left, button.style.top);

        // 清除已有按钮，防止重复创建
        var existingButton = $('.btn-primary');
        if (existingButton) {
            existingButton.remove();
        }

        // 绑定事件
        button.addEventListener('click', function () {
            console.log('Button clicked. Selected text:', selectedText);
            const modalBody = $('#definitionModal .modal-body');

            // 显示加载动画
            const loadingContent = `
                <div class="text-center my-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                    <p>正在查询，请稍候...</p>
                </div>`;
            modalBody.html(loadingContent);

            // 显示模态框
            $('#definitionModal').modal('show');

            // 发起 API 请求
            fetch(`http://127.0.0.1:5001/get_definition?word=${encodeURIComponent(selectedText)}`)
                .then(response => {
                    console.log('Fetch response status:', response.status);
                    return response.json();
                })
                .then(data => {
                    console.log('API response data:', data);

                    // 构建 HTML 内容
                    let htmlContent = '';
                    if (data && data.sources) {
                        htmlContent = generateContentHTML(data);
                        console.log(htmlContent)
                    } else {
                        htmlContent = '<p>未找到释义。</p>';
                    }

                    // 插入到模态框中
                    modalBody.html(htmlContent);

                    // 更新模态框内容
                    $('#definitionModal').modal('show');
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    modalBody.html('<p>请求失败，请稍后再试。</p>');
                    $('#definitionModal').modal('show');
                });

            // 清除按钮并重置状态
            button.remove();
            isButtonActive = false;
        });

        // 添加按钮到页面
        document.body.appendChild(button);
        console.log('Button added to DOM.');

        // 设置状态为“按钮激活”
        isButtonActive = true;
    } else {
        // 如果未选中文本，重置状态
        isButtonActive = false;
    }
});

// 生成内容的 HTML
function generateContentHTML(dataObj) {
  const title = dataObj.wd || "词条";

  // 图标字典，用于映射 dict_names 到图标和样式类
  const dictIconMapping = {
    'zdic': '<i class="fa fa-book zdic-icon" aria-hidden="true"></i>',
    'baidu_hanyu': '<i class="fa fa-book baidu-icon" aria-hidden="true"></i>',
    'moe': '<i class="fa fa-book moe-icon" aria-hidden="true"></i>'
  };

  let htmlContent = `<div class="text-center wordTitle">${title}</div>`;

  // 遍历 sources 数据
  dataObj.sources.forEach(source => {
      const dictName = source.dict_name;
      const spiderUrls = source.spider_url || [];
      const explanationsData = source.data || {};

      // 添加字典标题和图标
      const icon = dictIconMapping[dictName] || '📚';
      htmlContent += `<div class="dict-header">
          <span class="dict-name">${icon}</span>
          <span class="dict-links">`;

      // 添加字典的链接
      spiderUrls.forEach(url => {
          htmlContent += `<a href="${url}" target="_blank" class="dict-icon" title="${dictName}">🔗</a>`;
      });

      htmlContent += `</span></div>`;

      // 添加解释部分
      htmlContent += `<div class="explanations">`;
      Object.keys(explanationsData).forEach(pinyin => {
          const meanings = explanationsData[pinyin];
          htmlContent += `
              <div class="pinyin-section">
                  <div class="pinyin-title"><strong>[${pinyin}]</strong></div>
                  <ul class="meaning-list">
                      ${meanings.map(meaning => `<li>${meaning}</li>`).join('')}
                  </ul>
              </div>`;
      });
      htmlContent += `</div>`;
  });

  return htmlContent;
}
