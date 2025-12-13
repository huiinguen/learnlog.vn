// js/chatbox-logic.js

document.addEventListener('DOMContentLoaded', () => {
    // Đảm bảo chatBotKnowledge và defaultResponses đã được load từ chatbox-data.js
    if (typeof chatBotKnowledge === 'undefined') {
        console.error('Lỗi: Không tìm thấy dữ liệu chatBotKnowledge.');
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
    const suggestionsContainer = document.getElementById('chatboxSuggestions'); // Bổ sung

    // === BỔ SUNG: Danh sách Gợi ý ===
    const initialSuggestions = [ // Bổ sung
        "Hỏi về Chứng chỉ", 
        "Tìm Sản phẩm", 
        "Tra Ghi chú code", 
        "Liên hệ hỗ trợ"
    ];

    // === 2. Giao diện & Trạng thái ===
    let isChatOpen = false;

    // Ẩn badge tin nhắn mới khi mở lần đầu
    if (badge) badge.style.display = 'block';

    toggleBtn.addEventListener('click', () => {
        isChatOpen = !isChatOpen;
        chatWindow.style.display = isChatOpen ? 'flex' : 'none';
        if (isChatOpen) {
            if (badge) badge.style.display = 'none';
            scrollToBottom();
            inputField.focus();
            renderSuggestions(initialSuggestions); // Bổ sung
        } else {
            suggestionsContainer.innerHTML = ''; // Bổ sung
        }
    });

    closeBtn.addEventListener('click', () => {
        isChatOpen = false;
        chatWindow.style.display = 'none';
        suggestionsContainer.innerHTML = ''; // Bổ sung
    });

    // === BỔ SUNG: Logic cho Gợi ý (Giữ nguyên) ===
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
            let botResponse;
            
            // Ánh xạ gợi ý thành từ khóa tìm kiếm chính xác
            if (keyword.includes("Chứng chỉ")) {
                botResponse = getBotResponse("chứng chỉ gameshow");
            } else if (keyword.includes("Sản phẩm")) {
                botResponse = getBotResponse("tìm sản phẩm");
            } else if (keyword.includes("Ghi chú code")) {
                botResponse = getBotResponse("tra mẹo ghi chú");
            } else if (keyword.includes("Liên hệ")) {
                botResponse = getBotResponse("liên hệ hotline");
            } else {
                botResponse = getBotResponse(keyword); // Fallback
            }
            
            appendMessage(botResponse, 'bot-message', true);
            scrollToBottom();
            
            suggestionsContainer.classList.add('hidden');
        }, 800);
    }
    
    // === 3. Xử lý tin nhắn ===
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
        
        suggestionsContainer.classList.add('hidden'); // Bổ sung

        setTimeout(() => {
            const botResponse = getBotResponse(text);
            appendMessage(botResponse, 'bot-message', true);
            scrollToBottom();
        }, 800);
    }

    // Hàm thêm tin nhắn (Giữ nguyên)
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

    // === 4. Logic Bot (Rule-based) ĐÃ TỐI ƯU ===
    function getBotResponse(userInput) {
        const inputLower = userInput.toLowerCase();
        let bestMatch = null;
        let longestKeywordLength = 0; // Để ưu tiên khớp cụm từ dài nhất

        // 1. Tìm kiếm và ưu tiên từ khóa:
        for (const item of chatBotKnowledge) {
            for (const keyword of item.keywords) {
                const keywordLower = keyword.toLowerCase();

                // Kiểm tra nếu input chứa từ khóa và từ khóa này là dài nhất tìm được
                if (inputLower.includes(keywordLower) && keywordLower.length > longestKeywordLength) {
                    
                    // Cập nhật kết quả khớp tốt nhất
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