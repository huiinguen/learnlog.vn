document.addEventListener('DOMContentLoaded', function () {
    if (typeof quizData === 'undefined') return;

    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timerInterval = null;

    const startExamBtn = document.getElementById('startExamBtn');
    const quizContainer = document.getElementById('quizContainer');
    const quizSummary = document.getElementById('quizSummary');
    const downloadCertBtn = document.getElementById('downloadCertBtn');

    // --- THUẬT TOÁN ĐẢO MẢNG (FISHER-YATES) ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    startExamBtn.onclick = () => {
        const topic = document.getElementById('examTopicSelect').value;
        if (!topic) return alert('Vui lòng chọn loại chứng chỉ!');
        initExam(topic);
    };

    function initExam(topic) {
        let pool = [];
        // Lấy dữ liệu thô
        if (topic === 'exam_programming') {
            pool = [...quizData.cpp, ...quizData.python, ...quizData.java, ...quizData.programming];
        } else {
            const key = topic.replace('exam_', '');
            pool = [...quizData[key]];
        }

        // Đảo toàn bộ bộ câu hỏi
        shuffleArray(pool);

        // LOGIC 1: Lấy tối đa 30 câu, nếu không đủ thì lấy hết số câu hiện có
        const maxQuestions = Math.min(30, pool.length);
        currentQuestions = pool.slice(0, maxQuestions);

        score = 0;
        currentQuestionIndex = 0;
        
        document.getElementById('mainSetup').style.display = 'none';
        quizContainer.style.display = 'block';
        loadQuestion();
        startTimer(1200); // 20 phút
    }

    function loadQuestion() {
        const q = currentQuestions[currentQuestionIndex];
        
        // Cập nhật giao diện số câu thực tế
        document.getElementById('questionText').textContent = q.question;
        document.getElementById('currentQ').textContent = currentQuestionIndex + 1;
        document.getElementById('totalQ').textContent = currentQuestions.length;
        
        // LOGIC 2: Đảo các phương án trả lời (Options)
        // Tạo mảng object để giữ vết đáp án đúng
        let mappedOptions = q.options.map((text, index) => {
            return { text: text, isCorrect: index === q.correct };
        });
        
        // Đảo phương án
        shuffleArray(mappedOptions);

        const container = document.getElementById('optionsContainer');
        container.innerHTML = '';
        
        mappedOptions.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `<span class="opt-char">${String.fromCharCode(65+i)}</span> ${opt.text}`;
            
            btn.onclick = () => {
                const all = container.querySelectorAll('button');
                all.forEach(b => b.disabled = true);
                
                if (opt.isCorrect) {
                    btn.classList.add('correct');
                    score++;
                } else {
                    btn.classList.add('incorrect');
                }
                document.getElementById('nextQuestionBtn').style.display = 'block';
            };
            container.appendChild(btn);
        });

        // Cập nhật Progress Bar dựa trên tổng số câu thực tế
        const progressPercent = (currentQuestionIndex / currentQuestions.length) * 100;
        document.getElementById('progressFill').style.width = `${progressPercent}%`;
    }

    document.getElementById('nextQuestionBtn').onclick = () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuestions.length) {
            loadQuestion();
            document.getElementById('nextQuestionBtn').style.display = 'none';
        } else {
            showSummary();
        }
    };

    function startTimer(duration) {
        let time = duration;
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            let m = Math.floor(time / 60);
            let s = time % 60;
            const display = document.getElementById('timerDisplay');
            display.textContent = `⏰ ${m}:${s < 10 ? '0' : ''}${s}`;
            
            if (time <= 60) display.classList.add('time-warning'); // Cảnh báo khi còn 1 phút
            
            if (time-- <= 0) { 
                clearInterval(timerInterval); 
                showSummary(); 
            }
        }, 1000);
    }

    function showSummary() {
        clearInterval(timerInterval);
        quizContainer.style.display = 'none';
        quizSummary.style.display = 'flex';
        
        const total = currentQuestions.length;
        const percentage = (score / total) * 100;
        
        // Tính hạng dựa trên % thay vì số câu cố định
        let rank = 'C';
        if (percentage >= 90) rank = 'S';
        else if (percentage >= 70) rank = 'B';
        
        document.getElementById('scoreText').textContent = `Đúng ${score}/${total} câu`;
        document.getElementById('rankText').textContent = rank;
        
        if (percentage >= 70) { 
            document.getElementById('resultTitle').textContent = "BẠN ĐÃ ĐẠT CHỨNG CHỈ!";
            document.getElementById('resultTitle').style.color = "#03dac6";
            downloadCertBtn.style.display = 'block';
        } else {
            document.getElementById('resultTitle').textContent = "CHƯA ĐẠT";
            document.getElementById('resultTitle').style.color = "#ff3b5c";
            downloadCertBtn.style.display = 'none';
        }
    }

    // TẢI BẰNG KHEN
    downloadCertBtn.onclick = () => {
        const name = prompt("Nhập Họ và Tên của bạn để in lên bằng:", "NGUYỄN VĂN A");
        if (!name) return;

        document.getElementById('certRecipientName').textContent = name.toUpperCase();
        document.getElementById('certSubject').textContent = document.getElementById('examTopicSelect').options[document.getElementById('examTopicSelect').selectedIndex].text.toUpperCase();
        document.getElementById('certRank').textContent = document.getElementById('rankText').textContent;
        document.getElementById('certScore').textContent = `${score}/${currentQuestions.length}`;
        
        const d = new Date();
        document.getElementById('certDate').textContent = `Ngày ${d.getDate()} tháng ${d.getMonth()+1} năm ${d.getFullYear()}`;

        // Hiển thị template tạm thời để chụp ảnh
        const cert = document.getElementById('certificateTemplate');
        html2canvas(cert.querySelector('.cert-canvas'), { 
            scale: 2,
            backgroundColor: null,
            useCORS: true 
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `ChungChi_${name.replace(/\s/g, '_')}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
    };

    document.getElementById('restartQuizBtn').onclick = () => location.reload();
});