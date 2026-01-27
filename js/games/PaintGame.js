import { BaseGame } from '../games/BaseGame.js';
import { GameGraphics } from '../utils/GameGraphics.js';

export class PaintGame extends BaseGame {
    constructor(config) {
        super(config);
        this.items = [];
        this.paintedCount = 0;

        this.flowerColors = ['#8b7355', '#a0826d', '#c9a690', '#d4af37'];

        this.fairies = [];
        this.hasFairies = config.level >= 2;

        this.combo = 0;
        this.comboTimer = 0;
        this.brushTrail = [];
    }

    init() {
        super.init();
        this.setupLevel();
    }

    setupLevel() {
        this.items = [];
        this.fairies = [];
        this.brushTrail = [];
        const count = 25 + (this.level * 8);

        for (let i = 0; i < count; i++) {
            this.items.push({
                x: Math.random() * this.width,
                y: this.safeTop + 60 + Math.random() * (this.safeBottom - this.safeTop - 100),
                size: 15 + Math.random() * 25,
                color: this.flowerColors[Math.floor(Math.random() * this.flowerColors.length)],
                isGold: false,
                scale: 1,
                angle: Math.random() * Math.PI * 2,
                vx: this.level >= 2 ? (Math.random() - 0.5) * 30 : 0,
                vy: this.level >= 2 ? (Math.random() - 0.5) * 30 : 0
            });
        }

        if (this.hasFairies) {
            const fairyCount = 2 + this.level;
            for (let i = 0; i < fairyCount; i++) {
                this.fairies.push({
                    x: Math.random() * this.width,
                    y: this.safeTop + 100 + Math.random() * (this.safeBottom - this.safeTop - 200),
                    vx: (Math.random() - 0.5) * 100,
                    vy: (Math.random() - 0.5) * 100,
                    size: 35,
                    wingAngle: 0
                });
            }
        }

        this.onNewRound = () => this.setupLevel();
    }

    update(dt) {
        super.update(dt);
        if (this.isOver) return;

        // Combo Timer
        if (this.comboTimer > 0) {
            this.comboTimer -= dt;
            if (this.comboTimer <= 0) this.combo = 0;
        }

        // Level 2+: Move flowers
        if (this.level >= 2) {
            for (const item of this.items) {
                // Level 3: Wind (Drifting right-up)
                if (this.level >= 3) {
                    item.x += 20 * dt;
                    item.y -= 10 * dt;
                    // Wrap around
                    if (item.x > this.width + 50) item.x = -50;
                    if (item.y < -50) item.y = this.height + 50;
                } else {
                    // Level 2: Gentle float
                    item.x += item.vx * dt;
                    item.y += item.vy * dt;
                    // Bounce
                    if (item.x < 0 || item.x > this.width) item.vx *= -1;
                    if (item.y < 100 || item.y > this.height - 100) item.vy *= -1;
                }
            }
        }

        // Move Fairies
        for (const fairy of this.fairies) {
            fairy.x += fairy.vx * dt;
            fairy.y += fairy.vy * dt;
            fairy.wingAngle += dt * 10;

            if (fairy.x < 30 || fairy.x > this.width - 30) fairy.vx *= -1;
            if (fairy.y < this.safeTop + 100 || fairy.y > this.safeBottom - 100) fairy.vy *= -1;
        }

        // 붓 자취 업데이트
        for (let i = this.brushTrail.length - 1; i >= 0; i--) {
            this.brushTrail[i].life -= dt;
            if (this.brushTrail[i].life <= 0) {
                this.brushTrail.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        // Background
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(0, 0, this.width, this.height);

        // Combo
        if (this.combo >= 3) {
            ctx.fillStyle = '#fcd34d';
            ctx.font = 'bold 20px sans-serif';
            ctx.strokeText(`✨ ${this.combo} COMBO!`, this.width / 2, this.safeTop + 73);
            ctx.fillText(`✨ ${this.combo} COMBO!`, this.width / 2, this.safeTop + 73);
        } else if (this.paintedCount === 0) {
            // 안내 (처음에만)
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 14px sans-serif';
            const helpText = this.hasFairies ? "요정을 피해서 터치!" : "터치로 황금빛 칠하기!";
            ctx.fillText(helpText, this.width / 2, this.safeTop + 73);
        }

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (const item of this.items) {
            ctx.save();
            ctx.translate(item.x, item.y);
            ctx.rotate(item.angle + (this.level >= 3 ? Date.now() / 1000 : 0));
            ctx.scale(item.scale, item.scale);

            if (item.isGold) {
                ctx.shadowColor = '#fbbf24';
                ctx.shadowBlur = 15;
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.arc(0, 0, item.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            } else {
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = item.color;
                ctx.beginPath();
                ctx.arc(0, 0, item.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;
            }

            ctx.restore();
        }

        // Draw Fairies (Obstacles)
        for (const fairy of this.fairies) {
            ctx.save();
            ctx.translate(fairy.x, fairy.y);

            // 요정 몸
            ctx.fillStyle = '#dda0dd';
            ctx.beginPath();
            ctx.arc(0, 0, fairy.size * 0.3, 0, Math.PI * 2);
            ctx.fill();

            // 경고 표시
            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 20px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('⚠️', 0, -fairy.size * 0.7);

            ctx.restore();
        }

        // Progress Bar
        const progress = this.paintedCount / (this.items.length * 0.9);
        ctx.fillStyle = '#44403c';
        ctx.fillRect(50, this.height - 50, this.width - 100, 10);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(50, this.height - 50, (this.width - 100) * Math.min(progress, 1), 10);

        super.draw(ctx);
    }

    onInputMove(x, y) {
        this.brushTrail.push({ x, y, life: 1.0 });
        if (this.brushTrail.length > 20) this.brushTrail.shift();
        this.checkPaint(x, y);
        this.checkFairyCollision(x, y);
    }

    onInputDown(x, y) {
        this.resumeAudio();
        this.brushTrail.push({ x, y, life: 1.0 });
        this.checkPaint(x, y);
        this.checkFairyCollision(x, y);
    }

    checkFairyCollision(x, y) {
        for (const fairy of this.fairies) {
            const dx = x - fairy.x;
            const dy = y - fairy.y;
            if (dx * dx + dy * dy < 900) { // Hit fairy
                this.combo = 0;
                this.timeLeft -= 5;
                this.playSound('fail');
                window.navigator.vibrate?.(100);
                this.spawnParticles(fairy.x, fairy.y, '#a855f7', 10);
                return;
            }
        }
    }

    checkPaint(x, y) {
        let hit = false;
        for (const item of this.items) {
            if (item.isGold) continue;

            const dx = x - item.x;
            const dy = y - item.y;
            if (dx * dx + dy * dy < 1600) {
                item.isGold = true;
                item.scale = 1.3;

                this.paintedCount++;
                this.combo++;
                this.comboTimer = 1.5;

                const comboBonus = Math.min(this.combo * 2, 20);
                this.score += 10 + comboBonus;
                this.collected++;
                if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.collected);

                this.spawnParticles(item.x, item.y, '#fbbf24', 2);
                hit = true;

                if (this.paintedCount >= this.items.length * 0.9) {
                    setTimeout(() => this.roundClear(), 500);
                }
            }
        }
        if (hit) {
            this.playSound('click');
            window.navigator.vibrate?.(5);
        }
    }
}
