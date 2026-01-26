import { BaseGame } from '../games/BaseGame.js';
import { GameGraphics } from '../utils/GameGraphics.js';

export class CatchGame extends BaseGame {
    constructor(config) {
        super(config);
        // Paula: Catch Fruits
        this.playerX = 0;
        this.items = [];
        this.spawnTimer = 0;

        this.basketEmoji = '🧺';
        this.fruitEmojis = ['🍎', '🍐', '🍊', '🍋'];
        this.badEmoji = '🪨'; // Rock
    }

    init() {
        super.init();
        this.playerX = this.width / 2;
    }

    update(dt) {
        super.update(dt);
        if (this.isOver) return;

        // Spawn
        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0) {
            this.spawnItem();
            this.spawnTimer = Math.max(0.3, 1.0 - (this.level * 0.2));
        }

        // Update Items
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            item.y += (200 + (this.level * 50)) * dt;

            // Catch Check (Use safe area)
            if (item.y > this.safeBottom - 80 && item.y < this.safeBottom) {
                if (Math.abs(item.x - this.playerX) < 50) {
                    // Cached!
                    if (item.isBad) {
                        this.spawnParticles(item.x, item.y, '#555', 5);
                        window.navigator.vibrate?.(100);
                        this.timeLeft -= 5;
                    } else {
                        this.addScore(50);
                        this.spawnParticles(item.x, item.y, '#fb923c', 10);
                        window.navigator.vibrate?.(10);
                    }
                    this.items.splice(i, 1);
                    continue;
                }
            }

            if (item.y > this.height + 50) {
                this.items.splice(i, 1);
            }
        }
    }

    spawnItem() {
        const isBad = Math.random() < (0.1 * this.level);
        this.items.push({
            x: Math.random() * (this.width - 60) + 30,
            y: -50,
            emoji: isBad ? this.badEmoji : this.fruitEmojis[Math.floor(Math.random() * this.fruitEmojis.length)],
            isBad: isBad
        });
    }

    draw(ctx) {
        // Player (Basket) - Use safe area
        ctx.font = '60px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.basketEmoji, this.playerX, this.safeBottom - 40);

        // Items
        for (const item of this.items) {
            ctx.fillText(item.emoji, item.x, item.y);
        }

        super.draw(ctx);
    }

    onInputMove(x, y) {
        this.playerX = x;
    }

    onInputDown(x, y) {
        this.playerX = x;
    }
}
