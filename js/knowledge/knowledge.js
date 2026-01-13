document.addEventListener("DOMContentLoaded", function () {
  // Kiểm tra dữ liệu đầu vào
  if (typeof notesData === "undefined") return;

  // --- PHẦN TỬ SIDEBAR ĐIỀU HƯỚNG CHÍNH ---
  const sidebarMenu = document.getElementById("sidebarMenu");
  const menuToggleBtn = document.getElementById("menuToggleBtn");
  const menuCloseBtn = document.getElementById("menuCloseBtn");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  // --- PHẦN TỬ DRAWER DANH MỤC KIẾN THỨC ---
  const verticalMenu = document.getElementById("verticalMenu");
  const menuAllBtn = document.getElementById("menuAllBtn");
  const closeDrawer = document.getElementById("closeDrawer");
  const drawerOverlay = document.getElementById("drawerOverlay");

  // --- PHẦN TỬ NỘI DUNG ---
  const noteGrid = document.getElementById("noteGrid");
  const searchInput = document.getElementById("searchInput");
  const favCount = document.getElementById("favCount");
  const mainMenu = document.getElementById("mainMenu");

  // Trạng thái lọc hiện tại
  let currentFilter = { category: "all", subCategory: "all" };

  // ==================== 1. XỬ LÝ SIDEBAR CHÍNH ====================
  function toggleSidebar() {
    sidebarMenu.classList.toggle("open");
    sidebarOverlay.classList.toggle("show");
  }

  if (menuToggleBtn) menuToggleBtn.onclick = toggleSidebar;
  if (menuCloseBtn) menuCloseBtn.onclick = toggleSidebar;
  if (sidebarOverlay) sidebarOverlay.onclick = toggleSidebar;

  // ==================== 2. XỬ LÝ DRAWER DANH MỤC ====================
  function toggleDrawer() {
    verticalMenu.classList.toggle("open");
    drawerOverlay.classList.toggle("show");
  }

  if (menuAllBtn) menuAllBtn.onclick = toggleDrawer;
  if (closeDrawer) closeDrawer.onclick = toggleDrawer;
  if (drawerOverlay) drawerOverlay.onclick = toggleDrawer;

  // ==================== 3. KHỞI TẠO MENU DANH MỤC ====================
  function initVerticalMenu() {
    const categories = [...new Set(notesData.map((n) => n.category))];

    let menuHTML = `
            <li class="category-item">
                <a class="category-link" onclick="handleMenuClick('all', 'all')">
                    <i class="fas fa-globe"></i> Tất cả ghi chú
                </a>
            </li>`;

    categories.forEach((cat) => {
      const subCats = [
        ...new Set(
          notesData.filter((n) => n.category === cat).map((n) => n.subCategory)
        ),
      ];

      menuHTML += `
                <li class="category-item">
                    <div class="category-link" onclick="toggleSubMenu(this)">
                        <span><i class="fas fa-folder"></i> ${cat}</span>
                        <i class="fas fa-chevron-right arrow-icon"></i>
                    </div>
                    <ul class="vertical-sub-menu">
                        <li><a onclick="handleMenuClick('${cat}', 'all')">Xem tất cả ${cat}</a></li>
                        ${subCats
                          .map(
                            (sc) => `
                            <li><a onclick="handleMenuClick('${cat}', '${sc}')">${sc}</a></li>
                        `
                          )
                          .join("")}
                    </ul>
                </li>`;
    });

    mainMenu.innerHTML = menuHTML;
  }

  window.toggleSubMenu = function (element) {
    element.parentElement.classList.toggle("open");
  };

  window.handleMenuClick = function (cat, sub) {
    currentFilter.category = cat;
    currentFilter.subCategory = sub;

    const btnText = document.querySelector("#menuAllBtn span");
    if (btnText) {
      btnText.innerText =
        cat === "all" ? "Tất cả" : `${cat}${sub !== "all" ? " > " + sub : ""}`;
    }

    renderAll();
    toggleDrawer();
  };

  // ==================== 4. HIỂN THỊ GHI CHÚ ====================
  function renderAll() {
    const term = searchInput.value.toLowerCase();
    const favorites = JSON.parse(localStorage.getItem("favNotes")) || [];

    const filtered = notesData.filter((n) => {
      const matchCat =
        currentFilter.category === "all" ||
        n.category === currentFilter.category;
      const matchSub =
        currentFilter.subCategory === "all" ||
        n.subCategory === currentFilter.subCategory;
      const matchSearch = n.title.toLowerCase().includes(term);
      return matchCat && matchSub && matchSearch;
    });

    // Cập nhật số lượng yêu thích (favCount)
    if (favCount) favCount.innerText = favorites.length;

    // Hiển thị danh sách ghi chú
    // Tìm đoạn noteGrid.innerHTML trong file knowledge.js và thay thế bằng đoạn này:
    // Tìm hàm renderAll và thay đổi phần hiển thị card như sau:
    noteGrid.innerHTML = filtered
      .map(
        (n) => `
    <div class="note-card animate-fade-in" onclick="openNoteModal(${n.id})">
        <div class="note-header">
            <h3>
                <small style="display:block; font-size:0.6em; color:#bb86fc;">${
                  n.category
                } > ${n.subCategory}</small>
                ${n.title}
            </h3>
            <div class="header-actions">
                <i class="${
                  favorites.includes(n.id) ? "fas" : "far"
                } fa-heart fav-btn" 
                   onclick="event.stopPropagation(); toggleFavorite(${
                     n.id
                   })"></i>
            </div>
        </div>
    </div>
`
      )
      .join("");

    setupAccordion();
  }

  // Sao chép code
  window.copyToClipboard = function (elementId, btn) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i>';
      setTimeout(() => (btn.innerHTML = original), 2000);
    });
  };

  // Yêu thích / Bỏ yêu thích
  window.toggleFavorite = function (id) {
    let favorites = JSON.parse(localStorage.getItem("favNotes")) || [];
    favorites = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    localStorage.setItem("favNotes", JSON.stringify(favorites));
    renderAll();
  };

  // Hiệu ứng đóng mở Accordion
  function setupAccordion() {
    document.querySelectorAll(".note-header").forEach((h) => {
      h.onclick = (e) => {
        if (!e.target.classList.contains("fa-heart")) {
          h.parentElement.classList.toggle("open");
        }
      };
    });
  }

  // Lắng nghe tìm kiếm
  searchInput.oninput = renderAll;

  // Khởi tạo
  initVerticalMenu();
  renderAll();
  // --- LOGIC XỬ LÝ MODAL CHI TIẾT ---
  const noteModal = document.getElementById("noteModal");
  const modalBody = document.getElementById("modalBody");
  const modalOverlay = document.getElementById("modalOverlay");
  const modalCloseBtn = document.getElementById("modalCloseBtn");

  window.openNoteModal = function (id) {
    const note = notesData.find((n) => n.id === id);
    if (!note) return;

    modalBody.innerHTML = `
        <h2 style="color: #bb86fc; margin-bottom: 20px;">${note.title}</h2>
        <div style="background: rgba(187,134,252,0.1); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
            <p class="answer" style="margin-bottom: 0;">${note.answer}</p>
        </div>
        <div class="code-snippet">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px;">
                <span style="color: #00ff9d; font-size: 0.9em;"><i class="fas fa-code"></i> ${
                  note.code.lang || "Code"
                }</span>
                <i class="far fa-copy" style="cursor:pointer; color:#00ff9d" onclick="copyToClipboard('modal-code', this)"></i>
            </div>
            <pre><code id="modal-code">${note.code.content}</code></pre>
        </div>
    `;
    noteModal.classList.add("show");
  };

  function closeNoteModal() {
    noteModal.classList.remove("show");
  }

  // Thoát khi kích nút X
  if (modalCloseBtn) modalCloseBtn.onclick = closeNoteModal;

  // Thoát khi kích viền ngoài (overlay)
  if (modalOverlay) modalOverlay.onclick = closeNoteModal;

  // Thoát bằng phím Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNoteModal();
  });
});
