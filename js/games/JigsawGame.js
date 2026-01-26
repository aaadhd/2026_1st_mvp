import { BaseGame } from '../games/BaseGame.js';

export class JigsawGame extends BaseGame {
    constructor(config) {
        super(config);
        // Artist: Yiam (Mother Dog) - 슬라이딩 퍼즐
        this.pieces = [];
        this.rows = 3;
        this.cols = 3;
        this.emptyRow = 0; // 빈 공간의 행
        this.emptyCol = 0; // 빈 공간의 열

        // 이암 작가의 어미개 이미지 사용
        this.imageSrc = config.imageSrc || '/images/artworks/yiam_mother_dog.jpg';
        this.image = null;
        this.imageLoaded = false;
        
        // 퍼즐 영역 설정
        this.puzzleAreaMargin = 40;
        
        // 애니메이션
        this.animatingPiece = null;
        this.animationProgress = 0;
    }

    init() {
        super.init();
        this.setupDifficulty();
        this.loadImage();

        // 🆕 Level-up callback
        this.onNewRound = () => {
            this.setupDifficulty();
            this.createPieces();
        };
    }

    loadImage() {
        this.image = new Image();
        // 로컬 파일 사용 시 crossOrigin 제거
        // this.image.crossOrigin = 'anonymous';
        
        // webp 지원: webp를 먼저 시도하고, 실패하면 원본 경로 사용
        const tryWebp = () => {
            // 원본 경로에서 확장자 추출
            const basePath = this.imageSrc.replace(/\.(jpg|jpeg|png|webp)$/i, '');
            const webpPath = basePath + '.webp';
            
            // webp 시도
            const webpImage = new Image();
            webpImage.onload = () => {
                console.log('WebP image loaded successfully:', webpPath);
                this.image = webpImage;
                this.imageLoaded = true;
                this.createPieces();
            };
            webpImage.onerror = () => {
                // webp 실패 시 원본 경로 시도
                console.log('WebP not found, trying original:', this.imageSrc);
                this.image.onload = () => {
                    console.log('Image loaded successfully:', this.imageSrc);
                    this.imageLoaded = true;
                    this.createPieces();
                };
                this.image.onerror = (e) => {
                    console.error('Failed to load puzzle image:', this.imageSrc, e);
                    this.imageLoaded = false;
                };
                this.image.src = this.imageSrc;
            };
            webpImage.src = webpPath;
        };
        
        // 원본 경로가 이미 webp면 바로 시도
        if (this.imageSrc.toLowerCase().endsWith('.webp')) {
            this.image.onload = () => {
                console.log('Image loaded successfully:', this.imageSrc);
                this.imageLoaded = true;
                this.createPieces();
            };
            this.image.onerror = (e) => {
                console.error('Failed to load puzzle image:', this.imageSrc, e);
                this.imageLoaded = false;
            };
            this.image.src = this.imageSrc;
        } else {
            // jpg/png 경로면 webp 먼저 시도
            tryWebp();
        }
    }

    setupDifficulty() {
        // targetScore에 맞춰 조각 수 설정
        const pieceCount = this.targetScore || 6;
        
        // 조각 수에 따라 rows x cols 결정 (빈 공간 1개 포함)
        if (pieceCount <= 4) {
            this.rows = 2;
            this.cols = 2;
        } else if (pieceCount <= 6) {
            this.rows = 2;
            this.cols = 3;
        } else if (pieceCount <= 9) {
            this.rows = 3;
            this.cols = 3;
        } else if (pieceCount <= 12) {
            this.rows = 3;
            this.cols = 4;
        } else {
            this.rows = 4;
            this.cols = 4;
        }
        
        // targetScore를 실제 조각 수로 업데이트 (빈 공간 제외)
        this.targetScore = (this.rows * this.cols) - 1;
    }

    createPieces() {
        if (!this.imageLoaded) return;

        this.pieces = [];
        this.animatingPiece = null;
        this.animationProgress = 0;
        
        // 퍼즐 완성 영역 (중앙) - 고정 크기 사용
        const puzzleAreaWidth = Math.min(this.width - this.puzzleAreaMargin * 2, 280);
        const puzzleAreaHeight = puzzleAreaWidth * 0.8; // 가로:세로 = 5:4 비율

        // 완전히 중앙 정렬 (상단 미리보기 아래)
        const previewSize = Math.min(this.width - this.puzzleAreaMargin * 2, 120);
        const puzzleStartX = (this.width - puzzleAreaWidth) / 2;
        const puzzleStartY = this.safeTop + previewSize * 0.8 + 30;

        const pieceWidth = puzzleAreaWidth / this.cols;
        const pieceHeight = puzzleAreaHeight / this.rows;

        // 조각 생성 (올바른 위치에)
        let id = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                // 마지막 조각(우측 하단)은 빈 공간
                if (row === this.rows - 1 && col === this.cols - 1) {
                    this.emptyRow = row;
                    this.emptyCol = col;
                    continue;
                }

                const correctX = puzzleStartX + col * pieceWidth;
                const correctY = puzzleStartY + row * pieceHeight;

                this.pieces.push({
                    id: id++,
                    correctRow: row,
                    correctCol: col,
                    currentRow: row,
                    currentCol: col,
                    x: correctX,
                    y: correctY,
                    targetX: correctX,
                    targetY: correctY,
                    w: pieceWidth,
                    h: pieceHeight,
                    // 이미지에서 잘라낼 영역
                    sourceX: col * (this.image.width / this.cols),
                    sourceY: row * (this.image.height / this.rows),
                    sourceW: this.image.width / this.cols,
                    sourceH: this.image.height / this.rows
                });
            }
        }

        // 조각 섞기
        this.shufflePieces();
    }

    shufflePieces() {
        // Fisher-Yates 셔플 알고리즘으로 조각 섞기
        // 빈 공간을 이용해 무작위 이동으로 섞기 (해결 가능한 상태 보장)
        const moves = 100 + Math.floor(Math.random() * 100); // 100-200번 무작위 이동
        
        for (let i = 0; i < moves; i++) {
            const adjacentPieces = this.getAdjacentPieces(this.emptyRow, this.emptyCol);
            if (adjacentPieces.length > 0) {
                const randomPiece = adjacentPieces[Math.floor(Math.random() * adjacentPieces.length)];
                this.swapWithEmpty(randomPiece.currentRow, randomPiece.currentCol, false);
            }
        }
    }

    getAdjacentPieces(row, col) {
        // 빈 공간과 인접한 조각들 반환
        const adjacent = [];
        const directions = [
            { dr: -1, dc: 0 }, // 위
            { dr: 1, dc: 0 },  // 아래
            { dr: 0, dc: -1 }, // 왼쪽
            { dr: 0, dc: 1 }   // 오른쪽
        ];

        for (const dir of directions) {
            const newRow = row + dir.dr;
            const newCol = col + dir.dc;
            
            if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols) {
                const piece = this.pieces.find(p => p.currentRow === newRow && p.currentCol === newCol);
                if (piece) {
                    adjacent.push(piece);
                }
            }
        }

        return adjacent;
    }

    swapWithEmpty(pieceRow, pieceCol, animate = true) {
        // 조각과 빈 공간 교환
        const piece = this.pieces.find(p => p.currentRow === pieceRow && p.currentCol === pieceCol);
        if (!piece) return false;

        // 빈 공간의 위치 계산
        const puzzleAreaWidth = Math.min(this.width - this.puzzleAreaMargin * 2, 280);
        const puzzleAreaHeight = puzzleAreaWidth * 0.8;
        const previewSize = Math.min(this.width - this.puzzleAreaMargin * 2, 120);
        const puzzleStartX = (this.width - puzzleAreaWidth) / 2;
        const puzzleStartY = this.safeTop + previewSize * 0.8 + 30;
        const pieceWidth = puzzleAreaWidth / this.cols;
        const pieceHeight = puzzleAreaHeight / this.rows;

        // 조각의 새 위치 (빈 공간 위치)
        const newX = puzzleStartX + this.emptyCol * pieceWidth;
        const newY = puzzleStartY + this.emptyRow * pieceHeight;

        if (animate) {
            // 애니메이션으로 이동
            piece.targetX = newX;
            piece.targetY = newY;
            this.animatingPiece = piece;
            this.animationProgress = 0;
        } else {
            // 즉시 이동 (셔플 시)
            piece.x = newX;
            piece.y = newY;
            piece.targetX = newX;
            piece.targetY = newY;
        }

        // 위치 정보 업데이트
        const tempRow = piece.currentRow;
        const tempCol = piece.currentCol;
        piece.currentRow = this.emptyRow;
        piece.currentCol = this.emptyCol;
        this.emptyRow = tempRow;
        this.emptyCol = tempCol;

        return true;
    }

    update(dt) {
        super.update(dt);

        // 애니메이션 업데이트
        if (this.animatingPiece) {
            this.animationProgress += dt * 8; // 이동 속도
            if (this.animationProgress >= 1) {
                this.animationProgress = 1;
                this.animatingPiece.x = this.animatingPiece.targetX;
                this.animatingPiece.y = this.animatingPiece.targetY;
                this.animatingPiece = null;
                
                // 이동 완료 후 완성 체크
                this.checkComplete();
            } else {
                // 부드러운 이동 (ease-out)
                const ease = 1 - Math.pow(1 - this.animationProgress, 3);
                this.animatingPiece.x = this.animatingPiece.x + (this.animatingPiece.targetX - this.animatingPiece.x) * ease;
                this.animatingPiece.y = this.animatingPiece.y + (this.animatingPiece.targetY - this.animatingPiece.y) * ease;
            }
        }
    }

    draw(ctx) {
        if (!this.imageLoaded) {
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fillStyle = '#64748b';
            ctx.font = 'bold 20px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('이미지 로딩 중...', this.width / 2, this.height / 2 - 20);
            ctx.font = '14px sans-serif';
            ctx.fillText(this.imageSrc, this.width / 2, this.height / 2 + 20);
            super.draw(ctx);
            return;
        }

        // 배경 그리기
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, this.width, this.height);

        // 상단 정답 그림 미리보기
        const previewSize = Math.min(this.width - this.puzzleAreaMargin * 2, 120);
        const previewX = (this.width - previewSize) / 2;
        const previewY = this.safeTop + 10;
        
        // 미리보기 배경
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(previewX - 5, previewY - 5, previewSize + 10, previewSize * 0.8 + 10);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.strokeRect(previewX - 5, previewY - 5, previewSize + 10, previewSize * 0.8 + 10);
        
        // 완성된 이미지 미리보기
        ctx.drawImage(
            this.image,
            0, 0, this.image.width, this.image.height,
            previewX, previewY, previewSize, previewSize * 0.8
        );
        
        // "정답" 라벨
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('정답', this.width / 2, previewY - 8);

        // 퍼즐 영역 배경
        const puzzleAreaWidth = Math.min(this.width - this.puzzleAreaMargin * 2, 280);
        const puzzleAreaHeight = puzzleAreaWidth * 0.8;
        const puzzleStartX = (this.width - puzzleAreaWidth) / 2;
        const puzzleStartY = previewY + previewSize * 0.8 + 20;

        // 반투명 배경
        ctx.fillStyle = 'rgba(226, 232, 240, 0.5)';
        ctx.fillRect(
            puzzleStartX - 5, 
            puzzleStartY - 5, 
            puzzleAreaWidth + 10, 
            puzzleAreaHeight + 10
        );

        // 테두리
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.strokeRect(
            puzzleStartX - 5, 
            puzzleStartY - 5, 
            puzzleAreaWidth + 10, 
            puzzleAreaHeight + 10
        );

        // 빈 공간 표시
        const pieceWidth = puzzleAreaWidth / this.cols;
        const pieceHeight = puzzleAreaHeight / this.rows;
        const emptyX = puzzleStartX + this.emptyCol * pieceWidth;
        const emptyY = puzzleStartY + this.emptyRow * pieceHeight;
        
        ctx.fillStyle = 'rgba(203, 213, 225, 0.3)';
        ctx.fillRect(emptyX, emptyY, pieceWidth, pieceHeight);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(emptyX, emptyY, pieceWidth, pieceHeight);
        ctx.setLineDash([]);

        // 조각 그리기
        for (const piece of this.pieces) {
            ctx.save();

            // 조각 이미지 그리기
            ctx.drawImage(
                this.image,
                piece.sourceX, piece.sourceY, piece.sourceW, piece.sourceH,
                piece.x, piece.y, piece.w, piece.h
            );

            // 조각 테두리
            if (piece.currentRow === piece.correctRow && piece.currentCol === piece.correctCol) {
                // 올바른 위치
                ctx.strokeStyle = '#10b981';
                ctx.lineWidth = 3;
            } else {
                // 잘못된 위치
                ctx.strokeStyle = '#e5e7eb';
                ctx.lineWidth = 2;
            }
            ctx.strokeRect(piece.x, piece.y, piece.w, piece.h);

            ctx.restore();
        }

        super.draw(ctx);
    }

    onInputDown(x, y) {
        // 빈 공간과 인접한 조각 찾기
        const adjacentPieces = this.getAdjacentPieces(this.emptyRow, this.emptyCol);
        
        // 클릭한 위치의 조각 찾기
        for (const piece of adjacentPieces) {
            if (x >= piece.x && x <= piece.x + piece.w &&
                y >= piece.y && y <= piece.y + piece.h) {
                
                // 조각을 빈 공간으로 이동
                if (this.swapWithEmpty(piece.currentRow, piece.currentCol, true)) {
                    window.navigator.vibrate?.(10);
                    this.playSound('move', 0.3);
                }
                break;
            }
        }
    }

    onInputMove(x, y) {
        // 슬라이딩 퍼즐에서는 드래그 없음
    }

    onInputUp() {
        // 슬라이딩 퍼즐에서는 드래그 없음
    }

    checkComplete() {
        // 모든 조각이 올바른 위치에 있는지 확인
        const allCorrect = this.pieces.every(p => 
            p.currentRow === p.correctRow && p.currentCol === p.correctCol
        );

        if (allCorrect) {
            // 퍼즐 완성!
            this.screenShake(20, 0.5);
            this.spawnParticles(this.width / 2, this.height / 2, '#fbbf24', 30);
            this.playSound('levelup', 0.7);
            window.navigator.vibrate?.(100);
            
            // 점수 추가하면서 라운드 클리어
            this.addScore(200);
        }
    }
}
