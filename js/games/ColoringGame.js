import { BaseGame } from '../games/BaseGame.js';

export class ColoringGame extends BaseGame {
    constructor(config) {
        super(config);
        // Macke: Healing Coloring with Challenge
        this.colors = ['#f472b6', '#818cf8', '#60a5fa', '#34d399', '#facc15', '#fb923c'];
        this.selectedColor = null;
        this.spots = [];

        // 🎮 Gamification: Pattern Matching Challenge
        this.targetPattern = []; // Colors to match
        this.currentIndex = 0;
        this.isPatternMode = config.level >= 2; // Pattern mode from Level 2

        // Palette position
        this.paletteY = 0;
    }

    init() {
        super.init();
        this.setupLevel();
    }

    setupLevel() {
        this.spots = [];
        this.targetPattern = [];
        this.currentIndex = 0;

        const count = 6 + (this.level * 3);
        const cols = 4;
        const rows = Math.ceil(count / cols);
        const cellW = this.width / cols;
        const startY = this.safeTop + 30;
        const availableH = this.safeBottom - startY - 60;

        // Generate spots
        for (let i = 0; i < count; i++) {
            const r = Math.floor(i / cols);
            const c = i % cols;
            const cellH = availableH / rows;

            this.spots.push({
                x: c * cellW + cellW / 2,
                y: startY + r * cellH + cellH / 2,
                radius: Math.min(cellW, cellH) * 0.35,
                color: null,
                isColored: false,
                targetColor: this.isPatternMode ? this.colors[Math.floor(Math.random() * this.colors.length)] : null
            });

            if (this.isPatternMode) {
                this.targetPattern.push(this.spots[i].targetColor);
            }
        }

        this.paletteY = this.height - 100;
    }

    update(dt) {
        super.update(dt);
    }

    draw(ctx) {
        // Background
        ctx.fillStyle = '#f0fdf4';
        ctx.fillRect(0, 0, this.width, this.height);

        // Instruction
        ctx.fillStyle = '#374151';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';

        if (this.isPatternMode) {
            ctx.fillText("표시된 색과 같은 색으로 칠해주세요!", this.width / 2, 130);
        } else {
            ctx.fillText("색을 선택해 원을 채워보세요", this.width / 2, 130);
        }

        // Draw Spots
        for (const spot of this.spots) {
            ctx.save();

            // Target color indicator (Pattern Mode)
            if (this.isPatternMode && !spot.isColored) {
                ctx.strokeStyle = spot.targetColor;
                ctx.lineWidth = 4;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.arc(spot.x, spot.y, spot.radius + 8, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
            }

            // Spot
            ctx.beginPath();
            ctx.arc(spot.x, spot.y, spot.radius, 0, Math.PI * 2);

            if (spot.isColored) {
                ctx.fillStyle = spot.color;
                ctx.fill();

                // Checkmark for correct pattern match
                if (this.isPatternMode && spot.correct) {
                    ctx.fillStyle = '#fff';
                    ctx.font = '24px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('✓', spot.x, spot.y);
                }
            } else {
                ctx.fillStyle = '#e5e7eb';
                ctx.fill();
                ctx.strokeStyle = '#9ca3af';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            ctx.restore();
        }

        // Palette
        ctx.fillStyle = '#fff';
        ctx.shadowColor = 'rgba(0,0,0,0.1)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = -5;
        ctx.fillRect(0, this.paletteY - 20, this.width, 120);
        ctx.shadowBlur = 0;

        const paletteWidth = this.colors.length * 55;
        const startX = (this.width - paletteWidth) / 2 + 25;

        for (let i = 0; i < this.colors.length; i++) {
            const x = startX + i * 55;
            const y = this.paletteY + 20;

            // Selection ring
            if (this.selectedColor === this.colors[i]) {
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(x, y, 28, 0, Math.PI * 2);
                ctx.stroke();
            }

            ctx.fillStyle = this.colors[i];
            ctx.beginPath();
            ctx.arc(x, y, 22, 0, Math.PI * 2);
            ctx.fill();
        }

        super.draw(ctx);
    }

    onInputDown(x, y) {
        this.resumeAudio();

        // Check Palette
        const paletteWidth = this.colors.length * 55;
        const startX = (this.width - paletteWidth) / 2 + 25;

        for (let i = 0; i < this.colors.length; i++) {
            const px = startX + i * 55;
            const py = this.paletteY + 20;

            if (Math.sqrt((x - px) ** 2 + (y - py) ** 2) < 30) {
                this.selectedColor = this.colors[i];
                this.playSound('click');
                window.navigator.vibrate?.(10);
                return;
            }
        }

        // Color Spots
        if (!this.selectedColor) return;

        for (const spot of this.spots) {
            if (spot.isColored) continue;

            const dist = Math.sqrt((x - spot.x) ** 2 + (y - spot.y) ** 2);
            if (dist < spot.radius) {
                spot.isColored = true;
                spot.color = this.selectedColor;

                // Pattern Mode: Check if correct
                if (this.isPatternMode) {
                    if (spot.color === spot.targetColor) {
                        spot.correct = true;
                        this.addScore(100);
                        this.spawnParticles(spot.x, spot.y, spot.color, 15);
                    } else {
                        spot.correct = false;
                        this.playSound('fail');
                        this.timeLeft -= 3;
                        this.spawnParticles(spot.x, spot.y, '#999', 5);
                    }
                } else {
                    // Free Mode: Just color
                    this.addScore(50);
                    this.spawnParticles(spot.x, spot.y, spot.color, 10);
                }

                window.navigator.vibrate?.(15);

                // Check completion
                if (this.spots.every(s => s.isColored)) {
                    setTimeout(() => this.roundClear(), 500);
                }

                return;
            }
        }
    }
}
