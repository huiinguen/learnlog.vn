document.addEventListener("DOMContentLoaded", function () {
    const grid = document.getElementById("articleGrid");
    const modal = document.getElementById("articleModal");
    const body = document.getElementById("modalBody");
    const closeBtn = document.getElementById("closeBtn");
    const bg = document.getElementById("modalBg");
    const modalCopyBtn = document.getElementById("modalCopyBtn");
    const toast = document.getElementById("toast");
    
    // Element cho tìm kiếm và lọc
    const searchInput = document.getElementById("articleSearch");
    const sortSelect = document.getElementById("articleSort");

    let currentOpenId = null;

    // Hàm chuyển "DD/MM/YYYY" -> Date object để so sánh
    function parseDate(dateStr) {
        const [day, month, year] = dateStr.split('/');
        return new Date(year, month - 1, day);
    }

    // 1. Hàm Render danh sách bài viết (Có lọc và sắp xếp)
    function renderList() {
        if (!grid || typeof articlesData === 'undefined') return;

        const searchTerm = searchInput.value.toLowerCase();
        const sortType = sortSelect.value;

        // B1: Lọc theo tìm kiếm
        let filtered = articlesData.filter(post => 
            post.title.toLowerCase().includes(searchTerm)
        );

        // B2: Sắp xếp theo ngày
        filtered.sort((a, b) => {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            return sortType === "newest" ? dateB - dateA : dateA - dateB;
        });

        // B3: Hiển thị ra giao diện
        if (filtered.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 50px; color: #8c78a6;">Không tìm thấy bài viết nào.</div>`;
            return;
        }

        grid.innerHTML = filtered.map(post => `
            <div class="article-card animate-fade-in" onclick="openPost(${post.id})">
                <button class="card-copy-btn" onclick="copyArticleLink(event, ${post.id})" title="Copy Link">
                    <i class="far fa-copy"></i>
                </button>
                <small>${post.category} • ${post.date}</small>
                <h3>${post.title}</h3>
            </div>
        `).join("");
    }

    // Lắng nghe sự kiện tìm kiếm và sắp xếp
    if (searchInput) searchInput.oninput = renderList;
    if (sortSelect) sortSelect.onchange = renderList;

    // 2. Mở Modal đè lên nội dung chính
    window.openPost = function(id) {
        const post = articlesData.find(a => a.id === id);
        if (!post) return;

        currentOpenId = id;
        body.innerHTML = `
            <img src="${post.image}" class="detail-img">
            <small style="color: #bb86fc;">${post.date} | ${post.category}</small>
            <h1>${post.title}</h1>
            <div class="post-content">${post.content}</div>
        `;
        
        modal.classList.add("active");
        document.body.classList.add("modal-open");
        document.querySelector('.modal-content-box').scrollTop = 0;
    };

    // 3. Đóng Modal
    function closePost() {
        if (modal) {
            modal.classList.remove("active");
            document.body.classList.remove("modal-open");
            currentOpenId = null;
            
            const url = new URL(window.location);
            url.searchParams.delete('id');
            window.history.pushState({}, '', url);
        }
    }

    // 4. Logic Sao chép liên kết & Toast
    window.copyArticleLink = function(event, id) {
        if(event) event.stopPropagation();
        
        const baseUrl = window.location.origin + window.location.pathname;
        const shareLink = `${baseUrl}?id=${id}`;
        
        navigator.clipboard.writeText(shareLink).then(() => {
            showToast();
        });
    };

    function showToast() {
        if (!toast) return;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2500);
    }

    // 5. Tự động mở bài viết nếu URL có ID
    function checkUrlForId() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (id) {
            const numericId = parseInt(id);
            setTimeout(() => openPost(numericId), 100);
        }
    }

    if (closeBtn) closeBtn.onclick = closePost;
    if (bg) bg.onclick = closePost;
    
    if (modalCopyBtn) {
        modalCopyBtn.onclick = () => {
            if (currentOpenId) copyArticleLink(null, currentOpenId);
        };
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closePost();
    });

    renderList();
    checkUrlForId();
});