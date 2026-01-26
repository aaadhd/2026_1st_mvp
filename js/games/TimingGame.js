import { BaseGame } from '../games/BaseGame.js';
import { GameGraphics } from '../utils/GameGraphics.js';

export class TimingGame extends BaseGame {
    constructor(config) {
        super(config);
        // Bonnard: Feed Cat
        this.target = { x: 0, y: 0, dir: 1, speed: 200, timer: 0 };
        this.food = null;

        this.catEmoji = '🐱';
        this.happyEmoji = '😻';
        this.foodEmoji = '🐟';

        this.happyTimer = 0; // For reaction

        this.wind = 0; // Level 3 mechanic
    }

    init() {
        super.init();
        this.target.x = this.width / 2;
        this.target.y = this.safeTop + 60;
        this.target.speed = 200 + (this.level * 60); // 더 빠르게

        if (this.level >= 2) { // 레벨 2부터 바람 추가
            this.wind = (Math.random() - 0.5) * 120; // 더 강한 바람
        }
        
        // 타이밍 윈도우 레벨별 감소
        this.timingRange = Math.max(35, 55 - this.level * 4);
        this.perfectRange = Math.max(15, 25 - this.level * 2);
    }

    update(dt) {
        super.update(dt);
        if (this.isOver) return;

        // Happy Timer
        if (this.happyTimer > 0) {
            this.happyTimer -= dt;
        }

        // Target Logic
        this.target.x += this.target.speed * this.target.dir * dt;

        // Bounce
        if (this.target.x < 40 || this.target.x > this.width - 40) {
            this.target.dir *= -1;
            this.target.x = Math.max(40, Math.min(this.width - 40, this.target.x));
        }

        // Level 2+: Random direction change
        if (this.level >= 2) {
            this.target.timer -= dt;
            if (this.target.timer <= 0) {
                if (Math.random() < 0.3) this.target.dir *= -1; // Change dir
                this.target.timer = 1.0 + Math.random(); // Next check

                // Level 3: Speed variation
                if (this.level >= 3) {
                    this.target.speed = 100 + Math.random() * 300;
                }
            }
        }

        // Move Food
        if (this.food) {
            this.food.y -= 500 * dt;
            this.food.angle += 10 * dt;

            // Level 3 Wind
            if (this.level >= 3) {
                this.food.x += this.wind * dt;
            }

            // Hit Check
            const dx = this.food.x - this.target.x;
            const dy = this.food.y - this.target.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < this.timingRange) {
                // 완벽한 타이밍 보너스
                const score = dist < this.perfectRange ? 200 : 100;
                this.addScore(score);
                
                const particleColor = dist < this.perfectRange ? '#ffd700' : '#f97316';
                this.spawnParticles(this.target.x, this.target.y, particleColor, 20);
                window.navigator.vibrate?.(dist < this.perfectRange ? 30 : 15);
                this.food = null;

                // Reaction
                this.happyTimer = 1.0;

                // Increase speed slightly per hit
                this.target.speed *= 1.08;
                if (this.level >= 2) this.wind = (Math.random() - 0.5) * 150; // Wind changes
                
                this.screenShake(dist < this.perfectRange ? 12 : 8, 0.15);
            } else if (this.food.y < -50 || this.food.x < 0 || this.food.x > this.width) {
                this.food = null;
            }
        }
    }

    draw(ctx) {
        // 🎨 배경 그라디언트
        GameGraphics.drawGradientBackground(ctx, this.width, this.height, ['#fff8e1', '#ffecb3', '#ffe082']);
        
        // 바닥
        ctx.fillStyle = '#d7ccc8';
        ctx.fillRect(0, this.target.y + 60, this.width, 20);
        
        // 바닥 그림자
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(0, this.target.y + 60, this.width, 5);
        
        // 🎯 목표 표시
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#6d4c41';
        ctx.lineWidth = 4;
        ctx.font = 'bold 24px sans-serif';
        const goalText = `목표: 물고기 ${this.targetScore}마리`;
        ctx.strokeText(goalText, this.width / 2, this.safeTop + 20);
        ctx.fillText(goalText, this.width / 2, this.safeTop + 20);

        ctx.font = 'bold 20px sans-serif';
        ctx.fillStyle = this.collected >= this.targetScore ? '#4caf50' : '#ff9800';
        const progressText = `${this.collected} / ${this.targetScore}`;
        ctx.strokeText(progressText, this.width / 2, this.safeTop + 48);
        ctx.fillText(progressText, this.width / 2, this.safeTop + 48);
        
        // Wind Indicator (Lv3)
        if (this.level >= 3) {
            const windIntensity = Math.abs(this.wind) / 150;
            ctx.fillStyle = `rgba(100, 150, 255, ${windIntensity * 0.8})`;
            ctx.font = 'bold 14px sans-serif';
            ctx.fillText(this.wind > 0 ? '바람 →→' : '←← 바람', this.width / 2, this.safeTop + 60);
        }

        // 🐱 고양이 그리기
        ctx.save();
        ctx.scale(this.target.dir, 1);
        ctx.translate(this.target.x * this.target.dir, 0);
        GameGraphics.drawCat(ctx, 0, this.target.y, 30, this.happyTimer > 0);
        ctx.restore();

        // 하트 애니메이션 (행복할 때)
        if (this.happyTimer > 0) {
            const heartScale = 1 + Math.sin(Date.now() * 0.01) * 0.2;
            ctx.save();
            ctx.translate(this.target.x, this.target.y - 60);
            ctx.scale(heartScale, heartScale);
            ctx.font = '30px serif';
            ctx.textAlign = 'center';
            ctx.fillText('❤️', 0, 0);
            ctx.restore();
        }

        // 🐟 생선 그리기 (날아가는 중)
        if (this.food) {
            GameGraphics.drawFish(ctx, this.food.x, this.food.y, 20, this.food.angle || 0);
            
            // 생선 그림자
            ctx.fillStyle = 'rgba(0,0,0,0.15)';
            ctx.beginPath();
            ctx.ellipse(this.food.x, this.target.y + 60, 15, 5, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // 🐟 던지기 대기중인 생선 (하단)
        if (!this.food) {
            GameGraphics.drawFish(ctx, this.width / 2, this.height - 80, 25, 0);
            
            // 손가락 가이드 애니메이션
            const bounce = Math.sin(Date.now() * 0.005) * 10;
            ctx.font = '40px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('👆', this.width / 2, this.height - 120 + bounce);
        }

        // Instruction (처음에만)
        if (!this.food && this.happyTimer <= 0 && this.collected === 0) {
            ctx.fillStyle = '#6d4c41';
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            const instrText = "타이밍을 맞춰 생선을 던져주세요!";
            ctx.strokeText(instrText, this.width / 2, this.safeTop + 75);
            ctx.fillText(instrText, this.width / 2, this.safeTop + 75);
        }

        super.draw(ctx);
    }

    onInputDown() {
        if (!this.food) {
            this.food = {
                x: this.width / 2,
                y: this.height - 80,
                angle: 0
            };
            window.navigator.vibrate?.(5);
        }
    }
}
