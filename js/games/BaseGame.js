export class BaseGame {
    // 🎮 Safe Play Area (Avoids HUD overlap)
    static SAFE_TOP = 100;      // Top HUD + guide text height
    static SAFE_BOTTOM = 100;   // Bottom progress bar height

    constructor(config) {
        this.config = config || {};
        this.score = 0;
        this.level = config.level || 1;
        this.timeLimit = config.time || 60;
        this.timeLeft = this.timeLimit;

        this.targetScore = config.targetScore || 10;
        this.collected = 0;

        this.isOver = false;
        this.isPaused = false;
        this.width = 0;
        this.height = 0;

        this.particles = [];

        // 🎮 Combo System (기본값 0, 일부 게임에서 오버라이드)
        this.maxCombo = 0;

        // Callback hooks (external script connection)
        this.onScoreUpdate = null;
        this.onTimeUpdate = null;
        this.onGameOver = null;
        this.onGameClear = null;

        // 🔊 Sound System
        this.audioCtx = null;
        this.bgmGain = null;
        this.bgmOscillators = [];
        this.bgmInterval = null;
        this.domain = config.domain || 'EMOTION'; // EMOTION, COGNITION, SOCIAL, SENSORY

        // 📳 Screen Shake System
        this.shakeIntensity = 0;
        this.shakeDecay = 0;
        this.shakeOffsetX = 0;
        this.shakeOffsetY = 0;
    }

    // Helper: Get safe play area bounds
    get safeTop() { return BaseGame.SAFE_TOP; }
    get safeBottom() { return this.height - BaseGame.SAFE_BOTTOM; }
    get safeHeight() { return this.height - BaseGame.SAFE_TOP - BaseGame.SAFE_BOTTOM; }

    // 📳 Vibration Helper (설정 확인)
    vibrate(pattern) {
        if (window.state && window.state.settings && !window.state.settings.vibrationEnabled) {
            return; // 진동 설정이 꺼져있으면 실행하지 않음
        }
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }

    init() {
        if (this.engine) {
            this.width = this.engine.width;
            this.height = this.engine.height;
        }
        this.score = 0;
        this.maxCombo = 0; // Reset maxCombo on init
        // Init Audio Context (Lazy)
        this.initAudio();
        // 🎵 Start BGM
        setTimeout(() => this.startBGM(), 500); // Slight delay for smoother start
    }

    initAudio() {
        if (!this.audioCtx) {
            try {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn('AudioContext not supported');
            }
        }
    }

    resumeAudio() {
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    // 🎵 BGM System
    startBGM() {
        this.resumeAudio();
        if (!this.audioCtx || this.bgmInterval) return;

        // 사용자 설정 확인
        if (window.state && window.state.settings && !window.state.settings.bgmEnabled) {
            return;
        }

        // Create gain node for BGM volume control
        this.bgmGain = this.audioCtx.createGain();
        this.bgmGain.gain.value = 0.15; // Low volume for BGM
        this.bgmGain.connect(this.audioCtx.destination);

        // Domain-specific melodies
        const melodies = {
            EMOTION: {
                // 따뜻한 느낌 - C major pentatonic
                notes: [523, 587, 659, 784, 880], // C5, D5, E5, G5, A5
                pattern: [0, 2, 1, 2, 0, 2, 4, 2],
                tempo: 500
            },
            COGNITION: {
                // 경쾌한 느낌 - G major
                notes: [392, 440, 494, 523, 587, 659], // G4, A4, B4, C5, D5, E5
                pattern: [0, 1, 2, 3, 2, 1, 4, 5],
                tempo: 400
            },
            SOCIAL: {
                // 밝은 느낌 - D major
                notes: [587, 659, 740, 784, 880], // D5, E5, F#5, G5, A5
                pattern: [0, 1, 2, 1, 3, 4, 3, 2],
                tempo: 450
            },
            SENSORY: {
                // 리듬감 - A minor pentatonic
                notes: [440, 523, 587, 659, 784], // A4, C5, D5, E5, G5
                pattern: [0, 2, 1, 3, 4, 3, 1, 0],
                tempo: 350
            }
        };

        const melody = melodies[this.domain] || melodies.EMOTION;
        let noteIndex = 0;

        const playNote = () => {
            // Stop previous oscillators
            this.bgmOscillators.forEach(osc => {
                try { osc.stop(); } catch (e) { }
            });
            this.bgmOscillators = [];

            const note = melody.notes[melody.pattern[noteIndex]];
            const now = this.audioCtx.currentTime;

            // Main note
            const osc = this.audioCtx.createOscillator();
            osc.frequency.value = note;
            osc.type = 'sine';

            const noteGain = this.audioCtx.createGain();
            noteGain.gain.setValueAtTime(0.3, now);
            noteGain.gain.exponentialRampToValueAtTime(0.01, now + melody.tempo / 1000 * 0.8);

            osc.connect(noteGain);
            noteGain.connect(this.bgmGain);
            osc.start(now);
            osc.stop(now + melody.tempo / 1000);

            this.bgmOscillators.push(osc);

            // Harmony (5th interval)
            const harmonyOsc = this.audioCtx.createOscillator();
            harmonyOsc.frequency.value = note * 1.5; // Perfect fifth
            harmonyOsc.type = 'sine';

            const harmonyGain = this.audioCtx.createGain();
            harmonyGain.gain.setValueAtTime(0.15, now);
            harmonyGain.gain.exponentialRampToValueAtTime(0.01, now + melody.tempo / 1000 * 0.8);

            harmonyOsc.connect(harmonyGain);
            harmonyGain.connect(this.bgmGain);
            harmonyOsc.start(now);
            harmonyOsc.stop(now + melody.tempo / 1000);

            this.bgmOscillators.push(harmonyOsc);

            noteIndex = (noteIndex + 1) % melody.pattern.length;
        };

        // Start playing
        playNote();
        this.bgmInterval = setInterval(playNote, melody.tempo);
    }

    stopBGM() {
        if (this.bgmInterval) {
            clearInterval(this.bgmInterval);
            this.bgmInterval = null;
        }

        this.bgmOscillators.forEach(osc => {
            try { osc.stop(); } catch (e) { }
        });
        this.bgmOscillators = [];

        if (this.bgmGain) {
            this.bgmGain.disconnect();
            this.bgmGain = null;
        }
    }

    // 🎵 Sound Effects
    playSound(type = 'success') {
        this.resumeAudio();
        if (!this.audioCtx) return;

        // 사용자 설정 확인
        if (window.state && window.state.settings && !window.state.settings.sfxEnabled) {
            return;
        }

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        const now = this.audioCtx.currentTime;

        if (type === 'success') {
            // 🎵 Pleasant ding (C5 -> E5)
            osc.frequency.setValueAtTime(523, now);
            osc.frequency.setValueAtTime(659, now + 0.1);
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'fail') {
            // 🎵 Low buzz
            osc.frequency.setValueAtTime(150, now);
            osc.type = 'sawtooth';
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === 'click') {
            // 🎵 Short tap
            osc.frequency.setValueAtTime(800, now);
            osc.type = 'square';
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'combo') {
            // 🎵 Ascending arpeggio
            osc.frequency.setValueAtTime(523, now);
            osc.frequency.setValueAtTime(659, now + 0.08);
            osc.frequency.setValueAtTime(784, now + 0.16);
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
        } else if (type === 'clear') {
            // 🎵 Victory fanfare
            const osc2 = this.audioCtx.createOscillator();
            const gain2 = this.audioCtx.createGain();
            osc2.connect(gain2);
            gain2.connect(this.audioCtx.destination);

            osc.frequency.setValueAtTime(523, now);
            osc.frequency.setValueAtTime(659, now + 0.15);
            osc.frequency.setValueAtTime(784, now + 0.3);
            osc2.frequency.setValueAtTime(1047, now + 0.45);

            osc.type = 'sine';
            osc2.type = 'sine';

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            gain2.gain.setValueAtTime(0.3, now + 0.45);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

            osc.start(now);
            osc.stop(now + 0.5);
            osc2.start(now + 0.45);
            osc2.stop(now + 0.8);
        }
    }

    resize(w, h) {
        this.width = w;
        this.height = h;
    }

    update(dt) {
        if (this.isOver || this.isPaused) return;

        // Time Management
        this.timeLeft -= dt;
        if (this.onTimeUpdate) this.onTimeUpdate(Math.ceil(this.timeLeft));

        if (this.timeLeft <= 0) {
            this.gameOver();
            return;
        }

        // Update Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += 500 * dt; // Gravity

            if (p.life <= 0) this.particles.splice(i, 1);
        }

        // 📳 Update Screen Shake
        if (this.shakeIntensity > 0) {
            this.shakeOffsetX = (Math.random() - 0.5) * this.shakeIntensity;
            this.shakeOffsetY = (Math.random() - 0.5) * this.shakeIntensity;
            this.shakeIntensity -= this.shakeDecay * dt;
            if (this.shakeIntensity < 0) {
                this.shakeIntensity = 0;
                this.shakeOffsetX = 0;
                this.shakeOffsetY = 0;
            }
        }
    }

    draw(ctx) {
        // 캔버스 영역 내에서만 그리기 (클리핑)
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, this.width, this.height);
        ctx.clip();

        // Apply Screen Shake
        if (this.shakeIntensity > 0) {
            ctx.translate(this.shakeOffsetX, this.shakeOffsetY);
        }

        // Draw Particles
        for (const p of this.particles) {
            ctx.globalAlpha = p.life < 0.2 ? p.life * 5 : 1;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;

        ctx.restore();
    }

    // --- Helper Methods ---

    spawnParticles(x, y, color, count = 10) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 200 + 100;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 100, // Slightly Up
                life: 0.5 + Math.random() * 0.5,
                color: color,
                size: Math.random() * 4 + 2
            });
        }
    }

    // 📳 Screen Shake Effect
    screenShake(intensity = 20, duration = 0.3) {
        this.shakeIntensity = intensity;
        this.shakeDecay = intensity / duration; // Decay to 0 over duration
    }

    addScore(points) {
        this.score += points;
        this.collected++;
        if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.collected);

        // 🔊 Play success sound
        this.playSound('success');

        if (this.collected >= this.targetScore) {
            this.roundClear();
        }
    }

    // 🆕 Round Clear → Always Level Up (Infinite progression)
    roundClear() {
        this.levelUp();
    }

    levelUp() {
        this.level++;
        this.collected = 0;
        // Difficulty scaling (더 완만한 증가)
        this.targetScore = Math.floor(this.targetScore * 1.2); // 20% 증가
        this.timeLeft += 15; // 레벨업 시 15초 추가 보너스

        this.playSound('combo');
        this.screenShake(30, 0.5); // 🎉 Level Up Shake

        if (this.onLevelUp) {
            this.onLevelUp(this.level);
        }

        // Trigger game-specific reset for new level
        if (this.onNewRound) {
            this.onNewRound();
        }

        // HUD 업데이트 (targetScore가 변경되었으므로)
        if (this.onScoreUpdate) {
            this.onScoreUpdate(this.score, this.collected);
        }
    }

    gameOver() {
        this.isOver = true;
        this.stopBGM(); // 🎵 Stop BGM on game over
        this.playSound('fail');
        this.screenShake(15, 0.4); // 💔 Game Over Shake

        // 🆕 Positive Fail: 80% 이상 달성 시 재도전 기회 제공
        const progress = this.collected / this.targetScore;
        if (progress >= 0.8 && this.onPositiveFail) {
            this.onPositiveFail({ score: this.score, level: this.level, progress: progress });
        } else {
            if (this.onGameOver) this.onGameOver({ score: this.score, level: this.level, success: false });
        }
    }

    gameClear() {
        this.isOver = true;
        this.stopBGM(); // 🎵 Stop BGM on game clear
        this.playSound('clear');
        this.screenShake(40, 0.6); // 🎊 Clear Celebration Shake
        if (this.onGameClear) this.onGameClear({ score: this.score, level: this.level, success: true });
    }

    // Input Stubs (Override these)
    onInputDown(x, y) { }
    onInputMove(x, y) { }
    onInputUp(x, y) { }
}
