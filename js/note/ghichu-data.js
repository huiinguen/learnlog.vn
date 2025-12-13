const notesData = [
  {
    title: "Làm sao để căn giữa một thẻ Div?",
    category: "Lập trình", // Thay đổi
    subCategory: "Frontend", // Thêm mới
    answer: "Cách hiện đại và phổ biến nhất là sử dụng Flexbox hoặc Grid.",
    note: {
      type: "warning",
      text: "Lưu ý: Container cha bắt buộc phải có chiều cao (height) xác định nếu muốn căn giữa theo chiều dọc.",
    },
    code: {
      lang: "CSS",
      content: `.parent {
display: flex;
justify-content: center; /* Ngang */
align-items: center;     /* Dọc */
height: 100vh;
}`,
    },
  },
  {
    title: "Call API đơn giản với Fetch",
    category: "Lập trình", // Thay đổi
    subCategory: "Frontend", // Thêm mới
    answer:
      "Sử dụng fetch kết hợp với async/await để code gọn gàng hơn, dễ đọc hơn so với .then().",
    note: {
      type: "info",
      text: "Luôn nhớ bọc trong khối try/catch để bắt lỗi mạng hoặc lỗi server.",
    },
    code: {
      lang: "JavaScript",
      content: `async function getData() {
try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
} catch (error) {
    console.error('Lỗi rồi:', error);
}
}`,
    },
  },
  {
    title: "Tạo chữ màu Gradient (7 màu)",
    category: "Lập trình", // Thay đổi
    subCategory: "Frontend", // Thêm mới
    answer:
      "Dùng background-clip: text để cắt nền theo hình dạng chữ, tạo hiệu ứng màu sắc độc đáo.",
    note: {
      type: "info",
      text: "Thuộc tính này hỗ trợ tốt trên hầu hết các trình duyệt hiện đại.",
    },
    code: {
      lang: "CSS",
      content: `.gradient-text {
background: linear-gradient(45deg, #ff00cc, #3333ff);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
font-weight: bold;
}`,
    },
  },
  {
    title: "Tạo hàm chính trong C++",
    category: "Lập trình", // Thay đổi
    subCategory: "Backend", // Thêm mới
    answer: "Hàm main là điểm khởi đầu của mọi chương trình C++.",
    note: {
      type: "info",
      text: "Luôn trả về 0 nếu chương trình chạy thành công.",
    },
    code: {
      lang: "C++",
      content: `
#include <iostream>

int main() {
    std::cout << "Hello World!";
    return 0;
}
`,
    },
  },

    {
    title: "Xuất mẫu chứa tính năng pro (free) ?",
    category: "Mẹo Hay", // Thêm mới
    subCategory: "CapCut", // Thêm mới
    answer: "Bật vpn",
    note: {
      type: "warning",
      text: "Tỉ lệ thành công 60-70%",
    },
    code: {
      lang: "Tips",
      content: `
Bật vpn-> thoát app-> vô xuất lại -> ok
`,
    },
  },
  
  // ====================================================
  // KIẾN THỨC C++ NÂNG CAO VÀ LỖI THƯỜNG GẶP
  // ====================================================

  {
    title: "Lỗi Dangling Pointer",
    category: "Lập trình", 
    subCategory: "Backend",
    answer: "Xảy ra khi một con trỏ vẫn trỏ tới vùng nhớ đã được giải phóng (deallocate) hoặc đã ra khỏi phạm vi (scope).",
    note: {
      type: "warning",
      text: "Luôn gán con trỏ thành `nullptr` ngay sau khi gọi `delete` để tránh lỗi này. Đây là lỗi bảo mật và ổn định nghiêm trọng.",
    },
    code: {
      lang: "C++",
      content: `int* ptr = new int(10);
// ... sử dụng ptr
delete ptr; // Giải phóng vùng nhớ
// ptr hiện là dangling pointer
ptr = nullptr; // Khắc phục: gán lại thành nullptr`,
    },
  },
  {
    title: "Sử dụng Smart Pointers (unique_ptr)",
    category: "Lập trình", 
    subCategory: "Backend",
    answer: "Dùng `unique_ptr` để quản lý bộ nhớ tự động, ngăn chặn memory leak và lỗi dangling pointer. Nó tự động giải phóng bộ nhớ khi ra khỏi scope.",
    note: {
      type: "info",
      text: "Nên sử dụng `std::make_unique` thay vì `new` để khởi tạo `unique_ptr` vì hiệu suất và an toàn ngoại lệ (exception safety).",
    },
    code: {
      lang: "C++",
      content: `#include <memory>
#include <iostream>

class Data {
public:
    Data() { std::cout << "Data created\\n"; }
    ~Data() { std::cout << "Data destroyed\\n"; }
};

void func() {
    // Tự động giải phóng khi func() kết thúc
    std::unique_ptr<Data> dataPtr = std::make_unique<Data>(); 
} 
// Output: 
// Data created
// Data destroyed`,
    },
  },
  {
    title: "Khác biệt giữa Pass-by-Value, Reference và Const Reference",
    category: "Lập trình", 
    subCategory: "Backend",
    answer: "`const reference` (`const T&`) là cách hiệu quả nhất: tránh sao chép (copy) đối tượng lớn nhưng đảm bảo giá trị không bị thay đổi trong hàm.",
    note: {
      type: "info",
      text: "Nên dùng Pass-by-Value cho các kiểu dữ liệu nguyên thủy (int, float) hoặc các đối tượng nhỏ có hỗ trợ move semantic.",
    },
    code: {
      lang: "C++",
      content: `// Pass by Value: Tạo bản sao (tốn kém)
void funcValue(std::string str); 

// Pass by Reference: Sửa đổi được giá trị gốc
void funcRef(std::string& str); 

// Pass by Const Reference: Hiệu quả và an toàn (nên dùng cho tham số đầu vào lớn)
void funcConstRef(const std::string& str); `,
    },
  },
  {
    title: "Sử dụng `std::move` và Rvalue References",
    category: "Lập trình", 
    subCategory: "Backend",
    answer: "`std::move` cho phép truyền quyền sở hữu tài nguyên (chuyển thay vì sao chép) từ một đối tượng sang đối tượng khác, cải thiện hiệu suất với các đối tượng lớn.",
    note: {
      type: "warning",
      text: "Sau khi gọi `std::move(obj)`, đối tượng `obj` gốc không nên được sử dụng lại vì nó đã ở trạng thái không xác định (valid but unspecified state).",
    },
    code: {
      lang: "C++",
      content: `#include <vector>
#include <utility> // cho std::move

std::vector<int> source = {1, 2, 3, 4};
// Chuyển tài nguyên từ source sang destination thay vì sao chép
std::vector<int> destination = std::move(source); 

// source bây giờ trống (kết quả mong đợi)
// destination = {1, 2, 3, 4}`,
    },
  },
];