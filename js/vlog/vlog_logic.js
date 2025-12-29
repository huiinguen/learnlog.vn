// 1. Thống kê số lượng (Cập nhật khi load trang)
function updateStatistics() {
    document.getElementById('locketCount').innerText = LOCKET_DATA.length;
    document.getElementById('instaCount').innerText = INSTA_DATA.length;
    document.getElementById('thoughtCount').innerText = THOUGHT_DATA.length; 
}

// 2. Chuyển đổi Mode
function switchMode(mode) {
    const container = document.getElementById('vlogContainer');
    const buttons = document.querySelectorAll('.mode-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Cập nhật ID nút active tương ứng
    const activeBtn = document.getElementById(`btn-${mode}`);
    if (activeBtn) activeBtn.classList.add('active');

    container.innerHTML = '';
    
    if (mode === 'locket') {
        renderLocketMode(container);
    } else if (mode === 'insta') {
        renderInstaMode(container);
    } else if (mode === 'thought') {
        renderThoughtMode(container);
    }
}

// 3. Hiển thị chi tiết (Fix lỗi không kích được)
function viewDetail(id) {
    const item = VLOG_DATA.find(v => v.id == id); // Dùng == để tránh lỗi kiểu dữ liệu
    if (!item) return;

    const modal = document.getElementById('detailModal');
    
    // Đổ dữ liệu vào đúng ID trong vlog.html
    document.getElementById('detailImg').src = item.thumbnail;
    document.getElementById('detailTitle').innerText = item.title;
    document.getElementById('detailCaption').innerText = item.description;
    document.getElementById('detailDate').innerText = `Kỉ niệm ngày: ${item.date}`;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Chặn cuộn trang khi xem ảnh
}

// 4. Đóng Modal
function closeVlogDetail() {
    const modal = document.getElementById('detailModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Chạy mặc định khi load trang
document.addEventListener('DOMContentLoaded', () => {
    updateStatistics();
    switchMode('locket'); // Ưu tiên Locket Mode như bạn yêu cầu
});
// 2. Sửa hàm viewDetail để nhận diện loại dữ liệu
function viewDetail(id, mode) {
    const modal = document.getElementById('detailModal');
    const feedContainer = document.getElementById('modalFeedContainer');
    
    if (mode === 'locket') {
        feedContainer.innerHTML = LOCKET_DATA.map(item => `
            <div class="detail-feed-item" id="detail-locket-${item.id}">
                <div class="detail-img-wrapper">
                    <img src="${item.thumbnail}" alt="memory">
                    <button class="download-btn" onclick="downloadImage('${item.thumbnail}', 'locket-${item.id}.jpg')">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
                <div class="detail-feed-info">
                    <p class="single-caption">${item.caption || item.description || item.title}</p>
                    <span class="detail-date-tag">${item.date}</span>
                </div>
            </div>
        `).join('');

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        const targetItem = document.getElementById(`detail-locket-${id}`);
        if (targetItem) targetItem.scrollIntoView({ behavior: 'auto' });
    }
}

/**
 * Logic tải xuống ảnh
 */
async function downloadImage(imageSrc, fileName) {
    try {
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Lỗi khi tải ảnh:', error);
        alert('Không thể tải ảnh này trực tiếp. Vui lòng thử lại hoặc chuột phải vào ảnh để lưu.');
    }
}