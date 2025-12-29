// Khởi tạo dữ liệu từ LocalStorage hoặc giá trị mặc định
let userStats = JSON.parse(localStorage.getItem('userStats')) || {
    username: "Người dùng ẩn danh",
    loginCount: 0,
    clicks: { product: 0, note: 0, quiz: 0, vlog: 0 }
};

// Xuất file JSON (Sao lưu dữ liệu)
function exportAccount() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userStats));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `account_${userStats.username}.json`);
    downloadAnchor.click();
}

// Nhập file JSON (Đăng nhập bằng file)
function importAccount(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (importedData.clicks) {
                localStorage.setItem('userStats', JSON.stringify(importedData));
                alert("Đăng nhập thành công!");
                location.reload();
            }
        } catch (err) { alert("File không hợp lệ!"); }
    };
    reader.readAsText(file);
}

// Hiển thị báo cáo Rewind
function renderRewind() {
    const container = document.getElementById('rewindContainer');
    const clicks = userStats.clicks;
    const favorite = Object.keys(clicks).reduce((a, b) => clicks[a] > clicks[b] ? a : b);
    
    container.innerHTML = `
        <h2>Hành trình của ${userStats.username}</h2>
        <div class="stats-rewind-grid">
            <div class="stat-box"><span class="stat-number">${userStats.loginCount}</span> Lần ghé thăm</div>
            <div class="stat-box"><span class="stat-number">${clicks.product + clicks.note}</span> Tương tác</div>
        </div>
        <div class="highlight-interest">Bạn dành nhiều thời gian nhất cho: <br><b>${favorite.toUpperCase()}</b></div>
        <div class="profile-actions">
            <button class="btn-profile btn-export" onclick="exportAccount()">Sao lưu .json</button>
            <button class="btn-profile btn-import" onclick="document.getElementById('importFile').click()">Đăng nhập .json</button>
        </div>
    `;
}