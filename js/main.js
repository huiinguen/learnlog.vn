document.addEventListener("DOMContentLoaded", function () {
  console.log("Hệ thống đã sẵn sàng!");

  // ===============================================
  // 1. XỬ LÝ TRẠNG THÁI ACTIVE TRÊN NAVBAR & DOCK (CŨ - ĐÃ BỎ)
  // ===============================================
  // (Giữ lại đoạn này nếu bạn còn dùng navbar cũ ở đâu đó, không thì có thể xóa)
  const navLinks = document.querySelectorAll(".nav-links a, .dock-nav a");
  const currentPath = window.location.pathname.split("/").pop();

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href").split("/").pop();
    if (
      linkPath === currentPath ||
      (currentPath === "" && linkPath === "index.html")
    ) {
      link.classList.add("active");
    }
  });

  // ===============================================
  // 2. SMOOTH SCROLL (CUỘN MƯỢT CHO LINK NỘI BỘ)
  // ===============================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ===============================================
  // 3. LOGIC HAMBURGER MENU (MOBILE) - CŨ
  // ===============================================
  const hamburgerMenu = document.getElementById("hamburgerMenu");
  const mainNavLinks = document.querySelector(".navbar .nav-links");

  if (hamburgerMenu && mainNavLinks) {
    hamburgerMenu.addEventListener("click", function () {
      mainNavLinks.classList.toggle("active");
      hamburgerMenu.classList.toggle("open");
    });

    mainNavLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNavLinks.classList.remove("active");
        hamburgerMenu.classList.remove("open");
      });
    });
  }

  // ===============================================
  // SIDEBAR MENU TOGGLE - HAMBURGER HIỆN/ẨN KHI MỞ
  // ===============================================
  const menuToggleBtn = document.getElementById("menuToggleBtn");
  const sidebarMenu = document.getElementById("sidebarMenu");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const menuCloseBtn = document.getElementById("menuCloseBtn");

  if (menuToggleBtn && sidebarMenu && sidebarOverlay && menuCloseBtn) {
    // Mở menu → ẩn nút hamburger
    menuToggleBtn.addEventListener("click", () => {
      sidebarMenu.classList.add("active");
      sidebarOverlay.classList.add("active");
      menuToggleBtn.classList.add("hidden"); // Ẩn nút 3 gạch
      document.body.style.overflow = "hidden";
    });

    // Đóng menu → hiện lại nút hamburger
    const closeMenu = () => {
      sidebarMenu.classList.remove("active");
      sidebarOverlay.classList.remove("active");
      menuToggleBtn.classList.remove("hidden"); // Hiện lại nút
      document.body.style.overflow = "";
    };

    menuCloseBtn.addEventListener("click", closeMenu);
    sidebarOverlay.addEventListener("click", closeMenu);

    // Highlight link trang hiện tại
    const currentPath =
      window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".sidebar-link").forEach((link) => {
      // Trước tiên xóa bỏ tất cả class active cũ để tránh bị "sáng kép"
      link.classList.remove("active");

      const linkHref = link.getAttribute("href");
      if (linkHref === currentPath) {
        link.classList.add("active");
      }
    });
  }
});
