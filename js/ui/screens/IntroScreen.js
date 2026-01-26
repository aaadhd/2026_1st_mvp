// 인트로 화면
export function IntroScreen() {
    return `<div class="h-full flex flex-col p-8 items-center justify-center relative text-center bg-white">
            <!-- Playful character illustration -->
            <div class="mb-6 flex items-center gap-3">
                <div class="icon-circle bg-blue" style="animation: bounce 2s infinite;">🎨</div>
                <div class="icon-circle bg-yellow rotate-slight" style="animation: bounce 2s infinite 0.2s;">✨</div>
                <div class="icon-circle bg-red rotate-slight-reverse" style="animation: bounce 2s infinite 0.4s;">🖌️</div>
            </div>
            
            <h1 class="text-6xl font-black mb-3 tracking-tight font-serif" style="color: var(--text-primary);">PLAY</h1>
            <p class="text-2xl font-black mb-2" style="color: var(--text-secondary);">Art & Soul Pharmacy</p>
            <p class="text-lg mb-10 px-4" style="color: var(--text-secondary);">예술과 함께 떠나는 에너지 충전 여정</p>
            
            <button onclick="actions.startTuning()" class="btn-play text-xl px-8 py-5 bg-blue">
                <i data-lucide="sparkles" width="24"></i> 에너지 충전 여정 시작하기
            </button>
            
            <div class="absolute bottom-8 text-xs font-bold" style="color: var(--text-secondary);">v3.1.1 Notion Edition</div>
            
            <style>
                @keyframes bounce {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(5deg); }
                }
            </style>
            </div>`;
}
