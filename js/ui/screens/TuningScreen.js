// 튜닝 화면 (아트 메이트 찾기)
import { state } from '../../core/state.js';

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

    const tuningChoices = [
        {
            d1: 'SOCIAL', d2: 'EMOTION',
            img1: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Pierre-Auguste_Renoir_-_Bal_au_moulin_de_la_Galette.jpg/800px-Pierre-Auguste_Renoir_-_Bal_au_moulin_de_la_Galette.jpg",
            img2: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/800px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
            t1: "함께하는 기쁨", t2: "따뜻한 위로",
            artist1: "르누아르", artist2: "고흐"
        },
        {
            d1: 'COGNITION', d2: 'SENSORY',
            img1: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/The_Scream.jpg/800px-The_Scream.jpg",
            img2: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Claude_Monet%2C_Impression%2C_soleil_levant.jpg/800px-Claude_Monet%2C_Impression%2C_soleil_levant.jpg",
            t1: "흥미로운 생각", t2: "화려한 감각",
            artist1: "뭉크", artist2: "모네"
        },
        {
            d1: 'SOCIAL', d2: 'COGNITION',
            img1: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Grant_Wood_-_American_Gothic.jpg/600px-Grant_Wood_-_American_Gothic.jpg",
            img2: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Pablo_Picasso%2C_1910%2C_Girl_with_a_Mandolin_%28Fanny_Tellier%29%2C_oil_on_canvas%2C_100.3_x_73.6_cm%2C_Museum_of_Modern_Art_New_York..jpg/600px-Pablo_Picasso%2C_1910%2C_Girl_with_a_Mandolin_%28Fanny_Tellier%29%2C_oil_on_canvas%2C_100.3_x_73.6_cm%2C_Museum_of_Modern_Art_New_York..jpg",
            t1: "사람들 속으로", t2: "지적인 탐구",
            artist1: "우드", artist2: "피카소"
        },
        {
            d1: 'EMOTION', d2: 'SENSORY',
            img1: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/VanGogh-Irises_1_edited.jpg/800px-VanGogh-Irises_1_edited.jpg",
            img2: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Vassily_Kandinsky%2C_1913_-_Composition_7.jpg/800px-Vassily_Kandinsky%2C_1913_-_Composition_7.jpg",
            t1: "감성의 숲", t2: "질서있는 아름다움",
            artist1: "고흐", artist2: "칸딘스키"
        },
        {
            d1: 'EMOTION', d2: 'COGNITION',
            img1: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1912_Delaunay_Fen%C3%AAtre_sur_la_ville_anagoria.JPG/600px-1912_Delaunay_Fen%C3%AAtre_sur_la_ville_anagoria.JPG",
            img2: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/Paul_Klee%2C_1922%2C_Senecio_%28Baldgreis%29.jpg/600px-Paul_Klee%2C_1922%2C_Senecio_%28Baldgreis%29.jpg",
            t1: "꿈과 낭만", t2: "논리와 체계",
            artist1: "들로네", artist2: "클레"
        },
        {
            d1: 'SENSORY', d2: 'SOCIAL',
            img1: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Matisse-Woman-with-a-Hat.jpg/600px-Matisse-Woman-with-a-Hat.jpg",
            img2: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/La_Danse_%28I%29_by_Matisse.jpg/800px-La_Danse_%28I%29_by_Matisse.jpg",
            t1: "소리와 색채", t2: "축제와 어울림",
            artist1: "마티스", artist2: "마티스"
        },
        {
            d1: 'COGNITION', d2: 'EMOTION',
            img1: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Edvard_Munch_-_Madonna_%281894-1895%29.jpg/600px-Edvard_Munch_-_Madonna_%281894-1895%29.jpg",
            img2: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/800px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg",
            t1: "탐구의 즐거움", t2: "순수한 행복",
            artist1: "뭉크", artist2: "미켈란젤로"
        }
    ];
    const choice = tuningChoices[step - 1];
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
