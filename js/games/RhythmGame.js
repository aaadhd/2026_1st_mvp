import { BaseGame } from '../games/BaseGame.js';
import { GameGraphics } from '../utils/GameGraphics.js';

export class RhythmGame extends BaseGame {
    constructor(config) {
        super(config);
        this.notes = [];
        this.spawnTimer = 0;
        this.spawnInterval = 1.0;
        this.noteSpeed = 280; // 기본 속도

        this.judgeY = 0;
        this.hitEffects = [];
        this.beatPulse = 0;
        
        // 판정 윈도우 (레벨별 감소)
        this.perfectWindow = 50;
        this.goodWindow = 70;
    }

    init() {
        super.init();
        // 레벨별 난이도 조정
        this.noteSpeed = 280 + (this.level * 30); // 노트 속도 증가
        this.perfectWindow = Math.max(30, 50 - this.level * 3);
        this.goodWindow = Math.max(45, 70 - this.level * 4);
    }

    resize(w, h) {
        super.resize(w, h);
        this.judgeY = h * 0.8;
    }

    update(dt) {
        super.update(dt);
        if (this.isOver) return;
        
        this.beatPulse += dt * 5;

        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0) {
            this.spawnNote();
            // 더 빠른 스폰 간격 (건강한 시니어 대상)
            this.spawnInterval = Math.max(0.4, 0.9 - (this.level * 0.1));
            this.spawnTimer = this.spawnInterval;
        }

        for (let i = this.notes.length - 1; i >= 0; i--) {
            const n = this.notes[i];
            n.y += this.noteSpeed * dt;
            n.rotation += dt * 2;

            if (n.y > this.height + 50) {
                this.notes.splice(i, 1);
                // 놓친 노트는 시간 패널티
                this.timeLeft -= 1;
            }
        }
        
        for (let i = this.hitEffects.length - 1; i >= 0; i--) {
            this.hitEffects[i].life -= dt;
            if (this.hitEffects[i].life <= 0) {
                this.hitEffects.splice(i, 1);
            }
        }
    }

    spawnNote() {
        // Random lane? Center for now
        this.notes.push({
            x: this.width / 2 + (Math.random() - 0.5) * 200,
            y: -50,
            scale: 1,
            color: `hsl(${Math.random() * 360}, 70%, 70%)`
        });
    }

    draw(ctx) {
        // 🎨 무대 배경
        GameGraphics.drawGradientBackground(ctx, this.width, this.height, ['#1a1a2e', '#0f3460', '#16213e']);

        // 판정 라인 (펄스 효과)
        const pulse = 1 + Math.sin(this.beatPulse) * 0.1;
        ctx.save();
        ctx.translate(0, this.judgeY);
        ctx.scale(1, pulse);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, -40, this.width, 80);
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#4fc3f7';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.width, 0);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();

        // 히트 이펙트
        for (const effect of this.hitEffects) {
            const alpha = effect.life;
            const scale = 2 - effect.life;
            ctx.save();
            ctx.translate(effect.x, effect.y);
            ctx.scale(scale, scale);
            ctx.fillStyle = `rgba(79, 195, 247, ${alpha})`;
            ctx.font = 'bold 40px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('✨', 0, 0);
            ctx.restore();
        }

        // 음표들
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (const n of this.notes) {
            ctx.save();
            ctx.translate(n.x, n.y);
            ctx.rotate(n.rotation || 0);

            // 그림자
            ctx.shadowColor = n.color;
            ctx.shadowBlur = 25;
            
            GameGraphics.drawMusicNote(ctx, 0, 0, 40);

            ctx.restore();
        }
        
        // 🎯 목표 및 진행도 표시
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.font = 'bold 20px sans-serif';
        
        const goalText = `목표: ${this.targetScore}개`;
        ctx.strokeText(goalText, this.width / 2, this.safeTop + 15);
        ctx.fillText(goalText, this.width / 2, this.safeTop + 15);
        
        // 진행도
        ctx.font = 'bold 18px sans-serif';
        const progressColor = this.collected >= this.targetScore ? '#4fc3f7' : '#ffd54f';
        ctx.fillStyle = progressColor;
        ctx.strokeText(`${this.collected} / ${this.targetScore}`, this.width / 2, this.safeTop + 40);
        ctx.fillText(`${this.collected} / ${this.targetScore}`, this.width / 2, this.safeTop + 40);

        // 안내 텍스트 (처음에만)
        if (this.notes.length < 3 && this.collected === 0) {
            ctx.fillStyle = '#b3e5fc';
            ctx.font = 'bold 14px sans-serif';
            ctx.fillText('음표가 라인에 닿을 때 터치!', this.width / 2, this.safeTop + 70);
        }

        super.draw(ctx);
    }

    onInputDown(x, y) {
        let hit = false;
        let bestNote = null;
        let bestDist = Infinity;
        
        // 가장 가까운 노트 찾기
        for (const n of this.notes) {
            const dx = x - n.x;
            const dy = this.judgeY - n.y;
            const dist = Math.abs(dy);
            
            if (Math.abs(dx) < 100 && dist < bestDist && dist < this.goodWindow) {
                bestNote = n;
                bestDist = dist;
            }
        }
        
        if (bestNote) {
            const isPerfect = bestDist < this.perfectWindow;
            const score = isPerfect ? 200 : 100;
            const particleColor = isPerfect ? '#ffd700' : '#4fc3f7';
            const particleCount = isPerfect ? 25 : 15;
            
            this.spawnParticles(bestNote.x, this.judgeY, particleColor, particleCount);
            this.hitEffects.push({ x: bestNote.x, y: this.judgeY, life: 1.0 });
            this.addScore(score);
            
            // 노트 제거
            const index = this.notes.indexOf(bestNote);
            if (index > -1) this.notes.splice(index, 1);
            
            this.screenShake(isPerfect ? 15 : 8, 0.15);
            window.navigator.vibrate?.(isPerfect ? 30 : 15);
            hit = true;
        }

        if (!hit) {
            // 빗맞춤 - 시간 패널티
            this.spawnParticles(x, y, '#ff5252', 3);
            this.timeLeft -= 2;
        }
    }
}
