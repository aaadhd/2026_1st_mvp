import { state } from '../../core/state.js';
import { SCREENING_PAIRS } from '../../data/screening_pool.js';

export function TuningScreen(step) {
    // Vibrant colors for each choice
    const choiceColors = ['bg-red', 'bg-blue', 'bg-yellow', 'bg-green', 'bg-purple', 'bg-orange'];

    // 각 질문마다 다른 재미있는 멘트
    const questions = [
        { title: "오늘의 기분은 어떤가요?", subtitle: "마음이 이끄는 대로 선택해보세요" },
        { title: "어떤 색감이 끌리나요?", subtitle: "직관적으로 골라보세요" },
        { title: "어떤 이야기가 궁금한가요?", subtitle: "상상력을 자극하는 선택을" },
        { title: "마음이 가는 분위기는?", subtitle: "지금 이 순간의 느낌으로" },
        { title: "어떤 순간이 좋으신가요?", subtitle: "당신의 취향을 보여주세요" },
        { title: "선호하는 스타일은?", subtitle: "솔직한 선택이 가장 좋아요" },
        { title: "어떤 에너지가 필요한가요?", subtitle: "오늘 하루를 위한 선택" }
    ];

    const choice = SCREENING_PAIRS[step - 1];
    const question = questions[step - 1];
    const color1 = choiceColors[(step - 1) % 6];
    const color2 = choiceColors[((step - 1) + 3) % 6];
    const prevSelected = state.tuningSelectionByStep && state.tuningSelectionByStep[step];
    const leftSelected = prevSelected === choice.d1;
    const rightSelected = prevSelected === choice.d2;

    return `<div class="h-full flex flex-col p-3 font-sans bg-white">
        <div class="mb-6">
            <div class="flex justify-between items-center text-sm font-black mb-3 min-h-[48px]" style="color: var(--text-primary);">
                <div class="w-12 h-12 flex items-center">
                    ${step > 1 ? `
                    <button onclick="actions.tuningBack()" class="w-12 h-12 rounded-xl border-2 border-black bg-white flex items-center justify-center shadow-notion hover:bg-gray-50 transition-colors">
                        <i data-lucide="arrow-left" width="24" style="color: var(--text-primary);"></i>
                    </button>
                    ` : ''}
                </div>
                <span class="leading-none">${step} / 7</span>
            </div>
            <div class="w-full h-3 bg-gray-100 rounded-full border-2 border-black overflow-hidden">
                <div class="h-full ${color1} transition-all" style="width: ${(step / 7) * 100}%; border-right: 2px solid black;"></div>
            </div>
        </div>
        
        <div class="text-center mb-6">
            <h2 class="text-2xl font-black mb-2" style="color: var(--text-primary);">${question.title}</h2>
            <p class="text-sm font-bold" style="color: var(--text-secondary);">${question.subtitle}</p>
        </div>
        
        <div class="flex-1 flex flex-col gap-4 pb-8" style="min-height: 0;">
            <div onclick="spawnDOMParticles(event); actions.tuningSelect('${choice.d1}', '${choice.t1}', '${choice.artist1}')" 
                 class="flex-1 notion-card cursor-pointer relative overflow-hidden ${leftSelected ? 'ring-4 ring-blue-500 ring-offset-2' : ''}" style="min-height: 0;">
                <div class="h-full w-full relative">
                    ${leftSelected ? '<div class="absolute top-3 left-3 z-10 px-3 py-1.5 bg-white/95 rounded-lg border-2 border-black text-sm font-black" style="color: var(--text-primary);">✓ 내가 고른 것</div>' : ''}
                    <img src="${choice.img1}" 
                         class="w-full h-full object-cover" 
                         style="object-fit: cover; object-position: center;"
                         crossorigin="anonymous" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <div class="text-lg font-black mb-1">${choice.t1}</div>
                        <div class="text-sm font-bold opacity-90">${choice.artist1}</div>
                    </div>

                </div>
            </div>
            
            <div onclick="spawnDOMParticles(event); actions.tuningSelect('${choice.d2}', '${choice.t2}', '${choice.artist2}')" 
                 class="flex-1 notion-card cursor-pointer relative overflow-hidden ${rightSelected ? 'ring-4 ring-blue-500 ring-offset-2' : ''}" style="min-height: 0;">
                <div class="h-full w-full relative">
                    ${rightSelected ? '<div class="absolute top-3 left-3 z-10 px-3 py-1.5 bg-white/95 rounded-lg border-2 border-black text-sm font-black" style="color: var(--text-primary);">✓ 내가 고른 것</div>' : ''}
                    <img src="${choice.img2}" 
                         class="w-full h-full object-cover" 
                         style="object-fit: cover; object-position: center;"
                         crossorigin="anonymous" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <div class="text-lg font-black mb-1">${choice.t2}</div>
                        <div class="text-sm font-bold opacity-90">${choice.artist2}</div>
                    </div>

                </div>
            </div>
        </div>
    </div>`;
}
