const INSTA_DATA = [
    {
        id: "i1",
        title: "Chill cuối tuần",
        description: "Kỉ niệm săn mây HÒA BẮC-ĐÀ NẴNG",
        images: [
            
            "images/insta/1.JPG",
            "images/insta/2.JPG",
            "images/insta/3.JPG",

        ],
        date: "08/12/2025",
        location: "Đà Nẵng",
        likes: 128
    },
    {
        id: "i2",
        title: "Hiking",
        description: "Buổi hiking Hải Vân Quan",
        images: [
            "https://res.cloudinary.com/dxcuzqm9m/image/upload/v1766933621/6_avb3mi.jpg",
            "https://res.cloudinary.com/dxcuzqm9m/image/upload/v1766933608/5_qcttbd.jpg",
            "https://res.cloudinary.com/dxcuzqm9m/image/upload/v1766933609/9_opbuaa.jpg",
            "https://res.cloudinary.com/dxcuzqm9m/image/upload/v1766933609/8_dyxa8x.jpg",
            "https://res.cloudinary.com/dxcuzqm9m/image/upload/v1766933606/4_ljwjfl.jpg",
        ],
        date: "27/12/2025",
        location: "Đà Nẵng",
        likes: 256
    }
];
/**
 * Render giao diện chế độ Instagram (Minimalist Mode)
 * @param {HTMLElement} container - Khu vực chứa nội dung vlog
 */
function renderInstaMode(container) {
    // Lấy dữ liệu từ INSTA_DATA (đã được tách ra từ vlog_data.js)
    if (typeof INSTA_DATA === 'undefined' || INSTA_DATA.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:50px; opacity:0.5;">Chưa có bài viết nào trong hệ thống.</div>`;
        return;
    }

    const feedHtml = INSTA_DATA.map(item => {
        // Xử lý danh sách ảnh: Ưu tiên mảng images, nếu không có thì dùng thumbnail đơn lẻ
        const images = item.images && item.images.length > 0 ? item.images : [item.thumbnail];
        const hasMultiple = images.length > 1;

        return `
        <article class="insta-post animate-pop">
            <div class="post-header">
                <div class="u-info">
                    <div class="u-avatar">${item.location ? item.location.charAt(0) : 'G'}</div>
                    <div>
                        <div class="u-name">ERROR⚠️</div>
                        <div class="u-loc"><i class="fas fa-map-marker-alt"></i> ${item.location || 'Unknown'}</div>
                    </div>
                </div>
                <div class="post-options">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            
            <div class="post-slider" id="slider-${item.id}" data-current="0">
                <div class="slider-track" style="display: flex; transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);">
                    ${images.map(img => `<img src="${img}" alt="post-content" style="min-width:100%; aspect-ratio:1/1; object-fit:cover;">`).join('')}
                </div>
                
                ${hasMultiple ? `
                    <button class="slider-btn prev-btn" onclick="changeSlide('${item.id}', -1)">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="slider-btn next-btn" onclick="changeSlide('${item.id}', 1)">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    <div class="slider-dots">
                        ${images.map((_, idx) => `<span class="dot ${idx === 0 ? 'active' : ''}"></span>`).join('')}
                    </div>
                ` : ''}

                <div class="heart-overlay" id="heart-overlay-${item.id}">
                    <i class="fas fa-heart"></i>
                </div>
            </div>

            <div class="post-footer">
                <div class="post-btns">
                    <div class="left-btns">
                        <i class="far fa-heart" id="like-btn-${item.id}" onclick="toggleLike('${item.id}')"></i>
                        <i class="far fa-paper-plane" onclick="sharePost('${item.id}')"></i>
                    </div>
                    <i class="far fa-bookmark" onclick="savePost('${item.id}')"></i>
                </div>
                
                <div class="post-content-area">
                    <div class="post-likes"><b>${item.likes || 0}</b> lượt thích</div>
                    <div class="post-desc">
                        <span class="u-name-inline"><b>ERROR⚠️</b></span> ${item.description}
                    </div>
                    <div class="post-date">${item.date}</div>
                </div>
            </div>
        </article>
        `;
    }).join('');
    
    container.innerHTML = `<div class="insta-feed">${feedHtml}</div>`;
}

/**
 * Điều khiển chuyển ảnh trong Slider
 */
function changeSlide(postId, direction) {
    const slider = document.querySelector(`#slider-${postId}`);
    const track = slider.querySelector('.slider-track');
    const dots = slider.querySelectorAll('.dot');
    const totalSlides = dots.length;
    
    let currentSlide = parseInt(slider.getAttribute('data-current') || 0);
    
    currentSlide += direction;
    
    // Vòng lặp slider
    if (currentSlide >= totalSlides) currentSlide = 0;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Cập nhật trạng thái dot
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
    });
    
    slider.setAttribute('data-current', currentSlide);
}

/**
 * Logic thả tim (Like)
 */
function toggleLike(id) {
    const btn = document.getElementById(`like-btn-${id}`);
    const isLiked = btn.classList.contains('fas');
    
    if (!isLiked) {
        btn.classList.replace('far', 'fas');
        btn.style.color = '#ff3040';
        btn.style.animation = 'heartPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    } else {
        btn.classList.replace('fas', 'far');
        btn.style.color = '';
        btn.style.animation = '';
    }
}

/**
 * Các tính năng bổ sung (Placeholder)
 */
function sharePost(id) {
    console.log("Sharing post:", id);
    alert("Đã sao chép liên kết bài viết!");
}

function savePost(id) {
    alert("Đã lưu vào bộ sưu tập!");
}