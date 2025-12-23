function openArchive() {
    const grid = document.getElementById('vlogGrid');
    
    grid.innerHTML = VLOG_DATA.map(item => `
        <div class="memory-card animate-fade-in" onclick="viewDetail(${item.id})">
            <img src="${item.thumbnail}" alt="Memory">
            <div class="memory-caption">${item.title}</div>
        </div>
    `).join('');
}

function viewDetail(id) {
    const item = VLOG_DATA.find(v => v.id === id);
    const modal = document.getElementById('detailModal');
    
    document.getElementById('detailImg').src = item.thumbnail;
    document.getElementById('detailTitle').innerText = item.title;
    document.getElementById('detailCaption').innerText = item.description;
    document.getElementById('detailDate').innerText = item.date || "Hôm nay";
    
    modal.style.display = 'flex';
}

function closeDetail() {
    document.getElementById('detailModal').style.display = 'none';
}

// Chạy khởi tạo
document.addEventListener('DOMContentLoaded', openArchive);