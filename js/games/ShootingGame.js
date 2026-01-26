import { BaseGame } from '../games/BaseGame.js';
import { GameGraphics } from '../utils/GameGraphics.js';

export class ShootingGame extends BaseGame {
    constructor(config) {
        super(config);
        // Types: 'SHOOT' (Gogh) | 'PAINT' (Macke)
        this.type = config.type || 'SHOOT';

        this.playerX = 0;
        this.bullets = [];
        this.enemies = [];
        this.spawnTimer = 0;

        this.shootCooldown = 0;
        this.baseSpawnTime = 0.8;
        
        // 배경 구름
        this.clouds = [];
    }

    init() {
        super.init();
        this.playerX = this.width / 2;
        
        // 구름 생성
        this.clouds = [];
        for (let i = 0; i < 3; i++) {
            this.clouds.push({
                x: Math.random() * this.width,
                y: this.safeTop + Math.random() * 150,
                size: 30 + Math.random() * 20,
                speed: 10 + Math.random() * 20
            });
        }
        
        // 🆕 Level-up callback
        this.onNewRound = () => {
            // 안전하게 배열 비우기: 기존 적들을 화면 밖으로 즉시 이동
            this.enemies.forEach(e => {
                if (e) e.y = this.height + 100; // 화면 아래로 강제 이동 (자동 제거됨)
            });
            this.bullets = [];
        };
    }

    update(dt) {
        super.update(dt);
        if (this.isOver) return;
        
        // 구름 이동
        this.clouds.forEach(cloud => {
            cloud.x += cloud.speed * dt;
            if (cloud.x > this.width + 100) {
                cloud.x = -100;
                cloud.y = this.safeTop + Math.random() * 150;
            }
        });

        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0) {
            this.spawnEnemy();
            this.spawnTimer = Math.max(0.3, this.baseSpawnTime - (this.level * 0.1));
        }

        this.shootCooldown -= dt;

        // Bullets (물방울)
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].y -= 700 * dt;
            if (this.bullets[i].y < -50) this.bullets.splice(i, 1);
        }

        // 해바라기
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];
            if (!e) continue; // 🐛 안전장치: undefined 체크
            
            e.y += (150 + (this.level * 40)) * dt;

            if (this.level >= 2) {
                e.x += Math.sin(e.y * 0.015) * (80 * dt);
            }
            
            // 건강도 감소 (시들어감) - 감소율 완화
            e.health -= dt * 0.1; // 0.15 → 0.1

            // Collision (물주기)
            for (let j = this.bullets.length - 1; j >= 0; j--) {
                const b = this.bullets[j];
                const dx = e.x - b.x;
                const dy = e.y - b.y;
                if (Math.sqrt(dx * dx + dy * dy) < 50) {
                    // 물 맞음!
                    e.health = Math.min(1.0, e.health + 0.4); // 회복량 증가: 0.3 → 0.4
                    this.spawnParticles(e.x, e.y, '#81d4fa', 15);
                    window.navigator.vibrate?.(8);

                    this.bullets.splice(j, 1);

                    // 건강하게 회복하면 점수 (조건 완화: 0.6 이상)
                    if (e.health > 0.6 && !e.watered) {
                        e.watered = true;
                        this.addScore(100);
                        this.screenShake(10, 0.15);
                    }
                    break;
                }
            }

            if (e.y > this.height + 50) {
                this.enemies.splice(i, 1);
            }
        }
    }

    spawnEnemy() {
        this.enemies.push({
            x: Math.random() * (this.width - 100) + 50,
            y: -60,
            health: 0.3 + Math.random() * 0.3, // 초기 건강도 30-60%
            watered: false
        });
    }

    draw(ctx) {
        // 🎨 하늘 배경
        GameGraphics.drawGradientBackground(ctx, this.width, this.height, ['#87CEEB', '#b3e5fc', '#e1f5fe']);
        
        // ☁️ 구름
        this.clouds.forEach(cloud => {
            GameGraphics.drawCloud(ctx, cloud.x, cloud.y, cloud.size);
        });
        
        // 🌻 해바라기들
        for (const e of this.enemies) {
            // 그림자
            ctx.fillStyle = 'rgba(0,0,0,0.15)';
            ctx.beginPath();
            ctx.ellipse(e.x, e.y + 45, 25, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 해바라기
            GameGraphics.drawSunflower(ctx, e.x, e.y, 35, e.health);
            
            // 건강도 표시 바
            const barW = 50;
            const barH = 6;
            ctx.fillStyle = '#333';
            ctx.fillRect(e.x - barW / 2, e.y - 50, barW, barH);
            
            const healthColor = e.health > 0.6 ? '#4caf50' : e.health > 0.3 ? '#ffc107' : '#f44336';
            ctx.fillStyle = healthColor;
            ctx.fillRect(e.x - barW / 2, e.y - 50, barW * e.health, barH);
            
            // 테두리
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.strokeRect(e.x - barW / 2, e.y - 50, barW, barH);
        }

        // 💧 물방울들 (총알)
        for (const b of this.bullets) {
            GameGraphics.drawWaterDrop(ctx, b.x, b.y, 10);
        }
        
        // 💧 플레이어 (물뿌리개 효과)
        ctx.fillStyle = '#64b5f6';
        ctx.beginPath();
        ctx.arc(this.playerX, this.safeBottom - 25, 20, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#1976d2';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // 물뿌리개 손잡이
        ctx.beginPath();
        ctx.arc(this.playerX + 15, this.safeBottom - 30, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 물 나오는 입구
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(this.playerX, this.safeBottom - 35, 5, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 🎯 목표 표시
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#1976d2';
        ctx.lineWidth = 4;
        ctx.font = 'bold 24px sans-serif';
        const goalText = `목표: 해바라기 ${this.targetScore}개`;
        ctx.strokeText(goalText, this.width / 2, this.safeTop + 20);
        ctx.fillText(goalText, this.width / 2, this.safeTop + 20);

        ctx.font = 'bold 20px sans-serif';
        ctx.fillStyle = this.collected >= this.targetScore ? '#4caf50' : '#ffeb3b';
        const progressText = `${this.collected} / ${this.targetScore}`;
        ctx.strokeText(progressText, this.width / 2, this.safeTop + 48);
        ctx.fillText(progressText, this.width / 2, this.safeTop + 48);

        super.draw(ctx);
    }

    onInputDown(x) {
        this.playerX = x;
        this.shoot();
    }

    onInputMove(x) {
        this.playerX = x;
        this.shoot();
    }

    shoot() {
        if (this.shootCooldown <= 0) {
            this.bullets.push({ x: this.playerX, y: this.safeBottom - 50 });
            this.shootCooldown = 0.12;
            window.navigator.vibrate?.(5);
            this.playSound('click');
        }
    }
}
