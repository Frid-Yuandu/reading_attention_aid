console.log('内容脚本已加载并监听消息。');

chrome.runtime.onMessage.addListener(
  (request: any, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void): boolean => {
    switch (request.action) {
      case "applyBoldStyle":
        applyBoldStyle(sendResponse);
        return true;
      default:
        console.warn(`未知的动作：${request.action}`);
        sendResponse({ success: false, error: `未知的动作：${request.action}` });
        return true; // 保持消息通道开启以异步发送响应
    }
  }
);

/**
 * 处理来自 background script 的 applyBoldStyle 指令。
 * 遍历页面中所有的 <p> 元素，对其应用首字母加粗样式。
 * @param sendResponse - 用于将操作结果（成功或失败）发送回 background script 的回调函数。
 */
function applyBoldStyle(sendResponse: (response?: any) => void) {
  try {
    console.log("收到 applyBoldStyle 指令，开始处理段落...");
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(p => {
      processNode(p);
    });
    console.log(`处理完成！共 ${paragraphs.length} 个段落。`);
    sendResponse({ success: true });
  } catch (error) {
    console.error("处理段落时发生错误:", error);
    if (error instanceof Error) {
      sendResponse({ success: false, error: error.message });
    } else {
      sendResponse({ success: false, error: "发生未知错误。" });
    }
  }
}

/**
 * 递归处理 DOM 节点，对文本节点中的单词首字母应用样式。
 * 此函数会智能地处理节点，避免破坏已存在的 HTML 结构（如链接、斜体等）。
 * @param node - 需要处理的 DOM 节点 (Node)。
 */
function processNode(node: Node) {
  // 先处理后递归，避免重复修改
  if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
    // 获取父元素，如果不存在则无法替换，直接返回
    const parent = node.parentNode;
    if (!parent) return;

    const fragment: DocumentFragment = boldingWords(node);
    // 使用创建好的文档片段替换原始的文本节点
    parent.replaceChild(fragment, node);
  }

  // 如果当前节点是元素节点（Element Node），并且不是我们自己创建的 <span>，
  // 则递归处理其所有子节点，以处理嵌套的 HTML 标签。
  if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName !== 'SPAN') {
    // 将子节点序列转为静态数组，避免遍历时变动
    Array.from(node.childNodes)
      .forEach(child => processNode(child));
  }
}

/**
 * 对单个文本节点内的所有单词应用加粗样式。创建一个文档片段（DocumentFragment）
 * 存储样式结果，高效地批量插入新节点，返回处理后的文档片段。
 * @param node 需要处理的文本节点。
 * @param percentage 每个单词中前百分之几的字符将会被设置为粗体，为0到1的浮点数。
 */
function boldingWords(node: Node, percentage: number = 0.25): DocumentFragment {
  const fragment = document.createDocumentFragment();

  // 对单个单词进行加粗处理，指定加粗长度。
  function boldingWordWithLength(word: string, bold_length: number): void {
    const span = document.createElement('span');
    span.className = 'reading-aid-bold'; // 应用加粗样式
    span.textContent = word.substring(0, bold_length)
    fragment.appendChild(span)

    if (bold_length < word.length) {
      const restOfWord = word.substring(bold_length)
      fragment.appendChild(document.createTextNode(restOfWord))
    }
  }

  if (node.textContent?.trim()) {
    // 使用正则表达式按空白符（\s+）分割文本，并使用括号保留分隔符（空白符）在结果数组中
    // 确保单词间的原始间距得以保留
    const words = node.textContent.split(/(\s+)/);

    words.forEach(word => {
      // 检查处理的是否为单词而不是空白符
      if (word.trim().length > 0) {
        // 检查单词是否包含 Emoji
        if (/\p{Emoji}/u.test(word)) {
          // 如果单词包含 Emoji，则不进行任何处理，直接添加整个单词
          fragment.appendChild(document.createTextNode(word));
        } else {
          // 否则，为单词应用加粗样式
          const finalBoldLength = calculateBoldLength(word);
          boldingWordWithLength(word, finalBoldLength);
        }
      } else {
        // 如果是空白符，直接作为文本节点添加到片段中
        fragment.appendChild(document.createTextNode(word));
      }
    });
  }
  return fragment;

  function calculateBoldLength(word: string) {
    const boldLength = Math.round(word.length * percentage);
    // 确保最少1个字符，最多全部
    const finalBoldLength = Math.max(1, Math.min(boldLength, word.length));
    return finalBoldLength;
  }
}
