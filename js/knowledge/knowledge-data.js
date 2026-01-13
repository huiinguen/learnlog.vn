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
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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

  {
    id: 10,
    title: "Đệ quy cơ bản: Tính giai thừa",
    category: "Thuật toán",
    subCategory: "C++",
    answer:
      "Giai thừa của n (n!) là tích các số từ 1 đến n. Công thức đệ quy: n! = n * (n-1)!. Điều kiện dừng là khi n = 0 hoặc n = 1, kết quả là 1.",
    code: {
      lang: "C++",
      content: `
long long factorial(int n) {
    if (n <= 1) return 1; // Điều kiện dừng (Base case)
    return n * factorial(n - 1);
}`,
    },
  },
  {
    id: 11,
    title: "Dãy số Fibonacci",
    category: "Thuật toán",
    subCategory: "C++",
    answer:
      "Số Fibonacci thứ n được tính bằng tổng hai số Fibonacci đứng trước nó: F(n) = F(n-1) + F(n-2). Điều kiện dừng là khi n bằng 0 hoặc 1.",
    code: {
      lang: "C++",
      content: `
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    },
  },
  {
    id: 12,
    title: "Tìm kiếm nhị phân (Binary Search)",
    category: "Thuật toán",
    subCategory: "C++",
    answer:
      "Tìm kiếm bằng cách chia đôi mảng. Nếu phần tử ở giữa lớn hơn giá trị cần tìm, ta đệ quy vào nửa bên trái, ngược lại đệ quy vào nửa bên phải.",
    code: {
      lang: "C++",
      content: `
int binarySearch(int arr[], int left, int right, int x) {
    if (right >= left) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == x) return mid;
        if (arr[mid] > x) 
            return binarySearch(arr, left, mid - 1, x);
        return binarySearch(arr, mid + 1, right, x);
    }
    return -1; // Không tìm thấy
}`,
    },
  },
];
