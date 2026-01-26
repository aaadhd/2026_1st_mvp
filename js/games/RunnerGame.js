import { BaseGame } from '../games/BaseGame.js';
import { GameGraphics } from '../utils/GameGraphics.js';

export class RunnerGame extends BaseGame {
    constructor(config) {
        super(config);
        this.playerY = 0;
        this.velocity = 0;
        this.gravity = 900;
        this.jumpForce = -380;

        this.items = [];
        this.obstacles = [];
        this.clouds = [];
        this.backgroundOffset = 0;

        this.spawnTimer = 0;
        this.gameSpeed = 300 + (this.level * 60);
        this.animFrame = 0;

        // 꽃과 독수리 이모지
        this.targetEmoji = '🌸';
        this.obstacleEmoji = '🦅';
    }

    init() {
        super.init();
        this.playerY = (this.safeTop + this.safeBottom) / 2;
        this.velocity = 0;
        this.animFrame = 0;
        
        this.onNewRound = () => {
            this.items = [];
            this.obstacles = [];
            this.gameSpeed = 300 + (this.level * 60);
        };
    }

    update(dt) {
        super.update(dt);
        if (this.isOver) return;
        
        this.animFrame++;
        this.backgroundOffset += this.gameSpeed * dt;

        this.velocity += this.gravity * dt;
        this.playerY += this.velocity * dt;

        if (this.playerY < this.safeTop + 40) { 
            this.playerY = this.safeTop + 40; 
            this.velocity = 0; 
        }
        if (this.playerY > this.safeBottom - 50) {
            this.playerY = this.safeBottom - 50;
            this.velocity = 0;
        }

        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0) {
            this.spawnObject();
            this.spawnTimer = Math.max(0.5, 1.0 - (this.level * 0.15));
        }

        this.updateObjects(this.items, dt, 'item');
        this.updateObjects(this.obstacles, dt, 'obstacle');

        if (Math.random() < 0.02) this.clouds.push({ 
            x: this.width, 
            y: this.safeTop + Math.random() * 200, 
            speed: this.gameSpeed * 0.3, 
            size: 30 + Math.random() * 30 
        });
        
        for (let i = this.clouds.length - 1; i >= 0; i--) {
            this.clouds[i].x -= this.clouds[i].speed * dt;
            if (this.clouds[i].x < -100) this.clouds.splice(i, 1);
        }
    }

    spawnObject() {
        const isObstacle = this.level > 1 && Math.random() < (this.level * 0.25);

        if (isObstacle) {
            this.obstacles.push({
                x: this.width + 50,
                y: 50 + Math.random() * (this.height - 100),
                emoji: this.obstacleEmoji,
                type: 'obstacle'
            });
        } else {
            this.items.push({
                x: this.width + 50,
                y: 50 + Math.random() * (this.height - 100),
                emoji: this.targetEmoji,
                type: 'item'
            });
        }
    }

    updateObjects(list, dt, type) {
        for (let i = list.length - 1; i >= 0; i--) {
            const obj = list[i];
            obj.x -= this.gameSpeed * dt;

            const dx = obj.x - (this.width * 0.2);
            const dy = obj.y - this.playerY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 50) { // Generous hitbox
                if (type === 'item') {
                    this.addScore(100);
                    this.spawnParticles(obj.x, obj.y, '#818cf8', 10);
                    window.navigator.vibrate?.(10);
                    list.splice(i, 1);
                } else {
                    this.spawnParticles(obj.x, obj.y, '#999', 5);
                    window.navigator.vibrate?.(100);
                    this.velocity = 200;
                    list.splice(i, 1);
                    this.timeLeft -= 3;
                }
            } else if (obj.x < -50) {
                list.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        // 🎨 하늘 배경
        GameGraphics.drawGradientBackground(ctx, this.width, this.height, ['#87CEEB', '#b3e5fc', '#e1f5fe']);
        
        // ☁️ 구름
        for (const c of this.clouds) {
            GameGraphics.drawCloud(ctx, c.x, c.y, c.size);
        }
        
        // 🌳 배경 나무들 (시차효과)
        const treeCount = 5;
        for (let i = 0; i < treeCount; i++) {
            const treeX = ((this.backgroundOffset * 0.3 + i * 150) % (this.width + 150)) - 150;
            const treeY = this.safeBottom - 30;
            GameGraphics.drawTree(ctx, treeX, treeY, 40);
        }
        
        // 바닥 (풀밭)
        const grassGradient = ctx.createLinearGradient(0, this.safeBottom - 20, 0, this.safeBottom + 20);
        grassGradient.addColorStop(0, '#81c784');
        grassGradient.addColorStop(1, '#66bb6a');
        ctx.fillStyle = grassGradient;
        ctx.fillRect(0, this.safeBottom - 20, this.width, 40);
        
        // 🌸 꽃들 (아이템)
        for (const item of this.items) {
            GameGraphics.drawSimpleFlower(ctx, item.x, item.y, 20, '#e91e63');
            
            // 반짝임 효과
            const sparkle = Math.sin(Date.now() * 0.01 + item.x) * 0.3 + 0.7;
            ctx.fillStyle = `rgba(255, 255, 255, ${sparkle})`;
            ctx.beginPath();
            ctx.arc(item.x + 10, item.y - 10, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 🦅 장애물
        for (const obs of this.obstacles) {
            // 독수리 실루엣
            ctx.fillStyle = '#424242';
            ctx.save();
            ctx.translate(obs.x, obs.y);
            
            // 몸
            ctx.fillRect(-15, -10, 30, 20);
            
            // 날개 (펄럭임)
            const wingAngle = Math.sin(this.animFrame * 0.2) * 0.3;
            ctx.save();
            ctx.rotate(wingAngle);
            ctx.fillRect(-40, -5, 25, 10);
            ctx.restore();
            
            ctx.save();
            ctx.scale(-1, 1);
            ctx.rotate(wingAngle);
            ctx.fillRect(-40, -5, 25, 10);
            ctx.restore();
            
            // 부리
            ctx.fillStyle = '#ff6f00';
            ctx.beginPath();
            ctx.moveTo(15, 0);
            ctx.lineTo(25, 0);
            ctx.lineTo(20, 5);
            ctx.fill();
            
            ctx.restore();
        }
        
        // 🏃 플레이어 (러너 캐릭터)
        ctx.save();
        ctx.translate(this.width * 0.2, this.playerY);
        const tilt = Math.min(Math.max(this.velocity * 0.0008, -0.3), 0.3);
        ctx.rotate(tilt);
        GameGraphics.drawRunner(ctx, 0, 0, 30, this.animFrame);
        ctx.restore();
        
        // 🎯 목표 표시
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#1976d2';
        ctx.lineWidth = 3;
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        const goalText = `목표: 꽃 ${this.targetScore}개`;
        ctx.strokeText(goalText, this.width / 2, this.safeTop + 15);
        ctx.fillText(goalText, this.width / 2, this.safeTop + 15);
        
        ctx.font = 'bold 14px sans-serif';
        ctx.fillStyle = this.collected >= this.targetScore ? '#4caf50' : '#fbbf24';
        ctx.strokeText(`${this.collected} / ${this.targetScore}`, this.width / 2, this.safeTop + 35);
        ctx.fillText(`${this.collected} / ${this.targetScore}`, this.width / 2, this.safeTop + 35);
        
        // 안내 (처음에만)
        if (this.collected === 0 && this.items.length < 3) {
            ctx.font = 'bold 12px sans-serif';
            ctx.fillStyle = '#e0f2f1';
            ctx.strokeText("화면 터치로 점프!", this.width / 2, this.safeTop + 58);
            ctx.fillText("화면 터치로 점프!", this.width / 2, this.safeTop + 58);
        }

        super.draw(ctx);
    }

    onInputDown() {
        this.velocity = this.jumpForce;
        this.spawnParticles(this.width * 0.2 - 20, this.playerY + 20, '#fff', 3);
    }
}
