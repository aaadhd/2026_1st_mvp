import { BaseGame } from '../games/BaseGame.js';
import { GameGraphics } from '../utils/GameGraphics.js';

export class DragGame extends BaseGame {
    constructor(config) {
        super(config);
        // Mode: 'PUZZLE' (Fit to slot) | 'SORT' (Drop to basket)
        this.mode = config.mode || 'PUZZLE';

        this.draggables = []; // {x, y, w, h, id, dragging, targetId}
        this.slots = [];      // {x, y, w, h, id, acceptId}

        this.dragItem = null;
        this.dragOffset = { x: 0, y: 0 };

        // Settings
        this.snapDistance = 50;

        // Feedback message
        this.message = "";
        this.messageTimer = 0;
    }

    init() {
        super.init();
        this.setupLevel();
    }

    setupLevel() {
        // Init items based on mode
        this.draggables = [];
        this.slots = [];

        if (this.mode === 'PUZZLE') { // Yiam (Dog Puzzle)
            const centerX = this.width / 2;
            const centerY = (this.safeTop + this.safeBottom) / 2;

            // Slots (Shadows)
            this.slots.push({ x: centerX - 60, y: centerY, w: 100, h: 100, id: 's1', acceptId: 'p1' });
            this.slots.push({ x: centerX + 60, y: centerY, w: 100, h: 100, id: 's2', acceptId: 'p2' });

            // Pieces (Scattered)
            this.draggables.push({ x: this.width * 0.2, y: this.safeBottom - 80, w: 100, h: 100, id: 'p1', emoji: '🐶', color: '#fb7185' });
            this.draggables.push({ x: this.width * 0.8, y: this.safeBottom - 80, w: 100, h: 100, id: 'p2', emoji: '🐕', color: '#fda4af' });

        } else if (this.mode === 'SORT') { // Caillebotte (Fruit Sort)
            // Two baskets
            this.slots.push({ x: this.width * 0.3, y: this.safeBottom - 60, w: 120, h: 100, id: 'basket_red', isBasket: true, label: '🍎' });
            this.slots.push({ x: this.width * 0.7, y: this.safeBottom - 60, w: 120, h: 100, id: 'basket_green', isBasket: true, label: '🍏' });

            // Spawner will add fruits
            this.spawnTimer = 0;
            this.spawnInterval = 2.0;
        }
    }

    update(dt) {
        super.update(dt);
        if (this.isOver) return;

        if (this.messageTimer > 0) this.messageTimer -= dt;

        if (this.mode === 'SORT') {
            this.updateSortMode(dt);
        }

        // Physics for non-dragged items
        for (const p of this.draggables) {
            if (!p.dragging) {
                if (this.mode === 'SORT') {
                    // Fall
                    p.y += 100 * dt;
                    if (p.y > this.height) { // Missed
                        p.reset = true;
                        this.playSound('fail');
                    }
                }
            }
        }

        // Remove reset items
        if (this.mode === 'SORT') {
            for (let i = this.draggables.length - 1; i >= 0; i--) {
                if (this.draggables[i].reset) this.draggables.splice(i, 1);
            }
        }
    }

    updateSortMode(dt) {
        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0) {
            const isRed = Math.random() > 0.5;
            this.draggables.push({
                x: this.width / 2 + (Math.random() - 0.5) * 50,
                y: 100,
                w: 80, h: 80,
                id: Date.now(),
                type: isRed ? 'red' : 'green',
                emoji: isRed ? '🍎' : '🍏',
                color: isRed ? '#f87171' : '#4ade80'
            });
            this.spawnTimer = 1.5 - (this.level * 0.2);
        }
    }

    draw(ctx) {
        // Background
        ctx.fillStyle = this.mode === 'PUZZLE' ? '#fef3c7' : '#ecfdf5';
        ctx.fillRect(0, 0, this.width, this.height);

        // Instruction
        ctx.fillStyle = '#374151';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';

        if (this.mode === 'PUZZLE') {
            ctx.fillText("조각을 맞는 자리에 끌어다 놓으세요", this.width / 2, 130);
        } else {
            ctx.fillText("과일을 같은 색 바구니에 넣으세요", this.width / 2, 130);
        }

        // Feedback Message
        if (this.messageTimer > 0) {
            ctx.fillStyle = '#059669';
            ctx.font = 'bold 24px sans-serif';
            ctx.fillText(this.message, this.width / 2, 170);
        }

        // Draw Slots
        ctx.lineWidth = 4;

        for (const s of this.slots) {
            ctx.strokeStyle = '#aaa';
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(s.x - s.w / 2, s.y - s.h / 2, s.w, s.h);
            ctx.setLineDash([]);

            if (this.mode === 'SORT') {
                ctx.font = '50px serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('🧺', s.x, s.y);
                // Color hint label
                ctx.font = '30px serif';
                ctx.fillText(s.label, s.x, s.y - 50);
            }
        }

        // Draw Draggables
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw non-dragged first
        for (const p of this.draggables) {
            if (p.dragging) continue;
            this.drawPiece(ctx, p);
        }

        // Draw dragged item on top
        if (this.dragItem) {
            this.drawPiece(ctx, this.dragItem);
        }

        super.draw(ctx);
    }

    drawPiece(ctx, p) {
        ctx.save();
        ctx.translate(p.x, p.y);

        if (p.dragging) {
            ctx.scale(1.2, 1.2);
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = 15;
            ctx.shadowOffsetY = 10;
        }

        // Draw background shape
        ctx.fillStyle = p.locked ? '#fff' : p.color;
        if (p.locked) ctx.globalAlpha = 0.5;

        ctx.beginPath();
        ctx.roundRect(-p.w / 2, -p.h / 2, p.w, p.h, 20);
        ctx.fill();

        // Draw content
        ctx.globalAlpha = 1;
        ctx.font = '50px serif';
        ctx.fillText(p.emoji, 0, 0);

        ctx.restore();
    }

    // --- Input Handling ---
    onInputDown(x, y) {
        this.resumeAudio();

        // Find top-most item under input
        for (let i = this.draggables.length - 1; i >= 0; i--) {
            const p = this.draggables[i];
            if (p.locked) continue;

            if (Math.abs(x - p.x) < p.w / 2 && Math.abs(y - p.y) < p.h / 2) {
                this.dragItem = p;
                p.dragging = true;
                this.dragOffset.x = p.x - x;
                this.dragOffset.y = p.y - y;

                this.playSound('click');
                window.navigator.vibrate?.(10);
                break;
            }
        }
    }

    onInputMove(x, y) {
        if (this.dragItem) {
            this.dragItem.x = x + this.dragOffset.x;
            this.dragItem.y = y + this.dragOffset.y;
        }
    }

    onInputUp(x, y) {
        if (this.dragItem) {
            const p = this.dragItem;
            p.dragging = false;

            // Check drop target
            let snapped = false;

            if (this.mode === 'PUZZLE') {
                for (const s of this.slots) {
                    if (s.acceptId === p.id) { // Match
                        const dist = Math.sqrt(Math.pow(s.x - p.x, 2) + Math.pow(s.y - p.y, 2));
                        if (dist < this.snapDistance) {
                            // Snap!
                            p.x = s.x;
                            p.y = s.y;
                            p.locked = true;
                            snapped = true;

                            this.spawnParticles(p.x, p.y, p.color, 10);
                            this.addScore(100);
                            this.message = "딱 맞아요! 👏";
                            this.messageTimer = 1.5;

                            // Check Win
                            if (this.draggables.every(d => d.locked)) {
                                setTimeout(() => this.roundClear(), 500);
                            }
                            break;
                        }
                    }
                }
            } else if (this.mode === 'SORT') {
                for (const s of this.slots) {
                    // Check collision with box
                    if (Math.abs(p.x - s.x) < s.w / 2 && Math.abs(p.y - s.y) < s.h / 2) {
                        const correct = (s.id === 'basket_red' && p.type === 'red') ||
                            (s.id === 'basket_green' && p.type === 'green');

                        if (correct) {
                            this.addScore(50);
                            this.spawnParticles(s.x, s.y, p.color, 8);
                            this.message = "정확해요! ✨";
                            this.messageTimer = 1.0;
                        } else {
                            // Wrong
                            this.playSound('fail');
                            window.navigator.vibrate?.([50, 50, 50]);
                            this.message = "색이 달라요! 😅";
                            this.messageTimer = 1.0;
                            this.timeLeft -= 3;
                        }

                        // Remove item
                        p.reset = true;
                        snapped = true;
                        break;
                    }
                }
            }

            this.dragItem = null;
        }
    }
}
