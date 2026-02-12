/* ========================================
   אפקטים ויזואליים - JavaScript
   ======================================== */

const Effects = {
    // === קונפטי ===
    showConfetti(count = 30) {
        const container = document.getElementById('confetti-container');
        const colors = ['#FFD700', '#FF6B6B', '#43E97B', '#A18CD1', '#FA709A', '#38F9D7', '#FBC2EB', '#F6D365'];
        const shapes = ['confetti-circle', 'confetti-square', 'confetti-triangle'];

        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];

            confetti.className = `confetti ${shape}`;
            confetti.style.backgroundColor = color;
            confetti.style.color = color;
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            
            const size = 6 + Math.random() * 10;
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';

            container.appendChild(confetti);

            // הסר אחרי סיום
            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }
    },

    // === כוכבים מעופפים ===
    showFlyingStars(x, y, count = 5) {
        const container = document.getElementById('stars-container');
        const emojis = ['⭐', '🌟', '✨', '💫'];

        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'flying-star';
            star.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            star.style.left = x + 'px';
            star.style.top = y + 'px';
            
            // כיוון אקראי
            const angle = (Math.random() * 360) * (Math.PI / 180);
            const distance = 50 + Math.random() * 100;
            const endDistance = 100 + Math.random() * 150;
            
            star.style.setProperty('--star-x', Math.cos(angle) * distance + 'px');
            star.style.setProperty('--star-y', Math.sin(angle) * distance + 'px');
            star.style.setProperty('--star-end-x', Math.cos(angle) * endDistance + 'px');
            star.style.setProperty('--star-end-y', Math.sin(angle) * endDistance + 'px');
            
            star.style.animationDelay = (Math.random() * 0.2) + 's';

            container.appendChild(star);

            setTimeout(() => {
                star.remove();
            }, 1500);
        }
    },

    // === +1 צף ===
    showFloatingPlus(x, y, text = '⭐ +1') {
        const el = document.createElement('div');
        el.className = 'float-plus';
        el.textContent = text;
        el.style.left = x + 'px';
        el.style.top = y + 'px';

        document.body.appendChild(el);

        setTimeout(() => {
            el.remove();
        }, 1000);
    },

    // === רעידת מסך ===
    shakeScreen() {
        const gameContent = document.querySelector('.game-content');
        if (!gameContent) return;
        
        gameContent.classList.add('shake-screen');
        setTimeout(() => {
            gameContent.classList.remove('shake-screen');
        }, 400);
    },

    // === אפקט תשובה נכונה מלא ===
    correctAnswer(buttonEl) {
        // מציאת מיקום הכפתור
        const rect = buttonEl.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // כוכבים מעופפים
        this.showFlyingStars(x, y, 4);

        // +1 צף
        this.showFloatingPlus(x, y - 30);

        // הבהוב ירוק
        const questionArea = document.querySelector('.question-area');
        if (questionArea) {
            questionArea.classList.add('correct-flash');
            setTimeout(() => questionArea.classList.remove('correct-flash'), 500);
        }
    },

    // === אפקט תשובה שגויה ===
    wrongAnswer() {
        this.shakeScreen();
    },

    // === אפקט רצף ===
    updateStreak(streak) {
        const streakEl = document.getElementById('streak-display');
        if (!streakEl) return;

        if (streak >= 3) {
            const fires = streak >= 10 ? '🔥🔥🔥' : streak >= 5 ? '🔥🔥' : '🔥';
            streakEl.textContent = `${fires} ${streak} ברצף!`;
            streakEl.classList.add('streak-fire');
        } else {
            streakEl.textContent = '';
            streakEl.classList.remove('streak-fire');
        }
    },

    // === אפקט סיום משחק ===
    celebrateEnd(isGreat) {
        if (isGreat) {
            // קונפטי מרובה
            this.showConfetti(50);
            setTimeout(() => this.showConfetti(30), 500);
            setTimeout(() => this.showConfetti(20), 1000);
        } else {
            this.showConfetti(15);
        }
    },

    // === ניקוי כל האפקטים ===
    clearAll() {
        document.getElementById('confetti-container').innerHTML = '';
        document.getElementById('stars-container').innerHTML = '';
        document.querySelectorAll('.float-plus').forEach(el => el.remove());
    }
};
