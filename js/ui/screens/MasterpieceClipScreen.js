// 명화 클립 화면 (리추얼 인트로)
import { getArtistColor } from '../utils.js';

export function MasterpieceClipScreen(p) {
    if (!p) return '<div>Loading...</div>';

    const artistColor = getArtistColor(p.id);

    return `<div class="h-full flex flex-col bg-white overflow-hidden" id="masterpiece-screen-container">
        <!-- 상단 헤더 (다른 화면과 동일한 스타일) -->
        <div class="p-3 bg-white border-b-2 border-black flex justify-between items-center flex-shrink-0 relative z-20">
            <button onclick="actions.goBackToResult()"
                    class="w-12 h-12 min-w-[48px] min-h-[48px] rounded-xl border-2 border-black bg-white flex items-center justify-center shadow-notion hover:bg-gray-50 transition-colors">
                <i data-lucide="arrow-left" width="24" style="color: var(--text-primary);"></i>
            </button>
            <span class="font-black text-lg" style="color: var(--text-primary);">명화로 마음 채우기</span>
            <div class="w-12"></div>
        </div>

        <!-- 컨텐츠 영역 -->
        <div class="flex-1 flex flex-col items-center px-6 py-6 overflow-y-auto">
            <!-- 작품 제목과 아티스트 -->
            <div class="text-center mb-6 flex-shrink-0">
                <div class="inline-block px-3 py-1 rounded-full text-xs font-black mb-2 animate-fade-in ${artistColor} border border-black/10" style="color: ${artistColor.includes('bg-red') || artistColor.includes('bg-blue') ? '#ffffff' : 'var(--text-primary)'};">
                    ${p.title}의 작품
                </div>
                <h1 class="text-2xl font-black leading-tight mb-2 font-serif text-slate-900" style="color: var(--text-primary);">${p.masterpieceTitle}</h1>
            </div>

            <!-- 작품 이미지 카드 (Notion Style) -->
            <div class="flex-1 flex items-center justify-center w-full min-h-0 mb-8 motion-safe:animate-fade-in">
                <div onclick="window.openArtworkViewer('${p.masterpieceImage}')" 
                     class="relative w-full max-w-[280px] aspect-[4/5] bg-slate-100 rounded-[32px] border-2 border-black shadow-notion-lg overflow-hidden group cursor-pointer transition-all duration-300 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0_rgba(0,0,0,1)]">
                    <img src="${p.masterpieceImage}" 
                         class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                         onerror="this.onerror=null; console.error('이미지 로드 실패:', '${p.masterpieceImage}'); this.style.display='none'; this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center bg-slate-50\\'><div class=\\'text-center text-slate-400\\'><div class=\\'text-6xl mb-4\\'>🖼️</div><div class=\\'text-sm\\'>이미지를 불러올 수 없습니다</div></div></div>';"
                         alt="${p.masterpieceTitle}">
                    
                    <!-- Play Button Overlay -->
                    <div class="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/0 transition-colors">
                        <div class="w-16 h-16 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-notion group-hover:scale-110 transition-all">
                            <i data-lucide="play" width="32" class="fill-black text-black ml-1"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 작품 설명 (Notion Card Style) -->
            <div class="w-full max-w-sm flex-shrink-0 animate-slide-up pt-4">
                <div class="bg-slate-50 border-2 border-black/5 rounded-3xl p-5 relative">
                    <div class="absolute -top-3 left-6 px-3 bg-white border border-black/10 rounded-full text-xs font-bold text-slate-400">ABOUT</div>
                    <p class="text-slate-700 text-lg leading-relaxed font-bold italic" style="color: var(--text-secondary);">
                        "${p.masterpieceDesc}"
                    </p>
                </div>
            </div>
        </div>
        
        <!-- 하단 버튼 영역 (ResultScreen과 동일 스타일) -->
        <div class="flex-shrink-0 px-6 pb-6 pt-2 bg-white">
            <button onclick="actions.startGame()" 
                    class="w-full py-5 min-h-[56px] rounded-2xl text-xl font-black border-2 border-black shadow-notion ${artistColor} hover:scale-[1.02] transition-transform"
                    style="color: ${artistColor.includes('bg-red') || artistColor.includes('bg-blue') ? '#ffffff' : 'var(--text-primary)'};">
                아트 게임 시작하기
            </button>
        </div>

        <!-- 작품 감상 모달 (여기는 몰입을 위해 다크모드 유지) -->
        <div id="artworkModal" class="absolute inset-0 z-[100] bg-black hidden opacity-0 transition-opacity duration-300 flex items-center justify-center overflow-hidden">
            <!-- 닫기 버튼 -->
            <button onclick="window.closeArtworkViewer()" 
                    class="absolute top-0 right-0 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white/30 transition-all m-4">
                <i data-lucide="x" width="24"></i>
            </button>
            
            <div class="relative w-full h-full flex items-center justify-center">
                <video id="artworkModalVideo" class="w-full h-full object-cover" autoplay loop muted playsinline>
                    <source id="artworkModalVideoSource" src="" type="video/mp4">
                </video>
                <div id="artworkModalImageContainer" class="absolute inset-0 w-full h-full overflow-hidden hidden">
                    <img id="artworkModalImage" src="" class="w-full h-full object-cover animate-pan-image" alt="작품 이미지">
                </div>
            </div>
            <div onclick="window.closeArtworkViewer()" class="absolute inset-0 cursor-pointer z-10"></div>
        </div>
        
        <style>
            @keyframes panImage {
                0% { transform: scale(1.1) translateY(0); }
                50% { transform: scale(1.15) translateY(-5%); }
                100% { transform: scale(1.1) translateY(0); }
            }
            .animate-pan-image { animation: panImage 15s ease-in-out infinite; }
        </style>
    </div>`;
}

