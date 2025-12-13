document.addEventListener('DOMContentLoaded', function() {
    // Đảm bảo rằng notesData đã được load từ ghichu-data.js
    if (typeof notesData === 'undefined') {
        console.error('Lỗi: Không tìm thấy dữ liệu ghi chú (notesData). Hãy đảm bảo ghichu-data.js đã được nhúng.');
        return;
    }

    const noteGrid = document.getElementById('noteGrid');
    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('categorySelect');
    const subCategoryTabs = document.getElementById('subCategoryTabs'); // Element mới cho tabs con
    const noResults = document.getElementById('noResults');

    // Biến lưu trữ subCategory đang được chọn, mặc định là 'all'
    let selectedSubCategory = 'all'; 

    // ====================================================
    // LOGIC TÌM KIẾM VÀ PHÂN LOẠI
    // ====================================================

    // Khởi tạo Category Dropdown (Chỉ hiện Category chính)
    function setupCategories() {
        // Lấy danh sách Category chính duy nhất
        const categories = [...new Set(notesData.map(item => item.category))].sort();
        
        categorySelect.innerHTML = '<option value="all">Tất Cả</option>'; 
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
        
        // Chạy setup Sub-categories lần đầu cho category mặc định (Tất Cả)
        setupSubCategories(categorySelect.value);
    }
    
    // Khởi tạo/Cập nhật Sub-Category Tabs (Tab con)
    function setupSubCategories(mainCategory) {
        if (!subCategoryTabs) return;
        
        subCategoryTabs.innerHTML = '';
        selectedSubCategory = 'all'; // Reset tab con khi đổi category chính
        
        if (mainCategory === 'all') {
            subCategoryTabs.style.display = 'none';
            return;
        }
        
        subCategoryTabs.style.display = 'flex'; // Hiển thị tab con
        
        // Lấy danh sách Sub-Category duy nhất thuộc Category chính đang chọn
        const subCategories = [...new Set(notesData
            .filter(item => item.category === mainCategory && item.subCategory) // Chỉ lọc những item có subCategory
            .map(item => item.subCategory)
        )].sort();

        // Thêm tab "Tất Cả"
        const allTab = document.createElement('button');
        allTab.textContent = 'Tất Cả';
        allTab.className = 'sub-tab active'; // Mặc định active
        allTab.dataset.sub = 'all';
        subCategoryTabs.appendChild(allTab);

        // Thêm các Sub-Category Tabs khác
        subCategories.forEach(sub => {
            const tab = document.createElement('button');
            tab.textContent = sub;
            tab.className = 'sub-tab';
            tab.dataset.sub = sub;
            subCategoryTabs.appendChild(tab);
        });
        
        // Gắn sự kiện click cho các tab con
        subCategoryTabs.querySelectorAll('.sub-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                // Xử lý Active state
                subCategoryTabs.querySelector('.sub-tab.active')?.classList.remove('active');
                this.classList.add('active');
                
                // Cập nhật biến và lọc
                selectedSubCategory = this.dataset.sub;
                filterAndRenderNotes();
            });
        });
    }

    // Hàm lọc chính (Đã được bổ sung lọc theo Sub-Category)
    function filterAndRenderNotes() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value;
        
        const filteredNotes = notesData.filter(item => {
            // Lọc theo Category chính
            const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;

            // Lọc theo Sub-Category (chỉ áp dụng nếu không phải là 'all')
            const subCategoryMatch = selectedSubCategory === 'all' || 
                                     (item.subCategory && item.subCategory === selectedSubCategory);
                                     
            // Lọc theo Search Term (tìm kiếm trong title, answer và code content)
            const searchMatch = item.title.toLowerCase().includes(searchTerm) ||
                                item.answer.toLowerCase().includes(searchTerm) ||
                                (item.code && item.code.content.toLowerCase().includes(searchTerm));
            
            return categoryMatch && subCategoryMatch && searchMatch;
        });

        renderNotes(filteredNotes);
    }

    // Thêm Listener cho Tìm kiếm
    searchInput.addEventListener('input', filterAndRenderNotes);
    
    // Thêm Listener cho Phân loại chính (Cần chạy lại setup tab con)
    categorySelect.addEventListener('change', function() {
        setupSubCategories(this.value); // Chạy lại setup tab con
        filterAndRenderNotes();
    });
    
    // ====================================================
    // HÀM RENDER GIAO DIỆN (Sử dụng dữ liệu đã lọc)
    // ====================================================
    function renderNotes(notesToRender) {
        if (!noteGrid) return;
        
        noteGrid.innerHTML = ''; // Xóa nội dung cũ

        if (notesToRender.length === 0) {
            noResults.style.display = 'block';
            return;
        } else {
            noResults.style.display = 'none';
        }

        notesToRender.forEach(item => {
            const noteClass = item.note.type === 'warning' ? 'note-warning' : 'note-info';
            const noteIcon = item.note.type === 'warning' ? 'fa-exclamation-circle' : 'fa-info-circle';
            const noteLabel = item.note.type === 'warning' ? 'Lưu ý:' : 'Note:';
            
            // Hiển thị cả Category chính và Sub-Category
            const categoryDisplay = item.subCategory ? 
                                    `${item.code.lang} (${item.category} / ${item.subCategory})` : 
                                    `${item.code.lang} (${item.category})`;

            const cardHTML = `
                <div class="note-card animate-fade-in">
                    <div class="note-header">
                        <h3>${item.title}</h3>
                    </div>
                    <div class="note-body">
                        <p class="answer">${item.answer}</p>
                        
                        <div class="${noteClass}">
                            <i class="fas ${noteIcon}"></i>
                            <div><strong>${noteLabel}</strong> ${item.note.text}</div>
                        </div>

                        <div class="code-snippet">
                            <div class="code-header">
                                <span>${categoryDisplay}</span>
                                <button class="copy-btn" onclick="copyCode(this)">Copy</button>
                            </div>
                            <pre><code>${escapeHtml(item.code.content)}</code></pre>
                        </div>
                    </div>
                </div>
            `;
            
            noteGrid.innerHTML += cardHTML;
        });
    }

    // Hàm xử lý ký tự đặc biệt trong code
    function escapeHtml(text) {
        if (!text) return "";
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Chạy khởi tạo
    setupCategories();
    filterAndRenderNotes(); // Render lần đầu tiên
});

// ====================================================
// TÍNH NĂNG COPY CODE (Giữ nguyên)
// ====================================================
function copyCode(btn) {
    const codeBlock = btn.parentElement.nextElementSibling.querySelector('code');
    const textToCopy = codeBlock.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.innerText;
        btn.innerText = 'Copied!';
        btn.style.background = '#00ff9d';
        btn.style.color = '#000';
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = '';
            btn.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Copy thất bại:', err);
    });
}