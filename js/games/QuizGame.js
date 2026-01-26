import { BaseGame } from '../games/BaseGame.js';

export class QuizGame extends BaseGame {
    constructor(config) {
        super(config);
        // Types: 'PICK_ONE' (Arcimboldo) | 'DECODE_MIRROR' (DaVinci)
        this.type = config.type || 'PICK_ONE';

        this.question = "";
        this.options = [];
        this.correctId = null;

        this.isCorrect = null; // null, true, false
        this.feedbackTimer = 0;

        // Streak counter
        this.streak = 0;

        // DaVinci Pools
        this.words = ['사과', '바나나', '포도', '수박', '배', '복숭아', '체리', '딸기'];
    }

    init() {
        super.init();
        this.streak = 0;
        this.nextQuestion();
    }

    nextQuestion() {
        this.isCorrect = null;
        this.options = [];

        if (this.type === 'DECODE_MIRROR') {
            // DaVinci: Mirror Word
            const word = this.words[Math.floor(Math.random() * this.words.length)];
            this.question = word;
            this.correctId = word;

            // Options: correct word + 2 random words
            const distractors = this.words.filter(w => w !== word).sort(() => 0.5 - Math.random()).slice(0, 2);
            const all = [word, ...distractors].sort(() => 0.5 - Math.random());

            const optY = (this.safeTop + this.safeBottom) / 2 + 50;
            this.options = all.map((w, i) => ({
                id: w,
                text: w,
                x: this.width * (0.25 + i * 0.25),
                y: optY,
                isCorrect: w === word
            }));

        } else {
            // Arcimboldo: Face Part -> Fruit
            const parts = [
                { q: '👃 (코)', a: '🍐' },
                { q: '👂 (귀)', a: '🍄' },
                { q: '👄 (입)', a: '🍒' },
                { q: '👀 (눈)', a: '🫐' }
            ];
            const qData = parts[Math.floor(Math.random() * parts.length)];
            this.question = qData.q;
            this.correctId = qData.a;

            const fruits = ['🍐', '🍄', '🍒', '🫐', '🍉', '🍌'].filter(f => f !== qData.a);
            const distractors = fruits.sort(() => 0.5 - Math.random()).slice(0, 2);
            const all = [qData.a, ...distractors].sort(() => 0.5 - Math.random());

            const optY = (this.safeTop + this.safeBottom) / 2 + 50;
            this.options = all.map((f, i) => ({
                id: f,
                text: f,
                x: this.width * (0.25 + i * 0.25),
                y: optY,
                isCorrect: f === qData.a
            }));
        }
    }

    update(dt) {
        super.update(dt);
        if (this.feedbackTimer > 0) {
            this.feedbackTimer -= dt;
            if (this.feedbackTimer <= 0) {
                this.nextQuestion();
            }
        }
    }

    draw(ctx) {
        // 🎨 Background (Light Blue)
        ctx.fillStyle = '#f0f9ff';
        ctx.fillRect(0, 0, this.width, this.height);

        // Streak Display
        if (this.streak >= 2) {
            ctx.fillStyle = '#3b82f6';
            ctx.font = 'bold 20px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`🔥 ${this.streak}연속 정답!`, this.width / 2, 90);
        }

        // Draw Question
        ctx.fillStyle = '#1f2937';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (this.type === 'DECODE_MIRROR') {
            // Title
            ctx.font = '20px sans-serif';
            ctx.fillText("거울에 비친 글자는?", this.width / 2, 130);

            // Mirror Text
            ctx.save();
            ctx.translate(this.width / 2, this.height * 0.35);
            ctx.scale(-1, 1); // MIRROR EFFECT
            ctx.font = 'bold 60px serif';
            ctx.fillStyle = '#6366f1';
            ctx.fillText(this.question, 0, 0);
            ctx.restore();

        } else {
            ctx.font = '20px sans-serif';
            ctx.fillText("알맞은 과일을 고르세요", this.width / 2, 130);

            ctx.font = 'bold 50px sans-serif';
            ctx.fillText(this.question, this.width / 2, this.height * 0.35);
        }

        // Options
        for (const opt of this.options) {
            // Box
            let bgColor = '#fff';
            if (this.isCorrect !== null && opt.isCorrect) bgColor = '#dcfce7'; // Green
            if (this.isCorrect === false && !opt.isCorrect && opt.selected) bgColor = '#fee2e2'; // Red

            ctx.fillStyle = bgColor;
            ctx.shadowColor = 'rgba(0,0,0,0.1)';
            ctx.shadowBlur = 10;

            ctx.beginPath();
            ctx.roundRect(opt.x - 45, opt.y - 45, 90, 90, 20);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Text
            ctx.fillStyle = '#000';
            ctx.font = '45px serif';
            ctx.fillText(opt.text, opt.x, opt.y);
        }

        // Feedback Overlay
        if (this.isCorrect === true) {
            ctx.font = '100px serif';
            ctx.fillText('⭕', this.width / 2, this.height * 0.8);
        } else if (this.isCorrect === false) {
            ctx.font = '100px serif';
            ctx.fillText('❌', this.width / 2, this.height * 0.8);
        }

        super.draw(ctx);
    }

    onInputDown(x, y) {
        this.resumeAudio();
        if (this.feedbackTimer > 0) return;

        for (const opt of this.options) {
            if (Math.abs(x - opt.x) < 45 && Math.abs(y - opt.y) < 45) {
                // Picked
                opt.selected = true;
                if (opt.isCorrect) {
                    this.isCorrect = true;
                    this.streak++;

                    const streakBonus = Math.min(this.streak * 20, 100);
                    this.addScore(100 + streakBonus);

                    if (this.streak >= 3) {
                        this.playSound('combo');
                    }

                    this.spawnParticles(opt.x, opt.y, '#4ade80', 20);
                    window.navigator.vibrate?.(20);
                } else {
                    this.isCorrect = false;
                    this.streak = 0;
                    this.playSound('fail');
                    window.navigator.vibrate?.(100);
                    this.timeLeft -= 5;
                }
                this.feedbackTimer = 1.0;
                break;
            }
        }
    }
}
