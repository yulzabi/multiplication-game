/* ========================================
   מצב אתגר הזמן
   ======================================== */

const TimeChallenge = {
    correct: 0,
    wrong: 0,
    streak: 0,
    timeLeft: 60,
    timerInterval: null,
    currentQuestion: null,
    isActive: false,

    start() {
        this.correct = 0;
        this.wrong = 0;
        this.streak = 0;
        this.timeLeft = 60;
        this.isActive = true;

        // הצג מסך משחק
        Game.showScreen('screen-game');

        // הצג טיימר
        const timerDisplay = document.getElementById('timer-display');
        timerDisplay.style.display = 'block';
        timerDisplay.classList.remove('timer-warning');
        document.getElementById('timer-value').textContent = '60';

        // אתחול
        document.getElementById('score-display').textContent = '⭐ 0';
        document.getElementById('progress-fill').style.width = '0%';
        Effects.updateStreak(0);

        // הודעת פתיחה
        Character.setSpeech('game-speech-text', Character.getMessage('timeStart'));

        // התחל טיימר אחרי השהייה קצרה
        setTimeout(() => {
            this.startTimer();
            this.nextQuestion();
        }, 800);
    },

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            document.getElementById('timer-value').textContent = this.timeLeft;

            // עדכון פס התקדמות (הפוך - מתרוקן)
            const progress = (this.timeLeft / 60) * 100;
            document.getElementById('progress-fill').style.width = progress + '%';

            // אזהרת זמן
            if (this.timeLeft <= 10) {
                document.getElementById('timer-display').classList.add('timer-warning');
            }

            // סיום
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    },

    nextQuestion() {
        if (!this.isActive) return;

        this.currentQuestion = Questions.generate(Questions.ALL_TABLES);
        const q = this.currentQuestion;

        // עדכון מספרים
        document.getElementById('num1').textContent = q.num1;
        document.getElementById('num2').textContent = q.num2;

        // יצירת כפתורי תשובות
        const grid = document.getElementById('answers-grid');
        grid.innerHTML = '';

        q.options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = option;
            btn.onclick = () => this.checkAnswer(option, btn);
            grid.appendChild(btn);
        });
    },

    checkAnswer(selected, buttonEl) {
        if (!this.isActive) return;

        const q = this.currentQuestion;
        const isCorrect = Questions.check(q, selected);

        // השבת כל הכפתורים
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.classList.add('disabled');
        });

        if (isCorrect) {
            this.correct++;
            this.streak++;
            buttonEl.classList.add('correct');

            Effects.correctAnswer(buttonEl);
            Effects.updateStreak(this.streak);
            Character.reactCorrect('kafli-game', 'game-speech-text', this.streak);

            document.getElementById('score-display').textContent = `⭐ ${this.correct}`;

            // בונוס זמן ברצף
            if (this.streak > 0 && this.streak % 5 === 0) {
                this.timeLeft = Math.min(this.timeLeft + 3, 60);
                Effects.showFloatingPlus(
                    window.innerWidth / 2, 
                    100, 
                    '⏱️ +3 שניות!'
                );
            }
        } else {
            this.wrong++;
            this.streak = 0;
            buttonEl.classList.add('wrong');

            // הראה תשובה נכונה
            document.querySelectorAll('.answer-btn').forEach(btn => {
                if (parseInt(btn.textContent) === q.answer) {
                    btn.classList.add('correct');
                }
            });

            Effects.wrongAnswer();
            Effects.updateStreak(0);
            Character.reactWrong('kafli-game', 'game-speech-text');
        }

        // שאלה הבאה (מהר יותר באתגר זמן)
        setTimeout(() => this.nextQuestion(), isCorrect ? 400 : 1000);
    },

    endGame() {
        this.isActive = false;
        clearInterval(this.timerInterval);

        const score = this.correct;
        const isNewRecord = Storage.setHighScore('timeChallenge', score);
        Storage.addStars(score);
        Storage.updateStats(this.correct, this.wrong);

        Game.showSummary({
            title: 'סיכום אתגר הזמן',
            correct: this.correct,
            wrong: this.wrong,
            stars: score,
            isNewRecord: isNewRecord,
            correctPercent: this.correct > 0 ? 
                (this.correct / (this.correct + this.wrong)) * 100 : 0
        });
    },

    // ניקוי בעת יציאה
    cleanup() {
        this.isActive = false;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
};
