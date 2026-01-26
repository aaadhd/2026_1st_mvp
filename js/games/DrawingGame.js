import { BaseGame } from '../games/BaseGame.js';

export class DrawingGame extends BaseGame {
    constructor(config) {
        super(config);
        // DaVinci: Mirror Drawing (Symmetry)
        this.axisX = 0;
        this.points = []; // {x, y, connected}
        this.userPoints = []; // {x, y}
        this.currentIdx = 0;

        this.shapes = [
            // Triangle
            [{ x: -50, y: -50 }, { x: -80, y: 50 }, { x: -20, y: 50 }],
            // Star-ish
            [{ x: -40, y: -60 }, { x: -60, y: 0 }, { x: -20, y: 60 }, { x: -70, y: 60 }, { x: -10, y: 0 }],
            // Tree
            [{ x: -10, y: -80 }, { x: -60, y: 20 }, { x: -30, y: 20 }, { x: -80, y: 80 }, { x: -20, y: 80 }]
        ];
    }

    init() {
        super.init();
        this.axisX = this.width / 2;
        this.setupShape();
    }

    setupShape() {
        this.points = [];
        this.userPoints = [];
        this.currentIdx = 0;

        const shape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
        const scale = 1.0 + (this.level * 0.2);

        // Generate Left Guide Points
        for (const p of shape) {
            this.points.push({
                x: this.axisX + (p.x * scale), // Left side (negative offsets)
                y: (this.height / 2) + (p.y * scale),
                mirrorX: this.axisX - (p.x * scale), // Target Right side
                mirrorY: (this.height / 2) + (p.y * scale),
                done: false
            });
        }
    }

    update(dt) {
        super.update(dt);
    }

    draw(ctx) {
        // Axis
        ctx.strokeStyle = '#aaa';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(this.axisX, 50);
        ctx.lineTo(this.axisX, this.height - 50);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Guide (Left)
        ctx.strokeStyle = '#64748b'; // Slate
        ctx.lineWidth = 3;
        ctx.beginPath();
        if (this.points.length > 0) {
            ctx.moveTo(this.points[0].x, this.points[0].y);
            for (let i = 1; i < this.points.length; i++) ctx.lineTo(this.points[i].x, this.points[i].y);
            ctx.closePath();
        }
        ctx.stroke();

        // Draw Points
        for (let i = 0; i < this.points.length; i++) {
            const p = this.points[i];

            // Left (Reference)
            ctx.fillStyle = '#64748b';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            ctx.fill();

            // Right (Target Hint)
            if (i === this.currentIdx) {
                // Active Target - Blink
                const alpha = 0.5 + Math.sin(Date.now() / 200) * 0.4;
                ctx.fillStyle = `rgba(26, 115, 232, ${alpha})`; // Blue hint
                ctx.beginPath();
                ctx.arc(p.mirrorX, p.mirrorY, 15, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
            } else if (p.done) {
                // Done
                ctx.fillStyle = '#2563eb'; // Blue
                ctx.beginPath();
                ctx.arc(p.mirrorX, p.mirrorY, 6, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Draw User Lines
        if (this.currentIdx > 0) {
            ctx.strokeStyle = '#2563eb';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(this.points[0].mirrorX, this.points[0].mirrorY);
            for (let i = 1; i < this.currentIdx; i++) {
                ctx.lineTo(this.points[i].mirrorX, this.points[i].mirrorY);
            }
            ctx.stroke();
        }

        // Instruction
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.font = '20px sans-serif';
        ctx.fillText("대칭되는 점을 터치하세요", this.width / 2, 130);

        super.draw(ctx);
    }

    onInputDown(x, y) {
        if (this.currentIdx >= this.points.length) return;

        const target = this.points[this.currentIdx];
        const dist = Math.sqrt(Math.pow(x - target.mirrorX, 2) + Math.pow(y - target.mirrorY, 2));

        if (dist < 40) { // Generous hit area
            target.done = true;
            this.currentIdx++;
            this.addScore(100);
            this.spawnParticles(target.mirrorX, target.mirrorY, '#2563eb', 10);
            window.navigator.vibrate?.(10);

            if (this.currentIdx >= this.points.length) {
                // Complete shape
                setTimeout(() => {
                    this.roundClear();
                }, 1000);
            }
        } else {
            // Wrong touch
            this.spawnParticles(x, y, '#999', 3);
        }
    }
}
