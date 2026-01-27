/**
 * 🎨 스크리닝(밸런스 게임)용 명화 및 페어 데이터
 * 
 * [파일명 규칙]
 * 영역코드_화가명_작품명.jpg
 * - 정서: EMO_
 * - 인지: COG_
 * - 사회: SOC_
 * - 감각: SEN_
 */

// 1. 기본 이미지 데이터베이스 (나중에 랜덤화를 위해 확장 가능)
export const SCREENING_ASSETS = [
    { id: 'SOC_Renoir_Bal', domain: 'SOCIAL', artist: '르누아르', title: '물랭 드 라 갈레트의 무도회', img: '/images/screening/SOC_Renoir_Bal.jpg' },
    { id: 'EMO_Gogh_Starry', domain: 'EMOTION', artist: '고흐', title: '별이 빛나는 밤', img: '/images/screening/EMO_Gogh_Starry.jpg' },
    { id: 'COG_Munch_Scream', domain: 'COGNITION', artist: '뭉크', title: '절규', img: '/images/screening/COG_Munch_Scream.jpg' },
    { id: 'SEN_Monet_Sunrise', domain: 'SENSORY', artist: '모네', title: '인상 일출', img: '/images/screening/SEN_Monet_Sunrise.jpg' },
    { id: 'SOC_Wood_Gothic', domain: 'SOCIAL', artist: '우드', title: '아메리칸 고딕', img: '/images/screening/SOC_Wood_Gothic.jpg' },
    { id: 'COG_Picasso_Mandolin', domain: 'COGNITION', artist: '피카소', title: '만돌린을 든 소녀', img: '/images/screening/COG_Picasso_Mandolin.jpg' },
    { id: 'EMO_Gogh_Irises', domain: 'EMOTION', artist: '고흐', title: '붓꽃 (Irises)', img: '/images/screening/EMO_Gogh_Irises.jpg' },
    { id: 'SEN_Kandinsky_Comp7', domain: 'SENSORY', artist: '칸딘스키', title: '구성 7', img: '/images/screening/SEN_Kandinsky_Comp7.jpg' },
    { id: 'EMO_Delaunay_Windows', domain: 'EMOTION', artist: '들로네', title: '시내의 창', img: '/images/screening/EMO_Delaunay_Windows.jpg' },
    { id: 'COG_Klee_Senecio', domain: 'COGNITION', artist: '클레', title: '세네치오', img: '/images/screening/COG_Klee_Senecio.jpeg' },
    { id: 'SEN_Matisse_Hat', domain: 'SENSORY', artist: '마티스', title: '모자를 쓴 여인', img: '/images/screening/SEN_Matisse_Hat' },
    { id: 'SOC_Matisse_Dance', domain: 'SOCIAL', artist: '마티스', title: '춤', img: '/images/screening/SOC_Matisse_Dance.jpg' },
    { id: 'COG_Munch_Madonna', domain: 'COGNITION', artist: '뭉크', title: '마돈나', img: '/images/screening/COG_Munch_Madonna.jpg' },
    { id: 'EMO_Michelangelo_Adam', domain: 'EMOTION', artist: '미켈란젤로', title: '아담의 창조', img: '/images/screening/EMO_Michelangelo_Adam.jpg' }
];

// 2. 현재 스크리닝에서 사용하는 7가지 페어 구성 (정적인 순서)
export const SCREENING_PAIRS = [
    {
        d1: 'SOCIAL', d2: 'EMOTION',
        img1: "/images/screening/SOC_Renoir_Bal.jpg",
        img2: "/images/screening/EMO_Gogh_Starry.jpg",
        t1: "함께하는 기쁨", t2: "따뜻한 위로",
        artist1: "르누아르", artist2: "고흐"
    },
    {
        d1: 'COGNITION', d2: 'SENSORY',
        img1: "/images/screening/COG_Munch_Scream.jpg",
        img2: "/images/screening/SEN_Monet_Sunrise.jpg",
        t1: "흥미로운 생각", t2: "화려한 감각",
        artist1: "뭉크", artist2: "모네"
    },
    {
        d1: 'SOCIAL', d2: 'COGNITION',
        img1: "/images/screening/SOC_Wood_Gothic.jpg",
        img2: "/images/screening/COG_Picasso_Mandolin.jpg",
        t1: "사람들 속으로", t2: "지적인 탐구",
        artist1: "우드", artist2: "피카소"
    },
    {
        d1: 'EMOTION', d2: 'SENSORY',
        img1: "/images/screening/EMO_Gogh_Irises.jpg",
        img2: "/images/screening/SEN_Kandinsky_Comp7.jpg",
        t1: "감성의 숲", t2: "질서있는 아름다움",
        artist1: "고흐", artist2: "칸딘스키"
    },
    {
        d1: 'EMOTION', d2: 'COGNITION',
        img1: "/images/screening/EMO_Delaunay_Windows.jpg",
        img2: "/images/screening/COG_Klee_Senecio.jpeg",
        t1: "꿈과 낭만", t2: "논리와 체계",
        artist1: "들로네", artist2: "클레"
    },
    {
        d1: 'SENSORY', d2: 'SOCIAL',
        img1: "/images/screening/SEN_Matisse_Hat",
        img2: "/images/screening/SOC_Matisse_Dance.jpg",
        t1: "소리와 색채", t2: "축제와 어울림",
        artist1: "마티스", artist2: "마티스"
    },
    {
        d1: 'COGNITION', d2: 'EMOTION',
        img1: "/images/screening/COG_Munch_Madonna.jpg",
        img2: "/images/screening/EMO_Michelangelo_Adam.jpg",
        t1: "탐구의 즐거움", t2: "순수한 행복",
        artist1: "뭉크", artist2: "미켈란젤로"
    }
];

// 하위 호환성을 위해 유지했던 별칭 제거 (스크립트 통일 완료)
// export const SCREENING_POOL = SCREENING_ASSETS;
