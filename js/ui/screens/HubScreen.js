// Hub 화면 (다른 아트 메이트들)
import { ARTISTS_DB } from '../../data/artists.js';
import { state } from '../../core/state.js';
import { DOMAIN_COLORS, DOMAIN_LABELS, DOMAIN_EMOJIS } from '../utils.js';

export function HubScreen(p) {
    const currentTab = state.currentHubTab || 'ALL';

    // 필터링된 게임 목록
    let filteredGames = [];
    if (currentTab === 'ALL') {
        // 모든 게임을 도메인별로 그룹화
        filteredGames = Object.entries(ARTISTS_DB).map(([domain, games]) => ({
            domain,
            games: games
        }));
    } else {
        // 선택된 탭의 게임만
        filteredGames = [{
            domain: currentTab,
            games: ARTISTS_DB[currentTab]
        }];
    }

    return `<div class="h-full flex flex-col bg-white">
        <div class="p-3 bg-white border-b-2 border-black flex justify-between items-center sticky top-0 z-10">
            <button onclick="actions.goBackToCompanion()" class="w-12 h-12 min-w-[48px] min-h-[48px] rounded-xl border-2 border-black bg-white flex items-center justify-center shadow-notion">
                <i data-lucide="arrow-left" width="24" style="color: var(--text-primary);"></i>
            </button>
            <span class="font-black text-lg" style="color: var(--text-primary);">아트 게임 모아보기</span>
            <button onclick="window.openSettingsModal()" 
                    class="w-12 h-12 min-w-[48px] min-h-[48px] rounded-xl border-2 border-black bg-white flex items-center justify-center shadow-notion hover:bg-gray-50 transition-colors">
                <i data-lucide="menu" width="24" style="color: var(--text-primary);"></i>
            </button>
        </div>

        <div class="flex-1 overflow-y-auto">
            <div class="p-6 space-y-6">
                <!-- 1. Today's Recommended - Notion Style -->
                <section>
                    <h3 class="text-sm font-black mb-4 flex items-center gap-2" style="color: var(--text-primary);">
                        <span class="text-xl">⭐</span> 오늘의 추천 아트 게임
                    </h3>
                    <div onclick="actions.startLevelIntro()" class="notion-card p-5 bg-yellow cursor-pointer">
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <div class="text-sm font-black mb-1" style="color: var(--text-secondary);">${p.sub} · ${p.title}</div>
                                <div class="text-2xl font-black mb-2" style="color: var(--text-primary);">${p.gameTitle}</div>
                                <div class="text-sm font-bold" style="color: var(--text-primary);">${p.desc}</div>
                            </div>
                            <div class="text-5xl ml-4">${p.gameEmoji}</div>
                        </div>
                    </div>
                </section>

                <!-- 2. Tab Buttons - Notion Style -->
                <section>
                    <div class="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                        <button onclick="actions.setHubTab('ALL')" 
                                class="flex-shrink-0 px-5 py-3 rounded-xl border-2 border-black shadow-notion font-black text-sm min-h-[48px] flex items-center ${currentTab === 'ALL' ? 'bg-blue' : 'bg-white'}"
                                style="color: ${currentTab === 'ALL' ? '#ffffff' : 'var(--text-primary)'};">
                            전체
                        </button>
                        ${Object.keys(DOMAIN_LABELS).map(domain => {
        const isActive = currentTab === domain;
        const color = isActive ? DOMAIN_COLORS[domain] : 'bg-white';
        return `<button onclick="actions.setHubTab('${domain}')"
                                    class="flex-shrink-0 px-5 py-3 rounded-xl border-2 border-black shadow-notion font-black text-sm min-h-[48px] flex items-center ${color}"
                                    style="color: ${color === 'bg-red' || color === 'bg-blue' ? '#ffffff' : 'var(--text-primary)'};">
                                ${DOMAIN_EMOJIS[domain]} ${DOMAIN_LABELS[domain]}
                            </button>`;
    }).join('')}
                    </div>
                </section>

                <!-- 3. Games Grid - Notion Style -->
                ${filteredGames.map(({ domain, games }) => {
        if (games.length === 0) return '';

        const domainColor = DOMAIN_COLORS[domain] || 'bg-blue';
        const domainEmoji = DOMAIN_EMOJIS[domain] || '🎨';

        return `<section>
                        ${currentTab === 'ALL' ? `
                            <h3 class="text-sm font-black mb-4 flex items-center gap-2" style="color: var(--text-primary);">
                                <span class="text-lg">${domainEmoji}</span> ${DOMAIN_LABELS[domain]}
                            </h3>
                        ` : ''}
                        <div class="grid grid-cols-2 gap-3">
                            ${games.map(g => {
            const isCurrent = g.id === p.id;
            const cardColor = isCurrent ? domainColor : 'bg-white';
            return `<div id="hub-game-${g.id}" onclick="actions.playNext('${g.id}')" class="notion-card p-4 ${cardColor} cursor-pointer flex flex-col items-center text-center">
                                    <div class="text-3xl mb-2">${g.gameEmoji}</div>
                                    <div class="font-black text-sm leading-tight mb-1" style="color: ${cardColor === 'bg-red' || cardColor === 'bg-blue' ? '#ffffff' : 'var(--text-primary)'};">${g.gameTitle}</div>
                                    <div class="text-sm font-bold" style="color: ${cardColor === 'bg-red' || cardColor === 'bg-blue' ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)'};">${g.sub} · ${g.title}</div>
                                </div>`;
        }).join('')}
                        </div>
                    </section>`;
    }).join('')}
                
                <div class="h-10"></div>
            </div>
        </div>
    </div>`;
}
