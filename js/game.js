/* ========================================
   לוגיקה ראשית - ניהול המשחק
   ======================================== */

const Game = {
    currentMode: null, // 'practice', 'timeChallenge', 'starJourney'
    lastMode: null,
    lastModeConfig: null,

    // === אתחול ===
    init() {
        this.showScreen('screen-home');
        this.updateTotalStars();
    },

    // === עדכון סך כוכבים במסך הבית ===
    updateTotalStars() {
        const total = Storage.getTotalStars();
        const el = document.getElementById('total-stars-display');
        if (el) {
            if (total > 0) {
                el.textContent = `⭐ ${total} כוכבים נאספו!`;
                el.style.display = 'block';
            } else {
                el.style.display = 'none';
            }
        }
    },

    // === ניווט בין מסכים ===
    showScreen(screenId) {
        // הסתר את כל המסכים
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
        });

        // הצג את המסך המבוקש
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
        }

        // ניקוי אפקטים
        Effects.clearAll();
    },

    // === התחלת מצב משחק ===
    startMode(mode) {
        this.currentMode = mode;
        this.lastMode = mode;

        switch (mode) {
            case 'practice':
                Practice.initSelectScreen();
                this.showScreen('screen-select');
                break;

            case 'timeChallenge':
                TimeChallenge.start();
                break;

            case 'starJourney':
                StarJourney.initLevelsScreen();
                this.showScreen('screen-levels');
                break;
        }
    },

    // === חזרה לתפריט ראשי ===
    goHome() {
        this.cleanup();
        this.showScreen('screen-home');
        this.currentMode = null;
        this.updateTotalStars();
    },

    // === יציאה ממשחק פעיל ===
    exitGame() {
        this.cleanup();
        
        // חזור למסך הרלוונטי
        if (this.currentMode === 'starJourney') {
            StarJourney.initLevelsScreen();
            this.showScreen('screen-levels');
        } else if (this.currentMode === 'practice') {
            Practice.initSelectScreen();
            this.showScreen('screen-select');
        } else {
            this.goHome();
        }
    },

    // === ניקוי ===
    cleanup() {
        TimeChallenge.cleanup();
        Effects.clearAll();
    },

    // === הצגת מסך סיכום ===
    showSummary(data) {
        // data = { title, correct, wrong, stars, isNewRecord, correctPercent, levelStars? }
        
        this.lastModeConfig = data;

        // עדכון טקסטים
        document.getElementById('summary-title').textContent = data.title;
        document.getElementById('stat-correct').textContent = data.correct;
        document.getElementById('stat-wrong').textContent = data.wrong;
        document.getElementById('stat-stars').textContent = data.stars;

        // כפתור שלב הבא (רק במסע הכוכבים ורק אם עבר את השלב)
        const nextLevelBtn = document.getElementById('btn-next-level');
        if (this.currentMode === 'starJourney' && data.levelStars && data.levelStars >= 1) {
            const nextLevel = StarJourney.currentLevel + 1;
            if (nextLevel <= StarJourney.levels.length) {
                nextLevelBtn.style.display = 'flex';
            } else {
                nextLevelBtn.style.display = 'none';
            }
        } else {
            nextLevelBtn.style.display = 'none';
        }

        // שיא חדש
        const recordContainer = document.getElementById('stat-record-container');
        if (data.isNewRecord) {
            recordContainer.style.display = 'block';
            document.getElementById('stat-record').textContent = data.stars;
            recordContainer.classList.add('new-record');
        } else {
            recordContainer.style.display = 'none';
            recordContainer.classList.remove('new-record');
        }

        // הצג מסך
        this.showScreen('screen-summary');

        // אפקטים
        const isGreat = data.correctPercent >= 70;
        Effects.celebrateEnd(isGreat);

        // כפלי מגיב
        Character.reactSummary(
            'kafli-summary', 
            'summary-speech-text', 
            data.correctPercent, 
            data.isNewRecord
        );
    },

    // === שלב הבא (מסע הכוכבים) ===
    nextLevel() {
        const next = StarJourney.currentLevel + 1;
        if (next <= StarJourney.levels.length) {
            StarJourney.startLevel(next);
        } else {
            // סיים את כל השלבים!
            StarJourney.initLevelsScreen();
            this.showScreen('screen-levels');
        }
    },

    // === שחק שוב ===
    retry() {
        if (!this.lastMode) {
            this.goHome();
            return;
        }

        switch (this.lastMode) {
            case 'practice':
                // חזור לבחירת לוח כפל
                Practice.initSelectScreen();
                this.showScreen('screen-select');
                break;

            case 'timeChallenge':
                TimeChallenge.start();
                break;

            case 'starJourney':
                // חזור למסך שלבים
                StarJourney.initLevelsScreen();
                this.showScreen('screen-levels');
                break;

            default:
                this.goHome();
        }
    }
};

// === התחלת המשחק ===
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
