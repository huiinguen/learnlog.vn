// Dữ liệu mẫu cho Suy nghĩ
const THOUGHT_DATA = [
    {
        id: "t1",
        date: "28/12/2025",
        content: "Đôi khi code không chạy không phải do lỗi cú pháp, mà do tâm hồn đang bận 'reboot'...",
        likes: 12,
        funny: 5
    },
    {
        id: "t2",
        date: "27/12/2025",
        content: "Đứng giữa đèo Hải Vân, thấy mình nhỏ bé trước thiên nhiên nhưng lại thấy 'to lớn' vì đã dám đi.",
        likes: 28,
        funny: 0
    }
];

/**
 * Render giao diện Suy nghĩ
 */
function renderThoughtMode(container) {
    const html = THOUGHT_DATA.map(item => `
        <div class="thought-card animate-pop">
            <div class="thought-content">
                "${item.content}"
            </div>
            <div class="thought-actions">
                <div class="action-item active-red">
                    <i class="fas fa-heart"></i> <span>${item.likes}</span>
                </div>
                <div class="action-item">
                    <i class="fas fa-face-grin-squint-tears"></i> <span>${item.funny}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = `<div class="thought-grid">${html}</div>`;
}