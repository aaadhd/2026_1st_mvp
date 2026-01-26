import { BaseGame } from '../games/BaseGame.js';
import { GameGraphics } from '../utils/GameGraphics.js';

export class MemoryGame extends BaseGame {
    constructor(config) {
        super(config);
        this.type = config.type || 'LIST';

        this.state = 'PREPARE';
        this.timer = 0;

        this.itemsToRemember = [];
        this.pool = [
            { id: 'apple', color: '#ff6b6b', icon: '🍎' },
            { id: 'orange', color: '#ff9966', icon: '🍊' },
            { id: 'banana', color: '#ffd93d', icon: '🍌' },
            { id: 'grape', color: '#a29bfe', icon: '🍇' },
            { id: 'watermelon', color: '#55efc4', icon: '🍉' },
            { id: 'strawberry', color: '#fd79a8', icon: '🍓' },
            { id: 'cherry', color: '#d63031', icon: '🍒' },
            { id: 'lemon', color: '#fdcb6e', icon: '🍋' },
            { id: 'pear', color: '#a8e6cf', icon: '🍐' },
            { id: 'peach', color: '#ffb6b9', icon: '🍑' },
            { id: 'pineapple', color: '#f8c291', icon: '🍍' },
            { id: 'kiwi', color: '#8ed1fc', icon: '🥝' }
        ];

        this.displayItems = [];
        this.feedbackMsg = "";
        this.feedbackTimer = 0;
        this.cardFlipAnim = 0;
    }

    init() {
        super.init();
        this.startRound();

        // 🆕 Level-up callback
        this.onNewRound = () => this.startRound();
    }

    startRound() {
        this.state = 'MEMORIZE';
        // 외우는 시간 레벨별 감소 (건강한 시니어 대상)
        this.timer = Math.max(3.0, 6.0 - this.level * 0.3);

        // 더 많은 카드 (3개부터 시작, 최대 8개)
        const count = Math.min(3 + this.level, 8);
        const shuffled = [...this.pool].sort(() => 0.5 - Math.random());
        this.itemsToRemember = shuffled.slice(0, count);

        this.displayItems = this.itemsToRemember.map((item, i) => ({
            ...item,
            x: this.width / 2 - ((count - 1) * 70) / 2 + i * 70,
            y: this.height / 2,
            scale: 1
        }));

        this.feedbackMsg = "";
    }

    toGuessPhase() {
        this.state = 'GUESS';
        this.timer = this.timeLimit;

        const correct = this.itemsToRemember;
        const distractors = this.pool.filter(x => !correct.some(c => c.id === x.id)).slice(0, 3);
        const all = [...correct, ...distractors].sort(() => 0.5 - Math.random());

        const cols = 3;
        const startY = this.safeTop + 80;

        this.displayItems = all.map((item, i) => ({
            ...item,
            x: this.width / 2 + ((i % cols) - 1) * 90,
            y: startY + Math.floor(i / cols) * 100,
            scale: 1,
            selected: false,
            isTarget: correct.some(c => c.id === item.id)
        }));

        this.foundCount = 0;
    }

    update(dt) {
        super.update(dt);
        if (this.isOver) return;

        if (this.state === 'MEMORIZE') {
            this.timer -= dt;
            if (this.timer <= 0) {
                this.toGuessPhase();
            }
        }

        if (this.feedbackTimer > 0) this.feedbackTimer -= dt;
    }

    draw(ctx) {
        // 🎨 배경 그라디언트
        GameGraphics.drawGradientBackground(ctx, this.width, this.height, ['#fff8e1', '#fff3e0', '#ffecb3']);

        ctx.textAlign = 'center';

        if (this.state === 'MEMORIZE') {
            // 🎯 목표 표시
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#6d4c41';
            ctx.lineWidth = 3;
            ctx.font = 'bold 24px sans-serif';
            const goalText = `목표: ${this.itemsToRemember.length}개 기억하기`;
            ctx.strokeText(goalText, this.width / 2, this.safeTop + 20);
            ctx.fillText(goalText, this.width / 2, this.safeTop + 20);

            ctx.font = 'bold 20px sans-serif';
            ctx.fillStyle = this.timer < 2 ? '#ff5252' : '#ff9800';
            const timerText = `${Math.ceil(this.timer)}초 남음`;
            ctx.strokeText(timerText, this.width / 2, this.safeTop + 48);
            ctx.fillText(timerText, this.width / 2, this.safeTop + 48);

            // Draw list container (간단한 사각형으로 변경)
            ctx.fillStyle = '#fff';
            ctx.fillRect(40, this.height / 2 - 60, this.width - 80, 120);

        } else if (this.state === 'GUESS') {
            // 🎯 목표 표시
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#6d4c41';
            ctx.lineWidth = 3;
            ctx.font = 'bold 24px sans-serif';
            const goalText = `목표: 기억한 과일 찾기`;
            ctx.strokeText(goalText, this.width / 2, this.safeTop + 20);
            ctx.fillText(goalText, this.width / 2, this.safeTop + 20);

            ctx.font = 'bold 20px sans-serif';
            ctx.fillStyle = this.foundCount >= this.itemsToRemember.length ? '#4caf50' : '#ff9800';
            const progressText = `${this.foundCount} / ${this.itemsToRemember.length}`;
            ctx.strokeText(progressText, this.width / 2, this.safeTop + 48);
            ctx.fillText(progressText, this.width / 2, this.safeTop + 48);

            // Feedback
            if (this.feedbackTimer > 0) {
                ctx.fillStyle = '#db2777';
                ctx.font = 'bold 20px sans-serif';
                ctx.fillText(this.feedbackMsg, this.width / 2, this.safeTop + 85);
            }
        }

        // Draw Items
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (const item of this.displayItems) {
            if (item.selected) continue; // Already found

            // Card BG
            ctx.fillStyle = '#fff';
            ctx.shadowColor = 'rgba(0,0,0,0.1)';
            ctx.shadowBlur = 10;
            ctx.fillRect(item.x - 40, item.y - 40, 80, 80);
            ctx.shadowColor = 'transparent';
            
            // 테두리
            ctx.strokeStyle = '#d1d5db';
            ctx.lineWidth = 2;
            ctx.strokeRect(item.x - 40, item.y - 40, 80, 80);

            // Icon (데이터 구조에 따라 emoji 또는 icon 사용)
            ctx.fillStyle = '#000';
            ctx.font = '50px serif';
            const displayIcon = item.icon || item.emoji || '🍎';
            ctx.fillText(displayIcon, item.x, item.y);
        }

        // Draw Basket (Bottom)
        if (this.state === 'GUESS') {
            ctx.font = '80px serif';
            ctx.fillText('🧺', this.width / 2, this.height - 80);
        }

        super.draw(ctx);
    }

    onInputDown(x, y) {
        if (this.state !== 'GUESS') return;

        for (const item of this.displayItems) {
            if (item.selected) continue;

            // Check Hit (더 큰 터치 영역 - 시니어 친화적)
            if (Math.abs(x - item.x) < 50 && Math.abs(y - item.y) < 50) {
                // Correct?
                if (item.isTarget) {
                    item.selected = true;
                    this.foundCount++;

                    // Fly animation to basket
                    this.spawnParticles(item.x, item.y, '#4ade80', 20);
                    this.screenShake(10, 0.2);
                    this.addScore(100);
                    window.navigator.vibrate?.(20);

                    // Feedback
                    this.feedbackMsg = "정답입니다! 👍";
                    this.feedbackTimer = 1.5;

                    // Check Round Clear
                    if (this.foundCount >= this.itemsToRemember.length) {
                        setTimeout(() => {
                            this.roundClear();
                        }, 800);
                    }
                } else {
                    // Wrong
                    window.navigator.vibrate?.(100);
                    this.spawnParticles(item.x, item.y, '#f87171', 8);
                    this.screenShake(8, 0.15);
                    this.feedbackMsg = "다시 생각해보세요";
                    this.feedbackTimer = 1.0;
                    this.timeLeft -= 3; // 페널티 감소 (5초 -> 3초)
                }
                break;
            }
        }
    }
}
