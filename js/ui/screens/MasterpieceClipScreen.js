// 명화 클립 화면 (리추얼 인트로)
import { getArtistColor } from '../utils.js';

export function MasterpieceClipScreen(p) {
    if (!p) return '<div>Loading...</div>';

    const artistColor = getArtistColor(p.id);

    return `<div class="h-full flex flex-col bg-[#0a0a0a] overflow-hidden animate-fade-in" id="masterpiece-screen-container">
        <!-- 상단 헤더 제거 (몰입감 극대화) -->
        <div class="p-3 flex-shrink-0 relative z-20">
            <!-- Header elements removed for immersion -->
        </div>

        <!-- 컨텐츠 영역 -->
        <div class="flex-1 flex flex-col items-center px-6 pt-10 pb-6 overflow-y-auto relative">
            <!-- Spotlight Effect Background -->
            <div class="absolute inset-x-0 top-1/4 h-1/2 bg-gradient-to-b from-white/5 to-transparent blur-3xl rounded-full pointer-events-none"></div>

            <!-- 작품 제목과 아티스트 -->
            <div class="text-center mb-6 flex-shrink-0 relative z-10">
                <div class="inline-block px-4 py-1.5 rounded-full text-[11px] font-black mb-3 animate-fade-in bg-white/10 border border-white/10 text-white/50 uppercase tracking-widest">
                    ${p.title}의 명화
                </div>
                <h1 class="text-2xl font-black leading-tight mb-2 font-serif text-white tracking-tight">${p.masterpieceTitle}</h1>
            </div>

            <!-- 작품 이미지 카드 (Spotlight Style) - 크기 10% 확대 -->
            <div class="flex-1 flex items-center justify-center w-full min-h-[250px] mb-8 motion-safe:animate-fade-in relative z-10">
                <div onclick="window.openArtworkViewer('${p.masterpieceImage}')" 
                     class="relative w-full max-w-[245px] aspect-[4/5] bg-neutral-900 rounded-[36px] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden group cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:border-white/40">
                    <img src="${p.masterpieceImage}" 
                         class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                         onerror="this.onerror=null; console.error('이미지 로드 실패:', '${p.masterpieceImage}'); this.style.display='none'; this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center bg-neutral-800\\'><div class=\\'text-center text-neutral-500\\'><div class=\\'text-6xl mb-4\\'>🖼️</div><div class=\\'text-sm\\'>이미지를 불러올 수 없습니다</div></div></div>';"
                         alt="${p.masterpieceTitle}">
                    
                    <!-- Play Button Overlay -->
                    <div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-colors">
                        <div class="w-18 h-18 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                            <i data-lucide="play" width="36" class="fill-white text-white ml-1.5"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 작품 설명 (Elegant Dark Card) - 폰트 크기 및 패딩 확대 -->
            <div class="w-full max-w-sm flex-shrink-0 animate-slide-up pt-6 relative z-10">
                <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[32px] p-6 relative">
                    <div class="absolute -top-3 left-8 px-4 py-1 bg-[#111] border border-white/10 rounded-full text-[10px] font-black tracking-widest text-white/40">ABOUT</div>
                    <p class="text-white/90 text-[1.15rem] leading-relaxed font-bold italic text-center">
                        "${p.masterpieceDesc}"
                    </p>
                </div>
            </div>
        </div>
        
        <!-- 하단 버튼 영역 -->
        <div class="flex-shrink-0 px-6 pb-8 pt-4 bg-gradient-to-t from-black to-transparent">
            <button onclick="actions.startGame()" 
                    class="w-full py-5 min-h-[60px] rounded-2xl text-xl font-black border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] ${artistColor} hover:scale-[1.02] transition-transform active:scale-95"
                    style="color: ${artistColor.includes('bg-red') || artistColor.includes('bg-blue') ? '#ffffff' : 'var(--text-primary)'};">
                아트 게임 시작하기
            </button>
        </div>

        <!-- 작품 감상 모달 (여기는 몰입을 위해 기존 다크모드 유지) -->
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
