// 確保腳本只執行一次，通常在內容腳本的頂層
console.log('內容腳本已載入並監聽訊息。');

chrome.runtime.onMessage.addListener(
    (message: any,
     sender: chrome.runtime.MessageSender,
     sendResponse: (response?: any) => void) => {
        console.log("收到訊息 (內容腳本):", message);
        console.log("來自:", sender);
    }
)