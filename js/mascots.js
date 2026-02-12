/* ========================================
   ניהול קמעות - דמויות
   ======================================== */

const Mascots = {
    // הגדרת כל הדמויות
    list: [
        { id: 'fox', name: 'כפלי', emoji: '🦊', type: 'kafli' },
        { id: 'cat', name: 'חשבי', emoji: '🐱', type: 'mascot' },
        { id: 'dog', name: 'מספרי', emoji: '🐶', type: 'mascot' },
        { id: 'bunny', name: 'קופצי', emoji: '🐰', type: 'mascot' },
        { id: 'bear', name: 'חכמי', emoji: '🐻', type: 'mascot' },
        { id: 'owl', name: 'ינשופי', emoji: '🦉', type: 'mascot' },
    ],

    // יצירת HTML של דמות
    getHTML(mascotId, size, idPrefix) {
        const mascot = this.list.find(m => m.id === mascotId);
        if (!mascot) return this._foxHTML(size, idPrefix);

        if (mascot.type === 'kafli') {
            return this._foxHTML(size, idPrefix);
        }
        return this._genericHTML(mascotId, size, idPrefix);
    },

    // HTML של כפלי (השועל המקורי)
    _foxHTML(size, idPrefix) {
        const sizeClass = size === 'small' ? 'kafli-small' : '';
        return `
            <div id="${idPrefix}" class="kafli ${sizeClass}">
                <div class="kafli-ear kafli-ear-left"></div>
                <div class="kafli-ear kafli-ear-right"></div>
                <div class="kafli-head">
                    <div class="kafli-eye kafli-eye-left"><div class="kafli-pupil"></div></div>
                    <div class="kafli-eye kafli-eye-right"><div class="kafli-pupil"></div></div>
                    <div class="kafli-nose"></div>
                    <div class="kafli-mouth kafli-mouth-happy"></div>
                    <div class="kafli-cheek kafli-cheek-left"></div>
                    <div class="kafli-cheek kafli-cheek-right"></div>
                </div>
                <div class="kafli-body">
                    <div class="kafli-arm kafli-arm-left"></div>
                    <div class="kafli-arm kafli-arm-right"></div>
                    <div class="kafli-belly"></div>
                </div>
                <div class="kafli-tail"></div>
            </div>
        `;
    },

    // HTML של דמויות חדשות (מבנה אחיד)
    _genericHTML(mascotId, size, idPrefix) {
        const sizeClass = size === 'small' ? 'mascot-small' : '';
        let extra = '';
        if (mascotId === 'cat') extra = '<div class="mascot-whiskers"></div>';
        if (mascotId === 'dog') extra = '<div class="mascot-tongue"></div>';
        if (mascotId === 'owl') extra = '<div class="mascot-wing-left"></div><div class="mascot-wing-right"></div>';
        if (mascotId === 'bunny') extra = '<div class="mascot-cheek-left"></div><div class="mascot-cheek-right"></div>';

        return `
            <div id="${idPrefix}" class="mascot mascot-${mascotId} ${sizeClass}">
                <div class="mascot-ear-left"></div>
                <div class="mascot-ear-right"></div>
                <div class="mascot-head">
                    <div class="mascot-eye mascot-eye-left"><div class="mascot-pupil"></div></div>
                    <div class="mascot-eye mascot-eye-right"><div class="mascot-pupil"></div></div>
                    <div class="mascot-nose"></div>
                    <div class="mascot-mouth"></div>
                    ${extra}
                </div>
                <div class="mascot-body">
                    <div class="mascot-belly"></div>
                </div>
                ${mascotId !== 'owl' ? '<div class="mascot-tail"></div>' : ''}
                ${mascotId === 'owl' ? '<div class="mascot-wing-left"></div><div class="mascot-wing-right"></div>' : ''}
            </div>
        `;
    },

    // עדכון כל הדמויות בעמוד לפי הקמע הנבחר
    updateAllMascots() {
        const mascotId = Storage.getPlayerMascot();
        
        // מסך בית
        const homeContainer = document.querySelector('.character-home');
        if (homeContainer) {
            const oldMascot = homeContainer.querySelector('.kafli, .mascot');
            if (oldMascot) {
                const newHTML = this.getHTML(mascotId, 'normal', 'kafli-home');
                oldMascot.outerHTML = newHTML;
            }
        }

        // מסך משחק
        const gameContainer = document.querySelector('.character-game');
        if (gameContainer) {
            const oldMascot = gameContainer.querySelector('.kafli, .mascot');
            if (oldMascot) {
                const newHTML = this.getHTML(mascotId, 'small', 'kafli-game');
                oldMascot.outerHTML = newHTML;
            }
        }

        // מסך סיכום
        const summaryContainer = document.querySelector('.character-summary');
        if (summaryContainer) {
            const oldMascot = summaryContainer.querySelector('.kafli, .mascot');
            if (oldMascot) {
                const newHTML = this.getHTML(mascotId, 'normal', 'kafli-summary');
                oldMascot.outerHTML = newHTML;
            }
        }
    },

    // אתחול מסך כניסה
    initWelcomeScreen() {
        const grid = document.getElementById('mascot-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const currentMascot = Storage.getPlayerMascot();

        this.list.forEach(m => {
            const card = document.createElement('div');
            card.className = 'mascot-card' + (m.id === currentMascot ? ' mascot-card-selected' : '');
            card.onclick = () => this._selectMascot(m.id);
            card.dataset.mascotId = m.id;
            
            card.innerHTML = `
                <div class="mascot-card-preview">${m.emoji}</div>
                <div class="mascot-card-name">${m.name}</div>
            `;
            grid.appendChild(card);
        });

        // שם שחקן
        const nameInput = document.getElementById('player-name-input');
        if (nameInput) {
            nameInput.value = Storage.getPlayerName() || '';
        }
    },

    _selectMascot(id) {
        // עדכן UI
        document.querySelectorAll('.mascot-card').forEach(c => {
            c.classList.remove('mascot-card-selected');
        });
        const card = document.querySelector(`.mascot-card[data-mascot-id="${id}"]`);
        if (card) card.classList.add('mascot-card-selected');
        
        this._selectedMascot = id;
    },

    _selectedMascot: 'fox',

    // שמירה וכניסה למשחק
    saveAndEnter() {
        const nameInput = document.getElementById('player-name-input');
        const name = nameInput ? nameInput.value.trim() : '';
        
        if (!name) {
            nameInput.classList.add('shake-screen');
            setTimeout(() => nameInput.classList.remove('shake-screen'), 400);
            nameInput.focus();
            return;
        }

        Storage.setPlayer(name, this._selectedMascot || 'fox');
        this.updateAllMascots();
        Game.showScreen('screen-home');
        Game.updateHomeScreen();
    }
};
