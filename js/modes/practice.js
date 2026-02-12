/* ========================================
   מצב תרגול חופשי
   ======================================== */

const Practice = {
    tables: [],
    questions: [],
    currentIndex: 0,
    correct: 0,
    wrong: 0,
    streak: 0,
    totalQuestions: 10,

    // התחלה עם לוח כפל ספציפי
    start(table) {
        this.tables = [table];
        this._initGame();
    },

    // התחלה עם ערבוב כל הלוחות
    startMixed() {
        this.tables = Questions.ALL_TABLES;
        this._initGame();
    },

    _initGame() {
        this.currentIndex = 0;
        this.correct = 0;
        this.wrong = 0;
        this.streak = 0;
        this.totalQuestions = 10;

        this.questions = Questions.generateSet(this.tables, this.totalQuestions);

        // הצג מסך משחק
        Game.showScreen('screen-game');

        // הסתר טיימר
        document.getElementById('timer-display').style.display = 'none';

        // אתחול
        document.getElementById('score-display').textContent = '⭐ 0';
        document.getElementById('progress-fill').style.width = '0%';
        Effects.updateStreak(0);

        // הודעת פתיחה מכפלי
        Character.setSpeech('game-speech-text', Character.getMessage('start'));

        // הצג שאלה ראשונה
        setTimeout(() => this.showQuestion(), 500);
    },

    showQuestion() {
        if (this.currentIndex >= this.totalQuestions) {
            this.endGame();
            return;
        }

        const q = this.questions[this.currentIndex];

        // עדכון מספרים
        document.getElementById('num1').textContent = q.num1;
        document.getElementById('num2').textContent = q.num2;

        // אנימציה
        document.getElementById('num1').classList.add('num-appear');
        document.getElementById('num2').classList.add('num-appear');
        setTimeout(() => {
            document.getElementById('num1').classList.remove('num-appear');
            document.getElementById('num2').classList.remove('num-appear');
        }, 300);

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

        // עדכון פס התקדמות
        const progress = (this.currentIndex / this.totalQuestions) * 100;
        document.getElementById('progress-fill').style.width = progress + '%';
    },

    checkAnswer(selected, buttonEl) {
        const q = this.questions[this.currentIndex];
        const isCorrect = Questions.check(q, selected);

        // השבת כל הכפתורים
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.classList.add('disabled');
        });

        if (isCorrect) {
            this.correct++;
            this.streak++;
            buttonEl.classList.add('correct');

            // אפקטים
            Effects.correctAnswer(buttonEl);
            Effects.updateStreak(this.streak);

            // כפלי מגיב
            Character.reactCorrect('kafli-game', 'game-speech-text', this.streak);

            // עדכון ניקוד
            document.getElementById('score-display').textContent = `⭐ ${this.correct}`;
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

            // אפקטים
            Effects.wrongAnswer();
            Effects.updateStreak(0);

            // כפלי מגיב
            Character.reactWrong('kafli-game', 'game-speech-text');
        }

        // שאלה הבאה
        this.currentIndex++;
        setTimeout(() => this.showQuestion(), isCorrect ? 800 : 1500);
    },

    endGame() {
        const stars = this.correct;
        const isNewRecord = Storage.setHighScore('practice', stars);
        Storage.addStars(stars);
        Storage.updateStats(this.correct, this.wrong);

        Game.showSummary({
            title: 'סיכום תרגול',
            correct: this.correct,
            wrong: this.wrong,
            stars: stars,
            isNewRecord: isNewRecord,
            correctPercent: (this.correct / this.totalQuestions) * 100
        });
    },

    // אתחול מסך בחירה
    initSelectScreen() {
        const grid = document.getElementById('select-grid');
        grid.innerHTML = '';

        for (let i = 1; i <= 10; i++) {
            const btn = document.createElement('button');
            btn.className = 'select-btn';
            btn.textContent = i;
            btn.onclick = () => Practice.start(i);
            grid.appendChild(btn);
        }
    }
};
