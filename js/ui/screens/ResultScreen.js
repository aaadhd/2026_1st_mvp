// 결과 화면 (오늘의 아트 메이트)
import { ARTISTS_DB } from '../../data/artists.js';
import { formatMatchReason } from '../utils.js';

export function ResultScreen(p) {
    // Map artist to vibrant color
    const colorMap = {
        'EMOTION': 'bg-red',
        'COGNITION': 'bg-blue',
        'SOCIAL': 'bg-green',
        'SENSORY': 'bg-yellow'
    };
    let artistColor = 'bg-blue';
    for (const [domain, artists] of Object.entries(ARTISTS_DB)) {
        if (artists.some(a => a.id === p.id)) {
            artistColor = colorMap[domain];
            break;
        }
    }

    return `<div class="h-full flex flex-col bg-white overflow-y-auto">
        <!-- Header with Menu -->
        <div class="absolute top-0 right-0 p-4 z-20">
            <button onclick="window.openSettingsModal()" 
                    class="w-10 h-10 rounded-xl border-2 border-black bg-white flex items-center justify-center shadow-notion hover:bg-gray-50 transition-colors">
                <i data-lucide="menu" width="20" style="color: var(--text-primary);"></i>
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
                
                <!-- 메인 버튼: 함께 아트 여정 시작하기 -->
                <button onclick="actions.startLevelIntro()" 
                        class="w-full max-w-xs py-5 rounded-2xl text-xl font-black border-2 border-black shadow-notion ${artistColor} mb-6 relative hover:scale-105 transition-transform"
                        style="color: var(--text-primary);">
                    <div class="absolute -top-3 -right-3 bg-red text-white text-base font-bold px-3 py-1.5 rounded-full border-2 border-black transform rotate-12">
                        BEST!
                    </div>
                    함께 여정 떠나기 🚀
                </button>
                
                <div class="h-4"></div> <!-- Spacer after main button -->
                
                <!-- 하단 액션 (공유 / 다시하기 / 둘러보기) -->
                <div class="w-full max-w-xs flex flex-col gap-3">
                    <div class="flex gap-3">
                        <button onclick="shareResultCard()" 
                                class="flex-1 py-3 bg-white border-2 border-black rounded-xl text-base font-bold shadow-notion flex items-center justify-center gap-2"
                                style="color: var(--text-primary);">
                            <i data-lucide="share-2" width="16"></i> 친구에게 공유
                        </button>
                        <button onclick="actions.goToHub()" 
                                class="flex-1 py-3 bg-white border-2 border-black rounded-xl text-base font-bold shadow-notion"
                                style="color: var(--text-primary);">
                            다음 충전 장소 탐색
                        </button>
                    </div>
                    
                    <button onclick="actions.startTuning()" 
                            class="w-full py-3 text-stone-400 text-base font-bold underline hover:text-stone-600 transition-colors">
                        테스트 다시 하기 ↻
                    </button>
                </div>
            </div>
        </div>
    </div>`;
}
