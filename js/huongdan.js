// js/huongdan.js

document.addEventListener('DOMContentLoaded', () => {
    const guideContent = document.getElementById('guideContent');
    
    // Nội dung hướng dẫn Cài Web App (PWA)
    const pwaGuideHtml = `
        <div class="guide-item">
            <h3>Cách Cài Web App HVCoder ra Màn hình chính (PWA)</h3>
            <p>Việc này giúp bạn mở trang web nhanh chóng như một ứng dụng, không có thanh địa chỉ phiền phức của trình duyệt.</p>
            
            <h4>1. Trên iPhone (Dùng Safari)</h4>
            <ol>
                <li>Mở trang web bằng trình duyệt **Safari**.</li>
                <li>Nhấn vào biểu tượng **Chia sẻ** (<i class="fas fa-share-square"></i>) ở thanh dưới cùng.</li>
                <li>Cuộn xuống và chọn **Thêm vào Màn hình chính** (Add to Home Screen).</li>
                <li>Đặt tên cho ứng dụng (ví dụ: HVCoder) và nhấn **Thêm**.</li>
            </ol>
            
            <h4>2. Trên Android (Dùng Chrome)</h4>
            <ol>
                <li>Mở trang web bằng trình duyệt **Chrome**.</li>
                <li>Nhấn vào biểu tượng **ba dấu chấm dọc** (Menu) ở góc trên bên phải.</li>
                <li>Chọn **Thêm vào Màn hình chính** (Add to Home Screen) hoặc **Cài đặt ứng dụng** (Install app).</li>
                <li>Đặt tên và nhấn **Thêm** hoặc **Cài đặt**.</li>
            </ol>

            <h4>3. Trên Máy tính (Dùng Chrome/Edge)</h4>
            <ol>
                <li>Mở trang web bằng trình duyệt **Chrome** hoặc **Edge**.</li>
                <li>Tìm biểu tượng **Cài đặt** (thường là một dấu cộng hoặc hình mũi tên xuống) ở góc trên bên phải, trong thanh địa chỉ.</li>
                <li>Nhấn vào đó và chọn **Cài đặt** (Install).</li>
                <li>Ứng dụng sẽ được mở trong cửa sổ riêng và có biểu tượng trên Desktop/Taskbar.</li>
            </ol>
        </div>
        
        <hr style="margin: 40px 0; border-color: #3a3a5e;">
        
    `;

    guideContent.innerHTML = pwaGuideHtml;
});