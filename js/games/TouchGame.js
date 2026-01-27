import { BaseGame } from '../games/BaseGame.js';
import { GameGraphics } from '../utils/GameGraphics.js';

export class TouchGame extends BaseGame {
    constructor(config) {
        super(config);
        this.items = [];
        this.spawnTimer = 0;
        this.spawnInterval = 0.8 / (this.level * 0.5);
        this.targetEmoji = config.targetEmoji || '😊';

        // 🎮 Gamification: Combo System
        this.combo = 0;
        this.maxCombo = 0;
        this.comboTimer = 0;
        this.comboTimeout = 2.0; // Reset combo after 2s of no hits

        // Challenge: Speed increases over time
        this.speedMultiplier = 1.0;
    }

    init() {
        super.init();
        this.combo = 0;
        this.maxCombo = 0;
        this.speedMultiplier = 1.0;

        // 🆕 Level-up callback: Reset for new round
        this.onNewRound = () => {
            this.items = [];
            this.spawnInterval = 0.8 / (this.level * 0.5);
            this.speedMultiplier = 1.0 + (this.level * 0.2);
        };
    }

    update(dt) {
        super.update(dt);
        if (this.isOver) return;

        // Combo Timer
        if (this.comboTimer > 0) {
            this.comboTimer -= dt;
            if (this.comboTimer <= 0) {
                this.combo = 0; // Reset combo
            }
        }

        // Speed increases over time (challenge)
        this.speedMultiplier += 0.02 * dt;

        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0) {
            this.spawnItem();
            this.spawnTimer = this.spawnInterval / this.speedMultiplier;
        }

        // Remove timed out items (missed = combo break)
        for (let i = this.items.length - 1; i >= 0; i--) {
            this.items[i].life -= dt;
            if (this.items[i].life <= 0) {
                // Missed! Break combo
                if (this.combo > 0) {
                    this.combo = 0;
                    this.playSound('fail');
                }
                this.items.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        // 🎨 배경 그라디언트
        GameGraphics.drawGradientBackground(ctx, this.width, this.height, ['#ffe5f1', '#fff0f6', '#fff5fa']);

        // Combo Display
        if (this.combo >= 2) {
            ctx.save();
            const pulse = 1 + Math.sin(Date.now() * 0.01) * 0.1;
            ctx.translate(this.width / 2, 150);
            ctx.scale(pulse, pulse);

            // 그림자
            ctx.fillStyle = 'rgba(236, 72, 153, 0.3)';
            ctx.font = 'bold 32px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`${this.combo} COMBO! 🔥`, 2, 2);

            // 텍스트
            ctx.fillStyle = '#ec4899';
            ctx.fillText(`${this.combo} COMBO! 🔥`, 0, 0);
            ctx.restore();
        }

        for (const item of this.items) {
            // Pop in effect
            const scale = item.life > 2.8 ? (3 - item.life) * 5 : 1;
            const opacity = item.life < 0.5 ? item.life * 2 : 1;

            // Urgency glow when almost expired
            if (item.life < 1.0) {
                ctx.save();
                ctx.shadowColor = '#f43f5e';
                ctx.shadowBlur = 30 * (1 - item.life);
            }

            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.translate(item.x, item.y);
            ctx.scale(scale, scale);

            // 😊 행복한 얼굴 그리기
            GameGraphics.drawFace(ctx, 0, 0, 30, 'happy');

            ctx.restore();

            if (item.life < 1.0) {
                ctx.restore();
            }
        }

        // Instruction (처음에만)
        if (this.items.length === 0 && this.collected === 0) {
            ctx.fillStyle = '#9ca3af';
            ctx.font = 'bold 16px sans-serif';
            ctx.fillText("행복한 얼굴만 터치하세요!", this.width / 2, this.safeTop + 70);

            const bounce = Math.sin(Date.now() * 0.005) * 10;
            ctx.font = '30px sans-serif';
            ctx.fillText('😊', this.width / 2, this.safeTop + 110 + bounce);
        }

        super.draw(ctx);
    }

    spawnItem() {
        const padding = 50;
        this.items.push({
            id: Date.now() + Math.random(),
            x: padding + Math.random() * (this.width - padding * 2),
            y: this.safeTop + Math.random() * (this.safeBottom - this.safeTop - 50),
            life: Math.max(1.5, 3.0 - this.speedMultiplier * 0.5)
        });
    }

    onInputDown(x, y) {
        this.resumeAudio();

        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            const dx = item.x - x;
            const dy = item.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 50) { // Hit
                this.items.splice(i, 1);

                // Combo System
                this.combo++;
                this.comboTimer = this.comboTimeout;
                if (this.combo > this.maxCombo) this.maxCombo = this.combo;

                // Score based on combo
                const comboBonus = Math.min(this.combo * 10, 50);
                const baseScore = 100 + comboBonus;

                // Visual feedback
                this.spawnParticles(x, y, '#f472b6', 10 + this.combo);

                // Sound feedback
                if (this.combo >= 5) {
                    this.playSound('combo');
                } else {
                    this.playSound('click');
                }

                // Add score (triggers addScore sound too, but click is different)
                this.score += baseScore;
                this.collected++;
                if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.collected);

                window.navigator.vibrate?.(10);

                if (this.collected >= this.targetScore) {
                    this.roundClear();
                }

                return; // One per tap
            }
        }

        // Miss effect
        this.spawnParticles(x, y, '#ccc', 3);
        this.playSound('fail');
    }
}
