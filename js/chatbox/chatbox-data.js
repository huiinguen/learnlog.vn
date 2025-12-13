// js/chatbox-data.js

const chatBotKnowledge = [
    //Gameshow/Chứng chỉ
    {
        keywords: ["chứng chỉ", "thi", "câu hỏi", "score", "pass", "bằng khen", "gameshow","làm bài thi", "đậu chứng chỉ", "bao nhiêu điểm", "cách nhận bằng", "quy tắc thi", "thời gian thi","C++ chứng chỉ", "Python chứng chỉ", "Java chứng chỉ", "An Ninh Mạng chứng chỉ" ],
        response: "Phần Thi Chứng Chỉ Kỹ Thuật nằm ở trang Gameshow,hãy dùng kiến thức để lấy BẰNG CHỨNG CHỈ nào!"
    },
    //Sản phẩm/Tài nguyên
    {
        keywords: ["sản phẩm", "tài nguyên", "tool", "source code", "code","khóa học", "mua code", "tải tool", "tài liệu học", "đồ thanh lý", "mã nguồn", "phần mềm"],
        response: "Bạn có thể tìm kiếm tất cả **Sản Phẩm** và **Tài Nguyên** (source code, tool, khóa học) ở mục **Sản Phẩm** (biểu tượng hộp lưu trữ). Trang này có bộ lọc theo danh mục và tìm kiếm để bạn dễ dàng tra cứu."
    },
    //Liên hệ
    {
        keywords: ["mua", "giá", "liên hệ", "hotline", "zalo","cách mua", "phí", "thanh toán", "hỗ trợ", "gặp admin", "số điện thoại", "email", "mua sản phẩm"],
        response: "Để liên hệ mua các sản phẩm tính phí, bạn có thể liên hệ qua: loading...",
    },
    //  Cấu trúc trang
    {
        keywords: ["trang web", "cấu trúc", "web này", "tác giả","giới thiệu", "chủ trang web", "mục đích", "thông tin về trang", "người làm web"],
        response: "Trang web này là một thư viện tổng hợp về Tài Nguyên Kỹ thuật, Lập trình và các Công cụ (Tool). Nó được xây dựng bởi HV, nhằm mục đích chia sẻ kiến thức và sản phẩm."
    },
    // Python
    {
        keywords: ["python", "lỗi python", "hàm python", "lập trình python","học python", "tài liệu python", "khóa python", "bài tập python"],
        response: "Tôi có các câu hỏi về Python cho Chứng chỉ và các tài liệu học tập miễn phí. Bạn có thể tìm thấy khóa học Python trong mục Tài Nguyên."
    },
    // chào hỏi
    {
        keywords: ["hi", "hello", "chào bạn", "hey seri","alo", "hé lu", "chào", "good morning"],
        response: "Hi chào bạn,bạn đang gặp vấn đề gì cần tôi giúp?"
    },

    // cười-vui vẻ
    {
        keywords: ["hii", "hehe", "kkk", "cười ẻ","vãi", "hì", "kk", "hẹ hẹ"],
        response: "Cười cái con khỉ 😂 "
    },

    // tải app web
    {
        keywords:["tải app","tải về","app web","cách tải về"],
        response:"IOS: nút chia sẻ-> thêm vào mh -> Thêm | Android: menu-> thêm vào màn hình-> thêm",
    },

    

//========================================================================================

    // THIẾT LẬP CÂU HỎI + CHỨC NĂNG CODE= CHATBOX TÍNH NĂNG
    
    // TIME(ngày/tháng/năm-giờ/phút/giây-thứ)
    {
        keywords: ["mấy giờ", "thời gian", "time", "giờ","hour"],
        response: "[CURRENT_TIME]" // Đánh dấu để logic xử lý
    },
    // báo cáo lỗi 
    {
        keywords:["app bị lỗi","link bị lỗi","lỗi giao diện","lỗi","báo cáo"],
        response:"[report]"// đường link hiển thị ở chatbox để điền thông tin
    },

];

// Khởi tạo phản hồi mặc định
const defaultResponses = [
    "Dữ liệu hệ thống chưa được cập nhật với câu hỏi của bạn!",
    "Bạn muốn hỏi về vấn đề gì ạ? Tôi chỉ có thể trả lời các câu hỏi liên quan đến nội dung của trang web này."
];