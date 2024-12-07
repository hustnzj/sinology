let isButtonActive = false; // 状态变量：标记是否已有活动按钮
let activeButton = null; // 存储当前活动按钮的引用
let modalCount = 0; // 记录当前模态框数量，用于动态定位

document.addEventListener('mouseup', function (event) {
    var selection = window.getSelection();
    if (selection.toString().trim()) {
        var selectedText = selection.toString().trim();

        // 如果按钮已激活，直接返回，避免覆盖
        if (isButtonActive) {
            // console.log('Button already active, skipping new creation.');
            return;
        }

        // console.log('Mouseup event triggered. Selected text:', selectedText);

        // 创建按钮
        var button = document.createElement('button');
        button.classList.add('btn', 'btn-primary', 'btn-sm');
        button.innerText = '查看释义';

        // 设置按钮位置
        button.style.position = 'absolute';
        button.style.left = `${event.pageX}px`;
        button.style.top = `${event.pageY}px`;

        // console.log('Button position:', button.style.left, button.style.top);

        // 清除已有按钮，防止重复创建
        if (activeButton) {
            activeButton.remove();
        }

        // 添加按钮到页面
        document.body.appendChild(button);
        // console.log('Button added to DOM.');

        // 设置状态为“按钮激活”
        isButtonActive = true;
        activeButton = button;

        // 延迟绑定全局 click 事件，避免鼠标释放触发误移除
        setTimeout(() => {
            document.addEventListener('click', handleClickOutsideButton);
        }, 0);

        // 绑定事件
        button.addEventListener('click', function (e) {
            e.stopPropagation(); // 阻止事件冒泡到全局 click 事件
            // console.log('Button clicked. Selected text:', selectedText);

            // 创建新的模态框
            const modalId = `definitionModal-${Date.now()}`;
            createAndShowModal(modalId, selectedText, e);

            // 清除按钮并重置状态
            button.remove();
            isButtonActive = false;
            activeButton = null;
            document.removeEventListener('click', handleClickOutsideButton);
        });
        
    } else {
        // 如果未选中文本，重置状态
        isButtonActive = false;
        if (activeButton) {
            activeButton.remove();
            activeButton = null;
            document.removeEventListener('click', handleClickOutsideButton);
        }
    }
});

// 全局 click 事件监听函数
function handleClickOutsideButton(event) {
  // 如果有活动按钮，且点击的不是按钮本身，则移除按钮
  if (isButtonActive && activeButton && !activeButton.contains(event.target)) {
      // console.log('Click detected outside button. Removing button.');
      activeButton.remove();
      isButtonActive = false;
      activeButton = null;
      document.removeEventListener('click', handleClickOutsideButton);
  }
}

// 创建并显示模态框
function createAndShowModal(modalId, selectedText, event) {
  let isLoading = true; // 标志变量：模态框是否处于加载状态

  const modal = document.createElement('div');
  modal.id = modalId;
  modal.classList.add('modal', 'fade');
  modal.style.zIndex = 1051 - modalCount; // 确保 modal 位于 backdrop 上层
  modal.style.opacity = 0; // 初始透明度
  modal.style.display = 'block';
  modal.style.height = '300px';

  modal.innerHTML = `
      <div class="modal-dialog" style="position: absolute;">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title">查询结果</h5>
                  <button type="button" class="btn-close" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                  <div class="text-center my-4">
                      <div class="spinner-border text-primary" role="status">
                          <span class="sr-only">Loading...</span>
                      </div>
                      <p>正在查询，请稍候...</p>
                  </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-close-footer">关闭</button>
            </div>
          </div>
      </div>
  `;

  // 调整模态框初始位置和偏移
  const dialog = modal.querySelector('.modal-dialog');
  dialog.style.width = '400px';
  modal.style.position = 'fixed';
  modal.style.width = '400px';
  modal.style.height = '283px'; // 这个是 dialog.offsetHeight 得到的，是加载内容前的高度，之所以要设置这么精确，是为了避免多出来的高度挡住 backdrop，影响到 backdrop 绑定的点击隐藏模态框的事件。
  
  // 延迟获取dialog的宽度、并设置位置（因为在尝试获取宽高度时，如果 dialog 的内容尚未完全加载（比如样式或内容未渲染），高度可能为 0）
  setTimeout(() => {
    const dialogWidth = dialog.offsetWidth; // 或 dialog.getBoundingClientRect().height
    // console.log(dialog.offsetHeight); //勿删！勿删！勿删！勿删！勿删！勿删！勿删！勿删！勿删！用来确定 dialog 初始高度!
    modal.style.left = `calc(50% - ${dialogWidth / 2}px)`;
    modal.style.top = `calc(10%)`;
  }, 0);
  document.body.appendChild(modal);
  
  // 动态设置 modal 的高度
  const updateModalHeight = () => {
    const dialogHeight = dialog.offsetHeight; // 获取 dialog 的实际高度
    modal.style.height = `${dialogHeight}px`; // 设置 modal 的高度
  };


  // 如果模态框内容会动态加载（比如通过 fetch），在内容更新后重新计算
  const modalBody = modal.querySelector('.modal-body');
  new MutationObserver(() => {
      updateModalHeight();
  }).observe(modalBody, { childList: true, subtree: true });


  // 添加背景遮罩
  const backdrop = document.createElement('div');
  backdrop.classList.add('modal-backdrop', 'fade', 'show');
  backdrop.style.zIndex = 1050 - modalCount; // backdrop 层级略低
  document.body.appendChild(backdrop);

  // 动态显示模态框
  setTimeout(() => {
      modal.classList.add('show');
      modal.style.opacity = 1; // 开始淡入
  }, 10);

  // 关闭模态框逻辑
  const closeModal = () => {
      modal.style.opacity = 0; // 淡出效果
      backdrop.style.opacity = 0;
      setTimeout(() => {
          modal.remove();
          backdrop.remove();
      }, 300); // 等待动画结束后移除 DOM
      modalCount--;
  };

  // 隐藏逻辑
  const hideModal = () => {
    if (isLoading) {
      modal.classList.remove('show');
      modal.style.opacity = 0;
      backdrop.style.opacity = 0;
      setTimeout(() => {
          modal.style.display = 'none';
          backdrop.style.display = 'none';
      }, 300); // 等待动画结束
    }
  };

  // 重新显示逻辑
  const showModal = () => {
      modal.style.display = 'block';
      backdrop.style.display = 'block';
      setTimeout(() => {
          modal.classList.add('show');
          modal.style.opacity = 1;
          backdrop.style.opacity = 0.5;
      }, 10);
  };

  modal.querySelector('.btn-close').addEventListener('click', closeModal);
  modal.querySelector('.btn-close-footer').addEventListener('click', closeModal);
  backdrop.addEventListener('click', hideModal); // 点击遮罩时仅隐藏模态框

  // 模态框内容加载逻辑
  fetch(`http://127.0.0.1:5001/get_definition?word=${encodeURIComponent(selectedText)}`)
      .then(response => {
          console.log(`'${selectedText}' Fetch response status:`, response.status);
          return response.json();
      })
      .then(data => {
          const modalBody = modal.querySelector('.modal-body');
          let htmlContent = '';

          if (data && data.sources) {
              htmlContent = generateContentHTML(data);
              showModal(); // 在内容加载完成后重新显示模态框
          } else {
              if (data.error) {
                  if (data.play_sound) {
                      const utterance = new SpeechSynthesisUtterance(data.error);
                      utterance.lang = 'zh-CN';
                      window.speechSynthesis.speak(utterance);
                  }
              }
              htmlContent = `<p>${data.error}</p>`;
          }

          modalBody.innerHTML = htmlContent;
          isLoading = false; // 数据加载完成，设置为 false
      })
      .catch(error => {
          console.error('Fetch error:', error);
          modal.querySelector('.modal-body').innerHTML = '<p>请求失败，请稍后再试。</p>';
          isLoading = false; // 即使加载失败也设置为 false
      });

  modalCount++; // 递增模态框计数器

  makeModalDraggable(modal);

  // **添加自动关闭逻辑**
  setTimeout(() => {
    closeModal(); 
  }, 60 * 10000); // 6分钟后自动关闭模态框
}


function makeModalDraggable(modal) {
  const header = modal.querySelector('.modal-header');
  const dialog = modal.querySelector('.modal-dialog');

  if (!header || !dialog) return;

  // Initial positions
  let isDragging = false;
  let startX, startY, initialLeft, initialTop;

  // Mouse down: start drag
  header.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      // Get current modal position
      const rect = dialog.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      // Prevent text selection during drag
      document.body.style.userSelect = 'none';
  });

  // Mouse move: handle drag
  document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      // Update dialog position
      dialog.style.position = 'fixed';
      // dialog.style.left = `${initialLeft + deltaX}px`;
      // dialog.style.top = `${initialTop + deltaY}px`;
      //限制模态框只能在屏幕内拖动，可以加入边界检查：
      dialog.style.left = `${Math.max(0, Math.min(window.innerWidth - dialog.offsetWidth, initialLeft + deltaX))}px`;
      dialog.style.top = `${Math.max(0, Math.min(window.innerHeight - dialog.offsetHeight, initialTop + deltaY))}px`;

  });

  // Mouse up: stop drag
  document.addEventListener('mouseup', () => {
      if (isDragging) {
          isDragging = false;
          document.body.style.userSelect = ''; // Restore text selection
      }
  });
}

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
