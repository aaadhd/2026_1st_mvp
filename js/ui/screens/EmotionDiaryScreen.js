// 감정 일기 화면
import { state } from '../../core/state.js';

export function EmotionDiaryScreen(p) {
    if (!p) return '<div>Loading...</div>';

    // 색상 팔레트
    const colors = [
        '#FF6B6B', // 빨강
        '#FFA94D', // 주황
        '#FFE066', // 노랑
        '#69DB7C', // 초록
        '#74C0FC', // 파랑
        '#B197FC', // 보라
        '#F783AC', // 분홍
        '#868E96'  // 회색
    ];

    const colorPalette = colors.map((color, i) =>
        `<button onclick="window.diarySelectColor(${i})"
                class="w-9 h-9 rounded-full border-2 border-black shadow-notion diary-color-btn"
                style="background-color: ${color};"
                data-color-index="${i}">
        </button>`
    ).join('');

    // 조각보 그리드 (2x3)
    const gridCells = Array(6).fill(0).map((_, i) =>
        `<div onclick="window.diaryFillCell(${i})"
              class="aspect-square border-2 border-stone-400 cursor-pointer transition-all diary-cell"
              data-cell-index="${i}"
              style="background-color: #ffffff;">
        </div>`
    ).join('');

    return `<div class="h-full flex flex-col bg-stone-100">
        <!-- Header -->
        <div class="px-6 py-4 bg-white border-b-2 border-black">
            <div class="flex justify-between items-center">
                <button onclick="actions.skipDiary()" class="w-10 h-10 rounded-xl border-2 border-black bg-white flex items-center justify-center shadow-notion">
                    <i data-lucide="x" width="20" style="color: var(--text-primary);"></i>
                </button>
                <span class="font-black text-lg" style="color: var(--text-primary);">오늘의 감정 일기</span>
                <div class="w-10"></div>
            </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto">
            <div class="p-6">
                <!-- 명화 배경 카드 -->
                <div class="relative rounded-2xl border-2 border-black shadow-notion overflow-hidden mb-6"
                     style="background-image: url('${p.masterpieceImage}'); background-size: cover; background-position: center;">
                    <!-- 오버레이 -->
                    <div class="absolute inset-0 bg-black/40"></div>

                    <!-- 내용 -->
                    <div class="relative p-5 text-white">
                        <!-- 조각보 -->
                        <div class="bg-white/95 rounded-xl p-4 mb-4 border-2 border-white/50">
                            <p class="text-sm font-bold text-stone-600 mb-3 text-center">조각보에 오늘의 감정을 색으로 표현해보세요</p>
                            <div class="grid grid-cols-3 gap-1 max-w-[200px] mx-auto" id="diary-grid">
                                ${gridCells}
                            </div>
                        </div>

                        <!-- 색상 팔레트 -->
                        <div class="flex justify-center gap-2 flex-wrap mb-4" id="color-palette">
                            ${colorPalette}
                        </div>
                    </div>
                </div>

                <!-- 텍스트 입력 -->
                <div class="bg-white rounded-2xl border-2 border-black shadow-notion p-5 mb-6">
                    <p class="text-sm font-bold text-stone-500 mb-3">오늘 하루를 몇 줄의 글로 적어보세요</p>
                    <textarea
                        id="diary-text"
                        class="w-full h-24 p-3 border-2 border-stone-300 rounded-xl resize-none font-medium text-stone-700 focus:border-purple-400 focus:outline-none"
                        placeholder="오늘은 어떤 하루였나요?"
                        maxlength="200"
                    ></textarea>
                    <div class="text-right text-xs text-stone-400 mt-1">
                        <span id="char-count">0</span>/200
                    </div>
                </div>

                <!-- 저장 버튼 -->
                <button onclick="window.saveDiary()"
                        id="save-diary-btn"
                        class="w-full py-4 font-black rounded-2xl border-2 border-black shadow-notion bg-purple-400 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        style="color: var(--text-primary);"
                        disabled>
                    저장하기 ✨
                </button>

                <p class="text-center text-sm text-stone-500 mt-3">
                    색칠 또는 글 중 하나는 입력해주세요
                </p>
            </div>
        </div>
    </div>`;
}

// 전역 함수들 (window에 등록)
if (typeof window !== 'undefined') {
    // 현재 선택된 색상 인덱스
    window.diarySelectedColor = 0;
    // 각 셀의 색상 상태
    window.diaryCellColors = [-1, -1, -1, -1, -1, -1]; // -1 = 미선택

    const colors = [
        '#FF6B6B', '#FFA94D', '#FFE066', '#69DB7C',
        '#74C0FC', '#B197FC', '#F783AC', '#868E96'
    ];

    // 색상 선택
    window.diarySelectColor = (index) => {
        window.diarySelectedColor = index;

        // UI 업데이트 - 선택된 색상 표시
        document.querySelectorAll('.diary-color-btn').forEach((btn, i) => {
            if (i === index) {
                btn.style.transform = 'scale(1.2)';
                btn.style.boxShadow = '0 0 0 3px white, 0 0 0 5px black';
            } else {
                btn.style.transform = 'scale(1)';
                btn.style.boxShadow = '';
            }
        });
    };

    // 셀 채우기
    window.diaryFillCell = (cellIndex) => {
        const colorIndex = window.diarySelectedColor;
        window.diaryCellColors[cellIndex] = colorIndex;

        // UI 업데이트
        const cell = document.querySelector(`[data-cell-index="${cellIndex}"]`);
        if (cell) {
            cell.style.backgroundColor = colors[colorIndex];
        }

        // 저장 버튼 활성화 체크
        window.checkDiaryValid();
    };

    // 유효성 검사
    window.checkDiaryValid = () => {
        const hasColor = window.diaryCellColors.some(c => c !== -1);
        const textEl = document.getElementById('diary-text');
        const hasText = textEl && textEl.value.trim().length > 0;

        const saveBtn = document.getElementById('save-diary-btn');
        if (saveBtn) {
            saveBtn.disabled = !(hasColor || hasText);
        }
    };

    // 일기 저장
    window.saveDiary = () => {
        const textEl = document.getElementById('diary-text');
        const text = textEl ? textEl.value.trim() : '';

        const diary = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            artistId: state.persona?.id || 'UNKNOWN',
            artistTitle: state.persona?.title || '',
            masterpieceImage: state.persona?.masterpieceImage || '',
            colors: [...window.diaryCellColors],
            text: text,
            createdAt: new Date().toISOString()
        };

        // LocalStorage에 저장
        const diaries = JSON.parse(localStorage.getItem('emotionDiaries') || '[]');
        diaries.push(diary);
        localStorage.setItem('emotionDiaries', JSON.stringify(diaries));

        // 상태 초기화
        window.diaryCellColors = [-1, -1, -1, -1, -1, -1];

        // 완료 화면으로 이동
        if (window.actions && window.actions.completeDiary) {
            window.actions.completeDiary();
        }
    };

    // 텍스트 입력 이벤트 리스너 (페이지 로드 후)
    document.addEventListener('DOMContentLoaded', () => {
        const textEl = document.getElementById('diary-text');
        if (textEl) {
            textEl.addEventListener('input', (e) => {
                const count = e.target.value.length;
                const countEl = document.getElementById('char-count');
                if (countEl) countEl.textContent = count;
                window.checkDiaryValid();
            });
        }
    });
}
