/* ========================================
   מצב מסע הכוכבים - שלבים
   ======================================== */

const StarJourney = {
    currentLevel: 1,
    questions: [],
    currentIndex: 0,
    correct: 0,
    wrong: 0,
    streak: 0,
    totalQuestions: 8,

    // הגדרת שלבים
    levels: [
        { level: 1, name: 'כפל ב-1', tables: [1], icon: '🌱' },
        { level: 2, name: 'כפל ב-2', tables: [2], icon: '🌿' },
        { level: 3, name: 'כפל ב-3', tables: [3], icon: '🌳' },
        { level: 4, name: 'כפל ב-4', tables: [4], icon: '🌺' },
        { level: 5, name: 'כפל ב-5', tables: [5], icon: '🌸' },
        { level: 6, name: 'כפל ב-6', tables: [6], icon: '🌻' },
        { level: 7, name: 'כפל ב-7', tables: [7], icon: '🍀' },
        { level: 8, name: 'כפל ב-8', tables: [8], icon: '🔥' },
        { level: 9, name: 'כפל ב-9', tables: [9], icon: '💎' },
        { level: 10, name: 'כפל ב-10', tables: [10], icon: '🚀' },
        { level: 11, name: 'ערבוב!', tables: [1,2,3,4,5,6,7,8,9,10], icon: '👑' },
    ],

    // אתחול מסך שלבים
    initLevelsScreen() {
        const grid = document.getElementById('levels-grid');
        grid.innerHTML = '';

        const levelData = Storage.getLevelData();

        this.levels.forEach(lvl => {
            const btn = document.createElement('button');
            const isLocked = lvl.level > levelData.unlockedLevel;
            const stars = levelData.levelStars[lvl.level] || 0;

            btn.className = 'level-btn';
            if (isLocked) {
                btn.classList.add('level-locked');
            } else if (stars > 0) {
                btn.classList.add('level-completed');
            }
            if (lvl.level === levelData.unlockedLevel && !isLocked) {
                btn.classList.add('level-current');
            }

            const starsDisplay = isLocked ? '🔒' : 
                stars >= 3 ? '⭐⭐⭐' :
                stars >= 2 ? '⭐⭐☆' :
                stars >= 1 ? '⭐☆☆' : '☆☆☆';

            btn.innerHTML = `
                <span class="level-number">${lvl.icon}</span>
                <span style="font-size:0.8em">${lvl.name}</span>
                <span class="level-stars">${starsDisplay}</span>
            `;

            if (!isLocked) {
                btn.onclick = () => StarJourney.startLevel(lvl.level);
            }

            grid.appendChild(btn);
        });
    },

    // התחלת שלב
    startLevel(level) {
        this.currentLevel = level;
        const lvl = this.levels.find(l => l.level === level);
        if (!lvl) return;

        this.currentIndex = 0;
        this.correct = 0;
        this.wrong = 0;
        this.streak = 0;
        this.totalQuestions = 8;

        this.questions = Questions.generateSet(lvl.tables, this.totalQuestions);

        // הצג מסך משחק
        Game.showScreen('screen-game');

        // הסתר טיימר
        document.getElementById('timer-display').style.display = 'none';

        // אתחול
        document.getElementById('score-display').textContent = '⭐ 0';
        document.getElementById('progress-fill').style.width = '0%';
        Effects.updateStreak(0);

        // הודעת פתיחה
        Character.setSpeech('game-speech-text', `שלב ${level}: ${lvl.name} ${lvl.icon}`);

        setTimeout(() => this.showQuestion(), 700);
    },

    showQuestion() {
        if (this.currentIndex >= this.totalQuestions) {
            this.endLevel();
            return;
        }

        const q = this.questions[this.currentIndex];

        document.getElementById('num1').textContent = q.num1;
        document.getElementById('num2').textContent = q.num2;

        document.getElementById('num1').classList.add('num-appear');
        document.getElementById('num2').classList.add('num-appear');
        setTimeout(() => {
            document.getElementById('num1').classList.remove('num-appear');
            document.getElementById('num2').classList.remove('num-appear');
        }, 300);

        const grid = document.getElementById('answers-grid');
        grid.innerHTML = '';

        q.options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = option;
            btn.onclick = () => this.checkAnswer(option, btn);
            grid.appendChild(btn);
        });

        const progress = (this.currentIndex / this.totalQuestions) * 100;
        document.getElementById('progress-fill').style.width = progress + '%';
    },

    checkAnswer(selected, buttonEl) {
        const q = this.questions[this.currentIndex];
        const isCorrect = Questions.check(q, selected);

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
        } else {
            this.wrong++;
            this.streak = 0;
            buttonEl.classList.add('wrong');

            document.querySelectorAll('.answer-btn').forEach(btn => {
                if (parseInt(btn.textContent) === q.answer) {
                    btn.classList.add('correct');
                }
            });

            Effects.wrongAnswer();
            Effects.updateStreak(0);
            Character.reactWrong('kafli-game', 'game-speech-text');
        }

        this.currentIndex++;
        setTimeout(() => this.showQuestion(), isCorrect ? 800 : 1500);
    },

    endLevel() {
        // חישוב כוכבים: 3 כוכבים = 7-8 נכונות, 2 = 5-6, 1 = 3-4, 0 = פחות
        let stars = 0;
        if (this.correct >= 7) stars = 3;
        else if (this.correct >= 5) stars = 2;
        else if (this.correct >= 3) stars = 1;

        // שמירה
        Storage.saveLevelData(this.currentLevel, stars);
        Storage.addStars(this.correct);
        Storage.updateStats(this.correct, this.wrong);

        const isNewRecord = Storage.setHighScore(`level_${this.currentLevel}`, this.correct);

        Game.showSummary({
            title: `סיכום שלב ${this.currentLevel}`,
            correct: this.correct,
            wrong: this.wrong,
            stars: this.correct,
            isNewRecord: isNewRecord,
            correctPercent: (this.correct / this.totalQuestions) * 100,
            levelStars: stars
        });
    }
};
