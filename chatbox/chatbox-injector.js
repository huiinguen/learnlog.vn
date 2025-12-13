// js/chatbox-injector.js

document.addEventListener('DOMContentLoaded', () => {
    // Nội dung HTML của Chat Box
    const chatboxHtmlContent = `
        <div id="chatboxContainer" class="chatbox-container">
            <button id="chatboxToggle" class="chatbox-toggle">
                <i class="fas fa-comment-dots"></i>
                <span class="chatbox-badge" id="chatboxBadge">1</span>
            </button>

            <div id="chatboxWindow" class="chatbox-window" style="display: none;">
                <div class="chatbox-header">
                    <h4>HVCoder Support Bot</h4>
                    <i class="fas fa-times close-btn" id="chatboxClose"></i>
                </div>
                <div class="chatbox-messages" id="chatboxMessages">
                    <div class="message bot-message">
                        <p>Chào bạn! Tôi có thể giúp gì cho bạn về các chứng chỉ, sản phẩm, hay ghi chú code?</p>
                    </div>
                </div>
                <div class="chatbox-input-area">
                    <input type="text" id="chatboxInput" placeholder="Nhập câu hỏi...">
                    <button id="chatboxSend"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    `;

    // Nhúng Chat Box vào cuối body
    document.body.insertAdjacentHTML('beforeend', chatboxHtmlContent);

    // Dynamic import (chỉ sau khi HTML đã được thêm vào DOM)
    // Tự động nhúng file CSS và Logic
    
    // Nhúng CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/chatbox.css'; 
    document.head.appendChild(link);
    
    // Nhúng Data và Logic JS (Cần đảm bảo thứ tự load)
    const dataScript = document.createElement('script');
    dataScript.src = 'js/chatbox-data.js'; 
    dataScript.onload = () => {
        const logicScript = document.createElement('script');
        logicScript.src = 'js/chatbox-logic.js'; 
        document.body.appendChild(logicScript);
    };
    document.body.appendChild(dataScript);
});