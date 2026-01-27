// 명화 클립 화면 (리추얼 인트로)
export function MasterpieceClipScreen(p) {
    if (!p) return '<div>Loading...</div>';

    return `<div class="h-full flex flex-col bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 relative text-white overflow-y-auto scroll-safe-bottom" id="masterpiece-screen-container">
        <!-- Close Button (게임 플레이와 동일한 상단 간격) -->
        <div class="absolute top-0 left-0 z-20 p-3">
            <button onclick="actions.goBackToResult()"
                    class="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-black/50 backdrop-blur flex items-center justify-center border border-white/30 hover:bg-black/70 transition-colors">
                <i data-lucide="arrow-left" width="24" class="flex-shrink-0"></i>
            </button>
        </div>

        <!-- 컨텐츠 영역 (게임 플레이와 동일한 상단 기준) -->
        <div class="flex-1 flex flex-col items-center p-6 pt-4 pb-6 animate-fade-in overflow-y-auto">
            <div class="w-full max-w-sm mx-auto flex flex-col h-full">
                <!-- 작품 제목과 아티스트 -->
                <div class="text-center mb-4 pt-2">
                    <div class="text-base font-bold text-stone-400 mb-2 tracking-widest uppercase">${p.title}의 작품</div>
                    <h1 class="text-2xl font-black text-white leading-tight mb-2 font-serif">${p.masterpieceTitle}</h1>
                </div>

                <!-- 작품 이미지 - 터치하면 크게 보기 (크기 확대) -->
                <div class="relative w-full mx-auto flex-1 flex items-center justify-center min-h-0 mb-6">
                    <div onclick="window.openArtworkViewer('${p.masterpieceImage}')" class="relative w-full max-w-[320px] aspect-[3/4] bg-black rounded-3xl border-4 border-white/20 shadow-2xl overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-white/40">
                        <!-- Static Thumbnail (Masterpiece Image as background) -->
                        <img src="${p.masterpieceImage}" 
                             class="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500" 
                             onerror="this.onerror=null; console.error('이미지 로드 실패:', '${p.masterpieceImage}'); this.style.display='none'; this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center bg-stone-800\\'><div class=\\'text-center text-white/60\\'><div class=\\'text-6xl mb-4\\'>🖼️</div><div class=\\'text-sm\\'>이미지를 불러올 수 없습니다</div></div></div>';"
                             alt="${p.masterpieceTitle}">
                        
                        <!-- Play Button Overlay -->
                        <div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                            <div class="w-16 h-16 rounded-full bg-white/25 backdrop-blur-md border-2 border-white/60 flex items-center justify-center group-hover:bg-white/35 group-hover:scale-110 transition-all shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                                <i data-lucide="play" width="32" class="fill-white text-white ml-1"></i>
                            </div>
                        </div>
                        <div class="absolute bottom-4 left-0 right-0 text-center">
                            <p class="text-white font-semibold text-base drop-shadow-lg bg-black/30 px-4 py-2 rounded-full inline-block backdrop-blur-sm">터치해서 감상하기</p>
                        </div>
                    </div>
                </div>

                <!-- 작품 설명 (아래로 배치) -->
                <div class="px-2 mb-4">
                    <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                        <p class="text-stone-200 text-lg leading-relaxed font-medium">
                            ${p.masterpieceDesc}
                        </p>
                    </div>
                </div>
                
                <!-- 하단 액션 버튼 (아래로 배치) -->
                <div class="pt-2 pb-4">
                    <button onclick="actions.startGame()" 
                            class="w-full py-4 px-6 min-h-[52px] bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-semibold text-lg hover:bg-white/20 transition-all shadow-lg">
                        아트 게임 시작하기
                    </button>
                </div>
            </div>
        </div>

        <!-- 작품 감상 모달 (앱 프레임 내에서만 전체 화면) -->
        <div id="artworkModal" class="absolute inset-0 z-[100] bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 hidden opacity-0 transition-opacity duration-300 flex items-center justify-center overflow-hidden">
            <!-- 닫기 버튼 (게임 플레이와 동일한 상단 간격) -->
            <button onclick="window.closeArtworkViewer()" 
                    class="absolute top-0 right-0 z-20 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border-2 border-white/30 text-white flex items-center justify-center hover:bg-black/80 transition-all shadow-lg m-3">
                <i data-lucide="x" width="24"></i>
            </button>
            
            <!-- 비디오 컨테이너 (앱 프레임 내에서 전체 화면 느낌) -->
            <div class="relative w-full h-full flex items-center justify-center">
                <!-- 실제 비디오가 있으면 사용, 없으면 이미지를 영상처럼 -->
                <video id="artworkModalVideo" 
                       class="w-full h-full object-cover" 
                       autoplay 
                       loop 
                       muted 
                       playsinline
                       style="width: 100%; height: 100%; object-fit: cover;">
                    <source id="artworkModalVideoSource" src="" type="video/mp4">
                </video>
                
                <!-- 비디오가 없을 경우 이미지 (자동 스크롤 효과) -->
                <div id="artworkModalImageContainer" class="absolute inset-0 w-full h-full overflow-hidden hidden">
                    <img id="artworkModalImage" 
                         src="" 
                         class="w-full h-full object-cover animate-pan-image" 
                         style="width: 100%; height: 100%; object-fit: cover;"
                         onerror="console.error('모달 이미지 로드 실패:', this.src);"
                         alt="작품 이미지">
                </div>
            </div>
            
            <!-- 클릭 오버레이로 닫기 -->
            <div onclick="window.closeArtworkViewer()" class="absolute inset-0 cursor-pointer z-10"></div>
        </div>
        
        <style>
            @keyframes panImage {
                0% {
                    transform: scale(1.2) translateY(0) translateX(0);
                }
                20% {
                    transform: scale(1.2) translateY(-8%) translateX(-2%);
                }
                40% {
                    transform: scale(1.2) translateY(-12%) translateX(-4%);
                }
                60% {
                    transform: scale(1.2) translateY(-8%) translateX(-2%);
                }
                80% {
                    transform: scale(1.2) translateY(-4%) translateX(0);
                }
                100% {
                    transform: scale(1.2) translateY(0) translateX(0);
                }
            }
            .animate-pan-image {
                animation: panImage 15s ease-in-out infinite;
            }
        </style>
    </div>`;
}
