const chatBotKnowledge = [
  // --- NHÓM 1: CẢM XÚC (EMOTIONS) ---
  {
    keywords: ["vui", "hạnh phúc", "yêu đời", "tuyệt vời", "good", "ổn","kkk","kk","hihi","haha"],
    response: "Nghe có vẻ hôm nay là một ngày đẹp trời với Bro nhỉ? Cứ giữ năng lượng này để chiến Code nhé! 🚀",
    nextStep: ["Làm tí bài test không?", "Xem sản phẩm mới"]
  },

  {
    keywords:["hi","hello","alo","hey seri","lo","chào","chào buổi sáng","good morning"],
    response:"gì thế bro!!!!!!!!!",
  },
  
  {
    keywords: ["buồn", "chán", "thất vọng", "khóc", "tệ", "thất tình"],
    response: "Đừng buồn nữa Bro, ngoài kia còn bao nhiêu dòng Code đang chờ bạn Fix mà... Đùa chút thôi, nghỉ ngơi tí rồi quay lại chiến tiếp nhé! 😊",
    nextStep: ["Tâm sự tiếp", "Giải trí tí"]
  },
  {
    keywords: ["mệt", "oải", "áp lực", "stress", "muốn bỏ cuộc", "lười"],
    response: "Dừng lại 5 phút, uống một ngụm nước, hít thở sâu. Programmer không phải là máy, cần sạc pin đi thôi! 🔋",
  },
  {
    keywords: ["cay", "bực", "ghét", "vcl", "vl", "đm", "cút","vãi ò","vãi","chịu","hết cứu"],
    response: "Hạ hỏa nào Bro! Giận quá mất khôn, lỗi Code cũng từ đó mà ra đấy. Bình tĩnh lại rồi mình cùng giải quyết nhé! 🧊",
  },

  // --- NHÓM 2: KIẾN THỨC & KỸ NĂNG (KNOWLEDGE) ---
  {
    keywords: ["học lập trình", "roadmap", "bắt đầu từ đâu", "ngôn ngữ nào"],
    response: "Nếu mới bắt đầu, tôi khuyên Bro nên đi từ **Python** (dễ học) hoặc **Javascript** (làm được Web ngay). Bạn muốn xem lộ trình nào?",
    nextStep: ["Lộ trình Web", "Lộ trình C++", "Lộ trình Python"]
  },
  {
    keywords: ["mẹo thi", "điểm cao", "bí kíp", "pass môn"],
    response: "Bí kíp là: Đọc kỹ đề, không bỏ sót từ nào và quan trọng là... thi nhiều sẽ quen! Bạn định thi chứng chỉ gì?",
    nextStep: ["Thi C++", "Thi Python", "Thi Excel"]
  },
  {
    keywords: ["frontend", "backend", "fullstack"],
    response: "Frontend là vẻ bề ngoài (HTML/CSS/JS), Backend là tâm hồn bên trong (Data/Logic). Làm Fullstack thì... mệt cả hai! 😂",
  },

  // --- NHÓM 3: TRÊU ĐÙA & TƯƠNG TÁC (JOKES/FUN) ---
  {
    keywords: ["người yêu", "crush", "tỏ tình", "thả thính", "alone", "ế"],
    response: "Lập trình viên thường có 2 loại: Một là ế bền vững, hai là có người yêu cũng là lập trình viên. Bro thuộc loại nào? Đùa thôi, lo Code đi người yêu tự tới! 💖",
  },
  {
    keywords: ["ai đẹp trai nhất", "ai thông minh nhất", "tác giả"],
    response: "Chắc chắn là Bro rồi (sau tôi một tí)! Còn tác giả web này là @Huiibaby - một người cực kỳ đẹp trai và nhiệt huyết. 😎",
  },
  {
    keywords: ["cưới tôi đi", "yêu bot", "lấy bot"],
    response: "Xin lỗi Bro, tôi chỉ là Code thôi, tình yêu của tôi dành hết cho các dòng lệnh rồi! 🤖💔",
  },
  {
    keywords: ["giàu", "tiền", "lương", "thu nhập"],
    response: "Nghề này lương nghìn đô là thật, nhưng mà... nghìn đô đó đổi bằng tóc đấy Bro. Sẵn sàng chưa? 💸💇‍♂️",
  },

  // --- NHÓM 4: HỆ THỐNG & TIỆN ÍCH ---
  {
    keywords: ["mấy giờ", "thời gian", "ngày"],
    response: "Bây giờ là **[CURRENT_TIME]**. Đừng thức khuya quá nhé Bro! 🌙",
  },
  {
    keywords: ["liên hệ", "admin", "fb", "zalo", "gmail", "hỗ trợ"],
    response: "Mọi thắc mắc Bro có thể gửi về email: **hcao84539@gmail.com** hoặc liên hệ qua trang cá nhân của Admin nhé! 📬",
  },
  {
    keywords: ["bug", "lỗi web", "không bấm được", "hỏng","lỗi"],
    response: "Ối, có Bug à? Bro chụp ảnh lại hoặc mô tả kỹ rồi nhấn vào đây để báo tôi nhé: [report]",
  }
];