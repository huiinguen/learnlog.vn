/**
 * SANPHAM_CHITIET.JS - Cập nhật 2026
 * 1. Loại bỏ hoàn toàn giá tiền/miễn phí.
 * 2. Tối ưu nút bấm: Sao chép, Truy cập, Link gốc.
 */

// --- 1. Thay đổi ảnh chính trong Gallery ---
function changeMainImage(newImageUrl) {
    const mainImage = document.getElementById("mainProductImage");
    if (mainImage) {
        mainImage.src = newImageUrl;
        // Cập nhật trạng thái active cho thumbnail
        document.querySelectorAll(".thumbnail-images img").forEach((thumb) => {
            thumb.classList.remove("active");
            if (thumb.src === newImageUrl) thumb.classList.add("active");
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const productDetailContainer = document.getElementById("productDetailContainer");
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get("id"));

    // --- Helper: Hiển thị thông báo Toast ---
    function showToast(message) {
        let container = document.getElementById("toastContainer");
        if (!container) {
            container = document.createElement("div");
            container.id = "toastContainer";
            Object.assign(container.style, {
                position: "fixed",
                bottom: "20px",
                right: "20px",
                zIndex: "9999"
            });
            document.body.appendChild(container);
        }
        const toast = document.createElement("div");
        toast.textContent = message;
        Object.assign(toast.style, {
            background: "rgba(187, 134, 252, 0.9)",
            color: "#0f0f1e",
            padding: "10px 20px",
            marginTop: "8px",
            borderRadius: "6px",
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            opacity: "0",
            transition: "opacity 0.3s ease"
        });
        container.appendChild(toast);
        setTimeout(() => (toast.style.opacity = "1"), 50);
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // Kiểm tra dữ liệu
    if (!productDetailContainer) return;
    if (isNaN(productId) || typeof allProducts === "undefined") {
        productDetailContainer.innerHTML = '<p class="error-text">Dữ liệu không hợp lệ.</p>';
        return;
    }

    const product = allProducts.find((p) => p.id === productId);

    if (product) {
        displayProductDetails(product);
    } else {
        productDetailContainer.innerHTML = '<p class="error-text">Không tìm thấy sản phẩm.</p>';
    }

    // --- 2. Render đánh giá sao ---
    function renderStarRating(rating) {
        if (!rating) return "";
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.25;
        let html = "";
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) html += '<i class="fas fa-star filled"></i>';
            else if (i === fullStars && hasHalfStar) html += '<i class="fas fa-star-half-alt filled"></i>';
            else html += '<i class="far fa-star"></i>';
        }
        return `<div class="star-rating" title="${rating}/5 sao">${html}</div>`;
    }

    // --- 3. Hiển thị chi tiết sản phẩm ---
    function displayProductDetails(prod) {
        // Xử lý danh sách tính năng
        const functionsHtml = prod.functions
            ? `<div class="product-details-section">
                <h2><i class="fas fa-layer-group"></i> Tính năng</h2>
                <ul class="professional-list">
                    ${prod.functions.split("\n").map(f => `<li>${f.trim()}</li>`).join("")}
                </ul>
               </div>`
            : "";

        // Thiết lập bộ nút hành động tối giản
        let actionButtonsHtml = `<div class="product-actions new-actions">`;
        
        // Nút 1: Sao chép link trang hiện tại
        actionButtonsHtml += `
            <button class="cta-button btn-copy-page" title="Sao chép liên kết sản phẩm">
                <i class="fas fa-copy"></i> Sao chép
            </button>`;

        // Nút 2: Đi đến đích (Nếu có link)
        if (prod.resourceLink) {
            actionButtonsHtml += `
                <a href="${prod.resourceLink}" class="cta-button btn-visit" target="_blank" rel="noopener noreferrer">
                    <i class="fas fa-external-link-alt"></i> Truy cập
                </a>`;

            // Nút 3: Sao chép link đích
            actionButtonsHtml += `
                <button class="cta-button btn-copy-link" data-link="${prod.resourceLink}" title="Sao chép link gốc">
                    <i class="fas fa-link"></i> Link gốc
                </button>`;
        }
        actionButtonsHtml += `</div>`;

        // Render toàn bộ giao diện
        productDetailContainer.innerHTML = `
            <div class="product-gallery">
                <div class="main-image-container">
                    <img id="mainProductImage" src="${prod.images_gallery[0] || 'images/placeholder.png'}" alt="${prod.name}">
                </div>
                ${prod.images_gallery.length > 1 ? `
                <div class="thumbnail-images">
                    ${prod.images_gallery.map((img, idx) => `
                        <img src="${img}" alt="Thumb" onclick="changeMainImage('${img}')" class="${idx === 0 ? 'active' : ''}">
                    `).join("")}
                </div>` : ""}
            </div>

            <div class="product-info-content">
                <h1 class="product-title">${prod.name}</h1>
                <div class="meta-info-group">
                    ${renderStarRating(prod.rating)}
                    ${prod.version ? `<span class="meta-version"><i class="fas fa-code-branch"></i> v${prod.version}</span>` : ""}
                    ${prod.status ? `<span class="meta-status"><i class="fas fa-info-circle"></i> ${prod.status}</span>` : ""}
                </div>
                
                <hr class="separator"/>
                ${actionButtonsHtml}
                <hr class="separator"/>

                <div class="product-details-section">
                    <h2><i class="fas fa-info-circle"></i> Mô tả</h2>
                    <p class="product-description-text">${prod.description || "Đang cập nhật nội dung..."}</p>
                </div>
                ${functionsHtml}
            </div>
        `;

        // Gán sự kiện cho các nút bấm
        setupButtonEvents();
    }

    // --- 4. Thiết lập sự kiện cho nút bấm ---
    function setupButtonEvents() {
        // Sự kiện copy link trang hiện tại
        document.querySelector(".btn-copy-page")?.addEventListener("click", function() {
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast("Đã sao chép liên kết trang!");
            });
        });

        // Sự kiện copy link gốc (resourceLink)
        document.querySelector(".btn-copy-link")?.addEventListener("click", function() {
            const link = this.getAttribute("data-link");
            navigator.clipboard.writeText(link).then(() => {
                showToast("Đã sao chép link gốc!");
            });
        });
    }

    // --- 5. Xử lý nút quay lại & Ghi nhớ bộ lọc ---
    const backButton = document.querySelector(".fixed-back-btn");
    if (backButton) {
        const referrer = document.referrer;
        let savedParams = "";

        if (referrer && referrer.includes("sanpham.html")) {
            savedParams = new URL(referrer).search;
            sessionStorage.setItem("productListReturnState", savedParams);
        } else {
            savedParams = sessionStorage.getItem("productListReturnState") || "";
        }
        backButton.href = `sanpham.html${savedParams}`;
    }
});