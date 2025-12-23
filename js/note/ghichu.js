document.addEventListener('DOMContentLoaded', function() {
    if (typeof notesData === 'undefined') return;

    const noteGrid = document.getElementById('noteGrid');
    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('categorySelect');
    const favCount = document.getElementById('favCount');

    function renderAll() {
        const term = searchInput.value.toLowerCase();
        const cat = categorySelect.value;
        const favorites = JSON.parse(localStorage.getItem('favNotes')) || [];

        const filtered = notesData.filter(n => {
            return (cat === 'all' || n.category === cat) && (n.title.toLowerCase().includes(term));
        });

        noteGrid.innerHTML = filtered.map(n => `
            <div class="note-card collapsible animate-fade-in" id="note-${n.id}">
                <div class="note-header">
                    <h3>${n.title}</h3>
                    <div class="header-actions">
                        <i class="${favorites.includes(n.id) ? 'fas' : 'far'} fa-heart fav-btn" onclick="toggleFavorite(${n.id})"></i>
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

        if(favCount) favCount.innerText = favorites.length;
        setupAccordion();
    }

    window.toggleFavorite = function(id) {
        let favorites = JSON.parse(localStorage.getItem('favNotes')) || [];
        favorites = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
        localStorage.setItem('favNotes', JSON.stringify(favorites));
        renderAll();
    };

    function setupAccordion() {
        document.querySelectorAll('.note-header').forEach(h => {
            h.onclick = (e) => {
                if (e.target.classList.contains('fa-heart')) return;
                h.parentElement.classList.toggle('open');
            };
        });
    }

    const cats = ['all', ...new Set(notesData.map(n => n.category))];
    categorySelect.innerHTML = cats.map(c => `<option value="${c}">${c === 'all' ? 'Tất cả danh mục' : c}</option>`).join('');

    searchInput.oninput = renderAll;
    categorySelect.onchange = renderAll;
    renderAll();
});