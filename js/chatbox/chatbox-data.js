
const chatBotKnowledge = [
  // 1. CHỨNG CHỈ / GAMESHOW
  {
    keywords: ["chứng chỉ", "chung chi", "thi", "score", "pass", "bằng", "gameshow", "làm bài", "đậu", "điểm", "quy tắc"],
    response: 'Trả lời câu hỏi thông qua bài test. Chi tiết hướng dẫn: <a href="index.html" target="_blank" style="color: #03dac6; font-weight: bold;">Xem tại đây</a>.',
  },

  // 2. SẢN PHẨM / TÀI NGUYÊN
  {
    keywords: ["sản phẩm", "san pham", "tool", "source", "code", "khóa học", "tải", "phần mềm", "tài liệu", "mã nguồn"],
    response: 'Chi tiết hướng dẫn & tài nguyên: <a href="sanpham.html" target="_blank" style="color: #03dac6; font-weight: bold;">Xem tại đây</a>.',
  },


  // 4. GIỚI THIỆU TRANG WEB
  {
    keywords: ["trang web", "web", "tác giả", "giới thiệu", "chủ web", "mục đích", "thông tin", "ai làm"],
    response: "Trang web này là thư viện Tài Nguyên Kỹ thuật & Lập trình, xây dựng bởi @Huiibaby nhằm chia sẻ kiến thức và công cụ hữu ích.",
  },

  // 5. CHÀO HỎI & GIAO TIẾP
  {
    keywords: ["hi", "hello", "chào", "alo", "hé lu", "hey", "good morning", "ê"],
    response: "Chào Bro! Hôm nay tôi có thể giúp gì cho công việc của bạn không? 🐔",
  },

  // 6. CẢM XÚC VUI VẺ
  {
    keywords: ["haha", "hehe", "kkk", "cười", "vui", "hài", "vcl", "vl", ":))", ":>","ahihi"],
    response: "Cười cái con khỉ 😂. Vui vẻ thì làm tí code cho đời tươi trẻ đi Bro!",
  },

  // 7. CẢM XÚC TIÊU CỰC / TÂM SỰ
  {
    keywords: ["buồn", "chán", "mệt", "thất vọng", "tâm sự", "khóc", "áp lực", "stress","lú"],
    response: "Tôi hiểu cảm giác của bạn. Nghỉ ngơi một chút, uống ly cà phê rồi mọi chuyện sẽ ổn thôi! 😊",
  },

  // 8. TẢI APP (PWA)
  {
    keywords: ["tải app", "cài đặt", "app web", "pwa", "download app", "tải về điện thoại"],
    response: 'Bạn có thể cài đặt trang này như một ứng dụng (PWA). Hướng dẫn: <a href="huongdan.html" target="_blank" style="color: #03dac6; font-weight: bold;">Tại đây</a>.',
  },

  // kiến thức 
  {

  },


  // 10. THỜI GIAN & BÁO LỖI (Hàm đặc biệt)
  {
    keywords: ["mấy giờ", "thời gian", "time", "giờ", "ngày"],
    response: "[CURRENT_TIME]",
  },
  {
    keywords: ["lỗi", "bug", "hỏng", "không chạy", "báo cáo", "report"],
    response: "[report]",
  },
];

// Phản hồi mặc định khi không tìm thấy kết quả mờ nào khớp
const defaultResponses = [
  "Dữ liệu chưa cập nhật câu này, Bro thử gõ từ khóa khác (ví dụ: 'liên hệ', 'sản phẩm') xem?",
  "Tôi chưa hiểu ý Bro lắm, có phải Bro muốn hỏi về tài liệu học không?",
  "Bro gõ gì lạ thế? Thử dùng từ phổ thông hơn một chút nhé! 😂",
  "Hmm, câu này khó quá, tôi chưa được học. Thử hỏi về 'Chứng chỉ' xem sao!"
];
