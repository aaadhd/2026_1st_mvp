// 인트로 화면
export function IntroScreen() {
    return `<div class="h-full flex flex-col p-8 items-center justify-center relative text-center bg-white">
            <!-- Playful character illustration -->
            <div class="mb-6 flex items-center gap-3">
                <div class="icon-circle bg-blue" style="animation: bounce 2s infinite;">🎨</div>
                <div class="icon-circle bg-yellow rotate-slight" style="animation: bounce 2s infinite 0.2s;">✨</div>
                <div class="icon-circle bg-red rotate-slight-reverse" style="animation: bounce 2s infinite 0.4s;">🖌️</div>
            </div>
            
            <h1 class="text-[clamp(2.5rem,11vw,3.75rem)] font-black mb-3 tracking-tight font-serif" style="color: var(--text-primary);">신나는 그림약방</h1>
            <p class="text-2xl font-black mb-2" style="color: var(--text-secondary);">Art & Soul Pharmacy</p>
            <p class="text-lg mb-10 px-4" style="color: var(--text-secondary);">하루를 즐겁게 채우는 내 마음 맞춤 아트</p>
            
            <button onclick="actions.startTuning()" class="btn-play text-xl px-8 py-5 min-h-[56px] bg-blue">
                <i data-lucide="sparkles" width="24"></i> 오늘의 아트 세션 시작
            </button>
            

            
            <style>
                @keyframes bounce {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(5deg); }
                }
            </style>
            </div>`;
}
