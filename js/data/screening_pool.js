/**
 * 🎨 스크리닝(밸런스 게임)용 명화 풀
 * 
 * [파일명 규칙]
 * 영역코드_화가명_작품명.jpg
 * - 정서: EMO_
 * - 인지: COG_
 * - 사회: SOC_
 * - 감각: SEN_
 */
export const SCREENING_POOL = [
    // 1단계
    { id: 'SOC_Renoir_Bal', domain: 'SOCIAL', artist: '르누아르', title: '물랭 드 라 갈레트의 무도회', img: '/images/screening/SOC_Renoir_Bal.jpg' },
    { id: 'EMO_Gogh_Starry', domain: 'EMOTION', artist: '고흐', title: '별이 빛나는 밤', img: '/images/screening/EMO_Gogh_Starry.jpg' },

    // 2단계
    { id: 'COG_Munch_Scream', domain: 'COGNITION', artist: '뭉크', title: '절규', img: '/images/screening/COG_Munch_Scream.jpg' },
    { id: 'SEN_Monet_Sunrise', domain: 'SENSORY', artist: '모네', title: '인상 일출', img: '/images/screening/SEN_Monet_Sunrise.jpg' },

    // 3단계
    { id: 'SOC_Wood_Gothic', domain: 'SOCIAL', artist: '우드', title: '아메리칸 고딕', img: '/images/screening/SOC_Wood_Gothic.jpg' },
    { id: 'COG_Picasso_Mandolin', domain: 'COGNITION', artist: '피카소', title: '만돌린을 든 소녀', img: '/images/screening/COG_Picasso_Mandolin.jpg' },

    // 4단계
    { id: 'EMO_Gogh_Irises', domain: 'EMOTION', artist: '고흐', title: '붓꽃 (Irises)', img: '/images/screening/EMO_Gogh_Irises.jpg' },
    { id: 'SEN_Kandinsky_Comp7', domain: 'SENSORY', artist: '칸딘스키', title: '구성 7', img: '/images/screening/SEN_Kandinsky_Comp7.jpg' },

    // 5단계
    { id: 'EMO_Delaunay_Windows', domain: 'EMOTION', artist: '들로네', title: '시내의 창', img: '/images/screening/EMO_Delaunay_Windows.jpg' },
    { id: 'COG_Klee_Senecio', domain: 'COGNITION', artist: '클레', title: '세네치오', img: '/images/screening/COG_Klee_Senecio.jpeg' },

    // 6단계
    { id: 'SEN_Matisse_Hat', domain: 'SENSORY', artist: '마티스', title: '모자를 쓴 여인', img: '/images/screening/SEN_Matisse_Hat' },
    { id: 'SOC_Matisse_Dance', domain: 'SOCIAL', artist: '마티스', title: '춤', img: '/images/screening/SOC_Matisse_Dance.jpg' },

    // 7단계
    { id: 'COG_Munch_Madonna', domain: 'COGNITION', artist: '뭉크', title: '마돈나', img: '/images/screening/COG_Munch_Madonna.jpg' },
    { id: 'EMO_Michelangelo_Adam', domain: 'EMOTION', artist: '미켈란젤로', title: '아담의 창조', img: '/images/screening/EMO_Michelangelo_Adam.jpg' }
];
