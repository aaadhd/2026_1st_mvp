// 결과 화면 (오늘의 아트 메이트)
import { formatMatchReason, getArtistColor, getKoreanParticle, getArtistNameOnly } from '../utils.js';

export function ResultScreen(p) {
    const artistColor = getArtistColor(p.id);

    return `<div class="h-full flex flex-col bg-white overflow-y-auto">
        <!-- Header with Menu -->
        <div class="absolute top-0 right-0 p-4 z-20">
            <button onclick="window.openSettingsModal()" 
                    class="w-12 h-12 min-w-[48px] min-h-[48px] rounded-xl border-2 border-black bg-white flex items-center justify-center shadow-notion hover:bg-gray-50 transition-colors">
                <i data-lucide="menu" width="24" style="color: var(--text-primary);"></i>
            </button>
        </div>
        
        <div id="result-card" class="min-h-full flex flex-col bg-white">
            <div class="relative pt-8 pb-6 flex flex-col items-center">
                <!-- Badge without box - clean and minimal -->
                <div class="inline-flex items-center gap-2 mb-4">
                    <span class="text-2xl">${p.artistEmoji}</span>
                    <span class="font-black" style="color: var(--text-secondary); font-size: 18px;">오늘의 아트 메이트</span>
                </div>
                
                <!-- Artist Image with playful rotation -->
                <div class="relative w-40 h-40 mb-4 rotate-slight">
                    <div class="w-full h-full rounded-3xl border-2 border-black ${artistColor} flex items-center justify-center shadow-notion-lg overflow-hidden">
                        <img src="${p.artistImg}" 
                             class="w-full h-full object-contain" 
                             crossorigin="anonymous" 
                             loading="lazy"
                             onload="this.style.opacity=1"
                             style="opacity:0; transition: opacity 0.3s"
                             onerror="this.parentElement.innerHTML='<div class=\\'text-7xl\\'>${p.artistEmoji}</div>'" />
                    </div>
                </div>
            </div>
            
            <div class="flex flex-col items-center px-6 pt-4 pb-6 text-center">
                <h2 class="text-3xl font-black mb-4 leading-tight font-serif" style="color: var(--text-primary);">${p.title}</h2>
                <p class="text-lg leading-relaxed mb-6 px-2" style="color: var(--text-secondary);">${formatMatchReason(p.matchReason)}</p>
                
                <!-- 메인 버튼: 화가와 아트 세션 시작하기 -->
                <div class="w-full max-w-xs mb-6">
                    <!-- 루틴 스텝 설명 (CTA 상단 고정) -->
                    <div class="inline-flex items-center gap-2 mb-1 px-3 py-1.5 bg-gray-50 rounded-lg border border-black/10">
                        <span class="text-sm font-bold" style="color: var(--text-secondary);">🎬 그림 감상</span>
                        <span class="text-sm" style="color: var(--text-secondary);">→</span>
                        <span class="text-sm font-bold" style="color: var(--text-secondary);">🎮 아트 게임</span>
                    </div>
                    
                    <button onclick="actions.startLevelIntro()" 
                            class="w-full py-5 min-h-[56px] rounded-2xl text-xl font-black border-2 border-black shadow-notion ${artistColor} relative hover:scale-105 transition-transform"
                            style="color: ${artistColor.includes('bg-red') || artistColor.includes('bg-blue') ? '#ffffff' : 'var(--text-primary)'};">
                        ${(() => {
                            const artistName = getArtistNameOnly(p.title);
                            return artistName + getKoreanParticle(artistName) + ' 아트 세션 시작하기';
                        })()}
                    </button>
                </div>
                
                <div class="h-4"></div> <!-- Spacer after main button -->
                
                <!-- 하단 액션 (선택 다시하기 / 둘러보기) -->
                <div class="w-full max-w-xs flex flex-col gap-3">
                    <div class="flex gap-3">
                        <button onclick="actions.startTuning()" 
                                class="flex-1 py-4 min-h-[48px] bg-white border-2 border-black rounded-xl text-base font-bold shadow-notion flex items-center justify-center gap-2"
                                style="color: var(--text-primary);">
                            <i data-lucide="refresh-cw" width="16"></i> 선택 다시하기
                        </button>
                        <button onclick="actions.goToHub()" 
                                class="flex-1 py-4 min-h-[48px] bg-white border-2 border-black rounded-xl text-base font-bold shadow-notion flex items-center justify-center"
                                style="color: var(--text-primary);">
                            아트 게임 모아보기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}
