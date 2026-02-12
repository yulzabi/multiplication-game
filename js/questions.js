/* ========================================
   לוגיקת שאלות וכפל
   ======================================== */

const Questions = {
    // יצירת שאלה אקראית
    generate(tables) {
        // tables = מערך של מספרים (למשל [3] או [1,2,3,...,10])
        const table = tables[Math.floor(Math.random() * tables.length)];
        const num = Math.floor(Math.random() * 10) + 1;
        const answer = table * num;

        return {
            num1: table,
            num2: num,
            answer: answer,
            options: this._generateOptions(answer, table)
        };
    },

    // יצירת 4 אפשרויות תשובה
    _generateOptions(correctAnswer, table) {
        const options = new Set();
        options.add(correctAnswer);

        // ניסיונות ליצירת תשובות מסיחות הגיוניות
        const distractors = [
            correctAnswer + table,        // כפל + עוד אחד
            correctAnswer - table,        // כפל - אחד
            correctAnswer + 1,            // קרוב +1
            correctAnswer - 1,            // קרוב -1
            correctAnswer + 10,           // +10
            correctAnswer - 10,           // -10
            correctAnswer + 2,
            correctAnswer - 2,
            correctAnswer * 2,            // כפול
            Math.floor(correctAnswer / 2),// חצי
            table * (Math.floor(Math.random() * 10) + 1), // כפל אחר מאותו לוח
        ];

        // ערבב את המסיחים
        this._shuffle(distractors);

        // הוסף מסיחים תקינים (חיוביים ושונים מהתשובה)
        for (const d of distractors) {
            if (options.size >= 4) break;
            if (d > 0 && d <= 100 && !options.has(d)) {
                options.add(d);
            }
        }

        // אם עדיין אין מספיק, הוסף אקראיים
        while (options.size < 4) {
            const rand = Math.floor(Math.random() * 100) + 1;
            if (!options.has(rand)) {
                options.add(rand);
            }
        }

        const result = Array.from(options);
        this._shuffle(result);
        return result;
    },

    // ערבוב מערך (Fisher-Yates)
    _shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    // בדיקת תשובה
    check(question, selectedAnswer) {
        return selectedAnswer === question.answer;
    },

    // יצירת רשימת שאלות מוכנה מראש
    generateSet(tables, count) {
        const questions = [];
        const used = new Set();
        
        for (let i = 0; i < count; i++) {
            let q;
            let attempts = 0;
            do {
                q = this.generate(tables);
                attempts++;
            } while (used.has(`${q.num1}x${q.num2}`) && attempts < 50);
            
            used.add(`${q.num1}x${q.num2}`);
            questions.push(q);
        }
        return questions;
    },

    // כל לוחות הכפל (1-10)
    ALL_TABLES: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
};
