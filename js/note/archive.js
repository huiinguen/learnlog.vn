document.addEventListener('DOMContentLoaded', function() {
    const archiveGrid = document.getElementById('archiveGrid');
    
    function renderArchive() {
        const favorites = JSON.parse(localStorage.getItem('favNotes')) || [];
        const archivedNotes = notesData.filter(n => favorites.includes(n.id));

        if (archivedNotes.length === 0) {
            archiveGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 50px; color: #8c78a6;">
                    <i class="fas fa-folder-open" style="font-size: 3rem; margin-bottom: 15px;"></i>
                    <p>Kho lưu trữ đang trống!</p>
                </div>`;
            return;
        }

        archiveGrid.innerHTML = archivedNotes.map(n => `
            <div class="note-card open animate-fade-in" id="note-${n.id}">
                <div class="note-header">
                    <h3>${n.title}</h3>
                    <div class="header-actions">
                        <i class="fas fa-trash-alt remove-fav" onclick="removeAndRefresh(${n.id})" style="color: #ff5252; cursor: pointer;"></i>
                    </div>
                </div>
                <div class="note-body">
                    <p class="answer">${n.answer}</p>
                    <div class="code-snippet">
                        <pre><code>${n.code.content}</code></pre>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 1. Sao lưu dữ liệu (Chỉ lưu danh sách ID yêu thích)
    window.downloadBackup = function() {
        const favorites = JSON.parse(localStorage.getItem('favNotes')) || [];
        if (favorites.length === 0) return alert("Kho lưu trữ trống!");

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(favorites));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `backup_fav_notes.json`);
        downloadAnchor.click();
    };

    // 2. Đồng bộ dữ liệu từ file JSON
    window.importBackup = function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                if (Array.isArray(importedData)) {
                    localStorage.setItem('favNotes', JSON.stringify(importedData));
                    alert("Đồng bộ thành công!");
                    renderArchive();
                }
            } catch (err) { alert("File không hợp lệ!"); }
        };
        reader.readAsText(file);
    };

    // 3. Xuất PDF nội dung lưu trữ (Nền trắng, text đen)
    window.exportArchivePDF = function() {
        const favorites = JSON.parse(localStorage.getItem('favNotes')) || [];
        const listToExport = notesData.filter(n => favorites.includes(n.id));

        if (listToExport.length === 0) return alert("Không có nội dung để xuất!");

        const element = document.createElement('div');
        element.style.padding = '30px';
        element.style.backgroundColor = '#ffffff';

        let html = `<h1 style="text-align:center; color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">KHO LƯU TRỮ GHI CHÚ</h1>`;
        
        listToExport.forEach(n => {
            html += `
                <div style="margin-bottom: 25px; page-break-inside: avoid; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                    <h2 style="color: #0056b3; margin-bottom: 5px;">${n.title}</h2>
                    <p style="color: #333; line-height: 1.6;">${n.answer}</p>
                    <div style="background: #f8f8f8; border: 1px solid #ddd; padding: 10px; border-radius: 4px;">
                        <pre style="margin: 0; white-space: pre-wrap; font-family: monospace;">${n.code.content}</pre>
                    </div>
                </div>`;
        });
        element.innerHTML = html;

        html2pdf().set({
            margin: 10,
            filename: 'My-Archived-Notes.pdf',
            html2canvas: { scale: 2, backgroundColor: '#ffffff' },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }).from(element).save();
    };

    // Xóa nhanh và refresh
    window.removeAndRefresh = function(id) {
        if(!confirm("Xóa khỏi kho lưu trữ?")) return;
        let favorites = JSON.parse(localStorage.getItem('favNotes')) || [];
        favorites = favorites.filter(f => f !== id);
        localStorage.setItem('favNotes', JSON.stringify(favorites));
        renderArchive();
    };

    renderArchive();
});