// import { someHelperFunction } from "./utils"; // 假設你有一個 utils.ts

console.log("外掛背景 Service Worker (Vite TS) 已啟動");

chrome.runtime.onInstalled.addListener(() => {
  console.log("插件已安裝或更新 (Vite TS)。");
  console.log("进入引导设置流程 (Vite TS)...");
  // someHelperFunction(); // 使用匯入的函式
});

chrome.action.onClicked.addListener(async (): Promise<void> => {
  try {
    // 1. 请求获取当前活跃标签页ID
    // 1. request the current active tab ID
    const activeTab: chrome.tabs.Tab = await queryActiveTab()

    // 2. 告知内容脚本执行加粗操作
    // 2. inform the content script to apply the bold style
    if (typeof activeTab.id !== "number") {
      console.error('无法获取活跃标签页 ID，或 ID 为 undefined。');
      return; // 如果 ID 不存在，就直接返回，不執行後續操作
    }
    await sendMessageToContentScript(activeTab.id, { action: "applyBoldStyle" });
    console.log("已发送 applyBoldStyle 指令到内容脚本。");
  } catch (error) {
    console.error("处理点击事件时发生错误:", error);
  }
})

function queryActiveTab(): Promise<chrome.tabs.Tab> {
  return new Promise((resolve: (value: (PromiseLike<chrome.tabs.Tab> | chrome.tabs.Tab)) => void,
    reject: (reason?: any) => void) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]): void => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      }
      if (tabs?.length > 0) {
        resolve(tabs[0]);
      } else {
        reject(new Error("没有找到活跃的标签页。"));
      }
    });
  });
}

function sendMessageToContentScript(tabId: number, message: any): Promise<any> {
  return new Promise((resolve: (value: any) => void, reject: (reason?: any) => void): void => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError && chrome.runtime.lastError.message !== "The message port closed before a response was received.") {
        reject(chrome.runtime.lastError);
      }
      resolve(response);
    });
  });
}
