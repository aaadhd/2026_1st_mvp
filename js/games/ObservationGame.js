import { BaseGame } from '../games/BaseGame.js';
import { GameGraphics } from '../utils/GameGraphics.js';

export class ObservationGame extends BaseGame {
    constructor(config) {
        super(config);
        // Monet: Observation & Focus
        // Find the EXACT match among similar foils.
        this.targetFeature = null; // { color, petals, rotation }
        this.options = [];
        this.colors = ['#f472b6', '#818cf8', '#60a5fa', '#c084fc', '#fb7185'];
        this.startTimer = 0.5;
    }

    init() {
        super.init();
        this.nextRound();

        // 🆕 Level-up callback
        this.onNewRound = () => this.nextRound();
    }

    nextRound() {
        this.options = [];
        // Define Target Characteristics
        const baseColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        const basePetals = 5 + Math.floor(Math.random() * 3); // 5, 6, 7
        const baseAngle = Math.floor(Math.random() * 4) * 90; // 0, 90, 180, 270

        this.targetFeature = { color: baseColor, petals: basePetals, angle: baseAngle };

        // Generate Options (1 Correct + N Distractors)
        const optionCount = 3 + this.level; // Lv1: 4, Lv2: 5, Lv3: 6

        // Create Correct Item
        const correctItem = {
            ...this.targetFeature,
            id: 'correct',
            x: 0, y: 0,
            isCorrect: true
        };

        this.options.push(correctItem);

        // Create Distractors (Change 1 feature)
        for (let i = 0; i < optionCount - 1; i++) {
            const distractor = { ...this.targetFeature, id: `foil_${i}`, isCorrect: false };

            // Mutate one feature
            const mutType = Math.random();
            if (mutType < 0.33) {
                // Color Change
                let newColor;
                do { newColor = this.colors[Math.floor(Math.random() * this.colors.length)]; } while (newColor === baseColor);
                distractor.color = newColor;
            } else if (mutType < 0.66) {
                // Petal Change
                let newPetals;
                do { newPetals = 5 + Math.floor(Math.random() * 3); } while (newPetals === basePetals);
                distractor.petals = newPetals;
            } else {
                // Angle Change
                let newAngle;
                do { newAngle = Math.floor(Math.random() * 4) * 90; } while (newAngle === baseAngle);
                distractor.angle = newAngle;
            }
            this.options.push(distractor);
        }

        // Shuffle & Position
        this.options.sort(() => 0.5 - Math.random());

        // Grid Layout (Use safe area)
        const cols = this.level >= 2 ? 3 : 2;
        const rows = Math.ceil(optionCount / cols);
        const cellW = this.width / cols;
        const startY = Math.max(this.safeTop + 200, this.height * 0.5);
        const cellH = (this.safeBottom - startY - 20) / rows;

        this.options.forEach((opt, i) => {
            const r = Math.floor(i / cols);
            const c = i % cols;
            opt.x = c * cellW + cellW / 2;
            opt.y = startY + r * cellH + cellH / 2;
            opt.size = 50;
        });
    }

    update(dt) {
        super.update(dt);
        if (this.startTimer > 0) this.startTimer -= dt;
    }

    drawFlower(ctx, x, y, size, color, petals, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle * Math.PI / 180);

        // GameGraphics의 연꽃 그리기 사용
        // variant를 petals로 사용해서 다양성 만들기
        GameGraphics.drawLotus(ctx, 0, 0, size / 2, color, petals);

        ctx.restore();
    }

    draw(ctx) {
        // 🎨 모네의 정원 배경
        GameGraphics.drawGradientBackground(ctx, this.width, this.height, ['#e3f2fd', '#bbdefb', '#90caf9']);

        // 물 효과 (연못)
        ctx.fillStyle = 'rgba(129, 212, 250, 0.3)';
        ctx.fillRect(0, this.safeTop + 220, this.width, this.height - this.safeTop - 220);

        // 물결 효과
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            const offset = Math.sin(Date.now() * 0.001 + i) * 10;
            ctx.beginPath();
            ctx.moveTo(0, this.safeTop + 250 + i * 30 + offset);
            ctx.bezierCurveTo(
                this.width * 0.25, this.safeTop + 240 + i * 30 + offset,
                this.width * 0.75, this.safeTop + 260 + i * 30 + offset,
                this.width, this.safeTop + 250 + i * 30 + offset
            );
            ctx.stroke();
        }

        // 타이틀 영역
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(0, this.safeTop, this.width, 200);

        ctx.fillStyle = '#1565c0';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText("(색깔, 꽃잎 수, 방향을 관찰하세요)", this.width / 2, this.safeTop + 20);

        ctx.font = '14px sans-serif';
        ctx.fillText("⬇ 이 꽃과 똑같은 꽃을 찾으세요 ⬇", this.width / 2, this.safeTop + 90);

        if (this.targetFeature) {
            // 타겟 꽃 배경 (연못)
            const gradient = ctx.createRadialGradient(
                this.width / 2, this.safeTop + 140,
                0,
                this.width / 2, this.safeTop + 140,
                60
            );
            gradient.addColorStop(0, 'rgba(129, 212, 250, 0.6)');
            gradient.addColorStop(1, 'rgba(129, 212, 250, 0.2)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.width / 2, this.safeTop + 140, 55, 0, Math.PI * 2);
            ctx.fill();

            // Draw Target
            this.drawFlower(ctx, this.width / 2, this.safeTop + 140, 80, this.targetFeature.color, this.targetFeature.petals, this.targetFeature.angle);

            // 장식 테두리
            ctx.strokeStyle = '#0288d1';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.width / 2, this.safeTop + 140, 60, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Draw Options
        for (const opt of this.options) {
            // 연못 배경
            if (!opt.checked) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.beginPath();
                ctx.arc(opt.x, opt.y, opt.size + 5, 0, Math.PI * 2);
                ctx.fill();
            }

            if (opt.checked) {
                ctx.globalAlpha = 0.4;
            }
            this.drawFlower(ctx, opt.x, opt.y, opt.size, opt.color, opt.petals, opt.angle);
            ctx.globalAlpha = 1.0;

            if (opt.checked) {
                // 결과 표시 (더 크고 화려하게)
                ctx.save();
                const pulse = 1 + Math.sin(Date.now() * 0.01) * 0.1;
                ctx.translate(opt.x, opt.y);
                ctx.scale(pulse, pulse);
                ctx.font = '50px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(opt.isCorrect ? '⭕' : '❌', 0, 0);
                ctx.restore();
            }
        }

        super.draw(ctx);
    }

    onInputDown(x, y) {
        if (this.startTimer > 0) return;

        for (const opt of this.options) {
            if (opt.checked) continue;

            const dx = x - opt.x;
            const dy = y - opt.y;
            if (dx * dx + dy * dy < 3600) { // Hit (60px 반경 - 더 큰 터치 영역)
                opt.checked = true;

                if (opt.isCorrect) {
                    this.addScore(200);
                    this.spawnParticles(opt.x, opt.y, '#4ade80', 20);
                    this.screenShake(12, 0.2); // 🎯 Correct Answer Shake
                    window.navigator.vibrate?.(20);
                    setTimeout(() => {
                        if (!this.isOver) this.nextRound(); // Next puzzle
                    }, 1000);
                } else {
                    this.spawnParticles(opt.x, opt.y, '#999', 10);
                    this.screenShake(8, 0.15); // ❌ Wrong Shake
                    window.navigator.vibrate?.(100);
                    this.timeLeft -= 3; // Penalty (시니어 친화적으로 감소)
                }
                break;
            }
        }
    }
}
