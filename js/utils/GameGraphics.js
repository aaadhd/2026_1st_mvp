// 🎨 Game Graphics Asset System
// Canvas 기반 벡터 그래픽 생성

export class GameGraphics {
    // 🐱 귀여운 고양이 그리기
    static drawCat(ctx, x, y, size, isHappy = false, direction = 1) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(direction, 1); // 방향 적용
        
        // 몸통
        ctx.fillStyle = '#ff9d5c';
        ctx.beginPath();
        ctx.ellipse(0, 20, size * 0.8, size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 머리
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffb347';
        ctx.fill();
        
        // 귀 (삼각형)
        ctx.fillStyle = '#ff9d5c';
        ctx.beginPath();
        ctx.moveTo(-size * 0.7, -size * 0.5);
        ctx.lineTo(-size * 0.9, -size * 1.2);
        ctx.lineTo(-size * 0.4, -size * 0.7);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(size * 0.7, -size * 0.5);
        ctx.lineTo(size * 0.9, -size * 1.2);
        ctx.lineTo(size * 0.4, -size * 0.7);
        ctx.fill();
        
        // 귀 안쪽 (분홍)
        ctx.fillStyle = '#ffccd5';
        ctx.beginPath();
        ctx.moveTo(-size * 0.65, -size * 0.55);
        ctx.lineTo(-size * 0.75, -size * 0.95);
        ctx.lineTo(-size * 0.5, -size * 0.65);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(size * 0.65, -size * 0.55);
        ctx.lineTo(size * 0.75, -size * 0.95);
        ctx.lineTo(size * 0.5, -size * 0.65);
        ctx.fill();
        
        // 눈
        ctx.fillStyle = '#000';
        if (isHappy) {
            // 행복한 눈 (초승달)
            ctx.beginPath();
            ctx.arc(-size * 0.3, -size * 0.15, size * 0.15, 0.2, Math.PI - 0.2);
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#000';
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(size * 0.3, -size * 0.15, size * 0.15, 0.2, Math.PI - 0.2);
            ctx.stroke();
        } else {
            // 일반 눈
            ctx.beginPath();
            ctx.arc(-size * 0.3, -size * 0.1, size * 0.12, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(size * 0.3, -size * 0.1, size * 0.12, 0, Math.PI * 2);
            ctx.fill();
            
            // 눈 하이라이트
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(-size * 0.25, -size * 0.15, size * 0.05, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(size * 0.35, -size * 0.15, size * 0.05, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 코
        ctx.fillStyle = '#ff6b9d';
        ctx.beginPath();
        ctx.moveTo(0, size * 0.15);
        ctx.lineTo(-size * 0.1, size * 0.05);
        ctx.lineTo(size * 0.1, size * 0.05);
        ctx.fill();
        
        // 입
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, size * 0.15);
        ctx.lineTo(0, size * 0.25);
        ctx.stroke();
        
        if (isHappy) {
            // 웃는 입
            ctx.beginPath();
            ctx.arc(0, size * 0.25, size * 0.2, 0, Math.PI);
            ctx.stroke();
        }
        
        // 수염
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1.5;
        // 왼쪽
        ctx.beginPath();
        ctx.moveTo(-size * 0.5, 0);
        ctx.lineTo(-size * 1.2, -size * 0.1);
        ctx.moveTo(-size * 0.5, size * 0.1);
        ctx.lineTo(-size * 1.2, size * 0.1);
        ctx.moveTo(-size * 0.5, size * 0.2);
        ctx.lineTo(-size * 1.2, size * 0.3);
        ctx.stroke();
        
        // 오른쪽
        ctx.beginPath();
        ctx.moveTo(size * 0.5, 0);
        ctx.lineTo(size * 1.2, -size * 0.1);
        ctx.moveTo(size * 0.5, size * 0.1);
        ctx.lineTo(size * 1.2, size * 0.1);
        ctx.moveTo(size * 0.5, size * 0.2);
        ctx.lineTo(size * 1.2, size * 0.3);
        ctx.stroke();
        
        ctx.restore();
    }
    
    // 🐟 생선 그리기
    static drawFish(ctx, x, y, size, rotation = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        // 몸통
        ctx.fillStyle = '#4fc3f7';
        ctx.strokeStyle = '#0288d1';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 1.2, size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 비늘 패턴
        ctx.strokeStyle = '#03a9f4';
        ctx.lineWidth = 1;
        for (let i = -2; i <= 2; i++) {
            ctx.beginPath();
            ctx.arc(size * 0.3 * i, 0, size * 0.3, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // 꼬리
        ctx.fillStyle = '#4fc3f7';
        ctx.strokeStyle = '#0288d1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-size * 1.2, 0);
        ctx.lineTo(-size * 1.8, -size * 0.6);
        ctx.lineTo(-size * 1.8, size * 0.6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 눈
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(size * 0.8, 0, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(size * 0.8, 0, size * 0.08, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    // 🌻 해바라기 그리기
    static drawSunflower(ctx, x, y, size, health = 1.0) {
        ctx.save();
        ctx.translate(x, y);
        
        const petals = 12;
        const petalColor = health > 0.3 ? '#ffd54f' : '#d7ccc8';
        
        // 꽃잎
        ctx.fillStyle = petalColor;
        for (let i = 0; i < petals; i++) {
            ctx.save();
            ctx.rotate((Math.PI * 2 * i) / petals);
            ctx.beginPath();
            ctx.ellipse(0, -size * 0.6, size * 0.3, size * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 꽃잎 그라디언트
            const gradient = ctx.createRadialGradient(0, -size * 0.6, 0, 0, -size * 0.6, size * 0.5);
            gradient.addColorStop(0, health > 0.3 ? '#ffeb3b' : '#bcaaa4');
            gradient.addColorStop(1, petalColor);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            ctx.restore();
        }
        
        // 중심부
        const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.4);
        centerGradient.addColorStop(0, '#8d6e63');
        centerGradient.addColorStop(0.6, '#6d4c41');
        centerGradient.addColorStop(1, '#5d4037');
        ctx.fillStyle = centerGradient;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        // 씨앗 패턴
        ctx.fillStyle = '#4e342e';
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * size * 0.3;
            const seedX = Math.cos(angle) * dist;
            const seedY = Math.sin(angle) * dist;
            ctx.beginPath();
            ctx.arc(seedX, seedY, size * 0.03, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    // 💧 물방울 그리기
    static drawWaterDrop(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        
        // 물방울 모양
        const gradient = ctx.createRadialGradient(-size * 0.2, -size * 0.2, 0, 0, 0, size);
        gradient.addColorStop(0, '#e1f5fe');
        gradient.addColorStop(0.5, '#81d4fa');
        gradient.addColorStop(1, '#039be5');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.8);
        ctx.quadraticCurveTo(-size * 0.6, -size * 1.3, 0, -size * 1.5);
        ctx.quadraticCurveTo(size * 0.6, -size * 1.3, 0, -size * 0.8);
        ctx.fill();
        
        // 하이라이트
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(-size * 0.3, -size * 0.3, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    // 🌸 연꽃 그리기
    static drawLotus(ctx, x, y, size, color = '#f48fb1', variant = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(variant * 0.3); // 각도 변화
        
        const petals = 8;
        const petalColor = color;
        
        // 꽃잎 (레이어링)
        for (let layer = 0; layer < 2; layer++) {
            const layerSize = size * (1 - layer * 0.3);
            const rotation = layer * (Math.PI / petals);
            
            for (let i = 0; i < petals; i++) {
                ctx.save();
                ctx.rotate(rotation + (Math.PI * 2 * i) / petals);
                
                const gradient = ctx.createRadialGradient(0, -layerSize * 0.5, 0, 0, -layerSize * 0.5, layerSize * 0.6);
                gradient.addColorStop(0, '#fff');
                gradient.addColorStop(0.3, petalColor);
                gradient.addColorStop(1, color === '#f48fb1' ? '#ec407a' : '#ab47bc');
                ctx.fillStyle = gradient;
                
                ctx.beginPath();
                ctx.ellipse(0, -layerSize * 0.5, layerSize * 0.25, layerSize * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }
        }
        
        // 중심부
        const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.2);
        centerGradient.addColorStop(0, '#fff9c4');
        centerGradient.addColorStop(1, '#fbc02d');
        ctx.fillStyle = centerGradient;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        // 수술
        ctx.strokeStyle = '#f57f17';
        ctx.lineWidth = 1;
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 * i) / 12;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * size * 0.15, Math.sin(angle) * size * 0.15);
            ctx.stroke();
            
            ctx.fillStyle = '#ff6f00';
            ctx.beginPath();
            ctx.arc(Math.cos(angle) * size * 0.15, Math.sin(angle) * size * 0.15, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    // 😊 표정 그리기
    static drawFace(ctx, x, y, size, emotion = 'happy') {
        ctx.save();
        ctx.translate(x, y);
        
        // 얼굴
        const gradient = ctx.createRadialGradient(-size * 0.2, -size * 0.2, 0, 0, 0, size);
        gradient.addColorStop(0, '#ffeb3b');
        gradient.addColorStop(1, '#fbc02d');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 테두리
        ctx.strokeStyle = '#f57f17';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.fillStyle = '#000';
        
        if (emotion === 'happy') {
            // 웃는 눈
            ctx.beginPath();
            ctx.arc(-size * 0.3, -size * 0.15, size * 0.12, 0.2, Math.PI - 0.2);
            ctx.lineWidth = 4;
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(size * 0.3, -size * 0.15, size * 0.12, 0.2, Math.PI - 0.2);
            ctx.stroke();
            
            // 웃는 입
            ctx.beginPath();
            ctx.arc(0, size * 0.1, size * 0.5, 0, Math.PI);
            ctx.stroke();
        } else if (emotion === 'sad') {
            // 슬픈 눈
            ctx.beginPath();
            ctx.arc(-size * 0.3, -size * 0.1, size * 0.08, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(size * 0.3, -size * 0.1, size * 0.08, 0, Math.PI * 2);
            ctx.fill();
            
            // 눈물
            ctx.fillStyle = '#03a9f4';
            ctx.beginPath();
            ctx.ellipse(-size * 0.3, size * 0.2, size * 0.05, size * 0.15, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 슬픈 입
            ctx.strokeStyle = '#000';
            ctx.beginPath();
            ctx.arc(0, size * 0.5, size * 0.4, Math.PI, Math.PI * 2);
            ctx.stroke();
        } else {
            // 중립
            ctx.beginPath();
            ctx.arc(-size * 0.3, -size * 0.1, size * 0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(size * 0.3, -size * 0.1, size * 0.1, 0, Math.PI * 2);
            ctx.fill();
            
            // 하이라이트
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(-size * 0.25, -size * 0.15, size * 0.04, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(size * 0.35, -size * 0.15, size * 0.04, 0, Math.PI * 2);
            ctx.fill();
            
            // 일자 입
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(-size * 0.3, size * 0.3);
            ctx.lineTo(size * 0.3, size * 0.3);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    // 🌈 배경 그라디언트
    static drawGradientBackground(ctx, width, height, colors) {
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        colors.forEach((color, i) => {
            gradient.addColorStop(i / (colors.length - 1), color);
        });
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }
    
    // ☁️ 구름 그리기
    static drawCloud(ctx, x, y, size) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.arc(x + size * 0.8, y, size * 0.8, 0, Math.PI * 2);
        ctx.arc(x + size * 1.5, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 🌳 나무 그리기
    static drawTree(ctx, x, y, size) {
        // 나무줄기
        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(x - size * 0.1, y, size * 0.2, size * 0.8);
        
        // 나뭇잎
        const leafGradient = ctx.createRadialGradient(x, y - size * 0.3, 0, x, y - size * 0.3, size * 0.5);
        leafGradient.addColorStop(0, '#81c784');
        leafGradient.addColorStop(1, '#4caf50');
        ctx.fillStyle = leafGradient;
        ctx.beginPath();
        ctx.arc(x, y - size * 0.3, size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x - size * 0.3, y - size * 0.1, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + size * 0.3, y - size * 0.1, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 🎨 과일 그리기
    static drawFruit(ctx, x, y, size, type = 'apple') {
        ctx.save();
        ctx.translate(x, y);
        
        if (type === 'apple') {
            // 사과
            const gradient = ctx.createRadialGradient(-size * 0.2, -size * 0.2, 0, 0, 0, size);
            gradient.addColorStop(0, '#ff6b6b');
            gradient.addColorStop(1, '#c92a2a');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, size, 0, Math.PI * 2);
            ctx.fill();
            
            // 하이라이트
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.arc(-size * 0.3, -size * 0.3, size * 0.3, 0, Math.PI * 2);
            ctx.fill();
            
            // 줄기
            ctx.strokeStyle = '#8d6e63';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, -size);
            ctx.lineTo(size * 0.2, -size * 1.3);
            ctx.stroke();
            
            // 잎
            ctx.fillStyle = '#66bb6a';
            ctx.beginPath();
            ctx.ellipse(size * 0.3, -size * 1.2, size * 0.2, size * 0.4, Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();
            
        } else if (type === 'banana') {
            // 바나나
            ctx.fillStyle = '#ffd54f';
            ctx.beginPath();
            ctx.arc(0, 0, size * 0.4, 0, Math.PI);
            ctx.arc(size * 0.3, size * 0.5, size * 0.4, -Math.PI / 2, Math.PI / 2);
            ctx.fill();
            
            ctx.strokeStyle = '#f9a825';
            ctx.lineWidth = 2;
            ctx.stroke();
            
        } else if (type === 'orange') {
            // 오렌지
            const gradient = ctx.createRadialGradient(-size * 0.2, -size * 0.2, 0, 0, 0, size);
            gradient.addColorStop(0, '#ffb74d');
            gradient.addColorStop(1, '#f57c00');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, size, 0, Math.PI * 2);
            ctx.fill();
            
            // 텍스처
            ctx.fillStyle = 'rgba(245, 124, 0, 0.3)';
            for (let i = 0; i < 20; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * size * 0.8;
                ctx.beginPath();
                ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (type === 'watermelon') {
            // 수박
            ctx.fillStyle = '#66bb6a';
            ctx.beginPath();
            ctx.arc(0, 0, size, 0, Math.PI * 2);
            ctx.fill();
            
            // 줄무늬
            ctx.strokeStyle = '#2e7d32';
            ctx.lineWidth = 3;
            for (let i = -1; i <= 1; i++) {
                ctx.beginPath();
                ctx.arc(0, 0, size, (Math.PI / 6) * i, (Math.PI / 6) * (i + 0.5));
                ctx.stroke();
            }
        }
        
        ctx.restore();
    }
    
    // 🧩 퍼즐 조각 그리기
    static drawPuzzlePiece(ctx, x, y, w, h, sides = {top: 0, right: 0, bottom: 0, left: 0}, color = '#e3f2fd') {
        ctx.save();
        ctx.translate(x, y);
        
        const knobSize = Math.min(w, h) * 0.15;
        
        ctx.beginPath();
        
        // Top
        ctx.moveTo(0, 0);
        if (sides.top === 1) {
            ctx.lineTo(w / 2 - knobSize, 0);
            ctx.arc(w / 2, -knobSize, knobSize, Math.PI, 0);
            ctx.lineTo(w, 0);
        } else if (sides.top === -1) {
            ctx.lineTo(w / 2 - knobSize, 0);
            ctx.arc(w / 2, knobSize, knobSize, Math.PI, 0, true);
            ctx.lineTo(w, 0);
        } else {
            ctx.lineTo(w, 0);
        }
        
        // Right
        if (sides.right === 1) {
            ctx.lineTo(w, h / 2 - knobSize);
            ctx.arc(w + knobSize, h / 2, knobSize, Math.PI * 1.5, Math.PI * 0.5);
            ctx.lineTo(w, h);
        } else if (sides.right === -1) {
            ctx.lineTo(w, h / 2 - knobSize);
            ctx.arc(w - knobSize, h / 2, knobSize, Math.PI * 1.5, Math.PI * 0.5, true);
            ctx.lineTo(w, h);
        } else {
            ctx.lineTo(w, h);
        }
        
        // Bottom
        if (sides.bottom === 1) {
            ctx.lineTo(w / 2 + knobSize, h);
            ctx.arc(w / 2, h + knobSize, knobSize, 0, Math.PI);
            ctx.lineTo(0, h);
        } else if (sides.bottom === -1) {
            ctx.lineTo(w / 2 + knobSize, h);
            ctx.arc(w / 2, h - knobSize, knobSize, 0, Math.PI, true);
            ctx.lineTo(0, h);
        } else {
            ctx.lineTo(0, h);
        }
        
        // Left
        if (sides.left === 1) {
            ctx.lineTo(0, h / 2 + knobSize);
            ctx.arc(-knobSize, h / 2, knobSize, Math.PI * 0.5, Math.PI * 1.5);
        } else if (sides.left === -1) {
            ctx.lineTo(0, h / 2 + knobSize);
            ctx.arc(knobSize, h / 2, knobSize, Math.PI * 0.5, Math.PI * 1.5, true);
        }
        
        ctx.closePath();
        
        // Fill
        ctx.fillStyle = color;
        ctx.fill();
        
        // Stroke
        ctx.strokeStyle = '#90a4ae';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
    }
    
    // 🎵 음표 그리기
    static drawMusicNote(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        
        // 음표 머리
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.3, size * 0.25, -Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();
        
        // 음표 줄기
        ctx.fillRect(size * 0.25, -size * 0.8, size * 0.1, size * 0.8);
        
        // 깃발
        ctx.beginPath();
        ctx.moveTo(size * 0.35, -size * 0.8);
        ctx.quadraticCurveTo(size * 0.7, -size * 0.6, size * 0.5, -size * 0.4);
        ctx.quadraticCurveTo(size * 0.4, -size * 0.5, size * 0.35, -size * 0.5);
        ctx.fill();
        
        ctx.restore();
    }
    
    // 🎨 붓 그리기
    static drawBrush(ctx, x, y, size, color = '#fbc02d') {
        ctx.save();
        ctx.translate(x, y);
        
        // 붓털
        const gradient = ctx.createLinearGradient(0, -size, 0, size * 0.3);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, '#f57f17');
        ctx.fillStyle = gradient;
        
        for (let i = 0; i < 8; i++) {
            const angle = (i - 3.5) * 0.1;
            ctx.save();
            ctx.rotate(angle);
            ctx.fillRect(-size * 0.05, -size, size * 0.1, size * 1.2);
            ctx.restore();
        }
        
        // 붓대
        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(-size * 0.15, size * 0.2, size * 0.3, size * 1.5);
        
        // 붓대 끝
        ctx.fillStyle = '#5d4037';
        ctx.beginPath();
        ctx.ellipse(0, size * 1.7, size * 0.15, size * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    // 🏃 러너 캐릭터 그리기
    static drawRunner(ctx, x, y, size, frame = 0) {
        ctx.save();
        ctx.translate(x, y);
        
        // 몸통
        ctx.fillStyle = '#42a5f5';
        ctx.beginPath();
        ctx.arc(0, -size * 0.5, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        // 머리
        const gradient = ctx.createRadialGradient(-size * 0.1, -size * 1.2, 0, 0, -size, size * 0.3);
        gradient.addColorStop(0, '#ffb74d');
        gradient.addColorStop(1, '#f57c00');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, -size, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // 눈
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-size * 0.1, -size * 1.05, size * 0.05, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(size * 0.1, -size * 1.05, size * 0.05, 0, Math.PI * 2);
        ctx.fill();
        
        // 다리 (달리기 애니메이션)
        const legAngle = Math.sin(frame * 0.3) * 0.5;
        ctx.strokeStyle = '#1976d2';
        ctx.lineWidth = size * 0.15;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.2);
        ctx.lineTo(-size * 0.2, size * 0.2 + Math.sin(frame * 0.3) * size * 0.2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.2);
        ctx.lineTo(size * 0.2, size * 0.2 - Math.sin(frame * 0.3) * size * 0.2);
        ctx.stroke();
        
        ctx.restore();
    }
    
    // 🌸 꽃 그리기 (러너용)
    static drawSimpleFlower(ctx, x, y, size, color = '#e91e63') {
        ctx.save();
        ctx.translate(x, y);
        
        // 꽃잎 5개
        for (let i = 0; i < 5; i++) {
            ctx.save();
            ctx.rotate((Math.PI * 2 * i) / 5);
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.ellipse(0, -size * 0.6, size * 0.3, size * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        // 중심
        ctx.fillStyle = '#fdd835';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    // 🎯 타겟 표시
    static drawTarget(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        
        // 동심원
        for (let i = 3; i >= 0; i--) {
            ctx.fillStyle = i % 2 === 0 ? '#ff5252' : '#fff';
            ctx.beginPath();
            ctx.arc(0, 0, size * (i + 1) / 4, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 십자선
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-size, 0);
        ctx.lineTo(size, 0);
        ctx.moveTo(0, -size);
        ctx.lineTo(0, size);
        ctx.stroke();
        
        ctx.restore();
    }
    
    // 💎 보석 그리기
    static drawGem(ctx, x, y, size, color = '#e91e63') {
        ctx.save();
        ctx.translate(x, y);
        
        // 다이아몬드 형태
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size * 0.6, -size * 0.3);
        ctx.lineTo(size * 0.4, size);
        ctx.lineTo(-size * 0.4, size);
        ctx.lineTo(-size * 0.6, -size * 0.3);
        ctx.closePath();
        ctx.fill();
        
        // 하이라이트
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size * 0.6, -size * 0.3);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
        
        // 테두리
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size * 0.6, -size * 0.3);
        ctx.lineTo(size * 0.4, size);
        ctx.lineTo(-size * 0.4, size);
        ctx.lineTo(-size * 0.6, -size * 0.3);
        ctx.closePath();
        ctx.stroke();
        
        ctx.restore();
    }
    
    // 🌸 수련 (Water Lily) 그리기
    static drawWaterLily(ctx, x, y, size, color, petals, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        // 꽃잎들
        for (let i = 0; i < petals; i++) {
            ctx.save();
            ctx.rotate((Math.PI * 2 * i) / petals);
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.ellipse(0, -size * 0.6, size * 0.3, size * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        // 중심
        ctx.fillStyle = '#fdd835';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    // 🪷 수련 잎 (Lily Pad) 그리기
    static drawWaterLilyPad(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        
        ctx.fillStyle = '#66bb6a';
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 잎맥
        ctx.strokeStyle = '#4caf50';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -size);
        ctx.stroke();
        
        ctx.restore();
    }
    
    // 😊 행복한 얼굴 그리기
    static drawHappyFace(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        
        // 얼굴 배경
        const gradient = ctx.createRadialGradient(-size * 0.2, -size * 0.2, 0, 0, 0, size);
        gradient.addColorStop(0, '#ffd54f');
        gradient.addColorStop(1, '#ffb300');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 눈
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-size * 0.3, -size * 0.2, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(size * 0.3, -size * 0.2, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        
        // 웃는 입
        ctx.strokeStyle = '#000';
        ctx.lineWidth = size * 0.1;
        ctx.beginPath();
        ctx.arc(0, size * 0.1, size * 0.5, 0, Math.PI);
        ctx.stroke();
        
        ctx.restore();
    }
    
    // 😢 슬픈 얼굴 그리기
    static drawSadFace(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        
        // 얼굴 배경
        const gradient = ctx.createRadialGradient(-size * 0.2, -size * 0.2, 0, 0, 0, size);
        gradient.addColorStop(0, '#90a4ae');
        gradient.addColorStop(1, '#607d8b');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 눈
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-size * 0.3, -size * 0.2, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(size * 0.3, -size * 0.2, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        
        // 슬픈 입
        ctx.strokeStyle = '#000';
        ctx.lineWidth = size * 0.1;
        ctx.beginPath();
        ctx.arc(0, size * 0.4, size * 0.5, Math.PI, 0, true);
        ctx.stroke();
        
        ctx.restore();
    }
}
