// js/chatbox-data.js

const chatBotKnowledge = [
    // 1. Gameshow/Chứng chỉ
    {
        keywords: ["chứng chỉ", "thi", "câu hỏi", "score", "pass", "bằng khen", "gameshow","làm bài thi", "đậu chứng chỉ", "bao nhiêu điểm", "cách nhận bằng", "quy tắc thi", "thời gian thi","C++ chứng chỉ", "Python chứng chỉ", "Java chứng chỉ", "An Ninh Mạng chứng chỉ" ],
        response: "Phần Thi Chứng Chỉ Kỹ Thuật nằm ở trang **Gameshow** (biểu tượng gamepad). Bạn có thể chọn thi C++, Python, Java, hoặc An Ninh Mạng. Cần đạt 70% số câu đúng để nhận Bằng Khen Cấp độ B!"
    },
    // 2. Sản phẩm/Tài nguyên
    {
        keywords: ["sản phẩm", "tài nguyên", "tool", "source code", "code","khóa học", "mua code", "tải tool", "tài liệu học", "đồ thanh lý", "mã nguồn", "phần mềm"],
        response: "Bạn có thể tìm kiếm tất cả **Sản Phẩm** và **Tài Nguyên** (source code, tool, khóa học) ở mục **Sản Phẩm** (biểu tượng hộp lưu trữ). Trang này có bộ lọc theo danh mục và tìm kiếm để bạn dễ dàng tra cứu."
    },
    // 3. Ghi chú code
    {
        keywords: ["ghi chú", "noe", "mẹo", "tutorial", "tip","kiến thức kỹ thuật", "hướng dẫn", "mẹo lập trình", "thủ thuật code", "CSS", "JS", "C#", "lỗi code"],
        response: "Mục **Ghi Chú** (biểu tượng sticky note) là nơi tổng hợp các mẹo lập trình (CSS, C++, JS...) và kiến thức kỹ thuật. Bạn có thể lọc theo Category (Lập trình, Mẹo Hay) và SubCategory để tìm kiếm nhanh."
    },
    // 4. Liên hệ
    {
        keywords: ["mua", "giá", "liên hệ", "hotline", "zalo","cách mua", "phí", "thanh toán", "hỗ trợ", "gặp admin", "số điện thoại", "email", "mua sản phẩm"],
        response: "Để liên hệ mua các sản phẩm tính phí, bạn có thể liên hệ qua:<br>• **Facebook:** fb.com/hvcoder.vn<br>• **Zalo:** 0988.654.321<br>• **Email:** hvcoder.vn@gmail.com"
    },
    // 5. Cấu trúc trang
    {
        keywords: ["trang web", "cấu trúc", "web này", "tác giả","giới thiệu", "chủ trang web", "mục đích", "thông tin về trang", "người làm web"],
        response: "Trang web này là một thư viện tổng hợp về Tài Nguyên Kỹ thuật, Lập trình và các Công cụ (Tool). Nó được xây dựng bởi HV, nhằm mục đích chia sẻ kiến thức và sản phẩm."
    },
    // 6. Python
    {
        keywords: ["python", "lỗi python", "hàm python", "lập trình python","học python", "tài liệu python", "khóa python", "bài tập python"],
        response: "Tôi có các câu hỏi về Python cho Chứng chỉ và các tài liệu học tập miễn phí. Bạn có thể tìm thấy khóa học Python trong mục Tài Nguyên."
    },
    // chào hỏi
    {
        keywords: ["hi", "hello", "chào bạn", "hey seri","alo", "hé lu", "chào", "good morning"],
        response: "Hi chào bạn,bạn đang gặp vấn đề gì cần tôi giúp?"
    },
    {
        keywords: ["mấy giờ", "thời gian", "time", "giờ"],
        response: "[CURRENT_TIME]" // Đánh dấu để logic xử lý
    },
];

// Khởi tạo phản hồi mặc định
const defaultResponses = [
    "Tôi xin lỗi, tôi không hiểu câu hỏi của bạn. Vui lòng hỏi về Chứng chỉ, Sản phẩm, Ghi chú code, hoặc cách liên hệ.",
    "Tôi chỉ là một bot đơn giản, hãy thử hỏi về các chủ đề chính như 'chứng chỉ', 'sản phẩm' hoặc 'liên hệ' nhé.",
    "Bạn muốn hỏi về vấn đề gì ạ? Tôi chỉ có thể trả lời các câu hỏi liên quan đến nội dung của trang web này."
];