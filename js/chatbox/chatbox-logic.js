// js/chatbox/chatbox-logic.js

(function () {
  try {
    if (typeof chatBotKnowledge === "undefined") return;

    // --- 1. KHỞI TẠO BIẾN & CẤU HÌNH ---
    const chatWindow = document.getElementById("chatboxWindow");
    const messagesContainer = document.getElementById("chatboxMessages");
    const inputField = document.getElementById("chatboxInput");
    const sendBtn = document.getElementById("chatboxSend");
    const suggestionsContainer = document.getElementById("chatboxSuggestions");
    const toggleBtn = document.getElementById("chatboxToggle");

    let lastTopic = null; // Ghi nhớ chủ đề để xử lý "nó", "đó"
    const stopWords = ["là", "gì", "cách", "làm", "sao", "cho", "mình", "hỏi", "tôi", "muốn", "với", "nhé", "đi", "được", "không", "tại"];
    
    // Mặc định nếu không tìm thấy gì (Dùng từ bản cũ)
    const defaultResponses = [
        "Câu này khó quá, Bro thử hỏi kiểu khác hoặc gõ `/help` xem sao.",
        "Tôi chưa học câu này, nhưng tôi có thể giúp bạn thi chứng chỉ! 🚀",
        "Bro nói gì tôi chưa hiểu lắm, nhưng Admin @Huiibaby chắc chắn biết đấy! 😎"
    ];

    // Khởi tạo Fuse.js (Đề xuất 1: Tìm kiếm mờ)
    const fuse = new Fuse(chatBotKnowledge, {
      keys: ['keywords'],
      threshold: 0.4,
      includeScore: true
    });

    // Cấu hình Marked.js (Đề xuất 2: Markdown)
    marked.setOptions({ breaks: true, gfm: true });

    // --- 2. CÁC HÀM XỬ LÝ LOGIC "KHÔN" (TỪ BẢN CŨ) ---

    // Tiền xử lý văn bản (Bản cũ)
    function cleanInput(text) {
      return text.toLowerCase().replace(/[?.!,]/g, "").split(/\s+/)
        .filter((word) => !stopWords.includes(word)).join(" ");
    }

    // Tìm kiếm nội dung trên trang (Bản cũ - Ý tưởng 4)
    function searchOnPage(query) {
      const queryLower = query.toLowerCase();
      const elements = Array.from(document.querySelectorAll("h1, h2, h3, .sidebar-link, .cta-button"));
      const match = elements.find((el) => {
        const text = el.innerText.toLowerCase();
        return text.length > 3 && text.includes(queryLower);
      });

      if (match) {
        let locationName = match.innerText.trim();
        return { response: `Tôi thấy có nội dung **"${locationName}"** ngay trên trang này. Bro thử ngó qua xem đúng ý chưa nhé! 👀` };
      }
      return null;
    }

    // --- 3. LỆNH SLASH & PHÁO HOA (ĐỀ XUẤT 3) ---
    const slashCommands = {
        '/help': () => "Các lệnh: <br> `/clear`: Xóa chat <br> `/score`: Điểm thi <br> `/confetti`: Pháo hoa",
        '/clear': () => { messagesContainer.innerHTML = ''; return "Đã dọn dẹp cửa sổ chat! ✨"; },
        '/score': () => `Điểm thi gần nhất: **${localStorage.getItem('lastExamScore') || "Chưa có dữ liệu"}**`,
        '/confetti': () => { confetti({ particleCount: 150, spread: 70 }); return "Bùm! 🎉"; }
    };

    // --- 4. TRÁI TIM CỦA BOT: GET BEST RESPONSE (KẾT HỢP TẤT CẢ) ---
    function getBestResponse(userInput) {
      const cleaned = cleanInput(userInput);

      // Ưu tiên 0: Lệnh Slash
      if (userInput.startsWith('/')) {
        const cmd = userInput.split(' ')[0];
        return { response: slashCommands[cmd] ? slashCommands[cmd]() : "Lệnh không tồn tại." };
      }

      // Ưu tiên 1: Kiểm tra ngữ cảnh "nó", "đó" (Bản cũ)
      const contextWords = ["nó", "đó", "kia", "đấy", "thế nào"];
      if (contextWords.some((w) => userInput.includes(w)) && lastTopic) {
        const topicItem = chatBotKnowledge.find(i => i.keywords.includes(lastTopic));
        return {
          response: `Bro đang hỏi thêm về **${lastTopic}** đúng không? <br>` + (topicItem ? topicItem.response : "Tôi chưa rõ ý này.")
        };
      }

      // Ưu tiên 2: Tìm kiếm mờ thông minh (Fuse.js)
      const fuseResults = fuse.search(cleaned);
      if (fuseResults.length > 0) {
        const best = fuseResults[0].item;
        lastTopic = best.keywords[0]; // Ghi nhớ chủ đề
        return best;
      }

      // Ưu tiên 3: Tìm kiếm trực tiếp trên trang (Bản cũ)
      const pageResult = searchOnPage(cleaned);
      if (pageResult) return pageResult;

      // Cuối cùng: Phản hồi mặc định (Bản cũ)
      return { response: defaultResponses[Math.floor(Math.random() * defaultResponses.length)] };
    }

    // --- 5. GIAO DIỆN & HIỆU ỨNG ---

    function renderMessageUI(text, type) {
      const wrapper = document.createElement("div");
      wrapper.className = `message-wrapper ${type === "bot-message" ? "bot-wrapper" : "user-wrapper"}`;
      
      // Sử dụng Marked.js để render Markdown nếu là tin nhắn từ Bot
      const finalHtml = type === "bot-message" ? marked.parse(text) : text;
      
      wrapper.innerHTML = `<div class="message ${type}">${finalHtml}</div>`;
      messagesContainer.appendChild(wrapper);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTyping() {
      const typingDiv = document.createElement("div");
      typingDiv.className = "message-wrapper bot-wrapper typing-indicator";
      typingDiv.id = "typingIndicator";
      typingDiv.innerHTML = `<div class="message bot-message"><span></span><span></span><span></span></div>`;
      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function hideTyping() {
      const indicator = document.getElementById("typingIndicator");
      if (indicator) indicator.remove();
    }

    function renderSuggestions(customChips = null) {
      const path = window.location.pathname;
      let chips = customChips || (path.includes("index.html") ? ["Cách thi", "C++", "Python", "Báo lỗi"] : ["Chứng chỉ", "Admin"]);

      suggestionsContainer.innerHTML = "";
      chips.forEach((txt) => {
        const chip = document.createElement("div");
        chip.className = "suggestion-chip";
        chip.textContent = txt;
        chip.onclick = () => { inputField.value = txt; sendMessage(); };
        suggestionsContainer.appendChild(chip);
      });
      suggestionsContainer.classList.remove("hidden");
    }

    function sendMessage() {
      const text = inputField.value.trim();
      if (!text) return;

      renderMessageUI(text, "user-message");
      inputField.value = "";
      suggestionsContainer.classList.add("hidden");

      showTyping();

      setTimeout(() => {
        hideTyping();
        const res = getBestResponse(text);
        
        // Xử lý biến thời gian (Bản cũ)
        let responseText = res.response;
        if (responseText.includes("[CURRENT_TIME]")) {
            responseText = responseText.replace("[CURRENT_TIME]", new Date().toLocaleString("vi-VN"));
        }

        renderMessageUI(responseText, "bot-message");

        // Nếu có pháo hoa (confetti) trong cảm xúc
        if (text.toLowerCase().includes("vui") || text.toLowerCase().includes("tuyệt")) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.8 } });
        }

        if (res.nextStep) renderSuggestions(res.nextStep);
      }, 800);
    }

    // Lời chào chủ động (Bản cũ - Ý tưởng 3)
    function proactiveGreeting() {
      const hour = new Date().getHours();
      let greeting = hour < 12 ? "Chào buổi sáng Bro! Chúc ngày mới không Bug! ☀️" : 
                    (hour < 18 ? "Chào buổi chiều! Làm tí bài test không? ☕" : "Cày đêm à Bro? Đừng thức khuya quá nhé! 🌙");

      setTimeout(() => {
        const wrapper = document.createElement("div");
        wrapper.className = `message-wrapper bot-wrapper proactive`;
        wrapper.innerHTML = `<div class="message bot-message">${greeting}</div>`;
        messagesContainer.appendChild(wrapper);
        toggleBtn.classList.add("ping");
        renderSuggestions(["Cách thi", "Xem sản phẩm", "Tài liệu"]);
      }, 2000);
    }

    // --- 6. GẮN SỰ KIỆN ---
    sendBtn.onclick = sendMessage;
    inputField.onkeypress = (e) => { if (e.key === "Enter") sendMessage(); };
    
    toggleBtn.onclick = () => {
      const isHidden = chatWindow.style.display === "none";
      chatWindow.style.display = isHidden ? "flex" : "none";
      if (isHidden) renderSuggestions();
      toggleBtn.classList.remove("ping");
    };

    document.getElementById("chatboxClose").onclick = () => chatWindow.style.display = "none";

    // Khởi chạy
    proactiveGreeting();

  } catch (e) {
    console.error("Chatbox Logic Error:", e);
  }
})();