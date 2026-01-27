// --- 데이터 분석 시스템 (Analytics) ---
export const analytics = {
    sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    sessionStart: Date.now(),
    events: [],

    // Session Data
    screeningStartTime: null,
    gameStartTime: null,
    maxCombo: 0,
    totalActions: 0,
    gamesPlayed: 0,
    gamesSucceeded: 0,

    log(eventName, params = {}) {
        const event = {
            name: eventName,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            ...params
        };

        this.events.push(event);

        // Console logging for development
        console.log('[Analytics]', eventName, params);

        // 🔗 External Analytics Integration (Google Analytics 4)
        if (window.gtag) {
            window.gtag('event', eventName, params);
        }

        // 🔗 Mixpanel (if integrated)
        if (window.mixpanel) {
            window.mixpanel.track(eventName, params);
        }

        // 📊 Local Storage Backup
        try {
            const stored = JSON.parse(localStorage.getItem('analytics_events') || '[]');
            stored.push(event);
            // Keep last 1000 events
            if (stored.length > 1000) stored.shift();
            localStorage.setItem('analytics_events', JSON.stringify(stored));
        } catch (e) {
            console.warn('Analytics storage failed:', e);
        }
    },

    // Helper Methods
    getSessionDuration() {
        return (Date.now() - this.sessionStart) / 1000; // seconds
    },

    getSuccessRate() {
        return this.gamesPlayed > 0 ? (this.gamesSucceeded / this.gamesPlayed) * 100 : 0;
    },

    exportData() {
        return {
            sessionId: this.sessionId,
            duration: this.getSessionDuration(),
            events: this.events,
            metrics: {
                screeningDuration: this.screeningStartTime ? (this.gameStartTime - this.screeningStartTime) / 1000 : 0,
                totalActions: this.totalActions,
                gamesPlayed: this.gamesPlayed,
                successRate: this.getSuccessRate(),
                maxCombo: this.maxCombo
            }
        };
    }
};

// Expose analytics globally
window.logAnalytics = analytics.log.bind(analytics);

// --- 전역 상태 (Global State) ---
export const state = {
    currentStep: 'INTRO',
    persona: null,
    currentLevel: 1,
    totalScore: 0,
    currentDomain: null, // 현재 플레이 중인 영역 (EMOTION, COGNITION, SOCIAL, SENSORY)
    lastGameResult: null, // 마지막 게임 결과 저장
    currentHubTab: 'ALL', // Hub 화면의 현재 탭 (ALL, EMOTION, COGNITION, SOCIAL, SENSORY)

    tuningStep: 1,
    tuningWeights: { EMOTION: 0, COGNITION: 0, SOCIAL: 0, SENSORY: 0 },

    // Engine Instance
    engine: null,

    // 🔊 Sound Settings
    settings: {
        bgmEnabled: localStorage.getItem('bgm') !== 'false',
        sfxEnabled: localStorage.getItem('sfx') !== 'false',
        vibrationEnabled: localStorage.getItem('vibration') !== 'false',
        volume: parseFloat(localStorage.getItem('volume') || '0.7')
    },
    
    // 🛠️ 개발 모드
    devMode: localStorage.getItem('devMode') === 'true',
    
    // 명화 클립 같이 보기 설정
    showMasterpieceClip: (() => {
        const stored = localStorage.getItem('showMasterpieceClip');
        return stored === null ? true : stored === 'true'; // 기본값은 true
    })()
};
