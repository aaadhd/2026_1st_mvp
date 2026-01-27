// 명화 상세 화면
export function MasterpieceScreen(p) {
    if (!p) return '<div>Loading...</div>';

    return `<div class="h-full flex flex-col bg-stone-900 relative">
        <!-- Close Button (게임 플레이와 동일한 상단 간격) -->
        <div class="absolute top-0 right-0 z-20 p-3">
            <button onclick="actions.goBackToResult()" 
                    class="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center border border-white/30">
                <i data-lucide="x" width="24"></i>
            </button>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto w-full h-full flex flex-col">
            <!-- Full width Image -->
            <div class="w-full min-h-[50vh] relative">
                <img id="masterpiece-img" 
                     src="${p.masterpieceImage}" 
                     class="w-full h-full object-contain bg-stone-900"
                     onerror="
                        const img = this;
                        const basePath = '${p.masterpieceImage}'.replace(/\\.(jpg|jpeg|png|webp)$/i, '');
                        const webpPath = basePath + '.webp';
                        if (img.src !== webpPath) {
                            img.src = webpPath;
                        } else {
                            img.onerror = null;
                            console.error('이미지 로드 실패:', '${p.masterpieceImage}');
                            img.style.display = 'none';
                            img.parentElement.innerHTML = '<div class=\\'flex items-center justify-center h-full text-stone-400\\'><p>이미지를 불러올 수 없습니다</p></div>';
                        }
                     "
                     alt="${p.masterpieceTitle}"
                     style="max-height: 70vh;" />
            </div>

            <!-- Content -->
            <div class="flex-1 bg-white rounded-t-3xl -mt-6 relative z-10 px-6 pt-8 pb-10">
                <!-- Title & Artist -->
                <div class="mb-6">
                    <h2 class="text-2xl font-black mb-2 text-stone-900">${p.masterpieceTitle}</h2>
                    <div class="text-stone-500 font-bold">${p.title}</div>
                </div>

                <!-- Description Card -->
                <div class="p-5 bg-stone-50 rounded-2xl border-2 border-stone-200 mb-8">
                    <div class="text-3xl mb-3">❝</div>
                    <p class="text-lg font-medium leading-relaxed text-stone-700">
                        ${p.masterpieceDesc}
                    </p>
                    <div class="text-3xl text-right -mt-2">❞</div>
                </div>

                <!-- Action -->
                <button onclick="actions.goBackToResult()" 
                        class="w-full py-4 bg-stone-900 text-white rounded-xl font-bold text-lg">
                    닫기
                </button>
            </div>
        </div>
    </div>`;
}
