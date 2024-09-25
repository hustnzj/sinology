document.addEventListener("DOMContentLoaded", function () {
  function generateTOC(toc_ul) {
    /**
     * 功能：根据当前页面的HTML结构生成 toc 目录
     * 用法：
     * 首次开发时间：2024-08-25 14:23:04
     * 最新更改时间：
     * 备注：
     */

    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

    headings.forEach((heading, index) => {
      const text = heading.textContent.trim();
      const safeText = text
        .replace(/[^\w\s-]/g, "") //删除除了字母、数字、下划线、空白字符（包括空格、制表符、换页符等）、中划线外的所有字符
        .replace(/\s+/g, "-") //将所有空白字符替换为`-`
        .toLowerCase();
      const id = `heading-${safeText}-${index}`;
      heading.id = id;

      const li = document.createElement("li");
      li.style.display = heading.tagName === "H1" ? "flex" : "none";
      li.style.alignItems = "center";
      li.style.marginLeft = getMarginLeft(heading.tagName);

      const a = document.createElement("a");
      a.href = `#${id}`;
      a.textContent = processText(text);
      a.dataset.level = heading.tagName;

      const nextLevelHeadingTagName = `H${
        parseInt(heading.tagName.replace("H", "")) + 1
      }`;

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
            showNextLevelHeadings(heading, nextLevelHeadingTagName, toc_ul);
          } else {
            hideAllSubHeadings(heading, nextLevelHeadingTagName, toc_ul);
          }
          this.textContent = this.isOpen ? "⬇️" : "➡️";
        });
      }
      li.appendChild(toggle);
      li.appendChild(a);
      toc_ul.appendChild(li);
    });
  }

  function getMarginLeft(tagName) {
    /**
     * 功能：设置各级 li 容器 的初始 marginLeft 值
     * 用法：
     * 首次开发时间：2024-08-25 14:58:17
     * 最新更改时间：
     * 备注：
     */
    switch (tagName) {
      case "H2":
        return "1rem";
      case "H3":
        return "2rem";
      case "H4":
        return "3rem";
      case "H5":
        return "4rem";
      case "H6":
        return "5rem";
      default:
        return "0";
    }
  }

  function processText(text) {
    /**
     * 功能：根据不同页面的类型，处理toc标题的文本
     * 用法：
     * 首次开发时间：2024-08-25 14:29:59
     * 最新更改时间：
     * 备注：
     */
    var isPoetryPage = window.isPoetryPage || false; // 使用全局变量
    if (isPoetryPage) {
      return text
        .replace(/\d+/g, "") // 删除数字
        .replace(/[a-zA-Zāáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜü\s]+/g, ""); //删除拼音
    } else {
      return text;
    }
  }

  function hasNextLevelHeading(heading, nextLevelHeadingTagName) {
    /**
     * 功能：判断是否有下一层标题
     * 用法：
     * 首次开发时间：2024
     * 最新更改时间：
     * 备注：
     */
    let sibling = heading.nextElementSibling;
    while (sibling && sibling.tagName !== heading.tagName) {
      if (sibling.tagName === nextLevelHeadingTagName) {
        return true;
      }
      sibling = sibling.nextElementSibling;
    }
    return false;
  }

  function showNextLevelHeadings(heading, nextLevelHeadingTagName, toc_ul) {
    /**
     * 功能：显示下一层标题
     * 用法：
     * 首次开发时间：2024
     * 最新更改时间：
     * 备注：
     */
    let sibling = heading.nextElementSibling;
    while (sibling && sibling.tagName !== heading.tagName) {
      if (sibling.tagName === nextLevelHeadingTagName) {
        const siblingLi = toc_ul.querySelector(
          `a[href="#${sibling.id}"]`
        ).parentElement;
        siblingLi.style.display = "flex";
      }
      sibling = sibling.nextElementSibling;
    }
  }

  function hideAllSubHeadings(heading, nextLevelHeadingTagName, toc_ul) {
    /**
     * 功能：隐藏所有子标题
     * 用法：
     * 首次开发时间：2024
     * 最新更改时间：
     * 备注：
     */
    let sibling = heading.nextElementSibling;
    while (sibling && sibling.tagName !== heading.tagName) {
      if (sibling.tagName === nextLevelHeadingTagName) {
        const siblingLi = toc_ul.querySelector(
          `a[href="#${sibling.id}"]`
        ).parentElement;
        siblingLi.style.display = "none";
        const siblingToggle = siblingLi.querySelector("span");
        if (siblingToggle && siblingToggle.textContent === "⬇️") {
          siblingToggle.textContent = "➡️";
          siblingToggle.isOpen = false;
          hideAllSubHeadings(
            sibling,
            `H${parseInt(nextLevelHeadingTagName.replace("H", "")) + 1}`,
            toc_ul
          );
        }
      }
      sibling = sibling.nextElementSibling;
    }
  }

  generateTOC(document.querySelector("#toc ul"));

  // 监听所有 TOC 超链接的点击事件
  const OFFSET = 142; // 需要调整的位置偏移量
  document
    .querySelectorAll("#toc a, .reversefootnote, .footnote")
    .forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - OFFSET,
            behavior: "smooth",
          });
        }
      });
    });

  // 侧边目录栏切换收起与展开
  const toc = document.getElementById("toc");
  const toggleIcon = document.getElementById("toggle-icon");

  // 初始化 Popover
  const popover = new bootstrap.Popover(toggleIcon, {
    content: `<div class="popover-content">${toc.innerHTML}</div>`,
    html: true,
    trigger: "manual",
    container: "body",
  });

  // 更新 Popover 内容
  function updatePopoverContent() {
    const popoverContent = document.querySelector(".popover-content");
    if (popoverContent) {
      generateTOC(popoverContent.querySelector("ul"));
    }
  }

  toc.classList.toggle("hidden"); // 切换隐藏和显示的状态

  // 切换侧边目录显示状态
  toggleIcon.addEventListener("click", function () {
    toc.classList.toggle("hidden"); // 切换隐藏和显示的状态
  });

  // 显示 Popover
  toggleIcon.addEventListener("mouseover", function () {
    if (toc.classList.contains("hidden")) {
      // 只在目录隐藏时显示 Popover
      updatePopoverContent();
      popover.show();
    }
  });

  // 防止鼠标移出 #toggle-icon 时 Popover 消失
  toggleIcon.addEventListener("mouseout", function (e) {
    const popoverElement = document.querySelector(".popover");
    if (popoverElement && !popoverElement.contains(e.relatedTarget)) {
      // 只有当鼠标不在 Popover 上时才隐藏
      document.addEventListener("click", function (event) {
        if (
          !popoverElement.contains(event.target) &&
          !toggleIcon.contains(event.target)
        ) {
          popover.hide();
        }
      });
    }
  });

});
