// 게임 인트로 화면
import { ARTISTS_DB } from '../../data/artists.js';

export function ActivityIntroScreen(p) {
    // Get artist color
    const colorMap = { 'EMOTION': 'bg-red', 'COGNITION': 'bg-blue', 'SOCIAL': 'bg-green', 'SENSORY': 'bg-yellow' };
    let artistColor = 'bg-blue';
    for (const [domain, artists] of Object.entries(ARTISTS_DB)) {
        if (artists.some(a => a.id === p.id)) {
            artistColor = colorMap[domain];
            break;
        }
    }

    // 게임별 간단한 조작 가이드
    const guides = {
        'SHOOT_WATER': '💧 물방울을 터치해서 해바라기에 물을 주세요',
        'PUZZLE_JIGSAW': '🧩 퍼즐 조각을 드래그해서 맞춰보세요',
        'TOUCH_SMILE': '😊 웃는 얼굴을 빠르게 터치하세요',
        'TIMING_FISH': '🐟 고양이가 있는 곳에 생선을 터치하세요',
        'BALANCE_STACK': '🍎 과일이 떨어지는 타이밍에 터치하세요',
        'RUN_FLOWER': '🌸 꽃을 터치로 모으며 달려가세요',
        'OBSERVE_MATCH': '🪷 같은 모양의 수련을 찾아 터치하세요',
        'SWIPE_SORT': '🧺 과일을 드래그해서 바구니에 담으세요',
        'TRACE_DOT': '✏️ 점들을 순서대로 연결하세요',
        'MAZE_DRAG': '🏰 드래그로 길을 따라가세요',
        'FIND_HIDDEN': '🔍 숨어있는 연인을 찾아보세요',
        'FIND_PERSON': '👥 특정 사람을 찾아 터치하세요',
        'STICKER_FACE': '🍇 과일을 드래그해서 얼굴을 꾸며보세요',
        'STICKER_NATURE': '🦋 꽃과 곤충을 배치해보세요',
        'DRAW_MIRROR': '✍️ 반대편을 똑같이 그려보세요',
        'COLLAGE_CUTOUT': '✂️ 선을 따라 드래그하세요',
        'SOUND_CANVAS': '🎵 화면을 터치해 소리를 만들어보세요',
        'COLORING_FILL': '🎨 색을 선택하고 영역을 터치하세요',
        'GOLDEN_BRUSH': '✨ 드래그해서 황금빛으로 칠하세요',
        'LIST_MEMO': '📝 제시된 물건을 기억했다가 선택하세요',
        'MEMORY_MATCH': '🃏 카드를 뒤집어 같은 그림을 찾으세요',
        'RHYTHM_TAP': '🎵 음표가 라인에 닿을 때 터치하세요',
        'QUIZ_FRUIT': '❓ 정답을 터치하세요'
    };

    const guide = guides[p.mechanic] || '터치와 드래그로 게임을 즐겨보세요';

    return `<div class="h-full flex flex-col bg-white">
        <!-- Header with back button - Notion Style -->
        <div class="px-6 py-4 bg-white border-b-2 border-black flex flex-col gap-2">
            <div class="flex justify-between items-center">
                <button onclick="actions.goBackToCompanion()" class="w-10 h-10 rounded-xl border-2 border-black bg-white flex items-center justify-center shadow-notion">
                    <i data-lucide="arrow-left" width="20" style="color: var(--text-primary);"></i>
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
            <p class="text-lg font-black mb-8" style="color: var(--text-secondary);">${p.title}와 함께</p>
            
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
