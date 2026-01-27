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
    // 정서 (EMOTION)
    { id: 'EMO_01', domain: 'EMOTION', artist: '르누아르', title: '무도회', img: '/images/screening/EMO_Renoir_Bal.jpg' },
    { id: 'EMO_02', domain: 'EMOTION', artist: '고흐', title: '별이 빛나는 밤', img: '/images/screening/EMO_Gogh_Starry.jpg' },

    // 인지 (COGNITION)
    { id: 'COG_01', domain: 'COGNITION', artist: '뭉크', title: '절규', img: '/images/screening/COG_Munch_Scream.jpg' },
    { id: 'COG_02', domain: 'COGNITION', artist: '모네', title: '인상 일출', img: '/images/screening/COG_Monet_Sunrise.jpg' },

    // 사회 (SOCIAL)
    { id: 'SOC_01', domain: 'SOCIAL', artist: '우드', title: '아메리칸 고딕', img: '/images/screening/SOC_Wood_Gothic.jpg' },
    { id: 'SOC_02', domain: 'SOCIAL', artist: '피카소', title: '만돌린을 든 소녀', img: '/images/screening/SOC_Picasso_Mandolin.jpg' },

    // 감각 (SENSORY)
    { id: 'SEN_01', domain: 'SENSORY', artist: '칸딘스키', title: '구성 7', img: '/images/screening/SEN_Kandinsky_Comp7.jpg' },
    { id: 'SEN_02', domain: 'SENSORY', artist: '마티스', title: '춤', img: '/images/screening/SEN_Matisse_Dance.jpg' }

    // ... 앞으로 여기에 대량의 데이터를 추가할 수 있습니다.
];
