document.addEventListener("DOMContentLoaded", function () {
  if (typeof notesData === "undefined") return;

  const noteGrid = document.getElementById("noteGrid");
  const searchInput = document.getElementById("searchInput");
  const categorySelect = document.getElementById("categorySelect");
  const subCategorySelect = document.getElementById("subCategorySelect");
  const favCount = document.getElementById("favCount");
  const totalNotesCount = document.getElementById("totalNotesCount");

  // Hàm sao chép vào bộ nhớ tạm
  window.copyToClipboard = function (elementId, btn) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i>';
      btn.classList.add("copied");
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove("copied");
      }, 2000);
    });
  };

  function initMenus() {
    const cats = ["all", ...new Set(notesData.map((n) => n.category))];
    categorySelect.innerHTML = cats
      .map(
        (c) =>
          `<option value="${c}">${c === "all" ? "Tất cả danh mục" : c}</option>`
      )
      .join("");
    updateSubMenu();
  }

  function updateSubMenu() {
    const selectedCat = categorySelect.value;
    const subCats =
      selectedCat === "all"
        ? [...new Set(notesData.map((n) => n.subCategory))]
        : [
            ...new Set(
              notesData
                .filter((n) => n.category === selectedCat)
                .map((n) => n.subCategory)
            ),
          ];

    subCategorySelect.innerHTML =
      `<option value="all">Tất cả nhánh con</option>` +
      subCats.map((sc) => `<option value="${sc}">${sc}</option>`).join("");
  }

  function renderAll() {
    const term = searchInput.value.toLowerCase();
    const cat = categorySelect.value;
    const subCat = subCategorySelect.value;
    const favorites = JSON.parse(localStorage.getItem("favNotes")) || [];

    const filtered = notesData.filter((n) => {
      return (
        (cat === "all" || n.category === cat) &&
        (subCat === "all" || n.subCategory === subCat) &&
        n.title.toLowerCase().includes(term)
      );
    });

    if (totalNotesCount) totalNotesCount.innerText = notesData.length;
    if (favCount) favCount.innerText = favorites.length;

    // Tìm đoạn render trong hàm renderAll và thay thế noteGrid.innerHTML:
    noteGrid.innerHTML = filtered
      .map(
        (n) => `
    <div class="note-card collapsible animate-fade-in" id="note-${n.id}">
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
                } fa-heart fav-btn" onclick="toggleFavorite(${n.id})"></i>
            </div>
        </div>
        <div class="note-body">
            <p class="answer">${n.answer}</p>

            <div class="code-snippet">
                <pre><code id="code-${n.id}">${n.code.content}</code></pre>
                <button class="copy-btn" onclick="copyToClipboard('code-${
                  n.id
                }', this)" title="Copy mã nguồn">
                    <i class="far fa-copy"></i>
                </button>
            </div>
        </div>
    </div>
`
      )
      .join("");
    setupAccordion();
  }

  categorySelect.onchange = () => {
    updateSubMenu();
    renderAll();
  };
  subCategorySelect.onchange = renderAll;
  searchInput.oninput = renderAll;

  window.toggleFavorite = function (id) {
    let favorites = JSON.parse(localStorage.getItem("favNotes")) || [];
    favorites = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    localStorage.setItem("favNotes", JSON.stringify(favorites));
    renderAll();
  };

  function setupAccordion() {
    document.querySelectorAll(".note-header").forEach((h) => {
      h.onclick = (e) => {
        if (!e.target.classList.contains("fa-heart"))
          h.parentElement.classList.toggle("open");
      };
    });
  }

  initMenus();
  renderAll();
});
