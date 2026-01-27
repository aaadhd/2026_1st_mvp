// 메뉴 모달 컴포넌트
export function openMenuModal() {
    const app = document.getElementById('app');
    if (!app) return;

    // 기존 모달 제거
    const existing = document.getElementById('menu-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'menu-modal';
    modal.className = 'absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in';
    modal.onclick = (e) => {
        if (e.target === modal) closeMenuModal();
    };

    modal.innerHTML = `
        <div class="bg-white rounded-3xl border-3 border-black shadow-notion-lg max-w-sm w-full mx-4 animate-pop-in relative" onclick="event.stopPropagation()">
            <!-- SETTINGS 배너 -->
            <div class="bg-blue px-6 py-3 rounded-t-3xl border-b-3 border-black relative">
                <h2 class="text-xl font-black text-white text-center">메뉴</h2>
                <!-- 우상단 X 버튼 -->
                <button onclick="window.closeMenuModal()" 
                        class="absolute top-3 right-3 w-12 h-12 min-w-[48px] min-h-[48px] bg-white rounded-xl border-2 border-black shadow-notion flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <i data-lucide="x" width="24" style="color: var(--text-primary);"></i>
                </button>
            </div>
            
            <!-- 메뉴 항목 -->
            <div class="p-6 space-y-3">
                <!-- 설정 (뮤직, 사운드이펙트, 진동) -->
                <button onclick="window.openSettingsModal(); window.closeMenuModal();" 
                        class="w-full py-4 px-4 bg-white rounded-2xl border-2 border-black shadow-notion flex items-center gap-3 hover:bg-gray-50 transition-colors active:scale-95">
                    <div class="text-3xl">⚙️</div>
                    <div class="flex-1 text-left">
                        <div class="font-black text-base" style="color: var(--text-primary);">설정</div>
                        <div class="text-sm font-bold" style="color: var(--text-secondary);">뮤직, 사운드이펙트, 진동</div>
                    </div>
                </button>
                
                <!-- 다시 테스트하기 -->
                <button onclick="actions.startTuning(); window.closeMenuModal();" 
                        class="w-full py-4 px-4 bg-white rounded-2xl border-2 border-black shadow-notion flex items-center gap-3 hover:bg-gray-50 transition-colors active:scale-95">
                    <div class="text-3xl">🔄</div>
                    <div class="flex-1 text-left">
                        <div class="font-black text-base" style="color: var(--text-primary);">다시 테스트하기</div>
                        <div class="text-sm font-bold" style="color: var(--text-secondary);">새로운 아트 메이트를 찾아보세요</div>
                    </div>
                </button>
                
                <!-- 아트 게임 모아보기 -->
                <button onclick="actions.goToHub(); window.closeMenuModal();" 
                        class="w-full py-4 px-4 bg-white rounded-2xl border-2 border-black shadow-notion flex items-center gap-3 hover:bg-gray-50 transition-colors active:scale-95">
                    <div class="text-3xl">🎮</div>
                    <div class="flex-1 text-left">
                        <div class="font-black text-base" style="color: var(--text-primary);">아트 게임 모아보기</div>
                        <div class="text-sm font-bold" style="color: var(--text-secondary);">다양한 아트 게임을 탐색해보세요</div>
                    </div>
                </button>
            </div>
        </div>
    `;

    app.appendChild(modal);
    if (window.lucide) window.lucide.createIcons();
}

export function closeMenuModal() {
    const modal = document.getElementById('menu-modal');
    if (modal) {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.remove(), 300);
    }
}

// 전역 함수로 등록
if (typeof window !== 'undefined') {
    window.openMenuModal = openMenuModal;
    window.closeMenuModal = closeMenuModal;
}
