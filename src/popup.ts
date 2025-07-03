import './popup.css';

document.addEventListener('DOMContentLoaded', () => {
  const applyStyleBtn = document.getElementById('applyStyleBtn');

  if (applyStyleBtn) {
    applyStyleBtn.addEventListener('click', async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.id) {
          await chrome.tabs.sendMessage(tab.id, { action: "applyBoldStyle" });
          console.log("已发送 applyBoldStyle 指令到内容脚本。");
          window.close(); // 操作完成后自动关闭弹窗
        } else {
          console.error('无法获取活跃标签页。');
        }
      } catch (error) {
        console.error("发送消息时发生错误:", error);
      }
    });
  }
});
