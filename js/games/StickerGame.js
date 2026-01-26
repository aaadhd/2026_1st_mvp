import { BaseGame } from '../games/BaseGame.js';

export class StickerGame extends BaseGame {
    constructor(config) {
        super(config);
        // Modes: 'FACE' (Arcimboldo - Snap to Grid) | 'GARDEN' (Saimdang - Free Placements)
        this.mode = config.mode || 'FACE';

        this.baseFace = { x: 0, y: 0, w: 200, h: 250 };
        this.stickers = [];
        this.placedStickers = [];
        this.slots = [];

        this.selectedSticker = null;
        this.dragOffset = { x: 0, y: 0 };

        this.paletteY = 0;

        // Resources by Mode
        if (this.mode === 'FACE') {
            this.bgEmoji = '';
            this.paletteEmojis = ['🍐', '🍒', '🫐', '🍋', '🍌', '🍇', '🥬'];
        } else {
            // GARDEN (Saimdang)
            this.bgEmoji = '🌿'; // Just a hint, mostly canvas drawing
            this.paletteEmojis = ['🦋', '🐝', '🐞', '🦗', '🌸', '🌺', '🍉', '🥒'];
        }
    }

    init() {
        super.init();
        this.paletteY = this.safeBottom - 60;
        
        // targetScore를 모드에 맞게 고정
        this.fixedTargetScore = this.mode === 'FACE' ? 4 : 6;
        this.targetScore = this.fixedTargetScore;

        if (this.mode === 'FACE') {
            this.baseFace.x = this.width / 2 - 100;
            this.baseFace.y = this.safeTop + 20;

            this.slots = [
                { id: 'eye_l', x: this.baseFace.x + 40, y: this.baseFace.y + 80, w: 50, h: 50, emoji: '🫐', filled: false },
                { id: 'eye_r', x: this.baseFace.x + 110, y: this.baseFace.y + 80, w: 50, h: 50, emoji: '🫐', filled: false },
                { id: 'rose', x: this.baseFace.x + 75, y: this.baseFace.y + 130, w: 50, h: 70, emoji: '🍐', filled: false },
                { id: 'mouth', x: this.baseFace.x + 60, y: this.baseFace.y + 200, w: 80, h: 40, emoji: '🍒', filled: false }
            ];
        } else {
            // GARDEN: No specific slots, free placement
            this.slots = [];
        }

        this.setupStickers();
        
        // 🆕 Level-up callback
        this.onNewRound = () => {
            console.log('StickerGame onNewRound called, level:', this.level);
            this.stickers = [];
            this.selectedSticker = null;
            
            // targetScore를 고정값으로 되돌림 (증가하지 않음)
            this.targetScore = this.fixedTargetScore;
            
            if (this.mode === 'FACE') {
                this.slots.forEach(slot => slot.filled = false);
            }
            this.setupStickers();
        };
    }
    
    // targetScore를 고정하기 위해 levelUp 오버라이드
    levelUp() {
        this.level++;
        this.collected = 0;
        // targetScore는 고정 (증가하지 않음)
        this.targetScore = this.fixedTargetScore;
        // 시간은 10초만 추가 (더 짧게)
        this.timeLeft += 10;

        this.playSound('combo');
        this.screenShake(30, 0.5);
        
        if (this.onLevelUp) this.onLevelUp(this.level);
        if (this.onNewRound) this.onNewRound();
    }
    
    setupStickers() {
        this.stickers = [];
        
        // Setup Palette Stickers
        const candidates = this.paletteEmojis;
        const pSize = 60;
        let startX = (this.width - (candidates.length * 70)) / 2;
        if (startX < 10) startX = 10; // Overflow handling simply

        // Scrollable palette simulation? Just fit them
        // If too many, just pick random subset
        const subset = candidates.slice(0, 6);
        startX = (this.width - (subset.length * 70)) / 2;

        for (let i = 0; i < subset.length; i++) {
            this.stickers.push({
                emoji: subset[i],
                x: startX + (i * 70),
                y: this.paletteY + 20,
                w: pSize,
                h: pSize,
                isPlaced: false,
                homeX: startX + (i * 70),
                homeY: this.paletteY + 20,
                scale: 1.0
            });
        }
    }

    update(dt) {
        super.update(dt);
    }

    draw(ctx) {
        // 🎯 레벨 및 목표 표시
        ctx.textAlign = 'center';
        
        // 레벨 표시
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#1e40af';
        ctx.lineWidth = 3;
        ctx.font = 'bold 16px sans-serif';
        ctx.strokeText(`LEVEL ${this.level}`, this.width / 2, this.safeTop + 12);
        ctx.fillText(`LEVEL ${this.level}`, this.width / 2, this.safeTop + 12);
        
        // 목표 표시
        ctx.font = 'bold 18px sans-serif';
        const modeText = this.mode === 'FACE' ? '얼굴 꾸미기' : '초충도 꾸미기';
        const goalText = `목표: ${modeText} ${this.targetScore}개`;
        ctx.strokeText(goalText, this.width / 2, this.safeTop + 32);
        ctx.fillText(goalText, this.width / 2, this.safeTop + 32);
        
        // 진행도
        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = this.collected >= this.targetScore ? '#4caf50' : '#ff9800';
        ctx.strokeText(`${this.collected} / ${this.targetScore}`, this.width / 2, this.safeTop + 52);
        ctx.fillText(`${this.collected} / ${this.targetScore}`, this.width / 2, this.safeTop + 52);
        
        // Draw Background
        if (this.mode === 'FACE') {
            ctx.fillStyle = '#f0f9ff';
            ctx.fillRect(0, this.safeTop + 70, this.width, this.paletteY - this.safeTop - 70);

            ctx.fillStyle = '#fce7f3';
            ctx.beginPath();
            ctx.ellipse(this.baseFace.x + 100, this.baseFace.y + 125, 100, 125, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Guide Slots
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#000';
            for (const s of this.slots) {
                if (!this.isSlotFilled(s)) {
                    ctx.font = '40px serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(s.emoji, s.x + s.w / 2, s.y + s.h / 2);

                    ctx.strokeStyle = '#999';
                    ctx.setLineDash([5, 5]);
                    ctx.strokeRect(s.x, s.y, s.w, s.h);
                    ctx.setLineDash([]);
                }
            }
            ctx.globalAlpha = 1.0;

        } else {
            // GARDEN Background (Hanji style)
            ctx.fillStyle = '#fdfbf7'; // Paper color
            ctx.fillRect(0, 0, this.width, this.paletteY);

            // Draw some background stems/grass hints
            ctx.strokeStyle = '#dcfce7';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, this.paletteY);
            ctx.bezierCurveTo(100, this.paletteY - 100, 200, this.paletteY, 300, this.paletteY - 50);
            ctx.stroke();
        }

        // Palette Area
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, this.paletteY, this.width, this.height - this.paletteY);

        // Draw Stickers
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw Placed Stickers first (if free mode, they might overlap) - Actually one list is fine
        // But we want selected one on top.

        // Sort: Not selected first, Selected last
        const drawList = [...this.stickers].sort((a, b) => (a === this.selectedSticker ? 1 : -1));

        for (const s of drawList) {
            const size = s === this.selectedSticker ? s.w * 1.2 : s.w;
            ctx.font = `${size}px serif`;

            if (s === this.selectedSticker) {
                ctx.shadowColor = 'rgba(0,0,0,0.3)';
                ctx.shadowBlur = 10;
            } else {
                ctx.shadowColor = 'transparent';
            }

            ctx.fillText(s.emoji, s.x + s.w / 2, s.y + s.h / 2);
            ctx.shadowBlur = 0;
        }

        // Instruction
        ctx.fillStyle = '#333';
        ctx.font = '18px sans-serif';
        const msg = this.mode === 'FACE' ? "얼굴을 꾸며주세요" : "초충도를 완성해보세요";
        ctx.fillText(msg, this.width / 2, this.safeTop - 20);

        super.draw(ctx);
    }

    isSlotFilled(slot) {
        return slot.filled || false;
    }

    onInputDown(x, y) {
        for (let i = this.stickers.length - 1; i >= 0; i--) {
            const s = this.stickers[i];
            if (x > s.x && x < s.x + s.w && y > s.y && y < s.y + s.h) {
                this.selectedSticker = s;
                this.dragOffset.x = x - s.x;
                this.dragOffset.y = y - s.y;
                
                // If picking up a placed sticker, mark slot as unfilled
                if (s.isPlaced && this.mode === 'FACE') {
                    for (const slot of this.slots) {
                        const sx = s.x + s.w / 2;
                        const sy = s.y + s.h / 2;
                        const cx = slot.x + slot.w / 2;
                        const cy = slot.y + slot.h / 2;
                        if (Math.abs(sx - cx) < 30 && Math.abs(sy - cy) < 30) {
                            slot.filled = false;
                            break;
                        }
                    }
                }
                
                s.isPlaced = false;

                // Z-index handling (move to end)
                this.stickers.splice(i, 1);
                this.stickers.push(s);
                window.navigator.vibrate?.(10);
                break;
            }
        }
    }

    onInputMove(x, y) {
        if (this.selectedSticker) {
            this.selectedSticker.x = x - this.dragOffset.x;
            this.selectedSticker.y = y - this.dragOffset.y;
        }
    }

    onInputUp() {
        if (this.selectedSticker) {
            const s = this.selectedSticker;

            if (this.mode === 'FACE') {
                // Snap Logic
                let snapped = false;
                for (const slot of this.slots) {
                    // Skip if already filled
                    if (slot.filled) continue;
                    
                    const cx = slot.x + slot.w / 2;
                    const cy = slot.y + slot.h / 2;
                    const sx = s.x + s.w / 2;
                    const sy = s.y + s.h / 2;
                    const dist = Math.sqrt((cx - sx) * (cx - sx) + (cy - sy) * (cy - sy));

                    if (dist < 50) {
                        s.x = slot.x + (slot.w - s.w) / 2;
                        s.y = slot.y + (slot.h - s.h) / 2;
                        s.isPlaced = true;
                        slot.filled = true;
                        snapped = true;
                        this.spawnParticles(cx, cy, '#f472b6', 10);
                        window.navigator.vibrate?.(20);
                        
                        // Add score (BaseGame will auto-check targetScore)
                        this.addScore(100);
                        break;
                    }
                }

                if (!snapped && s.y < this.paletteY) {
                    s.x = s.homeX; s.y = s.homeY; // Return
                }

            } else {
                // GARDEN: Free Placement
                if (s.y < this.paletteY && !s.isPlaced) {
                    s.isPlaced = true;
                    this.spawnParticles(s.x + s.w / 2, s.y + s.h / 2, '#4ade80', 5);
                    window.navigator.vibrate?.(10);
                    
                    // Add score (BaseGame will auto-check targetScore)
                    this.addScore(100);
                } else if (s.y >= this.paletteY) {
                    // Returned to palette - allow re-placement
                    s.isPlaced = false;
                }
            }

            this.selectedSticker = null;
        }
    }
}
