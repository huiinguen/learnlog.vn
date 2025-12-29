/**
 * file: main.js
 * Chứa logic điều hướng, thanh Dock macOS cải tiến và các tiện ích chung.
 */
// Khởi tạo hoặc lấy dữ liệu tracking từ LocalStorage
let userStats = JSON.parse(localStorage.getItem('userStats')) || {
    username: "Guest",
    loginCount: 0,
    clicks: { product: 0, note: 0, quiz: 0, vlog: 0 },
    lastLogin: new Date().toLocaleDateString()
};

// Hàm ghi nhận click
function trackClick(type) {
    if (userStats.clicks.hasOwnProperty(type)) {
        userStats.clicks[type]++;
        localStorage.setItem('userStats', JSON.stringify(userStats));
    }
}

// Tự động gán sự kiện track cho các trang
document.addEventListener('click', (e) => {
    if (window.location.pathname.includes('sanpham')) trackClick('product');
    if (window.location.pathname.includes('ghichu')) trackClick('note');
    if (window.location.pathname.includes('index')) trackClick('quiz');
    
});
document.addEventListener('DOMContentLoaded', function() {
    
    console.log("Hệ thống đã sẵn sàng!");

    // ===============================================
    // 1. XỬ LÝ TRẠNG THÁI ACTIVE TRÊN NAVBAR & DOCK
    // ===============================================
    const navLinks = document.querySelectorAll('.nav-links a, .dock-nav a'); 
    const currentPath = window.location.pathname.split("/").pop();

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split("/").pop();
        // Kiểm tra nếu là trang chủ hoặc khớp tên file
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });

    // ===============================================
    // 2. SMOOTH SCROLL (CUỘN MƯỢT CHO LINK NỘI BỘ)
    // ===============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement){
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===============================================
    // 3. LOGIC HAMBURGER MENU (MOBILE)
    // ===============================================
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mainNavLinks = document.querySelector('.navbar .nav-links'); 

    if (hamburgerMenu && mainNavLinks) {
        hamburgerMenu.addEventListener('click', function() {
            mainNavLinks.classList.toggle('active');
            hamburgerMenu.classList.toggle('open');
        });

        mainNavLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNavLinks.classList.remove('active');
                hamburgerMenu.classList.remove('open');
            });
        });
    }

    // =============================================================
    // 4. LOGIC CẢI TIẾN THANH DOCK: PHÓNG TO & CUỘN TRÁI/PHẢI
    // =============================================================
    const dock = document.getElementById('dockNav');
    if (dock) {
        const dockIcons = dock.querySelectorAll('a');

        // --- A. Hiệu ứng phóng to kiểu macOS (Chỉ dành cho Desktop) ---
        if (window.innerWidth > 1024) {
            const maxScale = 1.3;     // Phóng to tối đa 1.3 lần
            const effectRadius = 150; // Khoảng cách chuột bắt đầu tác động

            dock.addEventListener('mousemove', function(e) {
                const dockRect = dock.getBoundingClientRect();
                const mouseX = e.clientX - dockRect.left;

                dockIcons.forEach(icon => {
                    const iconRect = icon.getBoundingClientRect();
                    const iconCenterX = (iconRect.left - dockRect.left) + (iconRect.width / 2);
                    const distance = Math.abs(mouseX - iconCenterX);
                    
                    let scale = 1;
                    if (distance < effectRadius) {
                        const scaleFactor = (1 - distance / effectRadius);
                        // Sử dụng hàm Cosine để hiệu ứng chuyển đổi scale mượt mà hơn
                        scale = 1 + (maxScale - 1) * Math.cos((1 - scaleFactor) * (Math.PI / 2));
                    }
                    
                    // Áp dụng biến đổi: phóng to và đẩy nhẹ icon lên trên (translateY)
                    icon.style.transform = `scale(${scale.toFixed(2)}) translateY(${(1 - scale) * 15}px)`;
                    // Tạo lề động để các icon không đè lên nhau khi to ra
                    icon.style.margin = `0 ${(scale - 1) * 10}px`; 
                });
            });

            // Reset trạng thái khi chuột rời khỏi Dock
            dock.addEventListener('mouseleave', function() {
                dockIcons.forEach(icon => {
                    icon.style.transform = 'scale(1) translateY(0px)';
                    icon.style.margin = '0';
                });
            });
        }

        // --- B. Tính năng cuộn ngang bằng bánh xe chuột ---
        // Cho phép người dùng lăn chuột để kéo thanh Dock sang trái/phải
        dock.addEventListener('wheel', function(e) {
            if (e.deltaY !== 0) {
                e.preventDefault();
                // Chuyển hướng cuộn dọc của chuột thành cuộn ngang cho Dock
                dock.scrollLeft += e.deltaY;
            }
        }, { passive: false });

        // --- C. Tự động căn giữa icon đang chọn (Active) ---
        const activeLink = dock.querySelector('a.active');
        if (activeLink) {
            setTimeout(() => {
                activeLink.scrollIntoView({ 
                    behavior: 'smooth', 
                    inline: 'center', 
                    block: 'nearest' 
                });
            }, 300);
        }
    }
});

/**
 * Tiện ích: Định dạng số thành tiền tệ Việt Nam (VND)
 * @param {number} amount 
 * @returns {string} ví dụ: 100.000 ₫
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}