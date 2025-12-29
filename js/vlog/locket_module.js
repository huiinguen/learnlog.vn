
/**
 * Dữ liệu cho chế độ Locket (Lưới ảnh bo tròn)
 * Thuộc tính chính:
 * - id: Định dạng chuỗi (vd: 'l1', 'l2') để phân biệt với Insta.
 * - caption: Nội dung văn bản duy nhất hiển thị dưới ảnh.
 * - thumbnail: Link ảnh tỷ lệ 1:1.
 */
const LOCKET_DATA = [
  {
    id: "l1",
    caption: "Buổi chiều chill",
    thumbnail: "https://res.cloudinary.com/dxcuzqm9m/image/upload/v1766934026/chill_27_musk3x.jpg",
    date: "01/09/2025",
  },
  {
    id: "l2",
    caption: "Buổi chiều chill",
    thumbnail: "https://res.cloudinary.com/dxcuzqm9m/image/upload/v1766934026/IMG_0119_jdgjwf.jpg",
    date: "15/10/2025",
  },
  {
    id: "l3",
    caption: "Đi chill chill cuối tuần",
    thumbnail: "https://res.cloudinary.com/dxcuzqm9m/image/upload/v1766934070/IMG_8542_bqxj0o.jpg",
    date: "26/12/2025",
  },
  {
    id: "l4",
    caption: "kkk",
    thumbnail: "https://res.cloudinary.com/dxcuzqm9m/image/upload/v1766934098/IMG_6997_znhj6i.jpg",
    date: "27/12/2025",
  },
  {
    id: "l5",
    caption: "Đêm không ngủ :))",
    thumbnail: "https://res.cloudinary.com/dxcuzqm9m/image/upload/v1766934026/chill_35_i2s84w.jpg",
    date: "28/12/2025",
  },
  {
    id: "l6",
    caption: "Đầu mùa thu",
    thumbnail: "https://res.cloudinary.com/dxcuzqm9m/image/upload/v1766934026/IMG_9184_id9iuy.jpg",
    date: "28/12/2025",
  },
  {
    id: "l7",
    caption: "hẹ hẹ",
    thumbnail: "https://res.cloudinary.com/dxcuzqm9m/image/upload/v1766934097/IMG_6995_jmavnk.jpg",
    date: "28/12/2025",
  },

];


function renderLocketMode(container) {
    const html = LOCKET_DATA.map(item => `
        <div class="locket-card animate-pop" onclick="viewDetail('${item.id}', 'locket')">
            <div class="locket-img-wrapper">
                <img src="${item.thumbnail}" alt="memory">
            </div>
            <div class="locket-badge">${item.date.split('/')[0]}/${item.date.split('/')[1]}</div>
            <div class="locket-caption-mini">${item.caption || item.title}</div>
        </div>
    `).join('');
    
    container.innerHTML = `<div class="locket-grid">${html}</div>`;
}