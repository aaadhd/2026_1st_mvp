import { BaseGame } from '../games/BaseGame.js';

export class FindGame extends BaseGame {
    constructor(config) {
        super(config);
        // Types: 'HIDDEN' | 'SAME'
        this.type = config.type || 'HIDDEN';
        this.role = config.role || 'YUNBOK';

        this.items = [];
        this.targetItem = null;

        // Pools
        this.peoplePool = ['🚶', '🏃', '🧍', '🤸', '🧘', '💃', '👯', '🕴️', '🧖', '🧗', '🚵', '🤹'];
        this.flowerPool = ['🌸', '🌺', '🌹', '🪷', '💐', '🥀', '☘️', '🌿', '🌱', '🎍'];
        this.coupleEmoji = '💑';

        this.message = "";
        this.messageTimer = 0;
    }

    init() {
        super.init();
        this.startRound();

        // 🆕 Level-up callback
        this.onNewRound = () => this.startRound();
    }

    startRound() {
        this.items = [];

        let pool = [];
        let distractorsCount = 20 + (this.level * 15); // Increased density
        let targetEmoji = '';

        if (this.type === 'HIDDEN') {
            pool = this.peoplePool;
            targetEmoji = this.coupleEmoji;
            if (this.config.role === 'BRUEGEL') {
                targetEmoji = '🤹';
                pool = this.peoplePool.filter(e => e !== '🤹');
            }
        } else if (this.type === 'SAME') {
            pool = this.flowerPool;
            targetEmoji = pool[Math.floor(Math.random() * pool.length)];
            distractorsCount = 15 + (this.level * 10);
        } else {
            pool = this.peoplePool;
            targetEmoji = '⭐';
        }

        // Target properties based on Level (Use safe area)
        const minY = this.safeTop + 20;
        const maxY = this.safeBottom - 30;

        this.targetItem = {
            id: 'target',
            emoji: targetEmoji,
            x: Math.random() * (this.width - 80) + 40,
            y: minY + Math.random() * (maxY - minY),
            size: this.level > 1 ? 30 : 40,
            angle: this.level > 1 ? (Math.random() - 0.5) : 0,
            isTarget: true,
            vx: this.level > 2 ? (Math.random() - 0.5) * 50 : 0,
            vy: this.level > 2 ? (Math.random() - 0.5) * 50 : 0
        };
        this.items.push(this.targetItem);

        // Add Distractors
        for (let i = 0; i < distractorsCount; i++) {
            let dEmoji = pool[Math.floor(Math.random() * pool.length)];
            if (this.type === 'SAME' && dEmoji === targetEmoji) {
                dEmoji = pool[(pool.indexOf(dEmoji) + 1) % pool.length];
            }

            this.items.push({
                id: `d_${i}`,
                emoji: dEmoji,
                x: Math.random() * (this.width - 80) + 40,
                y: minY + Math.random() * (maxY - minY),
                size: 30 + Math.random() * 20,
                angle: (Math.random() - 0.5) * 1.5,
                isTarget: false,
                vx: this.level > 2 ? (Math.random() - 0.5) * 20 : 0,
                vy: this.level > 2 ? (Math.random() - 0.5) * 20 : 0
            });
        }

        this.items.sort((a, b) => a.y - b.y);
    }

    update(dt) {
        super.update(dt);

        if (this.messageTimer > 0) this.messageTimer -= dt;

        if (this.level > 2) {
            // Update movement for Lv3
            for (const item of this.items) {
                if (item.vx || item.vy) {
                    item.x += item.vx * dt;
                    item.y += item.vy * dt;

                    // Bounce
                    if (item.x < 20 || item.x > this.width - 20) item.vx *= -1;
                    if (item.y < 20 || item.y > this.height - 20) item.vy *= -1;
                }
            }
        }
    }

    draw(ctx) {
        // Draw Header
        ctx.fillStyle = '#fff'; // White text for finding in dark? Usually FindGame has BG?
        // Let's assume FindGame needs a light BG for detailed finding, but base class clears.
        // Let's draw a nice paper BG.
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.fillStyle = '#111';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        // Instruction (Y=150 to avoid HUD)
        if (this.messageTimer <= 0) {
            ctx.fillText(`숨은 그림을 찾아보세요: ${this.targetItem.emoji}`, this.width / 2, 150);
        } else {
            // Success Message
            ctx.fillStyle = '#d97706';
            ctx.font = 'bold 22px sans-serif';
            ctx.fillText(this.message, this.width / 2, 150);
        }

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (const item of this.items) {
            ctx.save();
            ctx.translate(item.x, item.y);
            ctx.rotate(item.angle);
            ctx.fillStyle = '#000'; // Emoji default color
            ctx.font = `${item.size}px serif`;
            ctx.fillText(item.emoji, 0, 0);
            ctx.restore();
        }

        super.draw(ctx);
    }

    onInputDown(x, y) {
        if (this.messageTimer > 0) return; // Wait during message

        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            const dx = x - item.x;
            const dy = y - item.y;
            if (dx * dx + dy * dy < (item.size / 1.2) * (item.size / 1.2)) {
                if (item.isTarget) {
                    this.addScore(100);
                    this.spawnParticles(item.x, item.y, '#ffd700', 20);
                    window.navigator.vibrate?.(20);

                    // Set Message based on Role
                    if (this.role === 'BRUEGEL') {
                        this.message = "축제의 주인공을 찾았습니다! 🎉";
                    } else {
                        this.message = "아름다운 인연을 찾았네요! 💑";
                    }
                    this.messageTimer = 1.5;

                    setTimeout(() => {
                        this.startRound();
                    }, 1500);
                } else {
                    this.spawnParticles(item.x, item.y, '#999', 3);
                    window.navigator.vibrate?.(50);
                    this.timeLeft -= 2;
                }
                break; // One click per frame
            }
        }
    }
}
