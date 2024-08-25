document.addEventListener("DOMContentLoaded", function () {
  // 页面上的 toc 目录
  const toc_ul = document.querySelector("#toc ul");
  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

  headings.forEach((heading, index) => {
    const text = heading.textContent.trim();
    // \w 表示匹配字母、数字、下划线，相当于 [A-Za-z0-9_] 。
    // \s 表示匹配任何空白字符，包括空格、制表符、换页符等，相当于 [ \f\n\r\t\v] 。
    const safeText = text.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase();
    const id = `heading-${safeText}-${index}`;
    heading.id = id;

    const li = document.createElement("li");
    // 设置各级 li 容器 的初始值
    li.style.display = heading.tagName === "H1" ? "flex" : "none";
    li.style.alignItems = "center";
    li.style.marginLeft = heading.tagName === "H2" ? "1rem" : "0";
    li.style.marginLeft = heading.tagName === "H3" ? "2rem" : li.style.marginLeft;
    li.style.marginLeft = heading.tagName === "H4" ? "3rem" : li.style.marginLeft;
    li.style.marginLeft = heading.tagName === "H5" ? "4rem" : li.style.marginLeft;
    li.style.marginLeft = heading.tagName === "H6" ? "5rem" : li.style.marginLeft;

    const a = document.createElement("a");
    a.href = `#${id}`;
    // 删除标题中的数字和拼音（但不包括非拼音的英文字母）
    if (isPoetryPage) {
      a.textContent = text.replace(/\d+/g, '').replace(/[a-zA-Zāáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜü\s]+/g, '');
    }
    else {
      a.textContent = text
    }
    a.dataset.level = heading.tagName;

    const nextLevelHeadingTagName = `H${parseInt(heading.tagName.replace('H', '')) + 1}`;

    const toggle = document.createElement("span");
    toggle.style.width = "2rem";

    if (hasNextLevelHeading(heading, nextLevelHeadingTagName)) {
      toggle.textContent = "➡️";
      toggle.style.cursor = "pointer";

      toggle.isOpen = false;

      toggle.addEventListener("mouseover", function () {
        if (this.textContent.trim() === "➡️") {
          this.textContent = "⬇️";
        }
      });

      toggle.addEventListener("mouseout", function () {
        if (this.textContent.trim() === "⬇️" && !this.isOpen) {
          this.textContent = "➡️";
        }
      });

      toggle.addEventListener("click", function () {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
          showNextLevelHeadings(heading, nextLevelHeadingTagName);
        } else {
          hideAllSubHeadings(heading, nextLevelHeadingTagName);
        }
        this.textContent = this.isOpen ? "⬇️" : "➡️";
      });

    }
    li.appendChild(toggle);
    li.appendChild(a);
    toc_ul.appendChild(li);
  });

  function hasNextLevelHeading(heading, nextLevelHeadingTagName) {
    let sibling = heading.nextElementSibling;
    while (sibling && sibling.tagName !== heading.tagName) {
      if (sibling.tagName === nextLevelHeadingTagName) {
        return true;
      }
      sibling = sibling.nextElementSibling;
    }
    return false;
  }

  function showNextLevelHeadings(heading, nextLevelHeadingTagName) {
    let sibling = heading.nextElementSibling;
    while (sibling && sibling.tagName !== heading.tagName) {
      if (sibling.tagName === nextLevelHeadingTagName) {
        const siblingLi = toc_ul.querySelector(`a[href="#${sibling.id}"]`).parentElement;
        siblingLi.style.display = "flex";
      }
      sibling = sibling.nextElementSibling;
    }
  }

  function hideAllSubHeadings(heading, nextLevelHeadingTagName) {
    let sibling = heading.nextElementSibling;
    while (sibling && sibling.tagName !== heading.tagName) {
      if (sibling.tagName === nextLevelHeadingTagName) {
        const siblingLi = toc_ul.querySelector(`a[href="#${sibling.id}"]`).parentElement;
        siblingLi.style.display = "none";
        const siblingToggle = siblingLi.querySelector("span");
        if (siblingToggle && siblingToggle.textContent === "⬇️") {
          siblingToggle.textContent = "➡️";
          siblingToggle.isOpen = false;
          hideAllSubHeadings(sibling, `H${parseInt(nextLevelHeadingTagName.replace('H', '')) + 1}`);
        }
      }
      sibling = sibling.nextElementSibling;
    }
  }

  // 监听所有 TOC 超链接的点击事件
  const OFFSET = 142; // 需要调整的位置偏移量
  document.querySelectorAll('#toc a, .reversefootnote, .footnote').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - OFFSET,
          behavior: 'smooth'
        });
      }
    });
  });

   // 侧边目录栏切换收起与展开
   const toc = document.getElementById('toc');
   const toggleIcon = document.getElementById('toggle-icon');

   // 初始化 Popover
   const popover = new bootstrap.Popover(toggleIcon, {
     content: toc.innerHTML,
     html: true,
     trigger: 'manual',
     container: 'body'
   });

   // 更新 Popover 内容
   function updatePopoverContent() {
     popover.setContent({ '.popover-body': toc.innerHTML });
   }

   // 切换侧边目录显示状态
   toggleIcon.addEventListener('click', function () {
     if (toc.classList.contains('hidden')) {
       // 显示 Popover
       updatePopoverContent();
       popover.show();
     } else {
       // 隐藏 Popover
       popover.hide();
     }
     toc.classList.toggle('hidden'); // 切换隐藏和显示的状态
   });

   // 显示 Popover
   toggleIcon.addEventListener('mouseover', function () {
     if (toc.classList.contains('hidden')) {
       // 只在目录隐藏时显示 Popover
       updatePopoverContent();
       popover.show();
     }
   });

   // 隐藏 Popover
   function hidePopover() {
     popover.hide();
   }

   toggleIcon.addEventListener('mouseout', function (e) {
     if (!e.relatedTarget || !toggleIcon.contains(e.relatedTarget) && !document.querySelector('.popover').contains(e.relatedTarget)) {
       hidePopover();
     }
   });

   document.addEventListener('mouseout', function (e) {
     const popoverElement = document.querySelector('.popover');
     if (popoverElement && !popoverElement.contains(e.relatedTarget) && !toggleIcon.contains(e.relatedTarget)) {
       hidePopover();
     }
   });
  
})