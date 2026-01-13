// js/chatbox/chatbox-injector.js
document.addEventListener('DOMContentLoaded', () => {
    async function loadChatbox() {
        try {
            const response = await fetch('chatbox.html');
            if (!response.ok) throw new Error('Không thể tải file chatbox.html');
            const htmlContent = await response.text();
            document.body.insertAdjacentHTML('beforeend', htmlContent);

            // Các thư viện bổ trợ
            const externalLibs = [
                'https://cdn.jsdelivr.net/npm/fuse.js@6.6.2', // Tìm kiếm mờ
                'https://cdn.jsdelivr.net/npm/marked/marked.min.js', // Render Markdown
                'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js' // Pháo hoa
            ];

            // Nạp thư viện ngoài trước
            for (const lib of externalLibs) {
                await new Promise(r => {
                    const s = document.createElement('script'); s.src = lib; s.onload = r;
                    document.head.appendChild(s);
                });
            }

            // Nạp logic nội bộ
            const scripts = [
                'js/chatbox/chatbox-data.js',
                'js/chatbox/chatbox-logic.js'
            ];

            for (const src of scripts) {
                await new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.src = src; script.async = false;
                    script.onload = resolve;
                    document.body.appendChild(script);
                });
            }
        } catch (error) {
            console.error('Lỗi khởi tạo Chatbox:', error);
        }
    }
    loadChatbox();
});