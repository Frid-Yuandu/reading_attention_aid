import './popup.css';

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('myButton') as HTMLButtonElement;
    const messageDiv = document.getElementById('message') as HTMLDivElement;

    if (button) {
        button.addEventListener('click', () => {
            messageDiv.textContent = '按鈕被點擊了！';
            chrome.storage.local.set({ lastClicked: new Date().toLocaleString() });

            // 發送訊息給背景腳本
            chrome.runtime.sendMessage({ greeting: "來自彈窗的問候" }, (response) => {
                console.log("背景腳本的回覆:", response);
            });
        });
    }
});