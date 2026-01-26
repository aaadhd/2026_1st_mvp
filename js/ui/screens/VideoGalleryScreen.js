// 아트 갤러리 화면 (예술적인 레이아웃)
import { ARTISTS_DB } from '../../data/artists.js';
import { state } from '../../core/state.js';

export function VideoGalleryScreen(p) {
    const domains = {
        'EMOTION': '정서',
        'COGNITION': '인지',
        'SOCIAL': '사회',
        'SENSORY': '감각'
    };

    const categoryColors = {
        'EMOTION': 'bg-red',
        'COGNITION': 'bg-blue',
        'SOCIAL': 'bg-green',
        'SENSORY': 'bg-yellow'
    };

    const categoryEmojis = {
        'EMOTION': '❤️',
        'COGNITION': '🧠',
        'SOCIAL': '🤝',
        'SENSORY': '✨'
    };

    const currentTab = state.currentHubTab || 'ALL';

    // 데이터 가져오기 (전체 또는 탭별)
    let allArtists = [];
    if (currentTab === 'ALL') {
        allArtists = Object.values(ARTISTS_DB).flat();
    } else {
        allArtists = ARTISTS_DB[currentTab] || [];
    }

    // 현재 추천 아티스트 (p)가 목록에 있으면 최상단 노출을 위해 분리
    const featuredArtist = p && allArtists.find(a => a.id === p.id) ? p : allArtists[0];
    const otherArtists = allArtists.filter(a => a.id !== featuredArtist.id);

    return `<div class="h-full flex flex-col bg-stone-50 overflow-hidden relative">
        <!-- Decorative Background Blobs -->
        <div class="absolute top-[10%] -left-20 w-64 h-64 bg-purple/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-[20%] -right-20 w-80 h-80 bg-blue/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <!-- Header -->
        <div class="px-6 py-4 bg-stone-50/80 backdrop-blur-md border-b-2 border-black flex justify-between items-center sticky top-0 z-20">
            <button onclick="actions.goBackToCompanion()" class="w-10 h-10 rounded-xl border-2 border-black bg-white flex items-center justify-center shadow-notion hover:bg-stone-100 transition-colors">
                <i data-lucide="arrow-left" width="20" style="color: var(--text-primary);"></i>
            </button>
            <span class="font-black text-lg tracking-tight font-serif" style="color: var(--text-primary);">아트 갤러리</span>
            <button onclick="window.openSettingsModal()" 
                    class="w-10 h-10 rounded-xl border-2 border-black bg-white flex items-center justify-center shadow-notion hover:bg-stone-100 transition-colors">
                <i data-lucide="menu" width="20" style="color: var(--text-primary);"></i>
            </button>
        </div>

        <div class="flex-1 overflow-y-auto no-scrollbar pb-20">
            <!-- Tab Navigation - Subtle & Clean -->
            <div class="px-6 pt-6 pb-2">
                <div class="flex gap-2 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
                    <button onclick="actions.setHubTab('ALL')" 
                            class="flex-shrink-0 px-5 py-2 rounded-full border-2 border-black shadow-notion font-black text-sm ${currentTab === 'ALL' ? 'bg-black text-white' : 'bg-white text-black'} transition-all transform active:scale-95">
                        전체
                    </button>
                    ${Object.keys(domains).map(domain => {
        const isActive = currentTab === domain;
        const activeStyles = isActive ? `${categoryColors[domain]} text-black` : 'bg-white text-black';
        return `<button onclick="actions.setHubTab('${domain}')" 
                                    class="flex-shrink-0 px-5 py-2 rounded-full border-2 border-black shadow-notion font-black text-sm ${activeStyles} transition-all transform active:scale-95">
                                ${categoryEmojis[domain]} ${domains[domain]}
                            </button>`;
    }).join('')}
                </div>
            </div>

            <!-- Main Content Area -->
            <div class="px-6 space-y-10">
                
                <!-- 1. Featured Hero Card -->
                ${featuredArtist ? `
                <section class="animate-fade-in-up">
                    <h3 class="text-sm font-black uppercase tracking-[0.2em] text-stone-400 mb-4 px-1">Current Spotlight</h3>
                    <div onclick="actions.playVideo('${featuredArtist.id}')" 
                         class="notion-card bg-white overflow-hidden group border-3 cursor-pointer relative shadow-notion-lg">
                        <div class="aspect-[16/10] relative overflow-hidden bg-stone-200">
                            <img src="${featuredArtist.masterpieceImage}" 
                                 class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                 alt="${featuredArtist.masterpieceTitle}">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100"></div>
                            
                            <!-- Floating Play Button -->
                            <div class="absolute inset-0 flex items-center justify-center">
                                <div class="w-16 h-16 rounded-full bg-white/95 border-3 border-black flex items-center justify-center shadow-notion transform group-hover:scale-110 transition-transform">
                                    <i data-lucide="play" width="28" class="fill-current ml-1 text-black"></i>
                                </div>
                            </div>
                            
                            <!-- Artist Badge -->
                            <div class="absolute top-4 left-4 pointer-events-none">
                                <div class="px-3 py-1.5 bg-white border-2 border-black rounded-full text-xs font-black shadow-notion">
                                    ${featuredArtist.artistEmoji} ${featuredArtist.title}
                                </div>
                            </div>
                        </div>
                        <div class="p-5">
                            <h4 class="text-xl font-black leading-tight mb-1 font-serif" style="color: var(--text-primary); text-underline-offset: 4px;">${featuredArtist.masterpieceTitle}</h4>
                            <p class="text-base font-bold text-stone-500">${featuredArtist.masterpieceDesc.split('.')[0]}.</p>
                        </div>
                    </div>
                </section>
                ` : ''}

                <!-- 2. Artistic Masonry Gallery -->
                <section class="animate-fade-in-up" style="animation-delay: 0.1s">
                    <h3 class="text-sm font-black uppercase tracking-[0.2em] text-stone-400 mb-6 px-1">Collections</h3>
                    
                    <div class="columns-2 gap-4 space-y-4">
                        ${otherArtists.map((artist, index) => {
        // Assign varied styles based on index to create organic rhythm
        const styleType = index % 3;
        let cardClass = "break-inside-avoid mb-6 w-full group cursor-pointer animate-fade-in";
        let imgWrapperClass = "relative overflow-hidden border-2 border-black shadow-notion transition-all";

        if (styleType === 0) { // Classic Square
            imgWrapperClass += " aspect-square rounded-2xl group-hover:-translate-y-1";
        } else if (styleType === 1) { // Tall Artistic
            imgWrapperClass += " aspect-[3/4] rounded-t-[50%] rounded-b-2xl group-hover:rotate-2";
        } else { // Organic Wide
            imgWrapperClass += " aspect-square rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] group-hover:scale-105";
        }

        return `
                            <div onclick="actions.playVideo('${artist.id}')" class="${cardClass}">
                                <div class="${imgWrapperClass}">
                                    <img src="${artist.masterpieceImage}" 
                                         class="w-full h-full object-cover" 
                                         loading="lazy">
                                    <div class="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors"></div>
                                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div class="w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-notion">
                                            <i data-lucide="play" width="16" class="fill-current text-black ml-1"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-3 px-1">
                                    <div class="text-xs font-black uppercase text-stone-400 mb-0.5">${artist.title}</div>
                                    <div class="text-base font-black leading-tight truncate font-serif" style="color: var(--text-primary);">${artist.masterpieceTitle}</div>
                                </div>
                            </div>`;
    }).join('')}
                    </div>
                </section>
            </div>
        </div>
        
        <style>
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            
            @keyframes fade-in-up {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up {
                animation: fade-in-up 0.6s cubic-bezier(0.2, 0, 0.2, 1) both;
            }
            
            .shadow-notion-lg {
                box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
            }
            
            .columns-2 { column-count: 2; }
            .gap-4 { column-gap: 1rem; }
            .break-inside-avoid { break-inside: avoid; }
        </style>
    </div>`;
}
