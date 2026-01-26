import { BaseGame } from '../games/BaseGame.js';
import { GameGraphics } from '../utils/GameGraphics.js';

export class StackGame extends BaseGame {
    constructor(config) {
        super(config);
        this.fruits = [];
        this.fallingFruit = null;
        this.fruitTypes = [
            { type: 'apple', size: 35, name: '사과' },
            { type: 'orange', size: 30, name: '오렌지' },
            { type: 'banana', size: 25, name: '바나나' },
            { type: 'watermelon', size: 45, name: '수박' }
        ];

        this.dropX = 0;
        this.stackHeight = 0;
        this.towerY = 0;
        this.wobblePhase = 0;
    }

    init() {
        super.init();
        this.dropX = this.width / 2;
        this.towerY = this.height - 100;
        
        // 레벨별 속도 증가
        this.swingSpeed = 3 + (this.level * 0.8);

        // Initial clean state
        this.fruits = [];
        this.createNextFruit();
        
        // 🆕 Level-up callback
        this.onNewRound = () => {
            this.fruits = [];
            this.swingSpeed = 3 + (this.level * 0.8);
            this.createNextFruit();
        };
    }

    createNextFruit() {
        const type = this.fruitTypes[Math.floor(Math.random() * this.fruitTypes.length)];
        this.fallingFruit = {
            ...type,
            x: this.dropX,
            y: 100, // Top area
            vx: this.swingSpeed, // 레벨별 속도
            vy: 0,
            state: 'SWING' // SWING -> DROP -> LANDED
        };
    }

    update(dt) {
        super.update(dt);
        
        this.wobblePhase += dt * 3;

        if (this.fallingFruit) {
            const f = this.fallingFruit;

            if (f.state === 'SWING') {
                f.x += f.vx;
                if (f.x < 60 || f.x > this.width - 60) f.vx *= -1;
            }
            else if (f.state === 'DROP') {
                f.y += 450 * dt;
                f.rotation += dt * 2;

                // 바닥 충돌
                if (f.y + f.size >= this.towerY) {
                    this.landFruit(f, this.towerY - f.size);
                }
                // 다른 과일 위 충돌
                else if (this.fruits.length > 0) {
                    const top = this.fruits[this.fruits.length - 1];
                    if (f.y + f.size >= top.y - top.size) {
                        const overlap = Math.abs(f.x - top.x) < (f.size + top.size) * 0.5;

                        if (overlap) {
                            this.landFruit(f, top.y - top.size - f.size);
                        } else {
                            if (f.y > this.height) {
                                this.createNextFruit();
                                window.navigator.vibrate?.(50);
                            }
                        }
                    }
                }
            }
        }
        
        // 흔들림 효과
        this.fruits.forEach((fruit, i) => {
            const wobble = Math.sin(this.wobblePhase + i * 0.5) * (this.fruits.length - i) * 0.5;
            fruit.wobble = wobble;
        });
    }

    landFruit(fruit, landY) {
        fruit.y = landY;
        fruit.state = 'LANDED';
        this.fruits.push(fruit);

        this.spawnParticles(fruit.x, fruit.y, '#fcd34d', 10);
        window.navigator.vibrate?.(10);
        this.playSound('success');
        
        // ✅ 제대로 쌓였을 때만 점수 (BaseGame이 자동으로 targetScore 체크)
        this.addScore(100);
        this.screenShake(8, 0.2);
        
        // 다음 과일 생성
        if (!this.isOver && this.collected < this.targetScore) {
            this.createNextFruit();
        }
    }

    draw(ctx) {
        // 🎨 배경
        GameGraphics.drawGradientBackground(ctx, this.width, this.height, ['#fff8dc', '#ffebcd', '#ffe4b5']);

        // 테이블 (나무 재질)
        const tableGradient = ctx.createLinearGradient(0, this.towerY - 10, 0, this.towerY + 30);
        tableGradient.addColorStop(0, '#8d6e63');
        tableGradient.addColorStop(1, '#5d4037');
        ctx.fillStyle = tableGradient;
        ctx.fillRect(0, this.towerY - 10, this.width, 30);
        
        // 테이블 테두리
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 3;
        ctx.strokeRect(0, this.towerY - 10, this.width, 30);

        // 🎯 목표 표시
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#6d4c41';
        ctx.lineWidth = 4;
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        const goalText = `목표: ${this.targetScore}개 쌓기`;
        ctx.strokeText(goalText, this.width / 2, this.safeTop + 15);
        ctx.fillText(goalText, this.width / 2, this.safeTop + 15);
        
        // 진행도
        ctx.font = 'bold 18px sans-serif';
        ctx.fillStyle = this.collected >= this.targetScore ? '#4caf50' : '#ff9800';
        ctx.fillText(`현재: ${this.collected} / ${this.targetScore}`, this.width / 2, this.safeTop + 40);

        // 안내 텍스트 (처음에만)
        if (this.fruits.length === 0 && (!this.fallingFruit || this.fallingFruit.state === 'SWING')) {
            ctx.fillStyle = '#6d4c41';
            ctx.font = 'bold 14px sans-serif';
            ctx.fillText("화면을 터치하면 과일이 떨어집니다", this.width / 2, this.safeTop + 70);
            
            // 손가락 애니메이션
            const bounce = Math.sin(Date.now() * 0.005) * 10;
            ctx.font = '30px sans-serif';
            ctx.fillText('👆', this.width / 2, this.safeTop + 105 + bounce);
        }

        // 쌓인 과일들
        for (const f of this.fruits) {
            // 그림자
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.beginPath();
            ctx.ellipse(f.x + (f.wobble || 0), f.y + f.size + 5, f.size * 0.8, f.size * 0.2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 과일 (흔들림 효과)
            ctx.save();
            ctx.translate(f.wobble || 0, 0);
            GameGraphics.drawFruit(ctx, f.x, f.y, f.size, f.type);
            ctx.restore();
        }

        // 떨어지는 과일
        if (this.fallingFruit) {
            const f = this.fallingFruit;

            // 스윙 중일 때 실 그리기
            if (f.state === 'SWING') {
                ctx.strokeStyle = '#bdbdbd';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.moveTo(f.x, this.safeTop + 40);
                ctx.lineTo(f.x, f.y - f.size);
                ctx.stroke();
                ctx.setLineDash([]);
                
                // 고정점
                ctx.fillStyle = '#757575';
                ctx.beginPath();
                ctx.arc(f.x, this.safeTop + 40, 5, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // 떨어지는 과일 (회전 효과)
            ctx.save();
            ctx.translate(f.x, f.y);
            if (f.state === 'DROP') {
                ctx.rotate(f.rotation || 0);
            }
            GameGraphics.drawFruit(ctx, 0, 0, f.size, f.type);
            ctx.restore();
        }
        
        super.draw(ctx);
    }

    onInputDown() {
        if (this.fallingFruit && this.fallingFruit.state === 'SWING') {
            this.fallingFruit.state = 'DROP';
        }
    }
}
