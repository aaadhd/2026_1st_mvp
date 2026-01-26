// 감정 일기 목록 화면
import { state } from '../../core/state.js';

export function DiaryListScreen() {
    // 저장된 일기 불러오기
    const diaries = JSON.parse(localStorage.getItem('emotionDiaries') || '[]');
    const sortedDiaries = diaries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // 🎨 통계 계산: 많이 쓴 색상 찾기
    const colorCounts = {};
    let totalCells = 0;

    // 색상 팔레트 정의
    const colors = ['#FF6B6B', '#FFA94D', '#FFE066', '#69DB7C', '#74C0FC', '#B197FC', '#F783AC', '#868E96'];
    const colorNames = ['열정', '활기', '희망', '치유', '평온', '영감', '사랑', '중립'];

    diaries.forEach(d => {
        d.colors.forEach(c => {
            if (c >= 0) {
                colorCounts[c] = (colorCounts[c] || 0) + 1;
                totalCells++;
            }
        });
    });

    // 비율 계산 및 정렬
    const stats = Object.entries(colorCounts)
        .map(([idx, count]) => ({ idx: parseInt(idx), count, pct: (count / totalCells) * 100 }))
        .sort((a, b) => b.count - a.count);

    const topEmotion = stats.length > 0 ? colorNames[stats[0].idx] : '없음';

    return `<div class="h-full flex flex-col bg-white">
        <!-- Header -->
        <div class="px-6 py-4 bg-white border-b-2 border-black flex justify-between items-center sticky top-0 z-10">
            <button onclick="actions.goBackToHub()" class="w-10 h-10 rounded-xl border-2 border-black bg-white flex items-center justify-center shadow-notion">
                <i data-lucide="arrow-left" width="20" style="color: var(--text-primary);"></i>
            </button>
            <span class="font-black text-lg" style="color: var(--text-primary);">감정 일기</span>
            <div class="w-10"></div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto">
            ${sortedDiaries.length === 0 ? `
                <!-- 빈 상태 -->
                <div class="flex flex-col items-center justify-center h-full px-6 text-center">
                    <div class="text-6xl mb-4">📝</div>
                    <h3 class="text-xl font-black mb-2 font-serif" style="color: var(--text-primary);">아직 작성한 일기가 없어요</h3>
                    <p class="text-sm font-bold mb-6" style="color: var(--text-secondary);">첫 번째 감정 일기를 작성해보세요</p>
                    <button onclick="actions.goToDiary()" 
                            class="px-6 py-3 bg-purple-400 rounded-xl border-2 border-black shadow-notion font-black"
                            style="color: var(--text-primary);">
                        일기 쓰기 ✨
                    </button>
                </div>
            ` : `
                <div class="p-6 space-y-6">
                    <!-- 📊 나의 감정 팔레트 (통계) -->
                    <div class="bg-white rounded-2xl border-2 border-black shadow-notion p-5">
                        <h3 class="font-black text-base mb-3 flex items-center justify-between" style="color: var(--text-primary);">
                            <span class="font-serif">나의 감정 팔레트</span>
                            ${topEmotion !== '없음' ? `<span class="text-xs px-2 py-1 bg-black text-white rounded-full">최근: ${topEmotion}</span>` : ''}
                        </h3>
                        
                        <!-- Color Bar Chart -->
                        <div class="h-6 w-full rounded-full border-2 border-black overflow-hidden flex mb-2">
                            ${stats.length > 0 ? stats.map(s => `
                                <div style="width: ${s.pct}%; background-color: ${colors[s.idx]};" title="${colorNames[s.idx]}"></div>
                            `).join('') : '<div class="w-full bg-gray-200"></div>'}
                        </div>
                        <p class="text-xs font-bold text-stone-500 text-right">최근 기록된 감정 색상 비율</p>
                    </div>

                    <!-- 새 일기 쓰기 버튼 -->
                    <button onclick="actions.goToDiary()" 
                            class="w-full py-4 bg-purple-400 rounded-xl border-2 border-black shadow-notion font-black text-base mb-4 hover:scale-[1.02] transition-transform"
                            style="color: var(--text-primary);">
                        새 일기 쓰기 ✨
                    </button>
                    
                    <!-- 일기 목록 -->
                    <div class="space-y-4">
                    ${sortedDiaries.map((diary, index) => {
        const date = new Date(diary.createdAt);
        const dateStr = date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // 조각보 미리보기 생성
        const gridPreview = Array(6).fill(0).map((_, i) => {
            const colorIdx = diary.colors[i];
            const bgColor = colorIdx >= 0 ? colors[colorIdx] : '#ffffff';
            return `<div class="aspect-square border border-stone-300" style="background-color: ${bgColor};"></div>`;
        }).join('');

        return `
                            <div onclick="window.viewDiary('${diary.id}')" 
                                 class="w-full bg-white rounded-2xl border-2 border-black shadow-notion cursor-pointer hover:bg-gray-50 transition-colors" 
                                 style="height: 112px; min-height: 112px; max-height: 112px; padding: 16px; box-sizing: border-box;">
                                <div class="flex items-start gap-4 h-full" style="overflow: hidden; height: 100%;">
                                    <!-- 조각보 미리보기 -->
                                    <div class="grid grid-cols-3 gap-1 flex-shrink-0" style="width: 80px; height: 80px;">
                                        ${gridPreview}
                                    </div>
                                    
                                    <!-- 일기 정보 -->
                                    <div class="flex-1 min-w-0 flex flex-col justify-between h-full" style="overflow: hidden; max-width: calc(100% - 96px); height: 100%;">
                                        <div class="flex-shrink-0 min-w-0" style="overflow: hidden; width: 100%;">
                                            <div class="text-sm font-bold mb-1 truncate" style="color: var(--text-secondary); width: 100%;">${dateStr}</div>
                                            <div class="font-black text-lg mb-1 truncate font-serif" style="color: var(--text-primary); width: 100%;">${diary.artistTitle}</div>
                                        </div>
                                        <div class="flex-1 flex items-end min-h-0" style="overflow: hidden; width: 100%; padding-top: 4px;">
                                            ${diary.text ? `
                                                <p class="text-base font-bold m-0" style="color: var(--text-secondary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; word-break: break-word; overflow-wrap: break-word; width: 100%; max-width: 100%; line-height: 1.4; margin: 0;">${diary.text}</p>
                                            ` : `
                                                <p class="text-base font-bold m-0 truncate" style="color: var(--text-secondary); width: 100%; margin: 0;">색으로 표현한 감정</p>
                                            `}
                                        </div>
                                    </div>
                                    
                                    <i data-lucide="chevron-right" width="20" style="color: var(--text-secondary); flex-shrink: 0; margin-top: 2px;"></i>
                                </div>
                            </div>
                        `;
    }).join('')}
                    </div>
                </div>
            `}
        </div>
    </div>`;
}

// 일기 상세 보기
export function viewDiary(diaryId) {
    const diaries = JSON.parse(localStorage.getItem('emotionDiaries') || '[]');
    const diary = diaries.find(d => d.id.toString() === diaryId);

    if (!diary) {
        alert('일기를 찾을 수 없습니다.');
        return;
    }

    // 일기 상세 모달 표시
    const app = document.getElementById('app');
    const modal = document.createElement('div');
    modal.className = 'absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in';
    modal.onclick = () => modal.remove();

    const date = new Date(diary.createdAt);
    const dateStr = date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const colors = ['#FF6B6B', '#FFA94D', '#FFE066', '#69DB7C', '#74C0FC', '#B197FC', '#F783AC', '#868E96'];
    const gridCells = Array(6).fill(0).map((_, i) => {
        const colorIdx = diary.colors[i];
        const bgColor = colorIdx >= 0 ? colors[colorIdx] : '#ffffff';
        return `<div class="aspect-square border-2 border-stone-400" style="background-color: ${bgColor};"></div>`;
    }).join('');

    modal.innerHTML = `
        <div class="bg-white rounded-3xl border-3 border-black shadow-notion-lg max-w-sm w-full mx-4 animate-pop-in" style="max-height: 80vh;" onclick="event.stopPropagation()">
            <div class="p-6 flex flex-col" style="height: 100%; max-height: 80vh;">
                <div class="text-sm font-bold mb-2" style="color: var(--text-secondary);">${dateStr}</div>
                <h2 class="text-3xl font-black mb-4 font-serif" style="color: var(--text-primary);">${diary.artistTitle}</h2>
                
                <!-- 조각보 -->
                <div class="mb-4 p-4 bg-stone-50 rounded-xl border-2 border-stone-200 flex-shrink-0">
                    <div class="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
                        ${gridCells}
                    </div>
                </div>
                
                <!-- 텍스트 (고정 높이, 스크롤 가능) -->
                <div class="flex-1 min-h-0 mb-4">
                    ${diary.text ? `
                        <div class="h-full p-4 bg-white rounded-xl border-2 border-black overflow-y-auto">
                            <p class="text-lg leading-relaxed font-medium font-serif" style="color: var(--text-primary);">${diary.text}</p>
                        </div>
                    ` : `
                        <div class="h-full p-4 bg-white rounded-xl border-2 border-black flex items-center justify-center">
                            <p class="text-base font-bold text-stone-400">텍스트가 없습니다</p>
                        </div>
                    `}
                </div>
                
                <button onclick="this.closest('.absolute').remove()" 
                        class="w-full py-3 bg-gray-100 rounded-xl border-2 border-black font-black text-sm flex-shrink-0"
                        style="color: var(--text-primary);">
                    닫기
                </button>
            </div>
        </div>
    `;

    app.appendChild(modal);
    if (window.lucide) window.lucide.createIcons();
}

// 전역 함수로 등록
if (typeof window !== 'undefined') {
    window.viewDiary = viewDiary;
    window.openDiaryList = () => {
        if (window.actions && window.actions.goToDiaryList) {
            window.actions.goToDiaryList();
        }
    };
}
