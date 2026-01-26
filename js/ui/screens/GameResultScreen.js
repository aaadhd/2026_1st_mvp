// 게임 결과 화면
import { ARTISTS_DB } from '../../data/artists.js';
import { state, analytics } from '../../core/state.js';

export function GameResultScreen() {
    const result = state.lastGameResult;
    const p = state.persona;

    // domain이 없으면 페르소나로부터 찾기
    let domain = state.currentDomain;
    if (!domain && p) {
        for (const [key, artists] of Object.entries(ARTISTS_DB)) {
            if (artists.some(a => a.id === p.id)) {
                domain = key;
                break;
            }
        }
    }

    if (!result || !p) return '<div>Loading...</div>';

    const playTime = Math.floor((analytics.getSessionDuration() || 60) / 60);
    const maxCombo = analytics.maxCombo || 0;

    return `<div class="h-full flex flex-col bg-white">
        <!-- Header with Menu -->
        <div class="absolute top-0 right-0 p-4 z-20">
            <button onclick="window.openSettingsModal()" 
                    class="w-10 h-10 rounded-xl border-2 border-black bg-white flex items-center justify-center shadow-notion hover:bg-gray-50 transition-colors">
                <i data-lucide="menu" width="20" style="color: var(--text-primary);"></i>
            </button>
        </div>
        
        <!-- 전체 스크롤 영역 -->
        <div class="flex-1 overflow-y-auto">
            <div class="px-6 pt-8 pb-8 text-center">
                <!-- Success Icon -->
                <div class="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <div class="text-5xl">${result.success ? '🎉' : '💪'}</div>
                </div>

                <!-- Title -->
                <p class="text-lg leading-relaxed mb-5 font-bold" style="color: var(--text-secondary);">
                    <span class="font-black text-xl" style="color: var(--text-primary);">${p.title}</span>와 함께<br/>
                    <span class="text-base">에너지를 충전했어요!</span>
                </p>
                
                <!-- 통계 카드 - 배경색 제거 -->
                <div class="grid grid-cols-2 gap-4 mb-5 max-w-xs mx-auto">
                    <div class="py-3">
                        <div class="text-2xl mb-1">🏆</div>
                        <div class="text-2xl font-black mb-1" style="color: var(--text-primary);">${result.level || 1}</div>
                        <div class="text-sm font-black" style="color: var(--text-secondary);">레벨</div>
                    </div>
                    <div class="py-3">
                        <div class="text-2xl mb-1">⭐</div>
                        <div class="text-2xl font-black mb-1" style="color: var(--text-primary);">${result.score || 0}</div>
                        <div class="text-sm font-black" style="color: var(--text-secondary);">점수</div>
                    </div>
                </div>
                
                ${result.level >= 3 ? `
                    <div class="bg-yellow p-4 mb-5 rounded-2xl max-w-sm mx-auto">
                        <div class="text-3xl mb-1">⚡</div>
                        <p class="text-base font-black" style="color: var(--text-primary);">
                            레벨 ${result.level}까지! 에너지가 넘쳐요!
                        </p>
                    </div>
                ` : ''}
                
                <!-- 🎮 추천 게임 섹션 - 버튼 스타일 -->
                ${domain && ARTISTS_DB[domain] ? `
                <div class="mb-6">
                    <h3 class="text-base font-black mb-3 flex items-center gap-2 justify-center" style="color: var(--text-primary);">
                        <span class="text-lg">⚡</span> 에너지 더 채우러 가볼까요?
                    </h3>
                    <div class="grid grid-cols-2 gap-2.5 max-w-sm mx-auto">
                        ${ARTISTS_DB[domain].filter(g => g.id !== p.id).slice(0, 4).map(g => `
                            <div onclick="actions.playNext('${g.id}')" class="bg-white p-3 rounded-xl border-2 border-black shadow-notion cursor-pointer flex flex-col items-center text-center hover:bg-gray-50 transition-colors active:scale-95">
                                <div class="text-2xl mb-1.5">${g.gameEmoji}</div>
                                <div class="font-black text-sm leading-tight mb-0.5" style="color: var(--text-primary);">${g.gameTitle}</div>
                                <div class="text-xs font-bold" style="color: var(--text-secondary);">${g.sub}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                <!-- Action Buttons - Notion Style -->
                <div class="space-y-2.5 pt-2 pb-4 max-w-sm mx-auto w-full">
                    <!-- 감정 일기 버튼 (메인) -->
                    <button onclick="actions.goToDiary()"
                            class="w-full py-3.5 font-black rounded-xl border-2 border-black shadow-notion bg-purple-400 text-lg"
                            style="color: var(--text-primary);">
                        오늘의 감정 일기 쓰기 📝
                    </button>
                    <div class="flex gap-2.5">
                        <button onclick="actions.startGame()"
                                class="flex-1 py-3 font-black rounded-xl border-2 border-black shadow-notion bg-green text-base"
                                style="color: var(--text-primary);">
                            한 판 더 🔄
                        </button>
                        <button onclick="actions.goBackToHub()"
                                class="flex-1 py-3 bg-white border-2 border-black font-black rounded-xl shadow-notion text-base"
                                style="color: var(--text-primary);">
                            아트 여정 목록
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}
