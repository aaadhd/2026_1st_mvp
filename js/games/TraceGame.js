import { BaseGame } from '../games/BaseGame.js';

export class TraceGame extends BaseGame {
    constructor(config) {
        super(config);
        // Types: 'DOTS' (Seurat) | 'CUT' (Matisse) | 'MAZE' (Klee)
        this.type = config.type || 'DOTS';

        this.points = [];
        this.currentPointIndex = 0;
        this.path = []; // User drawing path
        this.isDrawing = false;

        // Maze Walls
        this.walls = [];
        this.startArea = null;
        this.endArea = null;

        // UI Feedback
        this.message = "";
        this.messageTimer = 0;
    }

    init() {
        super.init();
        this.path = [];
        this.currentPointIndex = 0;
        this.points = [];
        this.walls = [];

        if (this.type === 'DOTS') {
            // Seurat: Connect Dots (Use safe area)
            const count = 5 + (this.level * 2);
            for (let i = 0; i < count; i++) {
                this.points.push({
                    x: Math.random() * (this.width - 100) + 50,
                    y: this.safeTop + 30 + Math.random() * (this.safeBottom - this.safeTop - 80),
                    id: i + 1,
                    checked: false
                });
            }
            // Sort by X to make it somewhat traceable
            this.points.sort((a, b) => a.x - b.x);
            // Re-label
            this.points.forEach((p, i) => p.id = i + 1);

        } else if (this.type === 'CUT') {
            // Matisse: Cut line (Use safe area)
            const segs = 10;
            const centerY = (this.safeTop + this.safeBottom) / 2;
            for (let i = 0; i <= segs; i++) {
                const r = i / segs;
                this.points.push({
                    x: 50 + r * (this.width - 100),
                    y: centerY + Math.sin(r * Math.PI * 2 * (1 + (this.level * 0.5))) * 80
                });
            }
        } else if (this.type === 'MAZE') {
            // Klee: Maze (Use safe area)
            this.startArea = { x: 50, y: this.safeTop + 20, w: 60, h: 60 };
            this.endArea = { x: this.width - 110, y: this.safeBottom - 80, w: 60, h: 60 };

            // Random Walls
            const wallCount = 5 + (this.level * 3);
            for (let i = 0; i < wallCount; i++) {
                this.walls.push({
                    x: Math.random() * (this.width - 100) + 50,
                    y: this.safeTop + 50 + Math.random() * (this.safeBottom - this.safeTop - 100),
                    w: Math.random() < 0.5 ? 100 : 20,
                    h: Math.random() < 0.5 ? 20 : 100
                });
            }
        }
    }

    update(dt) {
        super.update(dt);
        if (this.messageTimer > 0) this.messageTimer -= dt;
    }

    draw(ctx) {
        // Background
        ctx.fillStyle = this.type === 'MAZE' ? '#fef3c7' : '#f5f5f4';
        ctx.fillRect(0, 0, this.width, this.height);

        // Instruction
        ctx.fillStyle = '#374151';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';

        if (this.type === 'DOTS') {
            const progress = this.currentPointIndex;
            const total = this.points.length;
            ctx.fillText(`점을 순서대로 이으세요 (${progress}/${total})`, this.width / 2, 80);
        } else if (this.type === 'CUT') {
            ctx.fillText("점선을 따라 가위로 잘라보세요 ✂️", this.width / 2, 80);
        } else {
            ctx.fillText("START에서 END까지 벽을 피해 이동하세요", this.width / 2, 80);
        }

        // Message
        if (this.messageTimer > 0) {
            ctx.fillStyle = '#059669';
            ctx.font = 'bold 24px sans-serif';
            ctx.fillText(this.message, this.width / 2, 120);
        }

        // Draw Path
        ctx.strokeStyle = this.type === 'CUT' ? '#ef4444' : '#000';
        ctx.lineWidth = 5;

        // Background guides
        if (this.type === 'DOTS') {
            for (const p of this.points) {
                ctx.fillStyle = p.checked ? '#10b981' : '#ccc';
                ctx.beginPath();
                ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#000';
                ctx.font = '12px sans-serif';
                ctx.fillText(p.id, p.x - 4, p.y - 15);
            }
            // Draw lines for checked
            ctx.beginPath();
            let first = true;
            for (const p of this.points) {
                if (p.checked) {
                    if (first) { ctx.moveTo(p.x, p.y); first = false; }
                    else { ctx.lineTo(p.x, p.y); }
                }
            }
            ctx.stroke();

        } else if (this.type === 'CUT') {
            ctx.setLineDash([10, 10]);
            ctx.strokeStyle = '#aaa';
            ctx.beginPath();
            ctx.moveTo(this.points[0].x, this.points[0].y);
            for (let i = 1; i < this.points.length; i++) ctx.lineTo(this.points[i].x, this.points[i].y);
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw user cut
            ctx.strokeStyle = '#ef4444';
            if (this.path.length > 1) {
                ctx.beginPath();
                ctx.moveTo(this.path[0].x, this.path[0].y);
                for (let i = 1; i < this.path.length; i++) ctx.lineTo(this.path[i].x, this.path[i].y);
                ctx.stroke();
            }

            // Result Scissors
            const last = this.path[this.path.length - 1];
            if (last) {
                ctx.font = '30px serif';
                ctx.fillText('✂️', last.x, last.y);
            }

        } else if (this.type === 'MAZE') {
            // Walls
            ctx.fillStyle = '#78350f';
            for (const w of this.walls) {
                ctx.fillRect(w.x, w.y, w.w, w.h);
            }

            // Start/End
            ctx.fillStyle = '#4ade80';
            ctx.globalAlpha = 0.5;
            ctx.fillRect(this.startArea.x, this.startArea.y, this.startArea.w, this.startArea.h);
            ctx.fillStyle = '#facc15';
            ctx.fillRect(this.endArea.x, this.endArea.y, this.endArea.w, this.endArea.h);
            ctx.globalAlpha = 1.0;

            ctx.fillStyle = '#000';
            ctx.font = '20px sans-serif';
            ctx.fillText('START', this.startArea.x + 10, this.startArea.y + 35);
            ctx.fillText('END', this.endArea.x + 15, this.endArea.y + 35);

            // User Path
            ctx.strokeStyle = '#3b82f6';
            ctx.beginPath();
            if (this.path.length > 0) {
                ctx.moveTo(this.path[0].x, this.path[0].y);
                for (let i = 1; i < this.path.length; i++) ctx.lineTo(this.path[i].x, this.path[i].y);
            }
            ctx.stroke();

            // Klee Character on head
            const head = this.path[this.path.length - 1];
            if (head) {
                ctx.font = '30px serif';
                ctx.fillText('🚶', head.x - 10, head.y + 10);
            }
        }

        super.draw(ctx);
    }

    onInputDown(x, y) {
        if (this.type === 'MAZE') {
            // Check Start Area
            if (x > this.startArea.x && x < this.startArea.x + this.startArea.w &&
                y > this.startArea.y && y < this.startArea.y + this.startArea.h) {
                this.isDrawing = true;
                this.path = [{ x, y }];
                window.navigator.vibrate?.(10);
            }
        } else {
            this.isDrawing = true;
            this.path = [{ x, y }];
        }

        this.checkPoint(x, y);
    }

    onInputMove(x, y) {
        if (!this.isDrawing) return;
        this.path.push({ x, y });

        if (this.type === 'MAZE') {
            // Collision Check
            for (const w of this.walls) {
                if (x > w.x && x < w.x + w.w && y > w.y && y < w.y + w.h) {
                    // Hit Wall -> Fail
                    this.isDrawing = false;
                    this.path = [];
                    this.spawnParticles(x, y, '#ef4444', 10);
                    window.navigator.vibrate?.(100);
                    return;
                }
            }
            // End Check
            if (x > this.endArea.x && x < this.endArea.x + this.endArea.w &&
                y > this.endArea.y && y < this.endArea.y + this.endArea.h) {
                this.roundClear();
            }
        } else {
            this.checkPoint(x, y);
        }
    }

    onInputUp() {
        this.isDrawing = false;
        if (this.type === 'CUT') {
            // Check completion simply by path length or proximity to end?
            // For now, if path covers X range
            const xs = this.path.map(p => p.x);
            const min = Math.min(...xs);
            const max = Math.max(...xs);
            if (max - min > this.width * 0.8) {
                this.addScore(100); // Per cut?
                // Just clear for simplicity
                this.roundClear();
            } else {
                this.path = []; // Reset
            }
        }
    }

    checkPoint(x, y) {
        if (this.type === 'DOTS') {
            const target = this.points[this.currentPointIndex];
            if (!target) {
                this.roundClear();
                return;
            }

            const dx = x - target.x;
            const dy = y - target.y;
            if (dx * dx + dy * dy < 400) {
                target.checked = true;
                this.currentPointIndex++;
                this.spawnParticles(target.x, target.y, '#10b981', 5);
                window.navigator.vibrate?.(10);

                if (this.currentPointIndex >= this.points.length) {
                    this.addScore(100);
                    setTimeout(() => this.roundClear(), 500);
                }
            }
        }
    }
}
