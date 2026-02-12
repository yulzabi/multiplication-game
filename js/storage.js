/* ========================================
   שמירת התקדמות - localStorage
   ======================================== */

const Storage = {
    KEYS: {
        HIGH_SCORES: 'kafli_high_scores',
        STAR_JOURNEY: 'kafli_star_journey',
        TOTAL_STARS: 'kafli_total_stars',
        STATS: 'kafli_stats'
    },

    // === שיאים ===
    getHighScore(mode) {
        const scores = this._get(this.KEYS.HIGH_SCORES) || {};
        return scores[mode] || 0;
    },

    setHighScore(mode, score) {
        const scores = this._get(this.KEYS.HIGH_SCORES) || {};
        if (score > (scores[mode] || 0)) {
            scores[mode] = score;
            this._set(this.KEYS.HIGH_SCORES, scores);
            return true; // שיא חדש!
        }
        return false;
    },

    // === מסע הכוכבים - שלבים ===
    getLevelData() {
        return this._get(this.KEYS.STAR_JOURNEY) || {
            unlockedLevel: 1,
            levelStars: {} // { 1: 3, 2: 2, ... }
        };
    },

    saveLevelData(level, stars) {
        const data = this.getLevelData();
        // שמור כוכבים רק אם יותר ממה שיש
        const currentStars = data.levelStars[level] || 0;
        if (stars > currentStars) {
            data.levelStars[level] = stars;
        }
        // פתח שלב הבא אם הושלם
        if (stars >= 1 && level >= data.unlockedLevel) {
            data.unlockedLevel = level + 1;
        }
        this._set(this.KEYS.STAR_JOURNEY, data);
    },

    // === סטטיסטיקות כלליות ===
    getTotalStars() {
        return this._get(this.KEYS.TOTAL_STARS) || 0;
    },

    addStars(count) {
        const total = this.getTotalStars() + count;
        this._set(this.KEYS.TOTAL_STARS, total);
        return total;
    },

    getStats() {
        return this._get(this.KEYS.STATS) || {
            totalCorrect: 0,
            totalWrong: 0,
            totalGames: 0
        };
    },

    updateStats(correct, wrong) {
        const stats = this.getStats();
        stats.totalCorrect += correct;
        stats.totalWrong += wrong;
        stats.totalGames += 1;
        this._set(this.KEYS.STATS, stats);
    },

    // === עזר ===
    _get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    },

    _set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('שגיאה בשמירה:', e);
        }
    },

    // איפוס כל הנתונים
    resetAll() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }
};
