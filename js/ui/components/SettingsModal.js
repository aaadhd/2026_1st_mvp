// 설정 모달 컴포넌트
export function openSettingsModal() {
    const app = document.getElementById('app');
    if (!app) return;

    // state 가져오기
    const state = window.state;
    if (!state) {
        console.error('State not available');
        return;
    }

    // 기존 모달 제거
    const existing = document.getElementById('settings-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'settings-modal';
    modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in';
    modal.style.overflow = 'visible';
    modal.onclick = (e) => {
        if (e.target === modal) closeSettingsModal();
    };

    modal.innerHTML = `
        <div class="modal-stitched-container animate-pop-in" onclick="event.stopPropagation()">
            <!-- Ribbon Header -->
            <div class="modal-ribbon-wrapper">
                <div class="modal-ribbon">SETTINGS</div>
            </div>

            <!-- Close Button -->
            <div class="modal-close-btn-wrapper">
                <button onclick="window.closeSettingsModal()" class="modal-close-btn">
                    <i data-lucide="x" width="28" height="28"></i>
                </button>
            </div>

            <div class="modal-stitched-inner">
                 <!-- Settings Icons Grid -->
                <div class="settings-grid">
                    <!-- Music -->
                    <div class="setting-item" onclick="if(window.toggleBGM) window.toggleBGM(); setTimeout(() => window.updateSettingsUI(), 100);" id="bgm-toggle-btn">
                        <div class="setting-icon-circle ${state.settings.bgmEnabled ? '' : 'disabled'}">
                            <i data-lucide="${state.settings.bgmEnabled ? 'music' : 'music'}" width="32" style="color: ${state.settings.bgmEnabled ? '#E91E63' : '#757575'};"></i>
                        </div>
                        <span class="setting-label">Music</span>
                    </div>

                    <!-- SFX -->
                    <div class="setting-item" onclick="if(window.toggleSFX) window.toggleSFX(); setTimeout(() => window.updateSettingsUI(), 100);" id="sfx-toggle-btn">
                        <div class="setting-icon-circle ${state.settings.sfxEnabled ? '' : 'disabled'}">
                            <i data-lucide="${state.settings.sfxEnabled ? 'volume-2' : 'volume-x'}" width="32" style="color: ${state.settings.sfxEnabled ? '#000' : '#757575'};"></i>
                        </div>
                        <span class="setting-label">Sound Effect</span>
                    </div>

                    <!-- Vibration -->
                    <div class="setting-item" onclick="if(window.toggleVibration) window.toggleVibration(); setTimeout(() => window.updateSettingsUI(), 100);" id="vibration-toggle-btn">
                        <div class="setting-icon-circle ${state.settings.vibrationEnabled ? '' : 'disabled'}">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" class="lucide lucide-vibrate" stroke="${state.settings.vibrationEnabled ? '#1E88E5' : '#757575'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="m2 8 2 2-2 2"></path>
                                <path d="m22 8-2 2 2 2"></path>
                                <rect width="8" height="14" x="8" y="5" rx="1"></rect>
                            </svg>
                        </div>
                        <span class="setting-label">Vibration</span>
                    </div>
                </div>
                
                <!-- Navigation Buttons -->
                <div class="settings-nav-buttons">
                    <button onclick="window.goToNewArtMate()" class="settings-nav-btn">
                        <span>새로운 아트 메이트 찾기</span>
                    </button>
                    <button onclick="window.goToArtGameHub()" class="settings-nav-btn">
                        <span>아트 게임 모아보기</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    if (window.lucide) window.lucide.createIcons();
}

export function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (modal) {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.remove(), 300);
    }
}

// 설정 UI 업데이트 함수
export function updateSettingsUI() {
    const state = window.state;
    if (!state) {
        setTimeout(() => updateSettingsUI(), 100);
        return;
    }

    // Helper to update state
    const updateState = (btnId, isEnabled, updateIconFn) => {
        const btn = document.getElementById(btnId);
        if (!btn) return;

        const circle = btn.querySelector('.setting-icon-circle');
        if (circle) {
            if (isEnabled) circle.classList.remove('disabled');
            else circle.classList.add('disabled');
        }

        updateIconFn(btn, isEnabled);
    };

    // BGM
    updateState('bgm-toggle-btn', state.settings.bgmEnabled, (btn, enabled) => {
        const icon = btn.querySelector('i[data-lucide]');
        if (icon) {
            icon.style.color = enabled ? '#E91E63' : '#757575';
            // Icon stays 'music' for both states in new design logic, just color change
            if (window.lucide) window.lucide.createIcons();
        }
    });

    // SFX
    updateState('sfx-toggle-btn', state.settings.sfxEnabled, (btn, enabled) => {
        const icon = btn.querySelector('i[data-lucide]');
        if (icon) {
            // Use volume-2 for enabled, volume-x for disabled
            icon.setAttribute('data-lucide', enabled ? 'volume-2' : 'volume-x');
            icon.style.color = enabled ? '#000' : '#757575';
            if (window.lucide) window.lucide.createIcons();
        }
    });

    // Vibration
    updateState('vibration-toggle-btn', state.settings.vibrationEnabled, (btn, enabled) => {
        const svg = btn.querySelector('svg');
        if (svg) {
            svg.setAttribute('stroke', enabled ? '#1E88E5' : '#757575');
        }
    });
}

// 전역 함수로 등록
if (typeof window !== 'undefined') {
    window.openSettingsModal = openSettingsModal;
    window.closeSettingsModal = closeSettingsModal;
    window.updateSettingsUI = updateSettingsUI;
}
