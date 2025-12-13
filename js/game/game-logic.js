document.addEventListener('DOMContentLoaded', function () {
    // Đảm bảo quizData và allQuizQuestions đã được load từ quiz-data.js
    if (typeof quizData === 'undefined' || typeof allQuizQuestions === 'undefined') {
        console.error('Lỗi: Không tìm thấy dữ liệu quizData. Vui lòng kiểm tra file quiz-data.js.');
        return;
    }

    // ================================================
    // 1. DOM ELEMENTS
    // ================================================
    const startExamBtn = document.getElementById('startExamBtn'); 
    const examTopicSelect = document.getElementById('examTopicSelect');
    const quizContainer = document.getElementById('quizContainer');
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    const progressFill = document.getElementById('progressFill');
    const currentQ = document.getElementById('currentQ');
    const totalQ = document.getElementById('totalQ');
    const quizSummary = document.getElementById('quizSummary');
    const scoreText = document.getElementById('scoreText');
    const rewardText = document.getElementById('rewardText');
    const restartQuizBtn = document.getElementById('restartQuizBtn');
    const resultTitle = document.getElementById('resultTitle');
    const timeTaken = document.getElementById('timeTaken');
    const rankText = document.getElementById('rankText');
    const comboText = document.getElementById('comboText');
    const resultDetails = document.getElementById('resultDetails'); 
    const downloadCertBtn = document.getElementById('downloadCertBtn'); 
    const timerDisplay = document.getElementById('timerDisplay');
    const mainSetup = document.getElementById('mainSetup');

    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let startTime = 0;
    let combo = 0;
    let timerInterval = null; 

    // ================================================
    // 2. BẮT ĐẦU THI CHỨNG CHỈ
    // ================================================
    startExamBtn.addEventListener('click', () => {
        const examTopic = examTopicSelect.value;
        if (!examTopic) return alert('Vui lòng chọn loại chứng chỉ muốn thi!');
        
        initExam(examTopic);
    });

    function initExam(examTopic) {
        let numQuestions = 30;
        let durationSeconds = 1200; // 20 phút
        let questionPool = [];
        let examName = '';
        const passRate = 0.7; 

        // Cấu hình bài thi dựa trên chủ đề
        switch (examTopic) {
            case 'exam_programming':
                examName = 'Lập trình Tổng hợp';
                questionPool = [...quizData.cpp, ...quizData.python, ...quizData.java, ...quizData.programming];
                break;
            case 'exam_cpp':
                examName = 'Lập trình C++';
                questionPool = quizData.cpp;
                break;
            case 'exam_python':
                examName = 'Lập trình Python';
                questionPool = quizData.python;
                break;
            case 'exam_java':
                examName = 'Lập trình Java';
                questionPool = quizData.java;
                break;
            case 'exam_cybersecurity':
                examName = 'An Ninh Mạng Bình Dân';
                questionPool = quizData.cybersecurity;
                break;
            default: // exam_all (Tổng hợp tất cả)
                examName = 'Kỹ thuật Tổng hợp (All)';
                questionPool = allQuizQuestions;
                break;
        }
        
        if (questionPool.length < numQuestions) {
            alert(`Chủ đề ${examName} chỉ có ${questionPool.length} câu hỏi. Đang lấy tối đa ${questionPool.length} câu.`);
            numQuestions = questionPool.length;
        }

        if (numQuestions === 0) {
             return alert('Không có câu hỏi nào để bắt đầu bài thi này.');
        }

        if (!confirm(`Bạn có chắc muốn bắt đầu Thi Chứng Chỉ ${examName}? Bài thi có ${numQuestions} câu, thời gian ${Math.floor(durationSeconds / 60)} phút. Yêu cầu ${Math.ceil(numQuestions * passRate)}/${numQuestions} câu để ĐẠT.`)) return;

        // Thiết lập biến và câu hỏi
        currentQuestions = [...questionPool];
        shuffleArray(currentQuestions);
        currentQuestions = currentQuestions.slice(0, numQuestions); 
        
        startTime = Date.now();
        currentQuestionIndex = 0;
        score = 0;
        combo = 0;

        displayQuizUI();
        loadQuestion();
        
        startTimer(durationSeconds);
    }

    function displayQuizUI() {
        mainSetup.style.display = 'none';
        quizContainer.style.display = 'block';
        optionsContainer.style.display = 'grid'; 
    }

    // ================================================
    // 3. LOGIC TRẮC NGHIỆM & CHUYỂN CÂU
    // ================================================
    function loadQuestion() {
        const q = currentQuestions[currentQuestionIndex];
        questionText.textContent = q.question;
        currentQ.textContent = currentQuestionIndex + 1;
        totalQ.textContent = currentQuestions.length;
        
        optionsContainer.innerHTML = '';

        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `<span class="opt-char">${String.fromCharCode(65 + i)}</span> ${opt}`;
            btn.onclick = () => selectAnswer(btn, i, q.correct);
            optionsContainer.appendChild(btn);
        });
        updateProgress();
    }

    function selectAnswer(btn, selectedIdx, correctIdx) {
        const allBtns = optionsContainer.querySelectorAll('.option-btn');
        allBtns.forEach(b => b.disabled = true); 

        let isCorrect = (selectedIdx === correctIdx);

        if (isCorrect) {
            btn.classList.add('correct');
            score++;
            combo++;
        } else {
            btn.classList.add('incorrect');
            combo = 0;
        }
        
        nextQuestionBtn.style.display = 'block';
    }

    nextQuestionBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuestions.length) {
            loadQuestion();
            nextQuestionBtn.style.display = 'none';
        } else {
            showSummary();
        }
    });
    
    // ================================================
    // 4. TIMER & TỔNG KẾT
    // ================================================
    function startTimer(duration) {
        let timeRemaining = duration;
        timerDisplay.style.display = 'block';
        
        clearInterval(timerInterval);
        
        timerInterval = setInterval(() => {
            const mins = Math.floor(timeRemaining / 60);
            const secs = timeRemaining % 60;
            timerDisplay.textContent = `⏰ Thời gian còn: ${mins}:${secs.toString().padStart(2, '0')}`;
            
            if (timeRemaining <= 120) { 
                timerDisplay.classList.add('time-warning'); 
            }
            
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                alert('Hết giờ! Tự động nộp bài.');
                showSummary();
            }
            
            timeRemaining--;
        }, 1000);
    }
    
    function showSummary() {
        if (timerInterval) clearInterval(timerInterval);
        timerDisplay.style.display = 'none';
        timerDisplay.classList.remove('time-warning'); 

        quizContainer.style.display = 'none';
        quizSummary.style.display = 'flex';

        const total = currentQuestions.length;
        const totalSeconds = Math.floor((Date.now() - startTime) / 1000);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        timeTaken.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

        // Xử lý Rank
        let rank = 'F';
        if (score === total) rank = 'S+';
        else if (score >= total * 0.8) rank = 'A';
        else if (score >= total * 0.7) rank = 'B';
        else if (score >= total * 0.5) rank = 'C';

        rankText.textContent = rank;
        comboText.textContent = score;
        scoreText.innerHTML = `Đúng <strong>${score}/${total}</strong> câu`;
        
        resultDetails.innerHTML = ''; 
        downloadCertBtn.style.display = 'none';

        // LOGIC THI CHỨNG CHỈ
        const passRate = 0.7;
        const passScore = Math.ceil(total * passRate);
        const isPassed = score >= passScore;
        
        const examName = examTopicSelect.options[examTopicSelect.selectedIndex].text; 
        const certName = examName.replace('Chứng chỉ ', '');
        
        resultTitle.textContent = isPassed ? "CHÚC MỪNG! BẠN ĐÃ ĐẠT CHỨNG CHỈ" : "CHƯA ĐẠT";
        
        if (isPassed) {
            resultDetails.innerHTML = `
                <div class="cert-status pass">✅ ĐẠT - Chứng chỉ ${certName} Cấp độ ${rank}</div>
                <div class="cert-info">Yêu cầu tối thiểu: ${passScore}/${total} câu.</div>
            `;
            rewardText.innerHTML = `<i class="fas fa-medal"></i> BẰNG KHEN XUẤT SẮC! <i class="fas fa-medal"></i>`;
            downloadCertBtn.style.display = 'block';
            launchConfetti();
        } else {
             resultDetails.innerHTML = `
                <div class="cert-status fail">❌ CHƯA ĐẠT - Cần ôn luyện thêm</div>
                <div class="cert-info">Yêu cầu tối thiểu: ${passScore}/${total} câu.</div>
            `;
            rewardText.innerHTML = 'Đừng nản lòng! Thử lại để đạt chứng chỉ nhé.';
        }
    }

    restartQuizBtn.onclick = () => {
        quizSummary.style.display = 'none';
        mainSetup.style.display = 'block';
    };

    // ================================================
    // 5. UTILS (Hiệu ứng)
    // ================================================
    function updateProgress() {
        const percent = ((currentQuestionIndex) / currentQuestions.length) * 100;
        progressFill.style.width = percent + '%';
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    downloadCertBtn.addEventListener('click', () => {
        const certElement = document.querySelector('#quizSummary .modal-content');
        
        // Kiểm tra xem html2canvas đã được tải chưa
        if (typeof html2canvas === 'undefined') {
            alert('Lỗi: Thư viện html2canvas chưa được tải. Vui lòng thêm <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script> vào index.html để tính năng này hoạt động.');
            return;
        }

        // Ẩn các thành phần không cần thiết trên ảnh (như nút download, confetti)
        downloadCertBtn.style.display = 'none';
        const confettiDiv = document.getElementById('confetti');
        if (confettiDiv) confettiDiv.style.display = 'none';

        // Sử dụng html2canvas để chụp DOM và chuyển thành ảnh
        html2canvas(certElement, { 
            scale: 2, // Tăng độ phân giải ảnh
            useCORS: true, 
            backgroundColor: '#221b35' // Đảm bảo nền của modal-content là màu tím đậm
        }).then(canvas => {
            // Khôi phục các thành phần đã ẩn
            downloadCertBtn.style.display = 'block';
            if (confettiDiv) confettiDiv.style.display = 'block';

            // Chuyển canvas thành Data URL và tải về
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            
            const certName = examTopicSelect.options[examTopicSelect.selectedIndex].text;
            const rank = rankText.textContent;
            
            link.download = `BangKhen_${certName.replace(/ /g, '_')}_Cap${rank}.png`;
            link.href = image;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch(err => {
            // Khôi phục nếu có lỗi
            downloadCertBtn.style.display = 'block';
            if (confettiDiv) confettiDiv.style.display = 'block';
            console.error('Lỗi khi tạo ảnh chứng chỉ:', err);
            alert('Không thể tạo ảnh. Vui lòng thử lại hoặc kiểm tra console.');
        });
    });
    
    // (Giữ nguyên các hàm hiệu ứng)
    function createParticle(element) { /* ... */ }
    function launchConfetti() { /* ... */ }
    function playSound(type) { /* ... */ }
});