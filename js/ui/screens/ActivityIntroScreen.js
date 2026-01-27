// 게임 인트로 화면
import { getArtistColor, getGameGuide, getKoreanParticle, getArtistNameOnly } from '../utils.js';

export function ActivityIntroScreen(p) {
    const artistColor = getArtistColor(p.id);
    const guide = getGameGuide(p.mechanic);

    return `<div class="h-full flex flex-col bg-white">
        <!-- Header with back button - Notion Style -->
        <div class="px-6 py-4 bg-white border-b-2 border-black flex flex-col gap-2">
            <div class="flex justify-between items-center">
                <button onclick="actions.goBackToCompanion()" class="w-12 h-12 min-w-[48px] min-h-[48px] rounded-xl border-2 border-black bg-white flex items-center justify-center shadow-notion">
                    <i data-lucide="arrow-left" width="24" style="color: var(--text-primary);"></i>
                </button>
                <span class="font-black text-lg" style="color: var(--text-primary);">${p.gameTitle}</span>
                <div class="w-10"></div>
            </div>
            <!-- 진행 상태 표시 -->
            <div class="flex justify-center">
                <div class="px-4 py-1.5 bg-green-100 rounded-full border-2 border-green-400">
                    <span class="text-sm font-bold text-green-700">활동 2/3 • 🎮 게임</span>
                </div>
            </div>
        </div>
        
        <!-- Content - centered -->
        <div class="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <!-- Big emoji with border -->
            <div class="w-32 h-32 rounded-3xl ${artistColor} border-3 border-black shadow-notion-lg flex items-center justify-center mb-8 rotate-slight animate-bounce">
                <div class="text-7xl">${p.gameEmoji}</div>
            </div>
            
            <h2 class="text-4xl font-black mb-4" style="color: var(--text-primary);">${p.gameTitle}</h2>
            <p class="text-lg font-black mb-8" style="color: var(--text-secondary);">${(() => {
                const artistName = getArtistNameOnly(p.title);
                return artistName + getKoreanParticle(artistName) + ' 함께';
            })()}</p>
            
            <!-- 조작 가이드 - 심플하게 -->
            <div class="bg-white rounded-2xl border-2 border-black px-5 py-3 mb-8 max-w-sm">
                <p class="text-base font-black" style="color: var(--text-primary);">${guide}</p>
            </div>
            
            <button onclick="actions.startGame()" 
                    class="w-full max-w-sm py-4 text-xl font-black rounded-2xl border-2 border-black shadow-notion ${artistColor}"
                    style="color: var(--text-primary);">
                놀러가기 🚀
            </button>
        </div>
    </div>`;
}
