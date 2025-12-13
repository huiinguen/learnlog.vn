// js/chatbox-logic.js

document.addEventListener('DOMContentLoaded', () => {
    // Đảm bảo chatBotKnowledge và defaultResponses đã được load từ chatbox-data.js
    if (typeof chatBotKnowledge === 'undefined' || typeof defaultResponses === 'undefined') {
        console.error('Lỗi: Không tìm thấy dữ liệu chatBotKnowledge hoặc defaultResponses. Kiểm tra chatbox-data.js.');
        return;
    }

    // === 1. DOM Elements ===
    const toggleBtn = document.getElementById('chatboxToggle');
    const closeBtn = document.getElementById('chatboxClose');
    const chatWindow = document.getElementById('chatboxWindow');
    const messagesContainer = document.getElementById('chatboxMessages');
    const inputField = document.getElementById('chatboxInput');
    const sendBtn = document.getElementById('chatboxSend');
    const badge = document.getElementById('chatboxBadge');
    const suggestionsContainer = document.getElementById('chatboxSuggestions'); 
    
    // ĐÃ XÓA: Khai báo File Elements (fileInput, fileTriggerBtn)


    // === 2. Giao diện & Trạng thái ===
    let isChatOpen = false;

    // Bắt đầu ẩn badge, hiện lại nếu có tin nhắn mới (mặc định cho lần load đầu là 1)
    if (badge) badge.style.display = 'block';

    toggleBtn.addEventListener('click', () => {
        isChatOpen = !isChatOpen;
        chatWindow.style.display = isChatOpen ? 'flex' : 'none';
        if (isChatOpen) {
            if (badge) badge.style.display = 'none';
            scrollToBottom();
            inputField.focus();
            // Đảm bảo initialSuggestions đã được khai báo hoặc lấy từ data
            const initialSuggestions = ["Tài liệu", "Tìm Sản phẩm", "Time", "Liên hệ"]; 
            renderSuggestions(initialSuggestions); 
        } else {
            suggestionsContainer.innerHTML = ''; 
        }
    });

    closeBtn.addEventListener('click', () => {
        isChatOpen = false;
        chatWindow.style.display = 'none';
        suggestionsContainer.innerHTML = ''; 
    });
    
    // === 3. Xử lý Gợi ý (Suggestions) ===

    function renderSuggestions(suggestions) {
        suggestionsContainer.innerHTML = '';
        if (suggestions && suggestions.length > 0) {
            suggestions.forEach(text => {
                const chip = document.createElement('div');
                chip.className = 'suggestion-chip';
                chip.textContent = text;
                chip.dataset.keyword = text;
                
                chip.addEventListener('click', handleSuggestionClick);
                suggestionsContainer.appendChild(chip);
            });
            // Giả định .chatbox-suggestions.hidden sẽ display: none
            suggestionsContainer.classList.remove('hidden'); 
        } else {
            suggestionsContainer.classList.add('hidden');
        }
    }

    function handleSuggestionClick(event) {
        const keyword = event.target.dataset.keyword;
        
        appendMessage(keyword, 'user-message', false);
        scrollToBottom();
        
        setTimeout(() => {
            // Sử dụng logic Bot cho cả Suggestion
            let botResponse = getBotResponse(keyword); 
            
            // Xử lý các chức năng đặc biệt ngay sau khi có phản hồi
            botResponse = handleSpecialFunctions(botResponse); 

            appendMessage(botResponse, 'bot-message', true);
            scrollToBottom();
            
            suggestionsContainer.classList.add('hidden');
        }, 800);
    }


    // === 4. Xử lý Tệp tin (ĐÃ XÓA TOÀN BỘ LOGIC FILE UPLOAD) ===
    
    // === 5. Xử lý Tin nhắn Người dùng (Text Message Logic) ===
    
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });
    sendBtn.addEventListener('click', sendMessage);

    function sendMessage() {
        const text = inputField.value.trim();
        if (text === "") return;

        appendMessage(text, 'user-message', false);
        inputField.value = '';
        scrollToBottom();
        
        suggestionsContainer.classList.add('hidden'); 

        setTimeout(() => {
            let botResponse = getBotResponse(text);
            
            // Xử lý các chức năng đặc biệt (Time, Report)
            botResponse = handleSpecialFunctions(botResponse); 
            
            appendMessage(botResponse, 'bot-message', true);
            scrollToBottom();
        }, 800);
    }

    
    // === 6. Các Hàm Tiện ích & Xử lý Đặc biệt ===

    // Hàm thêm tin nhắn
    function appendMessage(text, type, useHtml = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        if (useHtml) {
            messageDiv.innerHTML = `<p>${text}</p>`;
        } else {
            const p = document.createElement('p');
            p.textContent = text;
            messageDiv.appendChild(p);
        }
        
        messagesContainer.appendChild(messageDiv);
    }

    function scrollToBottom() {
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    // Xử lý chức năng đặc biệt (Time, Report)
    function handleSpecialFunctions(response) {
        let result = response;

        // Xử lý [CURRENT_TIME]
        if (result.includes("[CURRENT_TIME]")) {
            const timeString = getCurrentTimeFormatted();
            result = result.replace("[CURRENT_TIME]", timeString);
        }
        
        // Xử lý [report]
        if (result.includes("[report]")) {
            // Vui lòng thay thế bằng LINK FORM Báo cáo Lỗi thực tế của bạn
            const reportLink = 'https://docs.google.com/forms/d/e/...'; 
            const reportText = `Vui lòng báo cáo lỗi tại đây: <a href="${reportLink}" target="_blank" style="color: #03dac6; font-weight: bold;">Mẫu Báo cáo Lỗi</a>.`;
            result = result.replace("[report]", reportText);
        }

        return result;
    }

    // Hàm lấy và định dạng thời gian thực
    function getCurrentTimeFormatted() {
        const now = new Date();
        
        // Lấy Ngày/Tháng/Năm
        const date = now.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        // Lấy Giờ/Phút/Giây
        const time = now.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false 
        });
        
        // Lấy Thứ trong tuần
        const dayOfWeek = now.toLocaleDateString('vi-VN', { weekday: 'long' });

        return `${time} - ${date} (${dayOfWeek}).`;
    }


    // === 7. Logic Bot (Rule-based) ===
    function getBotResponse(userInput) {
        const inputLower = userInput.toLowerCase();
        let bestMatch = null;
        let longestKeywordLength = 0; 

        // 1. Tìm kiếm và ưu tiên từ khóa:
        for (const item of chatBotKnowledge) {
            for (const keyword of item.keywords) {
                const keywordLower = keyword.toLowerCase();

                if (inputLower.includes(keywordLower) && keywordLower.length > longestKeywordLength) {
                    
                    longestKeywordLength = keywordLower.length;
                    bestMatch = item;
                }
            }
        }
        
        // 2. Trả về phản hồi tốt nhất hoặc phản hồi mặc định
        if (bestMatch) {
            return bestMatch.response; 
        }

        // 3. Phản hồi mặc định nếu không tìm thấy
        const randomIndex = Math.floor(Math.random() * defaultResponses.length);
        return defaultResponses[randomIndex];
    }
});