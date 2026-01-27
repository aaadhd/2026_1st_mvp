// --- Imports ---
import { GameEngine } from './js/core/GameEngine.js';
import { ShootingGame } from './js/games/ShootingGame.js';
import { TouchGame } from './js/games/TouchGame.js';
import { DragGame } from './js/games/DragGame.js';
import { QuizGame } from './js/games/QuizGame.js';
import { TraceGame } from './js/games/TraceGame.js';
import { RhythmGame } from './js/games/RhythmGame.js';
import { MemoryGame } from './js/games/MemoryGame.js';
import { RunnerGame } from './js/games/RunnerGame.js';
import { FindGame } from './js/games/FindGame.js';
import { TimingGame } from './js/games/TimingGame.js';
import { PaintGame } from './js/games/PaintGame.js';
import { CatchGame } from './js/games/CatchGame.js';
import { JigsawGame } from './js/games/JigsawGame.js';
import { DrawingGame } from './js/games/DrawingGame.js';
import { StickerGame } from './js/games/StickerGame.js';
import { SoundCanvasGame } from './js/games/SoundCanvasGame.js';
import { CollageGame } from './js/games/CollageGame.js';
import { ColoringGame } from './js/games/ColoringGame.js';
import { ObservationGame } from './js/games/ObservationGame.js';
import { StackGame } from './js/games/StackGame.js';

// --- 데이터 및 상태 관리 ---
import { ARTISTS_DB, MATCH_REASONS } from './js/data/artists.js';
import { state, analytics } from './js/core/state.js';
import { getArtistDomain, getArtistColor, getGameGuide, getKoreanParticle, getArtistNameOnly } from './js/ui/utils.js';

// --- 화면 컴포넌트 ---
import {
    IntroScreen,
    TuningScreen,
    ResultScreen,
    HubScreen,
    GameResultScreen,
    MasterpieceScreen,
    MasterpieceClipScreen
} from './js/ui/screens/index.js';

// --- 모달 컴포넌트 ---
import './js/ui/components/MenuModal.js';
import './js/ui/components/SettingsModal.js';

// --- 앱 시작 시 로컬 이미지 미리 로드 (화면 깨짐·늦은 로딩 완화) ---
function resolveAssetUrl(path) {
    if (!path || typeof path !== 'string') return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    try {
        return new URL(path, window.location.href).href;
    } catch {
        return (path.startsWith('/') ? window.location.origin + path : window.location.origin + '/' + path.replace(/^\//, ''));
    }
}

function preloadAllAppAssets() {
    const seen = new Set();
    const urls = [];
    for (const list of Object.values(ARTISTS_DB)) {
        for (const a of list) {
            if (a.artistImg) {
                const u = resolveAssetUrl(a.artistImg);
                if (u && !seen.has(u)) { seen.add(u); urls.push(u); }
            }
            if (a.masterpieceImage) {
                const u = resolveAssetUrl(a.masterpieceImage);
                if (u && !seen.has(u)) { seen.add(u); urls.push(u); }
            }
        }
    }
    urls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// --- 액션 컨트롤러 ---
// (데이터, 상태, 화면 컴포넌트는 위에서 import됨)

// --- 액션 컨트롤러 ---
const actions = {
    startTuning: () => {
        state.tuningStep = 1;
        state.tuningWeights = { EMOTION: 0, COGNITION: 0, SOCIAL: 0, SENSORY: 0 };
        state.tuningSelectionHistory = [];
        state.tuningSelectionByStep = {};
        analytics.screeningStartTime = Date.now();
        analytics.log('screening_start');
        changeStep('TUNING');
    },
    tuningBack: () => {
        if (state.tuningStep <= 1) return;
        const lastDomain = state.tuningSelectionHistory.pop();
        if (lastDomain && state.tuningWeights[lastDomain] > 0) {
            state.tuningWeights[lastDomain]--;
        }
        state.tuningStep--;
        render();
    },
    tuningSelect: (domain, choice, artist) => {
        state.tuningWeights[domain]++;
        state.tuningSelectionHistory = state.tuningSelectionHistory || [];
        state.tuningSelectionHistory.push(domain);
        state.tuningSelectionByStep = state.tuningSelectionByStep || {};
        state.tuningSelectionByStep[state.tuningStep] = domain;
        analytics.log('screening_select', {
            step: state.tuningStep,
            domain: domain,
            choice: choice,
            artist: artist
        });

        if (state.tuningStep < 7) { state.tuningStep++; render(); }
        else {
            changeStep('LOADING');
            const sorted = Object.entries(state.tuningWeights).sort((a, b) => b[1] - a[1]);
            const top = sorted[0][0];
            const candidates = ARTISTS_DB[top];
            state.persona = candidates[Math.floor(Math.random() * candidates.length)];

            analytics.log('screening_complete', {
                persona_id: state.persona.id,
                domain: top,
                duration: (Date.now() - analytics.screeningStartTime) / 1000
            });

            // 로딩 메시지 순환 로직에서 마지막 메시지 표시 후 자동으로 결과 화면으로 전환됨
            // 백업 타이머 (혹시 모를 경우를 대비해 6초 후에도 전환)
            if (window.loadingBackupTimeout) {
                clearTimeout(window.loadingBackupTimeout);
            }
            window.loadingBackupTimeout = setTimeout(() => {
                if (state.currentStep === 'LOADING') {
                    changeStep('RESULT');
                }
                window.loadingBackupTimeout = null;
            }, 6000);
        }
    },
    goToHub: () => {
        analytics.log('navigate', { from: state.currentStep, to: 'HUB' });
        state.currentHubTab = 'ALL'; // 탭 초기화
        changeStep('HUB');
    },
    setHubTab: (tab) => {
        state.currentHubTab = tab;
        render();
    },
    goBackToCompanion: () => {
        analytics.log('navigate', { from: 'HUB', to: 'RESULT' });
        changeStep('RESULT');
    },
    goBackToHub: () => {
        analytics.log('navigate', { from: state.currentStep, to: 'HUB' });
        changeStep('HUB');
    },
    // 게임 허브로 이동 (ResultScreen '아트 여정' 클릭 시)
    goToGameHub: () => {
        actions.goToHub();
    },
    startLevelIntro: () => {
        state.currentLevel = 1;
        state.totalScore = 0;
        analytics.gameStartTime = Date.now();
        analytics.log('game_intro', {
            from: state.currentStep,
            artist_id: state.persona.id,
            mechanic: state.persona.mechanic
        });
        // 아트 게임 모아보기(Hub)에서 진입 시 명화 보기 건너뛰고 바로 게임 → 끝나면 결과 화면
        if (state.currentStep === 'HUB') {
            actions.startGame();
            return;
        }
        // 결과 화면 등에서는 체크박스(showMasterpieceClip)에 따라 분기
        if (state.showMasterpieceClip) {
            changeStep('CLIP_INTRO');
        } else {
            actions.startGame();
        }
    },
    // proceedToActivity는 제거됨 - startGame()으로 직접 이동
    viewMasterpiece: () => {
        changeStep('MASTERPIECE');
    },
    goBackToResult: () => {
        changeStep('RESULT');
    },

    // 빠른 접근: 게임만 (인트로 모달 포함)
    startGameDirectly: () => {
        state.currentLevel = 1;
        state.totalScore = 0;
        analytics.gameStartTime = Date.now();
        analytics.log('game_intro', {
            from: state.currentStep,
            artist_id: state.persona.id,
            mechanic: state.persona.mechanic
        });
        actions.startGame();
    },
    // Start Game (Engine) - Direct to Playing with Tutorial Modal
    startGame: () => {
        analytics.gamesPlayed++;
        analytics.log('game_start', {
            game_id: state.persona.mechanic,
            persona_id: state.persona.id,
            level: state.currentLevel
        });
        changeStep('PLAYING');

        const p = state.persona;
        const guide = getGameGuide(p.mechanic);
        const artistColor = getArtistColor(p.id);

        // Wait for DOM
        setTimeout(() => {
            // 게임 설명 모달 표시 (앱 프레임 내부에만)
            const app = document.getElementById('app');
            if (!app) return;

            const tutorialModal = document.createElement('div');
            tutorialModal.id = 'game-tutorial-modal';
            tutorialModal.className = 'absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in';
            tutorialModal.innerHTML = `
                <div class="bg-white rounded-3xl border-3 border-black shadow-notion-lg max-w-sm w-full mx-4 animate-pop-in">
                    <div class="p-6 text-center">
                        <!-- 게임 이모지 -->
                        <div class="w-24 h-24 mx-auto mb-4 rounded-3xl ${artistColor} border-3 border-black shadow-notion-lg flex items-center justify-center rotate-slight">
                            <div class="text-5xl">${p.gameEmoji}</div>
                        </div>
                        
                        <h2 class="text-2xl font-black mb-2" style="color: var(--text-primary);">${p.gameTitle}</h2>
                        <p class="text-sm font-bold mb-4" style="color: var(--text-secondary);">${(() => {
                            const artistName = getArtistNameOnly(p.title);
                            return artistName + getKoreanParticle(artistName) + ' 함께';
                        })()}</p>
                        
                        <!-- 조작 가이드 -->
                        <div class="bg-white rounded-2xl border-2 border-black px-4 py-3 mb-6">
                            <p class="text-base font-black" style="color: var(--text-primary);">${guide}</p>
                        </div>
                        
                        <button onclick="this.closest('#game-tutorial-modal').remove(); if (window.startGameAfterTutorial) window.startGameAfterTutorial();" 
                                class="w-full py-4 text-lg font-black rounded-2xl border-2 border-black shadow-notion ${artistColor}"
                                style="color: var(--text-primary);">
                            시작!
                        </button>
                    </div>
                </div>
            `;
            app.appendChild(tutorialModal);

            // 게임 엔진 초기화 함수 (모달 닫힌 후 실행)
            window.startGameAfterTutorial = () => {
                if (state.engine) {
                    // Stop BGM before creating new engine
                    if (state.engine.gameInstance && state.engine.gameInstance.stopBGM) {
                        state.engine.gameInstance.stopBGM();
                    }
                    state.engine.stop();
                }
                state.engine = new GameEngine('game-canvas');

                const p = state.persona;

                // 안전 가드: persona가 없으면 에러
                if (!p) {
                    console.error('페르소나가 설정되지 않았습니다. 게임을 시작할 수 없습니다.');
                    changeStep('HUB');
                    return;
                }

                // 🎵 Find domain for BGM
                const domain = getArtistDomain(p.id);
                state.currentDomain = domain; // Store for recommendations

                let gameInstance;

                // Mechanic Router - Complete 20 Distinct Games
                // 🎯 Balanced Target Scores (쉬운 레벨업)
                switch (p.mechanic) {
                    case 'SHOOT_WATER':
                        gameInstance = new ShootingGame({ type: 'SHOOT', level: state.currentLevel, targetScore: 8, domain });
                        break;
                    case 'PUZZLE_JIGSAW':
                        // 각 아티스트의 대표 작품 이미지
                        const puzzleImages = {
                            // 정서 Care
                            'YIAM': '/images/artworks/yiam_mother_dog.jpg', // 이암 - 모견도
                            'RENOIR': '/images/artworks/renoir_luncheon.jpg', // 르누아르 - 뱃놀이 파티의 점심
                            'CHAGALL': '/images/artworks/chagall_lovers.jpg', // 샤갈 - 연인들
                            'GOGH': '/images/artworks/gogh_sunflowers.jpg', // 고흐 - 해바라기
                            'PAULA': '/images/artworks/paula_still_life.jpg', // 파울라 - 정물

                            // 인지 Care
                            'ARCIMBOLDO': '/images/artworks/arcimboldo_seasons.jpg', // 아르침볼도 - 사계
                            'MONET_COG': '/images/artworks/monet_waterlilies.jpg', // 모네 - 수련
                            'CAILLEBOTTE': '/images/artworks/caillebotte_fruit.jpg', // 카유보트 - 과일 진열대
                            'SEURAT': '/images/artworks/seurat_grande_jatte.jpg', // 쇠라 - 그랑드 자트 섬의 일요일 오후
                            'DAVINCI': '/images/artworks/davinci_vitruvian.jpg', // 다빈치 - 비트루비우스 인체도

                            // 사회 Care
                            'SAIMDANG': '/images/artworks/saimdang_insects.jpg', // 신사임당 - 초충도
                            'TISSOT': '/images/artworks/tissot_picnic.jpg', // 티소 - 소풍
                            'YUNBOK': '/images/artworks/yunbok_lovers.jpg', // 신윤복 - 월하정인
                            'BRUEGEL': '/images/artworks/bruegel_wedding.jpg', // 브뤼겔 - 농민의 결혼식
                            'BONNARD': '/images/artworks/bonnard_cat.jpg', // 보나르 - 고양이와 여인

                            // 감각 Care
                            'MACKE': '/images/artworks/macke_zoological.jpg', // 마케 - 동물원
                            'MATISSE': '/images/artworks/matisse_cutouts.jpg', // 마티스 - 종이 오리기
                            'KANDINSKY': '/images/artworks/kandinsky_composition.jpg', // 칸딘스키 - 구성
                            'KLIMT_SEN': '/images/artworks/klimt_garden.jpg', // 클림트 - 정원
                            'KLEE': '/images/artworks/klee_castle.jpg' // 클레 - 성과 태양
                        };

                        // 기본 이미지 (작품 이미지가 없을 경우)
                        const defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/600px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg';

                        gameInstance = new JigsawGame({
                            level: state.currentLevel,
                            targetScore: 6,
                            domain,
                            imageSrc: puzzleImages[p.id] || defaultImage
                        });
                        break;
                    case 'BALANCE_STACK': // Paula (NEW)
                        gameInstance = new StackGame({ level: state.currentLevel, targetScore: 7, domain });
                        break;
                    case 'CATCH_FRUIT':
                        gameInstance = new CatchGame({ level: state.currentLevel, targetScore: 12, domain });
                        break;
                    case 'SWIPE_SORT':
                        gameInstance = new DragGame({ mode: 'SORT', level: state.currentLevel, targetScore: 8, domain });
                        break;
                    case 'LIST_MEMO':
                    case 'MEMORY_MATCH':
                        gameInstance = new MemoryGame({ type: 'LIST', level: state.currentLevel, targetScore: 6, domain });
                        break;
                    case 'STICKER_FACE':
                        gameInstance = new StickerGame({ mode: 'FACE', level: state.currentLevel, targetScore: 4, domain });
                        break;
                    case 'STICKER_NATURE':
                        gameInstance = new StickerGame({ mode: 'GARDEN', level: state.currentLevel, targetScore: 6, domain });
                        break;
                    case 'DRAW_MIRROR':
                        gameInstance = new DrawingGame({ level: state.currentLevel, targetScore: 5, domain });
                        break;
                    case 'QUIZ_FRUIT':
                        gameInstance = new QuizGame({ type: 'PICK_ONE', level: state.currentLevel, targetScore: 5, domain });
                        break;
                    case 'TRACE_DOT':
                        gameInstance = new TraceGame({ type: 'DOTS', level: state.currentLevel, targetScore: 3, domain });
                        break;
                    case 'MAZE_DRAG':
                        gameInstance = new TraceGame({ type: 'MAZE', level: state.currentLevel, targetScore: 3, domain });
                        break;
                    case 'SCISSORS_CUT':
                    case 'COLLAGE_CUTOUT':
                        gameInstance = new CollageGame({ level: state.currentLevel, targetScore: 6, domain });
                        break;
                    case 'SOUND_CANVAS':
                        gameInstance = new SoundCanvasGame({ level: state.currentLevel, targetScore: 8, domain });
                        break;
                    case 'COLORING_FILL':
                        gameInstance = new ColoringGame({ level: state.currentLevel, targetScore: 5, domain });
                        break;
                    case 'GOLDEN_BRUSH':
                        gameInstance = new PaintGame({ level: state.currentLevel, targetScore: 10, domain });
                        break;

                    // --- Updated Monet ---
                    case 'OBSERVE_MATCH': // Monet
                    case 'FIND_SAME':     // Fallback
                        gameInstance = new ObservationGame({ level: state.currentLevel, targetScore: 5, domain });
                        break;

                    // Other Specialized Games
                    case 'RHYTHM_TAP':
                    case 'TOUCH_SMILE': // Renoir (Touch Game)
                        gameInstance = new TouchGame({
                            level: state.currentLevel,
                            targetScore: 10,
                            targetEmoji: p.gameEmoji,
                            domain
                        });
                        break;
                    case 'RUN_FLOWER':
                        gameInstance = new RunnerGame({ level: state.currentLevel, targetScore: 12, domain });
                        break;
                    case 'FIND_HIDDEN':
                    case 'FIND_PERSON':
                        gameInstance = new FindGame({ type: 'HIDDEN', role: p.id === 'BRUEGEL' ? 'BRUEGEL' : 'YUNBOK', level: state.currentLevel, targetScore: 7, domain });
                        break;
                    case 'TIMING_FISH':
                        gameInstance = new TimingGame({ level: state.currentLevel, targetScore: 8, domain });
                        break;

                    default:
                        gameInstance = new TouchGame({
                            level: state.currentLevel,
                            targetScore: 10,
                            targetEmoji: p.gameEmoji,
                            domain
                        });
                        break;
                }

                // 안전 가드: gameInstance가 없으면 에러
                if (!gameInstance) {
                    console.error('게임 인스턴스 생성 실패:', p.mechanic);
                    return;
                }

                // 레벨 1의 1단계 시간 제한을 30초로 설정
                if (state.currentLevel === 1) {
                    gameInstance.timeLimit = 30;
                    gameInstance.timeLeft = 30;
                }

                // Connect Hooks
                gameInstance.onScoreUpdate = (score, count) => {
                    document.getElementById('ui-score').innerText = score.toLocaleString();
                    document.getElementById('ui-collected').innerText = `${count} / ${gameInstance.targetScore}`;
                    const progress = (count / gameInstance.targetScore) * 100;
                    document.getElementById('ui-progress').style.width = `${Math.min(100, progress)}%`;

                    // 📊 Analytics: Track actions
                    analytics.totalActions++;
                };

                gameInstance.onTimeUpdate = (time) => {
                    document.getElementById('ui-time').innerText = time;
                };

                // 🆕 Level Up Callback (In-game, no screen change)
                gameInstance.onLevelUp = (newLevel) => {
                    state.currentLevel = newLevel;

                    // Update UI - 레벨 표시 업데이트
                    const levelEl = document.getElementById('ui-level');
                    if (levelEl) {
                        levelEl.innerText = `LEVEL ${newLevel}`;
                    }

                    // Show level-up animation overlay (Notion style!)
                    const overlay = document.createElement('div');
                    overlay.className = 'fixed inset-0 flex items-center justify-center z-50 pointer-events-none';
                    overlay.innerHTML = `
                        <div class="text-center animate-pop-in">
                            <div class="w-32 h-32 mx-auto mb-6 rounded-3xl bg-yellow border-3 border-black shadow-notion-lg flex items-center justify-center rotate-slight animate-bounce">
                                <div class="text-7xl">🎊</div>
                            </div>
                            <div class="inline-block px-8 py-4 bg-white border-3 border-black rounded-2xl shadow-notion-lg mb-4">
                                <div class="text-4xl font-black mb-1" style="color: var(--text-primary)">
                                    레벨 ${newLevel} 달성!
                                </div>
                                <div class="text-xl font-black" style="color: var(--text-secondary)">계속 가보자! 🔥</div>
                            </div>
                        </div>
                    `;
                    document.body.appendChild(overlay);

                    // 배경 축하 효과 (단색 원형 파티클)
                    const appContainer = document.getElementById('app');
                    const appRect = appContainer.getBoundingClientRect();
                    const colors = ['#FFD93D', '#6BCB77', '#4D96FF', '#FF6B6B', '#C9B1FF'];
                    for (let i = 0; i < 15; i++) {
                        setTimeout(() => {
                            const particle = document.createElement('div');
                            const size = 8 + Math.random() * 8;
                            particle.style.cssText = `
                                position: absolute;
                                left: ${Math.random() * 100}%;
                                top: -20px;
                                width: ${size}px;
                                height: ${size}px;
                                border-radius: 50%;
                                background: ${colors[Math.floor(Math.random() * colors.length)]};
                                z-index: 49;
                                pointer-events: none;
                                opacity: 0.8;
                            `;
                            appContainer.appendChild(particle);

                            let pos = -20;
                            const speed = 3 + Math.random() * 2;
                            const fall = setInterval(() => {
                                pos += speed;
                                particle.style.top = pos + 'px';
                                if (pos > appRect.height) {
                                    clearInterval(fall);
                                    particle.remove();
                                }
                            }, 30);
                        }, i * 80);
                    }

                    setTimeout(() => overlay.remove(), 2000);
                };

                gameInstance.onGameClear = (result) => {
                    window.navigator.vibrate?.([50, 50, 50, 50, 50]);

                    // 🎵 Ensure BGM is stopped
                    if (gameInstance.stopBGM) gameInstance.stopBGM();

                    state.engine.stop();
                    state.totalScore += result.score;
                    state.currentLevel = result.level || 1;
                    state.lastGameResult = result; // 결과 저장

                    analytics.gamesSucceeded++;
                    analytics.log('game_complete', {
                        game_id: state.persona.mechanic,
                        level: result.level,
                        score: result.score,
                        duration: (Date.now() - analytics.gameStartTime) / 1000,
                        max_combo: result.maxCombo || 0
                    });

                    // Go to Game Result Screen
                    setTimeout(() => changeStep('GAME_RESULT'), 500);
                };

                gameInstance.onPositiveFail = (result) => {
                    // 🎵 Ensure BGM is stopped
                    if (gameInstance.stopBGM) gameInstance.stopBGM();

                    state.engine.stop();
                    state.totalScore += result.score;

                    analytics.log('positive_fail_shown', {
                        game_id: state.persona.mechanic,
                        level: result.level,
                        completion_rate: result.progress
                    });
                    const progressPercent = Math.round(result.progress * 100);

                    // 🎯 Positive Fail Modal (Notion style)
                    const modal = document.createElement('div');
                    modal.className = 'fixed inset-0 bg-white/95 flex items-center justify-center z-50 animate-fade-in px-6';
                    modal.innerHTML = `
                        <div class="bg-white border-3 border-black rounded-3xl p-8 max-w-sm w-full text-center animate-pop-in shadow-notion-lg">
                            <div class="w-24 h-24 mx-auto mb-4 rounded-3xl bg-orange border-3 border-black shadow-notion flex items-center justify-center">
                                <div class="text-6xl">😮</div>
                            </div>
                            <h2 class="text-2xl font-black mb-3" style="color: var(--text-primary);">아깝다! 조금만 더!</h2>
                            <p class="mb-2 font-bold" style="color: var(--text-secondary);">목표의 ${progressPercent}%나 달성했어요</p>
                            <p class="text-lg font-black mb-6 bg-yellow px-4 py-2 rounded-xl border-2 border-black inline-block" style="color: var(--text-primary);">
                                10초만 더 플레이할까요?
                            </p>
                            <div class="flex gap-3">
                                <button id="continue-btn" class="flex-1 py-3 bg-blue font-black rounded-xl border-2 border-black shadow-notion" style="color: var(--text-primary);">
                                    계속 고고! ⏱️
                                </button>
                                <button id="quit-btn" class="flex-1 py-3 bg-white font-black rounded-xl border-2 border-black shadow-notion" style="color: var(--text-primary);">
                                    나가기
                                </button>
                            </div>
                        </div>
                    `;

                    document.body.appendChild(modal);
                    window.navigator.vibrate?.([50, 100, 50]);

                    document.getElementById('continue-btn').onclick = () => {
                        modal.remove();
                        gameInstance.timeLeft = 10;
                        gameInstance.isOver = false;

                        // 🎵 Restart BGM
                        if (gameInstance.startBGM) gameInstance.startBGM();

                        state.engine.start();

                        analytics.log('positive_fail_retry', {
                            game_id: state.persona.mechanic,
                            level: result.level
                        });
                    };

                    document.getElementById('quit-btn').onclick = () => {
                        modal.remove();
                        state.currentLevel = result.level || 1;
                        state.lastGameResult = {
                            score: result.score || 0,
                            level: result.level || 1
                        };
                        changeStep('GAME_RESULT');

                        analytics.log('positive_fail_quit', {
                            game_id: state.persona.mechanic,
                            level: result.level
                        });
                    };
                };

                gameInstance.onGameOver = (result) => {
                    window.navigator.vibrate?.([100, 50, 100]);

                    // 🎵 Ensure BGM is stopped
                    if (gameInstance.stopBGM) gameInstance.stopBGM();

                    state.engine.stop();
                    state.totalScore += result.score;
                    state.currentLevel = result.level || 1;
                    state.lastGameResult = result; // 결과 저장

                    analytics.log('game_over', {
                        game_id: state.persona.mechanic,
                        level: result.level,
                        score: result.score,
                        duration: (Date.now() - analytics.gameStartTime) / 1000,
                        max_combo: result.maxCombo || 0
                    });

                    // Go to Game Result Screen
                    setTimeout(() => changeStep('GAME_RESULT'), 500);
                };

                state.engine.setGame(gameInstance);
                state.engine.start();
            };

        }, 50);
    },
    playNext: (id) => {
        const found = Object.values(ARTISTS_DB).flat().find(a => a.id === id);
        if (found) { state.persona = found; actions.startLevelIntro(); }
    },
    goHome: () => { state.totalScore = 0; changeStep('HUB'); },
    togglePause: () => {
        if (!state.engine || !state.engine.gameInstance) {
            console.log('일시정지 불가: 게임 엔진이 없습니다');
            return;
        }

        const game = state.engine.gameInstance;
        const isPaused = game.isPaused;

        if (isPaused) {
            // Resume
            game.isPaused = false;
            if (game.startBGM && state.settings && state.settings.bgmEnabled) {
                game.startBGM();
            }
            state.engine.start();

            // Update button icon
            const btn = document.getElementById('pause-btn');
            if (btn) {
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'pause');
                    if (window.lucide) window.lucide.createIcons();
                }
            }

            // Remove pause overlay (앱 프레임 내부에서 제거)
            const overlay = document.getElementById('pause-overlay');
            if (overlay) overlay.remove();

            analytics.log('game_resume', { artistId: state.persona?.id, level: state.currentLevel });
        } else {
            // Pause
            game.isPaused = true;
            if (game.stopBGM) game.stopBGM();
            state.engine.stop();

            // Update button icon
            const btn = document.getElementById('pause-btn');
            if (btn) {
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'play');
                    if (window.lucide) window.lucide.createIcons();
                }
            }

            // Show pause modal (게임 튜토리얼 모달과 동일한 스타일)
            const app = document.getElementById('app');
            const pauseModal = document.createElement('div');
            pauseModal.id = 'pause-overlay';
            pauseModal.className = 'absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in';
            pauseModal.innerHTML = `
                <div class="bg-white rounded-3xl border-3 border-black shadow-notion-lg max-w-sm w-full mx-4 animate-pop-in">
                    <div class="p-6 text-center">
                        <!-- 일시정지 아이콘 -->
                        <div class="w-24 h-24 mx-auto mb-4 rounded-3xl bg-yellow border-3 border-black shadow-notion-lg flex items-center justify-center rotate-slight">
                            <div class="text-5xl">⏸️</div>
                        </div>
                        
                        <h2 class="text-2xl font-black mb-2" style="color: var(--text-primary);">잠깐 쉬는 중!</h2>
                        <p class="text-sm font-bold mb-4" style="color: var(--text-secondary);">준비됐으면 다시 시작!</p>
                        
                        <!-- 안내 문구 -->
                        <div class="bg-white rounded-2xl border-2 border-black px-4 py-3 mb-6">
                            <p class="text-base font-black" style="color: var(--text-primary);">게임을 잠시 멈췄어요</p>
                        </div>
                        
                        <!-- 다시 플레이 버튼 -->
                        <button onclick="actions.togglePause()" 
                                class="w-full py-4 text-lg font-black rounded-2xl border-2 border-black shadow-notion bg-green"
                                style="color: var(--text-primary);">
                            다시 플레이 ▶️
                        </button>
                    </div>
                </div>
            `;
            app.appendChild(pauseModal);
            if (window.lucide) window.lucide.createIcons();

            analytics.log('game_pause', { artistId: state.persona?.id, level: state.currentLevel });
        }
    },
    quitGame: () => {
        if (state.engine) {
            // Stop BGM before stopping engine
            if (state.engine.gameInstance && state.engine.gameInstance.stopBGM) {
                state.engine.gameInstance.stopBGM();
            }
            // Save current game state as result
            if (state.engine.gameInstance) {
                state.lastGameResult = {
                    score: state.engine.gameInstance.score || 0,
                    level: state.engine.gameInstance.level || 1
                };
            }
            state.engine.stop();
        }
        changeStep('RESULT');
    },

    // 🛠️ 개발자용: 플로우 스킵
    skipFlow: () => {
        if (!state.devMode) return;

        // 기존 모달 제거 (튜토리얼 모달 등)
        const tutorialModal = document.getElementById('game-tutorial-modal');
        if (tutorialModal) {
            tutorialModal.remove();
        }

        // 게임 엔진 정지
        if (state.engine) {
            if (state.engine.gameInstance && state.engine.gameInstance.stopBGM) {
                state.engine.gameInstance.stopBGM();
            }
            state.engine.stop();
        }

        // 로딩 타이머 정리
        if (window.loadingInterval) {
            clearInterval(window.loadingInterval);
            window.loadingInterval = null;
        }
        if (window.loadingTimeout) {
            clearTimeout(window.loadingTimeout);
            window.loadingTimeout = null;
        }
        if (window.loadingBackupTimeout) {
            clearTimeout(window.loadingBackupTimeout);
            window.loadingBackupTimeout = null;
        }

        const flowMap = {
            'INTRO': 'TUNING',
            'TUNING': 'LOADING',
            'LOADING': 'RESULT',
            'RESULT': 'CLIP_INTRO',
            'CLIP_INTRO': 'PLAYING',
            'PLAYING': 'GAME_RESULT',
            'GAME_RESULT': 'HUB',
            'HUB': 'RESULT',
            'MASTERPIECE': 'RESULT'
        };

        const nextStep = flowMap[state.currentStep];
        if (nextStep) {
            // 필요한 상태 초기화
            if (nextStep === 'RESULT' && !state.persona) {
                // 페르소나가 없으면 랜덤으로 하나 선택
                const allArtists = Object.values(ARTISTS_DB).flat();
                state.persona = allArtists[Math.floor(Math.random() * allArtists.length)];
            }
            // LOADING에서 RESULT로 스킵할 때도 persona 확인
            if (state.currentStep === 'LOADING' && nextStep === 'RESULT' && !state.persona) {
                const allArtists = Object.values(ARTISTS_DB).flat();
                state.persona = allArtists[Math.floor(Math.random() * allArtists.length)];
            }
            if (nextStep === 'TUNING') {
                state.tuningStep = 1;
                state.tuningWeights = { EMOTION: 0, COGNITION: 0, SOCIAL: 0, SENSORY: 0 };
            }
            if (nextStep === 'PLAYING') {
                if (!state.persona) {
                    const allArtists = Object.values(ARTISTS_DB).flat();
                    state.persona = allArtists[Math.floor(Math.random() * allArtists.length)];
                }
                state.currentLevel = 1;
                actions.startGame();
                return; // startGame이 이미 changeStep을 호출함
            }

            // PLAYING에서 GAME_RESULT로 스킵할 때 게임 결과 데이터 생성
            if (state.currentStep === 'PLAYING' && nextStep === 'GAME_RESULT') {
                if (!state.lastGameResult) {
                    state.lastGameResult = {
                        score: 1000,
                        level: state.currentLevel || 1,
                        success: true
                    };
                    state.totalScore = (state.totalScore || 0) + 1000;
                }
            }

            changeStep(nextStep);
        }
    }
};

// --- 화면 렌더링 (State -> HTML) ---
function changeStep(s) {
    const prevStep = state.currentStep;
    state.currentStep = s;

    // 🎵 Stop BGM when leaving PLAYING state
    if (prevStep === 'PLAYING' && s !== 'PLAYING') {
        if (state.engine && state.engine.gameInstance && state.engine.gameInstance.stopBGM) {
            state.engine.gameInstance.stopBGM();
        }
    }

    // 📊 Analytics: View tracking
    analytics.log('view', {
        from: prevStep,
        to: s,
        persona: state.persona?.id || null
    });

    // 🛡️ Enable back defense for protected steps
    const protectedSteps = ['TUNING', 'PLAYING'];
    if (protectedSteps.includes(s)) {
        enableBackDefense();
    } else if (s === 'INTRO' || s === 'RESULT' || s === 'HUB' || s === 'GAME_RESULT' || s === 'MASTERPIECE' || s === 'CLIP_INTRO') {
        disableBackDefense();
    }

    render();
}

function render() {
    const app = document.getElementById('app');
    const p = state.persona;

    // 🛠️ 개발 모드 버튼 표시/숨김
    const devBtn = document.getElementById('dev-skip-btn');
    if (devBtn) {
        devBtn.classList.toggle('hidden', !state.devMode);
    }

    // Common Screens
    if (state.currentStep === 'INTRO') {
        app.innerHTML = IntroScreen();
    } else if (state.currentStep === 'TUNING') {
        app.innerHTML = TuningScreen(state.tuningStep);
    } else if (state.currentStep === 'LOADING') {
        app.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center text-center p-10 bg-white">
            <!-- Playful loading animation with enhanced actions -->
            <div class="relative w-32 h-32 mb-6">
                <!-- Outer rotating circles with pulse -->
                <div class="absolute inset-0 border-3 border-black rounded-full bg-blue" style="animation: spin 2s linear infinite, pulse 2s ease-in-out infinite;"></div>
                <div class="absolute inset-2 border-3 border-black rounded-full bg-yellow" style="animation: spin 1.5s linear infinite reverse, pulse 1.5s ease-in-out infinite 0.3s;"></div>
                <div class="absolute inset-4 border-3 border-black rounded-full bg-red" style="animation: spin 1s linear infinite, pulse 1s ease-in-out infinite 0.6s;"></div>
                <!-- Center icon with gentle pulse -->
                <div class="absolute inset-6 border-2 border-black rounded-full bg-white flex items-center justify-center" style="animation: gentle-pulse 2s ease-in-out infinite;">
                    <span class="text-3xl">🎨</span>
                </div>
                <!-- Floating particles -->
                <div class="absolute top-0 left-1/2 w-2 h-2 bg-blue rounded-full border border-black" style="animation: float-up 2s ease-in-out infinite;"></div>
                <div class="absolute top-2 right-0 w-2 h-2 bg-yellow rounded-full border border-black" style="animation: float-up 2s ease-in-out infinite 0.5s;"></div>
                <div class="absolute bottom-0 left-0 w-2 h-2 bg-red rounded-full border border-black" style="animation: float-up 2s ease-in-out infinite 1s;"></div>
            </div>
            <h2 id="loading-text" class="text-2xl font-black mb-2 transition-opacity duration-500" style="color: var(--text-primary);">오늘의 아트 세션 준비 중…</h2>
            <p class="font-bold text-sm" style="color: var(--text-secondary);">잠시만 기다려주세요</p>
            <style>
                @keyframes spin { 
                    0% { transform: rotate(0deg); } 
                    100% { transform: rotate(360deg); } 
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
                @keyframes gentle-pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.95; }
                }
                @keyframes float-up {
                    0% { transform: translateY(0) scale(0.8); opacity: 0; }
                    50% { transform: translateY(-20px) scale(1); opacity: 1; }
                    100% { transform: translateY(-40px) scale(0.8); opacity: 0; }
                }
            </style>
        </div>`;
        
        // 로딩 문구 순환 (각 메시지 최소 1초씩 보이도록)
        const loadingMessages = [
            '오늘의 아트 세션 준비 중…',
            '함께할 아트 메이트 찾는 중…',
            '완벽한 매칭을 준비하고 있어요…'
        ];
        let messageIndex = 0;
        const loadingTextEl = document.getElementById('loading-text');
        
        // 기존 타이머 정리
        if (window.loadingInterval) {
            clearInterval(window.loadingInterval);
            window.loadingInterval = null;
        }
        if (window.loadingTimeout) {
            clearTimeout(window.loadingTimeout);
            window.loadingTimeout = null;
        }
        
        if (loadingTextEl) {
            // 첫 메시지는 즉시 표시
            loadingTextEl.textContent = loadingMessages[0];
            
            // 각 메시지가 최소 1초씩 보이도록 (페이드 시간 0.3초 포함하여 1.3초 간격)
            window.loadingInterval = setInterval(() => {
                if (state.currentStep !== 'LOADING') {
                    if (window.loadingInterval) {
                        clearInterval(window.loadingInterval);
                        window.loadingInterval = null;
                    }
                    return;
                }
                
                messageIndex++;
                if (messageIndex >= loadingMessages.length) {
                    // 모든 메시지가 전환되었으면 더 이상 변경하지 않음
                    if (window.loadingInterval) {
                        clearInterval(window.loadingInterval);
                        window.loadingInterval = null;
                    }
                    // 마지막 메시지가 표시된 후 1초 뒤에 결과 화면으로 전환
                    window.loadingTimeout = setTimeout(() => {
                        if (state.currentStep === 'LOADING') {
                            changeStep('RESULT');
                        }
                        window.loadingTimeout = null;
                    }, 1000);
                    return;
                }
                
                loadingTextEl.style.opacity = '0';
                setTimeout(() => {
                    if (loadingTextEl && state.currentStep === 'LOADING') {
                        loadingTextEl.textContent = loadingMessages[messageIndex];
                        loadingTextEl.style.opacity = '1';
                    }
                }, 300); // 페이드 아웃 시간
            }, 1300); // 각 메시지가 1초 보이고 0.3초 페이드 = 1.3초 간격
        }
    } else if (state.currentStep === 'RESULT') {
        app.innerHTML = ResultScreen(p);
    } else if (state.currentStep === 'PLAYING') {
        // Canvas Game Screen
        app.innerHTML = `
        <div class="h-full flex flex-col bg-white relative overflow-hidden select-none">
            <!-- Header Interface - Minimal style -->
            <div class="absolute top-0 left-0 right-0 z-20 pointer-events-none">
                <!-- 첫 번째 줄: 버튼 + 점수/시간 -->
                <div class="p-3 flex justify-between items-start">
                    <div class="flex gap-2 pointer-events-auto">
                        <button onclick="actions.quitGame()" 
                                class="bg-white rounded-xl w-11 h-11 flex items-center justify-center border-2 border-black shadow-notion">
                             <i data-lucide="x" width="20" style="color: var(--text-primary);"></i>
                        </button>
                        <button onclick="actions.togglePause()" id="pause-btn" 
                                class="bg-yellow rounded-xl w-11 h-11 flex items-center justify-center border-2 border-black shadow-notion">
                             <i data-lucide="pause" width="20" style="color: var(--text-primary);"></i>
                        </button>
                    </div>
                    <div class="flex flex-col items-end gap-1 pointer-events-auto">
                        <div class="text-right">
                            <div class="text-[10px] font-bold uppercase tracking-wider opacity-60" style="color: var(--text-secondary);">Score</div>
                            <div id="ui-score" class="text-2xl font-black leading-none" style="color: var(--text-primary);">0</div>
                        </div>
                        <div class="text-right">
                            <div class="text-[10px] font-bold uppercase tracking-wider opacity-60" style="color: var(--text-secondary);">Time</div>
                            <div id="ui-time" class="text-2xl font-mono font-black leading-none" style="color: var(--text-primary);">0</div>
                        </div>
                    </div>
                </div>
                
                <!-- 두 번째 줄: 레벨/목표 + 진행바 -->
                <div class="px-4 pb-3 pointer-events-none">
                     <div class="flex justify-between items-center text-sm font-black mb-2">
                        <span id="ui-level" class="pointer-events-auto" 
                              style="color: var(--text-primary);">LEVEL ${state.currentLevel}</span>
                        <span id="ui-collected" class="pointer-events-auto" 
                              style="color: var(--text-secondary);">0 / 0</span>
                     </div>
                     <div class="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div id="ui-progress" class="h-full transition-all duration-300 bg-purple rounded-full" style="width:0%;"></div>
                     </div>
                </div>
            </div>
            
            <!-- Game Canvas -->
            <canvas id="game-canvas" class="w-full h-full touch-none" style="background: white;"></canvas>
        </div>`;
    } else if (state.currentStep === 'HUB') {
        app.innerHTML = HubScreen(p);
    } else if (state.currentStep === 'GAME_RESULT') {
        app.innerHTML = GameResultScreen();
    } else if (state.currentStep === 'MASTERPIECE') {
        app.innerHTML = MasterpieceScreen(p);
    } else if (state.currentStep === 'CLIP_INTRO') {
        app.innerHTML = MasterpieceClipScreen(p);
    }

    if (window.lucide) window.lucide.createIcons();

    // 메뉴 모달 아이콘 생성 (헤더에 메뉴가 있는 화면)
    setTimeout(() => {
        if (window.lucide) window.lucide.createIcons();
    }, 100);
}

// formatMatchReason은 js/ui/utils.js로 이동됨
// 화면 컴포넌트들은 js/ui/screens/로 분리됨

// 📸 Share Result Card
async function shareResultCard() {
    const resultCard = document.getElementById('result-card');
    if (!resultCard) return;

    try {
        // Create canvas from DOM element
        const canvas = await html2canvas(resultCard, {
            backgroundColor: '#ffffff',
            scale: 2, // High quality
            logging: false,
            useCORS: true
        });

        // Convert to blob
        canvas.toBlob(async (blob) => {
            const file = new File([blob], 'my-artist-companion.png', { type: 'image/png' });

            // Web Share API (모바일 지원)
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: '오늘의 아트 메이트',
                        text: `나는 ${state.persona.title}와 신나게 놀고 있어요! 🎨⚡`,
                        files: [file]
                    });

                    // 📊 Analytics: Share Event
                    window.logAnalytics?.('share', { persona_id: state.persona.id, method: 'native' });
                } catch (err) {
                    if (err.name !== 'AbortError') console.error('Share failed:', err);
                }
            } else {
                // Fallback: Download
                const url = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = 'my-artist-companion.png';
                link.href = url;
                link.click();

                // 📊 Analytics: Download Event
                window.logAnalytics?.('share', { persona_id: state.persona.id, method: 'download' });
            }
        }, 'image/png');
    } catch (error) {
        console.error('Screenshot failed:', error);
        alert('이미지 생성에 실패했습니다. 다시 시도해주세요.');
    }
}

// 🎨 Particle Effect for Tuning Selection
function spawnDOMParticles(event) {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // 햅틱 피드백
    if (navigator.vibrate) {
        navigator.vibrate([30, 20, 30]);
    }

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '12px';
        particle.style.height = '12px';
        particle.style.borderRadius = '50%';
        particle.style.border = '2px solid black';
        particle.style.backgroundColor = ['#FF4757', '#1E90FF', '#FFC107', '#00D9A3', '#9B59B6', '#FF6B35'][Math.floor(Math.random() * 6)];
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

        document.body.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 100;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance - 50;

        requestAnimationFrame(() => {
            particle.style.transform = `translate(${tx}px, ${ty}px)`;
            particle.style.opacity = '0';
        });

        setTimeout(() => particle.remove(), 800);
    }
}

// 🔊 Sound Controls
function toggleBGM() {
    state.settings.bgmEnabled = !state.settings.bgmEnabled;
    localStorage.setItem('bgm', state.settings.bgmEnabled);

    const btn = document.getElementById('bgm-toggle');
    if (btn) {
        const icon = btn.querySelector('i');
        if (icon) {
            if (state.settings.bgmEnabled) {
                icon.setAttribute('data-lucide', 'volume-2');
                if (state.engine?.gameInstance?.startBGM) state.engine.gameInstance.startBGM();
            } else {
                icon.setAttribute('data-lucide', 'volume-x');
                if (state.engine?.gameInstance?.stopBGM) state.engine.gameInstance.stopBGM();
            }
            if (window.lucide) window.lucide.createIcons();
        }
    }

    analytics.log('settings_change', { type: 'bgm', enabled: state.settings.bgmEnabled });
}

function toggleSFX() {
    state.settings.sfxEnabled = !state.settings.sfxEnabled;
    localStorage.setItem('sfx', state.settings.sfxEnabled);

    const btn = document.getElementById('sfx-toggle');
    if (btn) {
        const icon = btn.querySelector('i');
        if (icon) {
            if (state.settings.sfxEnabled) {
                icon.setAttribute('data-lucide', 'music');
            } else {
                icon.setAttribute('data-lucide', 'music-off');
            }
            if (window.lucide) window.lucide.createIcons();
        }
    }

    analytics.log('settings_change', { type: 'sfx', enabled: state.settings.sfxEnabled });
}

function toggleVibration() {
    state.settings.vibrationEnabled = !state.settings.vibrationEnabled;
    localStorage.setItem('vibration', state.settings.vibrationEnabled);

    // 테스트 진동 (설정 변경 시)
    if (state.settings.vibrationEnabled && navigator.vibrate) {
        navigator.vibrate(50);
    }

    analytics.log('settings_change', { type: 'vibration', enabled: state.settings.vibrationEnabled });
}

// Global actions binding
window.actions = actions;
window.state = state; // state를 전역으로 노출 (설정 모달에서 사용)
window.spawnDOMParticles = spawnDOMParticles;
window.shareResultCard = shareResultCard;
window.toggleBGM = toggleBGM;
window.toggleSFX = toggleSFX;
window.toggleVibration = toggleVibration;

// 명화 클립 같이 보기 토글
window.toggleMasterpieceClip = function(checked) {
    state.showMasterpieceClip = checked;
    localStorage.setItem('showMasterpieceClip', checked ? 'true' : 'false');
    console.log('명화 클립 같이 보기:', checked);
};

// 🎨 작품 감상 모달 (앱 내 - 쇼츠 스타일, 전체 화면)
window.openArtworkViewer = function (imageUrl) {
    const modal = document.getElementById('artworkModal');
    const modalVideo = document.getElementById('artworkModalVideo');
    const modalVideoSource = document.getElementById('artworkModalVideoSource');
    const modalImageContainer = document.getElementById('artworkModalImageContainer');
    const modalImage = document.getElementById('artworkModalImage');

    if (!modal) return;

    // 먼저 이미지를 보여줌 (즉시 표시)
    if (modalImageContainer) {
        modalImageContainer.classList.remove('hidden');
    }
    if (modalImage) {
        modalImage.src = imageUrl;
    }
    if (modalVideo) {
        modalVideo.classList.add('hidden');
    }

    // 비디오 파일이 있는지 확인 (이미지 URL에서 확장자 변경)
    const videoUrl = imageUrl.replace(/\.(jpg|jpeg|png|webp)$/i, '.mp4');

    // 비디오가 있으면 비디오 시도 (로드되면 전환)
    if (modalVideo && modalVideoSource) {
        // 비디오 시도
        modalVideoSource.src = videoUrl;
        modalVideo.load();

        modalVideo.onloadeddata = () => {
            // 비디오 로드 성공 시 비디오로 전환
            if (modalImageContainer) modalImageContainer.classList.add('hidden');
            modalVideo.classList.remove('hidden');
            modalVideo.play().catch(e => {
                console.log('비디오 재생 실패, 이미지 유지:', e);
                // 비디오 재생 실패 시 이미지 유지
                if (modalImageContainer) modalImageContainer.classList.remove('hidden');
                modalVideo.classList.add('hidden');
            });
        };

        modalVideo.onerror = () => {
            // 비디오 로드 실패, 이미지 유지 (이미 표시 중)
            console.log('비디오 없음, 이미지 사용');
        };
    }

    // 모달 표시 (앱 프레임 유지하면서 자연스럽게 확대)
    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        modal.style.opacity = '1';
    });

    // 아이콘 업데이트
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
};

// 작품 감상 모달 닫기
window.closeArtworkViewer = function () {
    const modal = document.getElementById('artworkModal');
    const modalVideo = document.getElementById('artworkModalVideo');

    if (!modal) return;

    // 비디오 정지
    if (modalVideo) {
        modalVideo.pause();
        modalVideo.currentTime = 0;
    }

    modal.classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);

    // Restore body scroll
    document.body.style.overflow = '';
};


// 🛡️ Back Button Defense
let backDefenseEnabled = false;

function enableBackDefense() {
    if (!backDefenseEnabled) {
        backDefenseEnabled = true;
        // Push a dummy state to history
        window.history.pushState({ preventBack: true }, '');
    }
}

function disableBackDefense() {
    backDefenseEnabled = false;
}

window.addEventListener('popstate', (event) => {
    if (backDefenseEnabled) {
        // Show confirmation modal
        const protectedSteps = ['TUNING', 'PLAYING'];
        if (protectedSteps.includes(state.currentStep)) {
            // Restore history state
            window.history.pushState({ preventBack: true }, '');

            // Show modal (Notion style)
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-white/95 flex items-center justify-center z-50 animate-fade-in px-6';
            modal.innerHTML = `
                <div class="bg-white border-3 border-black rounded-3xl p-8 max-w-sm w-full text-center animate-pop-in shadow-notion-lg">
                    <div class="w-24 h-24 mx-auto mb-4 rounded-3xl bg-red border-3 border-black shadow-notion flex items-center justify-center">
                        <div class="text-6xl">⚠️</div>
                    </div>
                    <h2 class="text-2xl font-black mb-3" style="color: var(--text-primary);">진짜 나갈 거예요?</h2>
                    <p class="mb-6 font-bold" style="color: var(--text-secondary);">지금까지 한 게 다 날아가요!</p>
                        <div class="flex gap-3">
                            <button id="stay-btn" class="flex-1 py-3 bg-green font-black rounded-xl border-2 border-black shadow-notion" style="color: var(--text-primary);">
                                계속 플레이
                            </button>
                            <button id="leave-btn" class="flex-1 py-3 bg-white font-black rounded-xl border-2 border-black shadow-notion" style="color: var(--text-primary);">
                                나갈래요
                            </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            analytics.log('back_defense_shown', { step: state.currentStep });

            document.getElementById('stay-btn').onclick = () => {
                modal.remove();
                analytics.log('back_defense_stay', { step: state.currentStep });
            };

            document.getElementById('leave-btn').onclick = () => {
                modal.remove();
                disableBackDefense();
                analytics.log('back_defense_leave', { step: state.currentStep });

                // Go to home or previous safe step
                if (state.currentStep === 'PLAYING') {
                    actions.quitGame();
                } else if (state.currentStep === 'TUNING') {
                    changeStep('INTRO');
                } else {
                    changeStep('HUB');
                }
            };
        }
    }
});

// 🛡️ 전역 에러 핸들러
window.addEventListener('error', (event) => {
    console.error('[Global Error]', event.error);
    analytics.log('error', {
        message: event.error?.message,
        stack: event.error?.stack?.substring(0, 200),
        step: state.currentStep
    });

    // 사용자에게 친절한 에러 메시지 (앱 프레임 안에 표시)
    const app = document.getElementById('app');
    if (app && !document.getElementById('error-toast')) {
        const toast = document.createElement('div');
        toast.id = 'error-toast';
        toast.className = 'absolute bottom-6 left-6 right-6 bg-red p-4 rounded-2xl border-2 border-black shadow-notion-lg animate-slide-up z-50';
        toast.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="text-3xl">😅</div>
                <div class="flex-1">
                    <div class="font-black mb-1" style="color: var(--text-primary);">일시적인 문제가 발생했어요</div>
                    <div class="text-sm font-bold" style="color: var(--text-primary);">잠시 후 다시 시도해주세요</div>
                </div>
                <button onclick="this.closest('#error-toast').remove()" 
                        class="w-8 h-8 rounded-lg bg-white border-2 border-black flex items-center justify-center">
                    <i data-lucide="x" width="16" style="color: var(--text-primary);"></i>
                </button>
            </div>
        `;
        app.appendChild(toast);
        if (window.lucide) window.lucide.createIcons();
        setTimeout(() => {
            if (toast.parentElement) toast.remove();
        }, 5000);
    }
});

// Promise rejection 처리
window.addEventListener('unhandledrejection', (event) => {
    console.error('[Unhandled Promise Rejection]', event.reason);
    analytics.log('promise_rejection', {
        reason: event.reason?.toString(),
        step: state.currentStep
    });
});

// 📡 온라인/오프라인 상태 감지
window.addEventListener('online', () => {
    const app = document.getElementById('app');
    if (app) {
        const toast = document.createElement('div');
        toast.className = 'absolute bottom-6 left-6 right-6 bg-green p-4 rounded-2xl border-2 border-black shadow-notion-lg animate-slide-up z-50';
        toast.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="text-2xl">✅</div>
                <div class="flex-1 font-black" style="color: var(--text-primary);">인터넷에 다시 연결되었어요</div>
            </div>
        `;
        app.appendChild(toast);
        setTimeout(() => {
            if (toast.parentElement) toast.remove();
        }, 3000);
        analytics.log('connection_restored');
    }
});

window.addEventListener('offline', () => {
    const app = document.getElementById('app');
    if (app) {
        const toast = document.createElement('div');
        toast.className = 'absolute bottom-6 left-6 right-6 bg-orange p-4 rounded-2xl border-2 border-black shadow-notion-lg animate-slide-up z-50';
        toast.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="text-2xl">📡</div>
                <div class="flex-1">
                    <div class="font-black mb-1" style="color: var(--text-primary);">인터넷 연결이 끊어졌어요</div>
                    <div class="text-sm font-bold" style="color: var(--text-primary);">게임은 계속 플레이할 수 있습니다</div>
                </div>
            </div>
        `;
        app.appendChild(toast);
        setTimeout(() => {
            if (toast.parentElement) toast.remove();
        }, 5000);
        analytics.log('connection_lost');
    }
});

// 🎨 에너지 충전 완료 토스트
window.showRechargeSuccess = () => {
    const app = document.getElementById('app');
    if (app) {
        const toast = document.createElement('div');
        toast.className = 'absolute top-24 left-6 right-6 bg-yellow p-6 rounded-3xl border-3 border-black shadow-notion-lg animate-bounce-in z-[100] text-center';
        toast.innerHTML = `
            <div class="text-4xl mb-2">⚡</div>
            <div class="font-black text-xl mb-1" style="color: var(--text-primary);">에너지 충전 완료!</div>
            <div class="text-sm font-bold" style="color: var(--text-primary);">오늘의 아티스트와 함께 마음이 더 단단해졌어요.</div>
        `;
        app.appendChild(toast);

        // 햅틱 피드백
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

        setTimeout(() => {
            toast.style.transition = 'all 0.5s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (toast.parentElement) toast.remove();
            }, 500);
        }, 4000);
    }
};

// Page Visibility API for session tracking
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        analytics.log('page_hidden', { step: state.currentStep });
        // 게임 중이면 자동으로 일시정지
        if (state.currentStep === 'PLAYING' && state.engine?.gameInstance && !state.engine.gameInstance.isPaused) {
            actions.togglePause();
        }
    } else {
        analytics.log('page_visible', { step: state.currentStep });
    }
});

// Session end tracking (before unload)
window.addEventListener('beforeunload', () => {
    analytics.log('session_end', {
        duration: analytics.getSessionDuration(),
        successRate: analytics.getSuccessRate(),
        totalActions: analytics.totalActions,
        gamesPlayed: analytics.gamesPlayed
    });
});

// ⌨️ 키보드 단축키
document.addEventListener('keydown', (e) => {
    // 🛠️ 개발 모드 토글: Shift + D
    if (e.shiftKey && e.code === 'KeyD') {
        e.preventDefault();
        state.devMode = !state.devMode;
        localStorage.setItem('devMode', state.devMode.toString());
        const btn = document.getElementById('dev-skip-btn');
        if (btn) {
            btn.classList.toggle('hidden', !state.devMode);
        }
        console.log('🛠️ 개발 모드:', state.devMode ? 'ON' : 'OFF');
        return;
    }

    // 게임 중 스페이스바로 일시정지
    if (e.code === 'Space' && state.currentStep === 'PLAYING') {
        e.preventDefault();
        actions.togglePause();
    }

    // ESC로 나가기
    if (e.code === 'Escape') {
        if (state.currentStep === 'PLAYING') {
            if (state.engine?.gameInstance?.isPaused) {
                actions.togglePause();
            } else {
                actions.quitGame();
            }
        }
    }

    // M 키로 BGM 토글
    if (e.code === 'KeyM' && state.currentStep === 'PLAYING') {
        toggleBGM();
    }

    // S 키로 SFX 토글
    if (e.code === 'KeyS' && state.currentStep === 'PLAYING') {
        toggleSFX();
    }
});

// 앱 시작 시 로컬 이미지(화가·명화) 미리 로드 — DOM 준비되는 즉시 시작
document.addEventListener('DOMContentLoaded', () => {
    preloadAllAppAssets();
});

// 접근성: Focus 표시
document.addEventListener('DOMContentLoaded', () => {
    // 탭 키 사용 시에만 focus outline 표시
    document.body.addEventListener('mousedown', () => {
        document.body.classList.add('using-mouse');
    });

    document.body.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.remove('using-mouse');
        }
    });
});

window.onload = () => {
    analytics.log('session_start', {
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language,
        bgmEnabled: state.settings.bgmEnabled,
        sfxEnabled: state.settings.sfxEnabled
    });

    // 🛠️ 개발 모드 버튼 초기화
    const devBtn = document.getElementById('dev-skip-btn');
    if (devBtn) {
        devBtn.classList.toggle('hidden', !state.devMode);
        if (state.devMode) {
            console.log('🛠️ 개발 모드 활성화됨 (Shift+D로 토글)');
        }
    }

    render();

    // 첫 방문 환영 메시지
    if (!localStorage.getItem('visited')) {
        setTimeout(() => {
            const app = document.getElementById('app');
            if (app) {
                const welcome = document.createElement('div');
                welcome.className = 'absolute bottom-6 left-6 right-6 bg-blue p-4 rounded-2xl border-2 border-black shadow-notion-lg animate-slide-up z-50';
                welcome.innerHTML = `
                    <div class="flex items-start gap-3">
                        <div class="text-3xl">👋</div>
                        <div class="flex-1">
                            <div class="font-black mb-1" style="color: var(--text-primary);">환영합니다!</div>
                            <div class="text-sm font-bold" style="color: var(--text-primary);">오늘 나와 함께할 아트 메이트를 찾아보세요</div>
                        </div>
                        <button onclick="this.closest('div').remove()" 
                                class="w-8 h-8 rounded-lg bg-white border-2 border-black flex items-center justify-center">
                            <i data-lucide="x" width="16" style="color: var(--text-primary);"></i>
                        </button>
                    </div>
                `;
                app.appendChild(welcome);
                if (window.lucide) window.lucide.createIcons();
                setTimeout(() => {
                    if (welcome.parentElement) welcome.remove();
                }, 5000);
                localStorage.setItem('visited', 'true');
            }
        }, 1000);
    }
};
