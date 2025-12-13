document.addEventListener('DOMContentLoaded', function() {
    const allProductGrid = document.getElementById('allProductGrid');
    const categoryFilterContainer = document.getElementById('categoryFilter');
    const searchInput = document.getElementById('searchInput');
    const sortBySelect = document.getElementById('sortBy');
    const paginationControls = document.getElementById('paginationControls');
    const productCountElement = document.getElementById('productCount');

    // Các thành phần cho QR Modal
    const qrModal = document.getElementById('qrModal');
    const closeQrModalBtn = document.getElementById('closeQrModal');
    const qrcodeContainer = document.getElementById('qrcodeContainer');
    const qrProductLinkText = document.getElementById('qrProductLink');

    // ⚠️ ĐÃ NÂNG CẤP: Thêm BASE_URL để tạo đường dẫn tuyệt đối cho QR Code
    // Thay thế bằng domain chính thức của bạn (hiện tại là GitHub Pages)
    const BASE_URL = 'https://huiinguen.github.io/share.vn.free/'; 

    const productsPerPage = 8;
    let currentPage = 1;
    let currentFilters = {
        category: 'all',
        subCategory: null,
        searchTerm: '',
        sortBy: 'newest'
    };
    let filteredProducts = [];
    let searchTimeout;

    const filterToggleBtn = document.getElementById('filterToggle');
    const sidebarFilters = document.getElementById('sidebarFilters');
    const closeFilterBtn = document.getElementById('closeFilterBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if (typeof allProducts === 'undefined' || allProducts.length === 0) {
        if (allProductGrid) {
            allProductGrid.innerHTML = "<p>Không có sản phẩm nào để hiển thị. Vui lòng kiểm tra lại dữ liệu.</p>";
        }
        return;
    }

    // ===========================================
    // HÀM XỬ LÝ LỌC & SẮP XẾP
    // ===========================================

    function updateUrl() {
        const urlParams = new URLSearchParams();
        if (currentFilters.category && currentFilters.category !== 'all') urlParams.set('category', currentFilters.category);
        if (currentFilters.subCategory) urlParams.set('subCategory', currentFilters.subCategory);
        if (currentFilters.searchTerm) urlParams.set('search', currentFilters.searchTerm);
        if (currentFilters.sortBy !== 'newest') urlParams.set('sortBy', currentFilters.sortBy);
        if (currentPage > 1) urlParams.set('page', currentPage);
        
        window.history.replaceState({}, '', `sanpham.html?${urlParams.toString()}`);
    }

function restoreFiltersFromUrl() {
    // Ưu tiên: Nếu có dữ liệu quay lại từ trang chi tiết → dùng nó
    const savedState = sessionStorage.getItem("productListReturnState");
    let params;

    if (savedState && savedState !== "") {
        params = new URLSearchParams(savedState);
        // Xóa sau khi dùng (chỉ dùng 1 lần)
        sessionStorage.removeItem("productListReturnState");
    } else {
        // Nếu không có lưu trước → dùng URL hiện tại
        params = new URLSearchParams(window.location.search);
    }

    currentFilters.category = params.get('category') || 'all';
    currentFilters.subCategory = params.get('subCategory') || null;
    currentFilters.searchTerm = params.get('search') || '';
    currentFilters.sortBy = params.get('sortBy') || 'newest';
    currentPage = parseInt(params.get('page')) || 1;

    // Cập nhật giao diện
    if (searchInput) searchInput.value = currentFilters.searchTerm;
    if (sortBySelect) sortBySelect.value = currentFilters.sortBy;
}

    // Hàm hiển thị sản phẩm
    function displayProducts(products, page) {
        if (!allProductGrid) return;

        allProductGrid.innerHTML = '';
        const start = (page - 1) * productsPerPage;
        const end = start + productsPerPage;
        const productsToDisplay = products.slice(start, end);

        if (productsToDisplay.length === 0) {
            allProductGrid.innerHTML = '<p class="loading-text">Không tìm thấy sản phẩm nào phù hợp.</p>';
            return;
        }

        productsToDisplay.forEach(product => {
            // Lấy các tham số hiện tại (ví dụ: category=...)
            const currentUrlParams = new URLSearchParams(window.location.search);
            
            // ⚠️ ĐÃ NÂNG CẤP: Tạo đường dẫn tuyệt đối cho mã QR
            // Chỉ cần link chi tiết cơ bản (sanpham_chitiet.html?id=...)
            // Không nên thêm quá nhiều filter/page vào QR code
            const relativeProductPath = `sanpham_chitiet.html?id=${product.id}`;
            const productLinkForQr = BASE_URL + relativeProductPath; 
            
            const productCard = document.createElement('div'); 
            productCard.classList.add('product-card');

            const priceClass = product.price === 0 ? 'free' : '';
            const priceText = product.price === 0 ? 'Miễn phí' : formatCurrency(product.price);

            // Thẻ <a> cho nội dung chính của sản phẩm (Link click vào)
            const productLinkContent = document.createElement('a');
            
            // Đường dẫn tương đối đơn giản cho thẻ A (chỉ cần ID)
            productLinkContent.href = `sanpham_chitiet.html?id=${product.id}`; 
            
            productLinkContent.classList.add('product-card-link-content');
            productLinkContent.innerHTML = `
                <h3 class="san-pham__title">${product.name}</h3>
                <div class="product-info-bottom">
                    <p class="price ${priceClass}">${priceText}</p>
                </div>
            `;

            // Nút icon chia sẻ
            const shareButton = document.createElement('button');
            shareButton.classList.add('share-icon-btn');
            shareButton.innerHTML = '<i class="fas fa-qrcode"></i>';
            // Gán đường dẫn ĐẦY ĐỦ để mã QR luôn chính xác
            shareButton.setAttribute('data-product-url', productLinkForQr); 
            
            // Xử lý sự kiện click cho nút chia sẻ
            shareButton.addEventListener('click', function(e) {
                e.preventDefault(); 
                e.stopPropagation(); 
                // Sử dụng URL tuyệt đối
                openQrModal(this.getAttribute('data-product-url'));
            });

            productCard.appendChild(productLinkContent);
            productCard.appendChild(shareButton);
            allProductGrid.appendChild(productCard);
        });
    }

    function setupPagination(products) {
        if (!paginationControls) return;
        paginationControls.innerHTML = '';

        const pageCount = Math.ceil(products.length / productsPerPage);
        if (pageCount <= 1) return;

        const prevBtn = document.createElement('button');
        prevBtn.textContent = 'Trước';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
            currentPage--;
            updateUrl();
            filterAndSortProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        paginationControls.appendChild(prevBtn);

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(pageCount, currentPage + 2);
        
        if (currentPage <= 3) {
            endPage = Math.min(pageCount, 5);
            startPage = 1;
        } else if (currentPage > pageCount - 2) {
            startPage = Math.max(1, pageCount - 4);
            endPage = pageCount;
        }

        if (startPage > 1) {
            const dotBtn = document.createElement('span');
            dotBtn.textContent = '...';
            paginationControls.appendChild(dotBtn);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                updateUrl();
                filterAndSortProducts();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            paginationControls.appendChild(pageBtn);
        }
        
        if (endPage < pageCount) {
             const dotBtn = document.createElement('span');
            dotBtn.textContent = '...';
            paginationControls.appendChild(dotBtn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Sau';
        nextBtn.disabled = currentPage === pageCount;
        nextBtn.addEventListener('click', () => {
            currentPage++;
            updateUrl();
            filterAndSortProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        paginationControls.appendChild(nextBtn);
    }

    function updateProductCount(count) {
        if (productCountElement) {
            productCountElement.textContent = `Số sản phẩm: ${count}`;
        }
    }
    
    function filterAndSortProducts() {
        let results = [...allProducts];

        if (currentFilters.category && currentFilters.category !== 'all') {
            results = results.filter(p => p.category === currentFilters.category);
        }
        if (currentFilters.subCategory) {
            results = results.filter(p => p.subCategory === currentFilters.subCategory);
        }

        if (currentFilters.searchTerm) {
            const searchTermLower = currentFilters.searchTerm.toLowerCase();
            results = results.filter(p =>
                p.name.toLowerCase().includes(searchTermLower) ||
                (p.description && p.description.toLowerCase().includes(searchTermLower)) ||
                (p.category && p.category.toLowerCase().includes(searchTermLower))
            );
        }

        if (currentFilters.sortBy) {
            switch (currentFilters.sortBy) {
                case 'price-asc':
                    results.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    results.sort((a, b) => b.price - a.price);
                    break;
                case 'newest':
                default:
                    results.sort((a, b) => (b.id || 0) - (a.id || 0)); 
                    break;
            }
        }
        
        const maxPage = Math.ceil(results.length / productsPerPage);
        if (currentPage > maxPage && maxPage > 0) {
            currentPage = maxPage;
        } else if (results.length === 0) {
            currentPage = 1;
        }

        filteredProducts = results;
        displayProducts(filteredProducts, currentPage);
        setupPagination(filteredProducts);
        updateProductCount(filteredProducts.length);
    }

    function setupCategoryFilters() {
        if (!categoryFilterContainer) return;
        categoryFilterContainer.innerHTML = '';
        
        const allItemLi = document.createElement('li');
        allItemLi.classList.add('category-item', 'all-products-item');
        allItemLi.innerHTML = `
            <label>
                <input type="radio" name="category" value="all" ${currentFilters.category === 'all' ? 'checked' : ''}>
                Tất cả sản phẩm
            </label>
        `;
        categoryFilterContainer.appendChild(allItemLi);

        const categoriesWithSub = {};
        allProducts.forEach(p => {
            if (!categoriesWithSub[p.category]) {
                categoriesWithSub[p.category] = new Set();
            }
            if (p.subCategory) {
                categoriesWithSub[p.category].add(p.subCategory);
            }
        });

        for (const category in categoriesWithSub) {
            const categoryLi = document.createElement('li');
            categoryLi.classList.add('category-item');
            
            const isCategoryActive = currentFilters.category === category && !currentFilters.subCategory;
            
            let shouldExpand = isCategoryActive;
            if (categoriesWithSub[category].has(currentFilters.subCategory)) {
                 shouldExpand = true;
            }
            if (shouldExpand) {
                categoryLi.classList.add('expanded');
            }

            const categoryTitleDiv = document.createElement('div');
            categoryTitleDiv.classList.add('category-title');
            categoryTitleDiv.innerHTML = `
                <label>
                    <input type="radio" name="category" value="${category}" ${isCategoryActive && !currentFilters.subCategory ? 'checked' : ''}>
                    ${category}
                </label>
                <i class="fas fa-chevron-right toggle-icon"></i>
            `;
            categoryLi.appendChild(categoryTitleDiv);

            if (categoriesWithSub[category].size > 0) {
                const subCategoryUl = document.createElement('ul');
                subCategoryUl.classList.add('subcategory-list');
                categoriesWithSub[category].forEach(subCat => {
                    const subCategoryLi = document.createElement('li');
                    const isSubCategoryActive = currentFilters.subCategory === subCat;
                    subCategoryLi.innerHTML = `
                        <label>
                            <input type="radio" name="subCategory" value="${subCat}" ${isSubCategoryActive ? 'checked' : ''}>
                            ${subCat}
                        </label>
                    `;
                    subCategoryUl.appendChild(subCategoryLi);
                });
                categoryLi.appendChild(subCategoryUl);

                categoryTitleDiv.addEventListener('click', (e) => {
                    const targetInput = e.target.closest('label')?.querySelector('input');
                    if (!targetInput || targetInput.name !== 'category') {
                        document.querySelectorAll('.category-item').forEach(item => {
                            if (item !== categoryLi) {
                                item.classList.remove('expanded');
                            }
                        });
                        categoryLi.classList.toggle('expanded');
                        e.stopPropagation();
                    }
                });
            }
            categoryFilterContainer.appendChild(categoryLi);
        }
    }

    function initializeFilters() {
        restoreFiltersFromUrl();
        setupCategoryFilters();
        
        if (categoryFilterContainer) {
            categoryFilterContainer.addEventListener('change', (e) => {
                const target = e.target;
                if (target.name === 'category') {
                    currentFilters.category = target.value;
                    currentFilters.subCategory = null;
                    const subRadios = categoryFilterContainer.querySelectorAll('input[name="subCategory"]');
                    subRadios.forEach(radio => radio.checked = false);
                } else if (target.name === 'subCategory') {
                    currentFilters.subCategory = target.value;
                    const parentCategory = target.closest('.category-item').querySelector('input[type="radio"]').value;
                    currentFilters.category = parentCategory;
                    target.closest('.category-item').querySelector('input[type="radio"]').checked = true;
                }
                currentPage = 1;
                updateUrl();
                filterAndSortProducts();
                closeSidebar(); 
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    currentFilters.searchTerm = searchInput.value.trim();
                    currentPage = 1;
                    updateUrl();
                    filterAndSortProducts();
                }, 300);
            });
        }
        if (sortBySelect) {
            sortBySelect.addEventListener('change', () => {
                currentFilters.sortBy = sortBySelect.value;
                currentPage = 1;
                updateUrl();
                filterAndSortProducts();
            });
        }
        
        filterAndSortProducts();
    }

    // ===========================================
    // HÀM XỬ LÝ SIDEBAR (MOBILE)
    // ===========================================
    function openSidebar() {
        sidebarFilters.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebarFilters.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (filterToggleBtn) {
        filterToggleBtn.addEventListener('click', openSidebar);
    }

    if (closeFilterBtn) {
        closeFilterBtn.addEventListener('click', closeSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // ===========================================
    // HÀM XỬ LÝ QR CODE MODAL
    // ===========================================

    function openQrModal(productUrl) {
        // Xóa nội dung cũ
        qrcodeContainer.innerHTML = '';
        
        // Cập nhật URL trong modal
        qrProductLinkText.textContent = productUrl;

        // KIỂM TRA: Đảm bảo thư viện QRCode đã được tải
        if (typeof QRCode !== 'undefined') {
             // Kích thước QR (ví dụ: 180x180)
            new QRCode(qrcodeContainer, {
                text: productUrl, // Sử dụng URL tuyệt đối
                width: 180,
                height: 180,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
        } else {
            // Thông báo nếu thư viện chưa tải
            qrcodeContainer.innerHTML = '<p>Thư viện QR Code (QRCode.js) chưa được tải. Vui lòng kiểm tra lại file HTML.</p>';
        }

        // Hiển thị modal
        qrModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Ngăn cuộn nền
    }

    // Đóng Modal khi nhấn nút 'x'
    if (closeQrModalBtn) {
        closeQrModalBtn.onclick = function() {
            qrModal.style.display = "none";
            document.body.style.overflow = '';
            qrcodeContainer.innerHTML = ''; // Dọn dẹp mã QR
        }
    }

    // Đóng Modal khi nhấn ra ngoài
    if (qrModal) {
        window.onclick = function(event) {
            if (event.target == qrModal) {
                qrModal.style.display = "none";
                document.body.style.overflow = '';
                qrcodeContainer.innerHTML = ''; // Dọn dẹp mã QR
            }
        }
    }


    // KHỞI TẠO
    initializeFilters();
});

function formatCurrency(price) {
    return price.toLocaleString('vi-VN') + 'đ';
}