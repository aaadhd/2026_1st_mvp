// 결과 화면 (오늘의 아트 메이트)
import { formatMatchReason, getArtistColor, getKoreanParticle, getArtistNameOnly } from '../utils.js';

export function ResultScreen(p) {
    const artistColor = getArtistColor(p.id);

    return `<div class="h-full flex flex-col bg-white">
        <!-- 상단 헤더 -->
        <div class="p-3 bg-white border-b-2 border-black flex justify-between items-center flex-shrink-0">
            <div class="w-12"></div>
            <span class="font-black text-lg flex items-center gap-2" style="color: var(--text-primary);">
                <span class="text-2xl">${p.artistEmoji}</span>
                <span>오늘의 아트 메이트</span>
            </span>
            <button onclick="window.openMenuModal()" 
                    class="w-12 h-12 min-w-[48px] min-h-[48px] rounded-xl border-2 border-black bg-white flex items-center justify-center shadow-notion hover:bg-gray-50 transition-colors">
                <i data-lucide="menu" width="24" style="color: var(--text-primary);"></i>
            </button>
        </div>
        
        <!-- 컨텐츠 영역 (flex-1로 남은 공간 채움, 세로 중앙 정렬) -->
        <div class="flex-1 flex flex-col items-center justify-center px-6 py-4 overflow-y-auto">
            <!-- Artist Image -->
            <div class="relative w-40 h-40 mb-4 rotate-slight flex-shrink-0">
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
            
            <!-- 제목 및 설명 -->
            <h2 class="text-3xl font-black mb-4 leading-tight font-serif text-center" style="color: var(--text-primary);">${p.title}</h2>
            <p class="text-lg leading-relaxed mb-4 px-2 text-center" style="color: var(--text-secondary);">${formatMatchReason(p.matchReason)}</p>
        </div>
        
        <!-- 하단 버튼 영역 (고정 위치) -->
        <div class="flex-shrink-0 px-6 pb-6 pt-2 bg-white">
            <!-- 루틴 스텝 설명 -->
            <div class="flex justify-center mb-2">
                <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-black/10">
                    <span class="text-sm font-bold" style="color: var(--text-secondary);">🎬 그림 감상</span>
                    <span class="text-sm" style="color: var(--text-secondary);">→</span>
                    <span class="text-sm font-bold" style="color: var(--text-secondary);">🎮 아트 게임</span>
                </div>
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
    </div>`;
}

