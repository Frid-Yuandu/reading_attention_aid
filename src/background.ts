// import { someHelperFunction } from "./utils"; // 假設你有一個 utils.ts

console.log("外掛背景 Service Worker (Vite TS) 已啟動");

chrome.runtime.onInstalled.addListener(() => {
    console.log("外掛已安裝或更新 (Vite TS)。");
    console.log("进入引导设置流程 (Vite TS)...");
    // someHelperFunction(); // 使用匯入的函式
});

// ... (其他 background.ts 內容)
chrome.runtime.onMessage.addListener(
    (request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
        console.log("收到訊息 (Vite TS):", request.greeting);
        if (request.greeting === "來自彈窗的問候") {
            sendResponse({farewell: "背景腳本收到訊息了 (Vite TS)！"});
        }
        return true;
    }
);

chrome.action.onClicked.addListener(async (): Promise<void> => {
    try {
        // 1. 请求获取当前活跃标签页ID
        // 1. request the current active tab ID
        const activeTab: chrome.tabs.Tab = await queryActiveTab()

        // 2. 告知内容脚本执行开始读取网页内容
        // 2. inform the content script to start reading the webpage content
        if (typeof activeTab.id !== "number") {
            console.error('無法獲取活躍標籤頁 ID，或 ID 為 undefined。');
            return; // 如果 ID 不存在，就直接返回，不執行後續操作
        }
        const resp: any = await sendMessageToContentScript(activeTab.id, {action: "startReading"});

        // 3. 处理文本
        // 3. process the text

        // 4. 将处理结果发送回内容脚本
        // 4. send the processed result back to the content script
    } catch (error) {
        console.error("處理點擊事件時發生錯誤:", error);
    }
})

function queryActiveTab(): Promise<chrome.tabs.Tab> {
    return new Promise((resolve: (value: (PromiseLike<chrome.tabs.Tab> | chrome.tabs.Tab)) => void,
                        reject: (reason?: any) => void) => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs: chrome.tabs.Tab[]): void => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            }
            if (tabs?.length > 0) {
                resolve(tabs[0]);
            } else {
                reject(new Error("沒有找到活躍的標籤頁"));
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