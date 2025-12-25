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