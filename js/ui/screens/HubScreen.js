// Hub 화면 (다른 아트 메이트들)
import { ARTISTS_DB } from '../../data/artists.js';
import { state } from '../../core/state.js';

export function HubScreen(p) {
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

    // 필터링된 게임 목록
    let filteredGames = [];
    if (currentTab === 'ALL') {
        // 모든 게임을 도메인별로 그룹화
        filteredGames = Object.entries(ARTISTS_DB).map(([domain, games]) => ({
            domain,
            games: games.filter(g => g.id !== p.id)
        }));
    } else {
        // 선택된 탭의 게임만
        filteredGames = [{
            domain: currentTab,
            games: ARTISTS_DB[currentTab].filter(g => g.id !== p.id)
        }];
    }

    return `<div class="h-full flex flex-col bg-white">
        <div class="px-6 py-4 bg-white border-b-2 border-black flex justify-between items-center sticky top-0 z-10">
            <button onclick="actions.goBackToCompanion()" class="w-10 h-10 rounded-xl border-2 border-black bg-white flex items-center justify-center shadow-notion">
                <i data-lucide="arrow-left" width="20" style="color: var(--text-primary);"></i>
            </button>
            <span class="font-black text-lg" style="color: var(--text-primary);">아트 플레이</span>
            <button onclick="window.openSettingsModal()" 
                    class="w-10 h-10 rounded-xl border-2 border-black bg-white flex items-center justify-center shadow-notion hover:bg-gray-50 transition-colors">
                <i data-lucide="menu" width="20" style="color: var(--text-primary);"></i>
            </button>
        </div>

        <div class="flex-1 overflow-y-auto">
            <div class="p-6 space-y-6">
                <!-- 1. Today's Recommended - Notion Style -->
                <section>
                    <h3 class="text-sm font-black mb-4 flex items-center gap-2" style="color: var(--text-primary);">
                        <span class="text-xl">⭐</span> 오늘의 아트 메이트
                    </h3>
                    <div onclick="actions.startLevelIntro()" class="notion-card p-5 bg-yellow cursor-pointer">
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <div class="text-xs font-black mb-1" style="color: var(--text-secondary);">${p.sub} · ${p.title}</div>
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
                                class="flex-shrink-0 px-4 py-2 rounded-xl border-2 border-black shadow-notion font-black text-sm ${currentTab === 'ALL' ? 'bg-blue' : 'bg-white'}"
                                style="color: var(--text-primary);">
                            전체
                        </button>
                        ${Object.keys(domains).map(domain => {
        const isActive = currentTab === domain;
        const color = isActive ? categoryColors[domain] : 'bg-white';
        return `<button onclick="actions.setHubTab('${domain}')" 
                                    class="flex-shrink-0 px-4 py-2 rounded-xl border-2 border-black shadow-notion font-black text-sm ${color}"
                                    style="color: var(--text-primary);">
                                ${categoryEmojis[domain]} ${domains[domain]}
                            </button>`;
    }).join('')}
                    </div>
                </section>

                <!-- 3. Games Grid - Notion Style -->
                ${filteredGames.map(({ domain, games }) => {
        if (games.length === 0) return '';

        const categoryColor = categoryColors[domain] || 'bg-blue';
        const categoryEmoji = categoryEmojis[domain] || '🎨';

        return `<section>
                        ${currentTab === 'ALL' ? `
                            <h3 class="text-sm font-black mb-4 flex items-center gap-2" style="color: var(--text-primary);">
                                <span class="text-lg">${categoryEmoji}</span> ${domains[domain]} Care
                            </h3>
                        ` : ''}
                        <div class="grid grid-cols-2 gap-3">
                            ${games.map(g => {
            const isCurrent = g.id === p.id;
            const cardColor = isCurrent ? categoryColor : 'bg-white';
            return `<div onclick="actions.playNext('${g.id}')" class="notion-card p-4 ${cardColor} cursor-pointer flex flex-col items-center text-center">
                                    <div class="text-3xl mb-2">${g.gameEmoji}</div>
                                    <div class="font-black text-sm leading-tight mb-1" style="color: var(--text-primary);">${g.gameTitle}</div>
                                    <div class="text-xs font-bold" style="color: var(--text-secondary);">${g.sub} · ${g.title}</div>
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
