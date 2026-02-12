/* ========================================
   ניהול דמות כפלי השועל
   ======================================== */

const Character = {
    // הודעות לפי מצב
    messages: {
        correct: [
            'כל הכבוד! 🌟',
            'מעולה! 🎉',
            'נכון! אתה כוכב! ⭐',
            'בדיוק! 👏',
            'וואו! מדהים! 🔥',
            'אלוף/ה! 💪',
            'יופי! תמשיך ככה! 🚀',
            'מושלם! ✨',
        ],
        wrong: [
            'כמעט! ננסה שוב 💪',
            'לא נורא, בפעם הבאה! 😊',
            'קרוב! אפשר עוד פעם 🌈',
            'אופס! בוא ננסה עוד 💫',
            'לא נכון, אבל אתה לומד! 📚',
        ],
        streak3: [
            'רצף מדהים! 🔥🔥🔥',
            '3 ברצף! אש! 🔥',
            'אתה על גלגל! 🎯',
        ],
        streak5: [
            'וואו! 5 ברצף! 🌟🌟🌟',
            'בלתי ניתן לעצירה! 🚀',
            'מכונת כפל! ⚡',
        ],
        streak10: [
            'אגדה! 10 ברצף! 👑',
            'אלוף/ת העולם! 🏆',
        ],
        start: [
            'בהצלחה! 🍀',
            'בוא נתחיל! 💪',
            'אני מאמין בך! ⭐',
            'קדימה! 🚀',
        ],
        summaryGreat: [
            'עבודה מצוינת! אתה כוכב! 🌟',
            'מדהים! גאה בך! 🏆',
            'וואו! פשוט מעולה! ✨',
        ],
        summaryGood: [
            'עבודה טובה! 👍',
            'יפה מאוד! ממשיכים! 💪',
            'טוב מאוד! עוד קצת תרגול! 📚',
        ],
        summaryOk: [
            'לא נורא! תרגול עושה מושלם! 💪',
            'נמשיך להתאמן! 📚',
            'כל פעם קצת יותר טוב! 🌈',
        ],
        newRecord: [
            'שיא חדש! אתה אלוף! 🏆🎉',
            'וואו! שברת את השיא! 👑',
        ],
        timeStart: [
            'מוכנים? יאללה! ⏱️',
            'בוא נראה כמה אתה מהיר! 🏃',
        ],
        levelComplete: [
            'שלב הושלם! 🌟',
            'עברת את השלב! 🎉',
        ],
    },

    // קבלת הודעה אקראית מקטגוריה
    getMessage(category) {
        const msgs = this.messages[category];
        if (!msgs || msgs.length === 0) return '';
        return msgs[Math.floor(Math.random() * msgs.length)];
    },

    // הפעלת אנימציה על הדמות
    animate(kafliId, animationType) {
        const kafli = document.getElementById(kafliId);
        if (!kafli) return;

        // הסר אנימציות קודמות
        kafli.classList.remove('kafli-jumping', 'kafli-sad', 'kafli-cheering');

        // הפעל אנימציה חדשה
        void kafli.offsetWidth; // force reflow
        kafli.classList.add(`kafli-${animationType}`);

        // הסר אחרי סיום
        const durations = { jumping: 600, sad: 500, cheering: 800 };
        setTimeout(() => {
            kafli.classList.remove(`kafli-${animationType}`);
        }, durations[animationType] || 600);
    },

    // שינוי פה
    setMouth(kafliId, mouthType) {
        const kafli = document.getElementById(kafliId);
        if (!kafli) return;
        const mouth = kafli.querySelector('.kafli-mouth');
        if (!mouth) return;

        mouth.className = 'kafli-mouth';
        mouth.classList.add(`kafli-mouth-${mouthType}`);
    },

    // תגובה לתשובה נכונה
    reactCorrect(kafliId, speechId, streak) {
        let category = 'correct';
        if (streak >= 10) category = 'streak10';
        else if (streak >= 5) category = 'streak5';
        else if (streak >= 3) category = 'streak3';

        this.setSpeech(speechId, this.getMessage(category));
        this.setMouth(kafliId, 'happy');
        this.animate(kafliId, 'jumping');
    },

    // תגובה לתשובה שגויה
    reactWrong(kafliId, speechId) {
        this.setSpeech(speechId, this.getMessage('wrong'));
        this.setMouth(kafliId, 'sad');
        this.animate(kafliId, 'sad');

        // חזור לחיוך אחרי 1.5 שניות
        setTimeout(() => {
            this.setMouth(kafliId, 'happy');
        }, 1500);
    },

    // תגובת סיכום
    reactSummary(kafliId, speechId, correctPercent, isNewRecord) {
        if (isNewRecord) {
            this.setSpeech(speechId, this.getMessage('newRecord'));
            this.animate(kafliId, 'cheering');
        } else if (correctPercent >= 80) {
            this.setSpeech(speechId, this.getMessage('summaryGreat'));
            this.animate(kafliId, 'jumping');
        } else if (correctPercent >= 50) {
            this.setSpeech(speechId, this.getMessage('summaryGood'));
            this.setMouth(kafliId, 'happy');
        } else {
            this.setSpeech(speechId, this.getMessage('summaryOk'));
            this.setMouth(kafliId, 'happy');
        }
    },

    // עדכון בועת דיבור
    setSpeech(speechId, text) {
        const bubble = document.getElementById(speechId);
        if (!bubble) return;
        
        const textEl = bubble.querySelector('p') || bubble;
        textEl.textContent = text;
        
        // אנימציית הופעה
        bubble.style.animation = 'none';
        void bubble.offsetWidth;
        bubble.style.animation = 'bubbleAppear 0.3s ease';
    }
};
