import { BaseGame } from '../games/BaseGame.js';

export class CollageGame extends BaseGame {
    constructor(config) {
        super(config);
        // Matisse: Paper Cutout Collage
        this.pieces = [];
        this.selectedPiece = null;
        this.offset = { x: 0, y: 0 };

        // Palette
        this.paletteY = 0;
        this.paletteItems = [];
    }

    init() {
        super.init();
        this.paletteY = this.height * 0.8;

        // Setup Pattern Shapes (Leaf, Star, Squiggle) - Represented by emojis or paths
        const shapes = ['🌿', '🥬', '🍁', '🦋', '🔵', '🟧', '🔶'];
        // Generate Palette Items
        for (let i = 0; i < shapes.length; i++) {
            this.paletteItems.push({
                emoji: shapes[i],
                x: 50 + i * 60,
                y: this.paletteY + 40,
                size: 50,
                color: `hsl(${Math.random() * 360}, 70%, 60%)`
            });
        }

        // Preset Canvas
        this.pieces = [];
    }

    update(dt) {
        super.update(dt);
    }

    draw(ctx) {
        // Canvas Background
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, this.width, this.paletteY);

        // Placed Pieces
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (const p of this.pieces) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.scale(p.scale, p.scale);

            // Draw Emoji with Color Filter? 
            // Canvas fillText handles color if using unicode, but emojis are fixed color.
            // For Matisse vibe, better to draw shapes. But using Emojis for simplicity/consistency.

            // Shadow
            if (p === this.selectedPiece) {
                ctx.shadowColor = 'rgba(0,0,0,0.3)';
                ctx.shadowBlur = 10;
            }

            ctx.font = `${p.size}px serif`;
            ctx.fillText(p.emoji, 0, 0);

            ctx.restore();
        }

        // Palette
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, this.paletteY, this.width, this.height - this.paletteY);
        ctx.fillStyle = '#eee';
        ctx.fillRect(0, this.paletteY, this.width, 2); // Border

        for (const item of this.paletteItems) {
            ctx.font = `${item.size}px serif`;
            ctx.fillText(item.emoji, item.x, item.y);
        }

        // Dragging Piece (if new from palette)
        // ... handled in pieces list directly? No, separate logic for drag from palette.

        // Instructions
        if (this.pieces.length === 0) {
            ctx.fillStyle = '#999';
            ctx.font = '20px sans-serif';
            ctx.fillText("조각을 드래그해 정원을 꾸며보세요", this.width / 2, this.height / 2);
        }

        super.draw(ctx);
    }

    onInputDown(x, y) {
        // Check Palette
        if (y > this.paletteY) {
            for (const item of this.paletteItems) {
                if (Math.abs(x - item.x) < 30 && Math.abs(y - item.y) < 30) {
                    // Spawn new piece
                    const newPiece = {
                        emoji: item.emoji,
                        x: x,
                        y: y,
                        size: 80, // Bigger on canvas
                        angle: Math.random() * 0.5 - 0.25,
                        scale: 1,
                        isNew: true
                    };
                    this.pieces.push(newPiece);
                    this.selectedPiece = newPiece;
                    this.offset = { x: 0, y: 0 };
                    window.navigator.vibrate?.(10);
                    return;
                }
            }
        }

        // Check Canvas Pieces (Top-most first)
        for (let i = this.pieces.length - 1; i >= 0; i--) {
            const p = this.pieces[i];
            const dx = x - p.x;
            const dy = y - p.y;
            if (dx * dx + dy * dy < 1600) { // 40px radius
                this.selectedPiece = p;
                this.offset.x = dx;
                this.offset.y = dy;
                // Lift up
                this.pieces.splice(i, 1);
                this.pieces.push(p);
                window.navigator.vibrate?.(5);
                return;
            }
        }
    }

    onInputMove(x, y) {
        if (this.selectedPiece) {
            this.selectedPiece.x = x - this.offset.x;
            this.selectedPiece.y = y - this.offset.y;
        }
    }

    onInputUp() {
        if (this.selectedPiece) {
            // Delete if thrown back to palette
            if (this.selectedPiece.y > this.paletteY) {
                const idx = this.pieces.indexOf(this.selectedPiece);
                if (idx > -1) this.pieces.splice(idx, 1);
                this.spawnParticles(this.selectedPiece.x, this.selectedPiece.y, '#999', 5);
            } else {
                // Placed
                this.addScore(50);
                this.spawnParticles(this.selectedPiece.x, this.selectedPiece.y, '#f472b6', 5);
            }
            this.selectedPiece = null;

            // Check count for 'Clear' (soft clear)
            if (this.pieces.length >= 10 && !this.isOver) {
                setTimeout(() => this.roundClear(), 2000);
            }
        }
    }
}
