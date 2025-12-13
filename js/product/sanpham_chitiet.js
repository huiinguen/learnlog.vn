// --- 1. Global function: Format currency ---
function formatCurrency(price) {
  if (typeof price !== "number") return "";
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

// --- 2. Change main image ---
function changeMainImage(newImageUrl) {
  const mainImage = document.getElementById("mainProductImage");
  if (mainImage) {
    mainImage.src = newImageUrl;
    document.querySelectorAll(".thumbnail-images img").forEach((thumb) => {
      thumb.classList.remove("active");
      const newName = newImageUrl.substring(newImageUrl.lastIndexOf("/") + 1);
      const thumbName = thumb.src.substring(thumb.src.lastIndexOf("/") + 1);
      if (thumbName === newName) thumb.classList.add("active");
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const productDetailContainer = document.getElementById("productDetailContainer");
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id"));

  // --- Helper: Show Toast ---
  function showToast(message) {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.style.position = "fixed";
      container.style.bottom = "20px";
      container.style.right = "20px";
      container.style.zIndex = "9999";
      document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.background = "#333";
    toast.style.color = "#fff";
    toast.style.padding = "10px 15px";
    toast.style.marginTop = "8px";
    toast.style.borderRadius = "8px";
    toast.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    container.appendChild(toast);
    setTimeout(() => (toast.style.opacity = "1"), 50);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  if (!productDetailContainer) {
    console.error("Product detail container not found!");
    return;
  }
  if (isNaN(productId) || typeof allProducts === "undefined") {
    productDetailContainer.innerHTML = '<p class="error-text" style="color:#ff79c6; text-align:center;">ID sản phẩm không hợp lệ hoặc dữ liệu chưa sẵn sàng.</p>';
    return;
  }

  const product = allProducts.find((p) => p.id === productId);

  if (product) {
    displayProductDetails(product);
    if (product.salePrice && product.saleEndDate) {
      startSaleCountdown(product.saleEndDate);
    }
  } else {
    productDetailContainer.innerHTML = '<p class="error-text" style="color:#ff79c6; text-align:center;">Không tìm thấy sản phẩm.</p>';
  }

  // ====================== RENDER STAR RATING ======================
  function renderStarRating(rating) {
    if (typeof rating !== "number" || rating < 0 || rating > 5) return "";
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.25 && rating % 1 <= 0.75;
    let html = "";
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) html += '<i class="fas fa-star filled"></i>';
      else if (i === fullStars && hasHalfStar) html += '<i class="fas fa-star-half-alt filled"></i>';
      else html += '<i class="far fa-star"></i>';
    }
    return `<div class="star-rating" title="${rating.toFixed(1)} / 5 sao">${html}</div>`;
  }

  // ====================== COUNTDOWN ======================
  function startSaleCountdown(endDateString) {
    const countdownElement = document.getElementById("saleCountdownTimer");
    if (!countdownElement) return;
    const endDate = new Date(endDateString).getTime();
    let countdownInterval;
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = endDate - now;
      if (distance < 0) {
        countdownElement.innerHTML = "Ưu đãi đã kết thúc!";
        clearInterval(countdownInterval);
        return;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      countdownElement.innerHTML = `Thời hạn sale: 
        <span title="Ngày">${days} N</span> 
        <span title="Giờ">${hours} G</span> 
        <span title="Phút">${minutes} P</span> 
        <span title="Giây">${seconds} S</span>`;
    };
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
  }

  // ====================== HIỂN THỊ CHI TIẾT ======================
  function displayProductDetails(prod) {
    const functionsListHtml = prod.functions
      ? `<div class="product-details-section">
            <h2><i class="fas fa-check-circle"></i> Tính năng nổi bật</h2>
            <ul class="professional-list">
                ${prod.functions.split("\n").map((f) => `<li>${f.trim()}</li>`).join("")}
            </ul>
         </div>`
      : "";

    // ----- Giá -----
    let priceHtml = "";
    if (prod.price === 0) {
      priceHtml = `<p class="product-price price-free">Giá: <span>Miễn phí</span></p>`;
    } else if (prod.salePrice && prod.salePrice < prod.price) {
      priceHtml = `
        <div class="price-block">
            <p class="product-price original-price on-sale">${formatCurrency(prod.price)}</p>
            <p class="product-price sale-price">Giá ưu đãi: <span>${formatCurrency(prod.salePrice)}</span></p>
            <p id="saleCountdownTimer" class="sale-countdown"></p>
        </div>`;
    } else {
      priceHtml = `<p class="product-price">Giá: <span>${formatCurrency(prod.price)}</span></p>`;
    }

    // ----- Meta info -----
    const ratingHtml = prod.rating ? renderStarRating(prod.rating) : "";
    const versionHtml = prod.version ? `<span class="meta-version"><i class="fas fa-code-branch"></i> Phiên bản: ${prod.version}</span>` : "";
    const statusHtml = prod.status ? `<span class="meta-status"><i class="fas fa-info-circle"></i> ${prod.status}</span>` : "";

    // ----- NÚT HÀNH ĐỘNG MỚI -----
    let actionSectionHtml = `<div class="product-actions new-actions">`;

    // Nút Copy link
    actionSectionHtml += `
      <button class="cta-button copy-link-btn">
        <i class="fas fa-link"></i> Copy Link
      </button>`;

    if (prod.price > 0) {
      // Sản phẩm trả phí → Liên hệ
      actionSectionHtml += `
        <button class="cta-button contact-btn">
          <i class="fas fa-comments"></i> Liên hệ mua
        </button>`;
    } else {
      // Miễn phí → Đi đến đích
      if (prod.resourceLink) {
        actionSectionHtml += `
          <a href="${prod.resourceLink}" class="cta-button" target="_blank" rel="noopener noreferrer">
            <i class="fas fa-external-link-alt"></i> Đi đến đích
          </a>`;
      }
    }
    actionSectionHtml += `</div>`;

    // ----- HTML chính -----
    const productHtml = `
      <div class="product-gallery">
        <div class="main-image-container">
          <img id="mainProductImage" src="${prod.images_gallery[0] || 'images/placeholder.png'}" alt="${prod.name}">
        </div>
        ${prod.images_gallery.length > 1 ? `
        <div class="thumbnail-images">
          ${prod.images_gallery.map((img, idx) => `
            <img src="${img}" alt="Thumbnail ${idx+1}" onclick="changeMainImage('${img}')" class="${idx===0 ? 'active' : ''}">
          `).join("")}
        </div>` : ""}
      </div>

      <div class="product-info-content">
        <h1 class="product-title">${prod.name}</h1>
        <div class="meta-info-group">
          ${ratingHtml}
          ${versionHtml}
          ${statusHtml}
        </div>
        <hr class="separator"/>
        ${priceHtml}
        ${actionSectionHtml}
        <hr class="separator"/>
        <div class="product-details-section">
          <h2><i class="fas fa-align-left"></i> Mô tả chi tiết</h2>
          <p class="product-description-text">${prod.description || "Không có mô tả chi tiết."}</p>
        </div>
        ${functionsListHtml}
      </div>
    `;

    productDetailContainer.innerHTML = productHtml;

    // ====================== NÚT COPY LINK ======================
    const copyBtn = document.querySelector(".copy-link-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
          showToast("Đã copy link sản phẩm!");
          copyBtn.innerHTML = '<i class="fas fa-check"></i> Đã copy!';
          setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-link"></i> Copy Link';
          }, 2000);
        }).catch(() => {
          showToast("Copy thất bại, vui lòng thử lại.");
        });
      });
    }

    // ====================== NÚT LIÊN HỆ → MỞ MODAL ======================
    const contactBtn = document.querySelector(".contact-btn");
    if (contactBtn) {
      contactBtn.addEventListener("click", openContactModal);
    }
  }

  // ====================== MODAL LIÊN HỆ ======================
  function openContactModal() {
    const existing = document.getElementById("contactModal");
    if (existing) {
      existing.style.display = "flex";
      return;
    }

    const modal = document.createElement("div");
    modal.id = "contactModal";
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-content">
        <span class="modal-close"><i class="fas fa-times"></i></span>
        <h3><i class="fas fa-shopping-cart"></i> Liên hệ mua hàng</h3>
        <div class="contact-info">
          <p><strong>Facebook:</strong> <a href="https://fb.com/hvcoder.vn" target="_blank">fb.com/hvcoder.vn</a></p>
          <p><strong>Zalo:</strong> <a href="https://zalo.me/0988654321" target="_blank">0988.654.321</a></p>
          <p><strong>Telegram:</strong> <a href="https://t.me/hvcoder" target="_blank">@hvcoder</a></p>
          <p><strong>Email:</strong> hvcoder.vn@gmail.com</p>
        </div>
        <div style="margin-top:20px; text-align:center;">
          <small style="color:#bb86fc;">Nhắn tin ngay để được báo giá tốt nhất!</small>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector(".modal-close");
    closeBtn.onclick = () => { modal.style.display = "none"; };
    
    modal.onclick = (e) => { 
        if (e.target === modal) modal.style.display = "none"; 
    };
    
    modal.style.display = "flex";
  }

  // ====================== BACK BUTTON + GHI NHỚ TRẠNG THÁI LỌC ======================
  const backButton = document.querySelector(".fixed-back-btn");
  if (backButton) {
    const referrer = document.referrer;
    let savedParams = "";

    if (referrer && referrer.includes("sanpham.html")) {
      const url = new URL(referrer);
      savedParams = url.search;
      sessionStorage.setItem("productListReturnState", savedParams);
    } else {
      const stored = sessionStorage.getItem("productListReturnState");
      if (stored) savedParams = stored;
    }
    backButton.href = `sanpham.html${savedParams ? "?" + savedParams.substring(1) : ""}`;
  }
});