const notesData = [
  {
    id: 1,
    title: "Đảo ngược chuỗi (String Reversal)",
    category: "Lập trình",
    subCategory: "Python",

    answer:
      "Sử dụng slicing với bước nhảy $-1$ để đảo ngược chuỗi một cách ngắn gọn và 'Pythonic'.",
    code: {
      lang: "Python",
      content: `text = "hello world"\nreversed_text = text[::-1]\nprint(reversed_text) # dlrow olleh`,
    },
  },
  {
    id: 2,
    title: "Sử dụng List Comprehension",
    category: "Lập trình",
    subCategory: "Python",

    answer:
      "List Comprehension giúp tạo danh sách mới một cách nhanh chóng dựa trên các danh sách đã có.",
    code: {
      lang: "Python",
      content: `numbers = [1, 2, 3, 4, 5]\nsquares = [x**2 for x in numbers if x > 2]\nprint(squares) # [9, 16, 25]`,
    },
  },
  {
    id: 3,
    title: "Bắt lỗi bất đồng bộ với async/await",
    category: "Lập trình",
    subCategory: "JavaScript",

    answer:
      "Sử dụng khối `try...catch` bao quanh hàm `await` để xử lý các lỗi mạng hoặc lỗi từ server.",
    code: {
      lang: "JavaScript",
      content: `async function fetchData(url) {\n  try {\n    const response = await fetch(url);\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error("Lỗi:", error);\n  }\n}`,
    },
  },
  {
    id: 4,
    title: "Căn giữa phần tử với Flexbox",
    category: "Giao diện",
    subCategory: "CSS",

    answer:
      "Sử dụng cặp thuộc tính `justify-content` và `align-items` trên thẻ cha (display: flex).",
    code: {
      lang: "CSS",
      content: `.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}`,
    },
  },

  {
    id: 6,
    title: "Tạo bảng (Table) chuẩn SEO",
    category: "Giao diện",
    subCategory: "HTML",

    answer:
      "Sử dụng đầy đủ các thẻ semantic như `thead`, `tbody`, và `th` để hỗ trợ trình đọc màn hình.",
    code: {
      lang: "HTML",
      content: `<table>\n  <thead>\n    <tr><th>ID</th><th>Tên</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>1</td><td>Gemini</td></tr>\n  </tbody>\n</table>`,
    },
  },

  {
    id: 16,
    title: "Lập trình đa luồng (Multithreading)",
    category: "Lập trình",
    subCategory: "Java",

    answer:
      "Sử dụng Thread để thực hiện các tác vụ song song, giúp tối ưu hiệu suất xử lý.",
    code: {
      lang: "Java",
      content: `class MyThread extends Thread {\n  public void run() { System.out.println("Thread is running..."); }\n}\nMyThread t1 = new MyThread(); t1.start();`,
    },
  },
  {
    id: 17,
    title: "Hàm Lambda trong C++",
    category: "Lập trình",
    subCategory: "C++",

    answer:
      "Lambda cho phép định nghĩa các hàm ẩn danh ngắn gọn ngay trong thân hàm khác.",
    code: {
      lang: "C++",
      content: `auto add = [](int a, int b) { return a + b; };\nstd::cout << add(5, 3); // Output: 8`,
    },
  },
  {
    id: 18,
    title: "Sử dụng con trỏ (Pointers) cơ bản",
    category: "Lập trình",
    subCategory: "C",

    answer:
      "Con trỏ lưu trữ địa chỉ vùng nhớ của biến khác, cho phép thao tác trực tiếp trên bộ nhớ.",
    code: {
      lang: "C",
      content: `int var = 20; int *ip = &var;\nprintf("Địa chỉ: %p\\n", ip);\nprintf("Giá trị: %d\\n", *ip);`,
    },
  },


  {
    id: 28,
    title: "Sắp xếp nhanh (Quick Sort)",
    category: "Thuật toán",
    subCategory: "C++",
    answer:
      "Chọn một phần tử làm 'chốt' (pivot). Sắp xếp sao cho mọi phần tử bên trái nhỏ hơn chốt và mọi phần tử bên phải lớn hơn chốt, sau đó lặp lại đệ quy.",
    code: {
      lang: "C++",
      content: `
// Hàm phân hoạch
int partition(int arr[], int low, int high) {
    int pivot = arr[high]; // Chọn chốt là phần tử cuối
    int i = (low - 1); 

    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
    },
  },
  {
    id: 29,
    title: "Sắp xếp chèn (Insertion Sort)",
    category: "Thuật toán",
    subCategory: "C++",
    answer:
      "Lấy từng phần tử từ mảng và 'chèn' vào đúng vị trí của nó trong đoạn mảng đã được sắp xếp trước đó.",
    code: {
      lang: "C++",
      content: `
void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        // Di chuyển các phần tử lớn hơn key về sau 1 vị trí
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
    },
  },
  {
    id: 30,
    title: "Sắp xếp chọn (Selection Sort)",
    category: "Thuật toán",
    subCategory: "C++",
    answer:
      "Tìm phần tử nhỏ nhất trong mảng chưa sắp xếp và đưa nó về đầu dãy.",
    code: {
      lang: "C++",
      content: `
void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        // Hoán đổi phần tử nhỏ nhất với phần tử đầu đoạn chưa sắp xếp
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}`,
    },
  },
  {
    id: 31,
    title: "Sắp xếp nổi bọt (Bubble Sort)",
    category: "Thuật toán",
    subCategory: "C++",
    answer:
      "Thuật toán này liên tục so sánh 2 phần tử kề nhau. Nếu phần tử đứng trước lớn hơn phần tử đứng sau thì hoán đổi chúng.",
    code: {
      lang: "C++",
      content: `
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Hoán đổi
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
    },
  },
];
