import { BaseGame } from '../games/BaseGame.js';

export class SoundCanvasGame extends BaseGame {
    constructor(config) {
        super(config);
        // Kandinsky: Synesthesia (Sound + Visual)
        this.shapes = [];
        this.colors = ['#f472b6', '#818cf8', '#60a5fa', '#34d399', '#facc15', '#fb923c'];

        // Web Audio Context (Lazy init)
        this.audioCtx = null;
    }

    init() {
        super.init();
        this.shapes = [];
        // No strict win condition, it's an experience. 
        // But to pass level, user needs to create N shapes?
        this.targetCount = 20 + (this.level * 10);
    }

    startAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playNote(y) {
        if (!this.audioCtx) return;

        // Height maps to pitch (High Y = Low pitch, Low Y = High pitch)
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        const freq = 200 + ((this.height - y) / this.height) * 600; // 200~800Hz
        osc.frequency.value = freq;
        osc.type = Math.random() < 0.5 ? 'sine' : 'triangle';

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, this.audioCtx.currentTime + 1);
        osc.stop(this.audioCtx.currentTime + 1);
    }

    update(dt) {
        super.update(dt);

        // Expand/Fade shapes
        for (let i = this.shapes.length - 1; i >= 0; i--) {
            const s = this.shapes[i];
            s.size += 20 * dt;
            s.alpha -= 0.5 * dt;
            if (s.alpha <= 0) {
                this.shapes.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        // Kandinsky style background cues?
        if (this.shapes.length === 0) {
            ctx.fillStyle = '#888';
            ctx.textAlign = 'center';
            ctx.font = '20px sans-serif';
            ctx.fillText("화면을 터치하여 음악을 그려보세요", this.width / 2, this.height / 2);
        }

        ctx.globalCompositeOperation = 'hard-light'; // Blending
        for (const s of this.shapes) {
            ctx.fillStyle = s.color;
            ctx.globalAlpha = s.alpha;

            ctx.beginPath();
            if (s.type === 'circle') {
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            } else if (s.type === 'rect') {
                ctx.rect(s.x - s.size, s.y - s.size, s.size * 2, s.size * 2);
            } else {
                ctx.moveTo(s.x, s.y - s.size);
                ctx.lineTo(s.x + s.size, s.y + s.size);
                ctx.lineTo(s.x - s.size, s.y + s.size);
            }
            ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1.0;

        // Progress (Hidden or Minimal)
        super.draw(ctx);
    }

    onInputDown(x, y) {
        this.startAudio();
        this.createShape(x, y);
    }

    onInputMove(x, y) {
        // Drag sound? Maybe throttle
        if (Math.random() < 0.2) this.createShape(x, y);
    }

    createShape(x, y) {
        const type = ['circle', 'rect', 'tri'][Math.floor(Math.random() * 3)];
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];

        this.shapes.push({
            x, y, type, color,
            size: 10 + Math.random() * 20,
            alpha: 1.0
        });

        this.playNote(y);
        this.addScore(10);

        if (this.score >= this.targetScore && !this.isOver) {
            // Just continue endless or clear?
            // Since it's a game, let's clear after some engagement
            setTimeout(() => this.roundClear(), 2000);
        }
    }
}
