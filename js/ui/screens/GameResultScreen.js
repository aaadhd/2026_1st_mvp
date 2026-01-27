// 게임 결과 화면
import { ARTISTS_DB } from '../../data/artists.js';
import { state } from '../../core/state.js';
import { getArtistDomain, getKoreanParticle, getArtistNameOnly, DOMAIN_LABELS, DOMAIN_EMOJIS, DOMAIN_COLORS } from '../utils.js';

export function GameResultScreen() {
    const result = state.lastGameResult;
    const p = state.persona;

    // domain이 없으면 페르소나로부터 찾기
    const domain = state.currentDomain || (p ? getArtistDomain(p.id) : null);

    if (!result || !p) return '<div>Loading...</div>';

    return `<div class="h-full flex flex-col bg-white">
        <!-- Standard Header with Divider (Visual Consistency) -->
        <div class="p-4 bg-white border-b-2 border-black flex justify-between items-center flex-shrink-0">
            <div class="w-12"></div>
            <div class="flex-1"></div>
            <button onclick="window.openSettingsModal()" 
                    class="w-12 h-12 min-w-[48px] min-h-[48px] rounded-xl border-2 border-black bg-white flex items-center justify-center shadow-notion hover:bg-gray-50 transition-colors">
                <i data-lucide="menu" width="24" style="color: var(--text-primary);"></i>
            </button>
        </div>
        
        <!-- 전체 스크롤 영역 (게임 플레이와 동일한 상단 간격) -->
        <div class="flex-1 overflow-y-auto scroll-safe-bottom">
            <div class="px-6 text-center pt-6 pb-8">
                <!-- 게임 이모지 + 타이틀 (이미지 스타일) -->
                <div class="mb-8 mt-4">
                    <div class="w-28 h-28 mx-auto mb-6 flex items-center justify-center rounded-full bg-pink-100/80 border border-pink-200/60 shadow-inner">
                        <span class="text-6xl">${p.gameEmoji || '💪'}</span>
                    </div>
                    <h2 class="text-center font-black text-4xl mb-3" style="color: var(--text-primary);">게임 종료!</h2>
                    <p class="text-xl font-bold opacity-80" style="color: var(--text-secondary);">${(() => {
            const artistName = getArtistNameOnly(p.title);
            return p.title + getKoreanParticle(artistName) + ' 함께한 시간';
        })()}</p>
                </div>
                
                <!-- 통계 카드 - 배경색 제거 -->
                <div class="grid grid-cols-2 gap-6 mb-8 max-w-xs mx-auto">
                    <div class="py-4">
                        <div class="text-3xl mb-1">🏆</div>
                        <div class="text-3xl font-black mb-1" style="color: var(--text-primary);">${result.level || 1}</div>
                        <div class="text-base font-black opacity-60" style="color: var(--text-secondary);">레벨</div>
                    </div>
                    <div class="py-4">
                        <div class="text-3xl mb-1">⭐</div>
                        <div class="text-3xl font-black mb-1" style="color: var(--text-primary);">${result.score || 0}</div>
                        <div class="text-base font-black opacity-60" style="color: var(--text-secondary);">점수</div>
                    </div>
                </div>
                
                ${result.level >= 3 ? `
                    <div class="bg-yellow p-5 mb-8 rounded-2xl max-w-sm mx-auto shadow-notion">
                        <div class="text-4xl mb-2">⚡</div>
                        <p class="text-lg font-black" style="color: var(--text-primary);">
                            레벨 ${result.level}까지! 에너지가 넘쳐요!
                        </p>
                    </div>
                ` : ''}
                
                <!-- 다시 도전하기 버튼 -->
                <div class="mb-10 max-w-sm mx-auto">
                    <button onclick="actions.startGame()"
                            class="w-full py-5 min-h-[60px] font-black rounded-2xl border-2 border-black shadow-notion bg-black text-xl transition-transform active:scale-[0.98]"
                            style="color: #ffffff;">
                        한 번 더 하기 🔄
                    </button>
                </div>
                
                <hr class="border-t border-gray-100 mb-8 max-w-xs mx-auto">
                
                <!-- 🎮 추천 게임 섹션 -->
                ${domain && ARTISTS_DB[domain] ? `
                <div class="mb-6 pt-2 pb-6 bg-slate-50/50 rounded-3xl -mx-4 px-4 border border-slate-100/50">
                    <div class="px-6 mb-4 text-left">
                        <h3 class="text-xl font-black" style="color: var(--text-primary);">함께 즐기면 좋은 아트 게임</h3>
                    </div>
                    <div class="overflow-x-auto px-6 pb-2 -mx-2 px-2" style="scrollbar-width: none; -ms-overflow-style: none;">
                        <style>
                            .overflow-x-auto::-webkit-scrollbar { display: none; }
                        </style>
                        <div class="flex gap-3" style="width: max-content;">
                            ${ARTISTS_DB[domain].map(g => `
                                <div onclick="actions.playNext('${g.id}')" class="flex-shrink-0 w-32 bg-white rounded-xl border-2 border-black shadow-notion cursor-pointer flex flex-col overflow-hidden hover:bg-gray-50 transition-colors active:scale-95">
                                    <div class="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden flex-shrink-0">
                                        <img src="${g.artistImg || '/images/default-artist.jpg'}" 
                                             class="w-full h-full object-cover"
                                             onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center bg-gray-200\\'><div class=\\'text-3xl\\'>${g.gameEmoji}</div></div>';"
                                             alt="${g.gameTitle}">
                                        <div class="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                                            <span class="text-lg">${g.gameEmoji}</span>
                                        </div>
                                    </div>
                                    <div class="p-2 text-center flex-shrink-0">
                                        <div class="font-black text-sm leading-tight" style="color: var(--text-primary);">${g.gameTitle}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    </div>`;
}
