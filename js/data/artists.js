// 🎨 20인의 아티스트 & 데이터
// desc 수정: 활동의 '인지적/정서적 이점'을 강조하는 문구로 변경
export const ARTISTS_DB = {
    EMOTION: [
        {
            id: 'YIAM', title: '따뜻한 이암', sub: '애착', gameTitle: '모견도 퍼즐', color: '#fb7185', textColor: '#e11d48', artistEmoji: '👨‍🎨', gameEmoji: '🐕', artistImg: '/images/painters/artist_YIAM.png', mechanic: 'PUZZLE_JIGSAW', desc: '흩어진 조각을 맞추며 집중력과 성취감을 느껴보세요.',
            masterpieceImage: '/images/artworks/yiam_mother_dog.jpg', masterpieceTitle: '모견도(母犬圖)', masterpieceDesc: '어미 개와 강아지의 따스한 눈맞춤에서 조건 없는 사랑을 느껴보세요.'
        },
        {
            id: 'RENOIR', title: '행복한 르누아르', sub: '기쁨', gameTitle: '스마일 캐치', color: '#f472b6', textColor: '#db2777', artistEmoji: '👨‍🎨', gameEmoji: '😊', artistImg: '/images/painters/artist_RENOIR.png', mechanic: 'TOUCH_SMILE', desc: '우울한 표정을 밝은 미소로 바꾸며 긍정 에너지를 채워보세요.',
            masterpieceImage: '/images/artworks/renoir_luncheon.jpg', masterpieceTitle: '뱃놀이 파티의 점심', masterpieceDesc: '햇살 아래 친구들과 나누는 즐거운 대화와 웃음소리가 들리는 듯합니다.'
        },
        {
            id: 'CHAGALL', title: '꿈꾸는 샤갈', sub: '낭만', gameTitle: '사랑의 비행', color: '#818cf8', textColor: '#4f46e5', artistEmoji: '👨‍🎨', gameEmoji: '💕', artistImg: '/images/painters/artist_CHAGALL.png', mechanic: 'RUN_FLOWER', desc: '자유롭게 하늘을 날며 몽환적인 해방감을 경험해보세요.',
            masterpieceImage: '/images/artworks/chagall_lovers.jpg', masterpieceTitle: '에펠탑의 신랑신부', masterpieceDesc: '사랑에 빠지면 하늘을 나는 기분, 그 설렘을 환상적으로 표현했어요.'
        },
        {
            id: 'GOGH', title: '강렬한 고흐', sub: '열정', gameTitle: '해바라기 피우기', color: '#eab308', textColor: '#a16207', artistEmoji: '👨‍🎨', gameEmoji: '🌻', artistImg: '/images/painters/artist_GOGH.png', mechanic: 'SHOOT_WATER', desc: '메마른 꽃에 물을 주며 생명력을 불어넣는 보람을 느껴보세요.',
            masterpieceImage: '/images/artworks/gogh_sunflowers.jpg', masterpieceTitle: '해바라기', masterpieceDesc: '태양을 향해 타오르는 노란빛에서 삶에 대한 뜨거운 열정이 느껴집니다.'
        },
        {
            id: 'PAULA', title: '순수한 파울라', sub: '조화', gameTitle: '과일 탑 쌓기', color: '#fb923c', textColor: '#ea580c', artistEmoji: '👩‍🎨', gameEmoji: '🍎', artistImg: '/images/painters/artist_PAULA.png', mechanic: 'BALANCE_STACK', desc: '과일이 무너지지 않게 조심스럽게 쌓으며 균형과 조화를 느껴보세요.',
            masterpieceImage: '/images/artworks/paula_still_life.jpg', masterpieceTitle: '정물', masterpieceDesc: '소박한 과일들에 담긴 자연의 색감과 조화로운 아름다움을 감상해보세요.'
        }
    ],
    COGNITION: [
        {
            id: 'ARCIMBOLDO', title: '기발한 아르침볼도', sub: '창의', gameTitle: '얼굴 꾸미기', color: '#f97316', textColor: '#c2410c', artistEmoji: '👨‍🎨', gameEmoji: '🍇', artistImg: '/images/painters/artist_ARCIMBOLDO.png', mechanic: 'STICKER_FACE', desc: '서로 다른 사물을 조합해 새로운 형태를 만들며 인지적 유연성을 기르세요.',
            masterpieceImage: '/images/artworks/arcimboldo_seasons.jpg', masterpieceTitle: '사계', masterpieceDesc: '자세히 보면 꽃과 과일이지만, 멀리서 보면 사람의 얼굴이 되는 마법!'
        },
        {
            id: 'MONET_COG', title: '관찰의 모네', sub: '집중', gameTitle: '수련 관찰', color: '#60a5fa', textColor: '#2563eb', artistEmoji: '👨‍🎨', gameEmoji: '🪷', artistImg: '/images/painters/artist_MONET_COG.png', mechanic: 'OBSERVE_MATCH', desc: '꽃의 미세한 차이를 찾아내며 깊은 관찰력과 집중력을 기르세요.',
            masterpieceImage: '/images/artworks/monet_waterlilies.jpg', masterpieceTitle: '수련', masterpieceDesc: '빛에 따라 시시각각 변하는 물 위의 정원, 그 찰나의 순간을 포착했습니다.'
        },
        {
            id: 'CAILLEBOTTE', title: '질서의 카유보트', sub: '체계', gameTitle: '과일 정리', color: '#10b981', textColor: '#047857', artistEmoji: '👨‍🎨', gameEmoji: '🧺', artistImg: '/images/painters/artist_CAILLEBOTTE.png', mechanic: 'SWIPE_SORT', desc: '사물을 기준에 맞춰 분류하며 논리적 사고와 정돈 습관을 기르세요.',
            masterpieceImage: '/images/artworks/caillebotte_fruit.jpg', masterpieceTitle: '과일 진열대', masterpieceDesc: '잘 정돈된 과일들에서 느껴지는 질서와 풍요로움의 미학을 발견해보세요.'
        },
        {
            id: 'SEURAT', title: '치밀한 쇠라', sub: '구성', gameTitle: '점 잇기', color: '#14b8a6', textColor: '#0f766e', artistEmoji: '👨‍🎨', gameEmoji: '⚫', artistImg: '/images/painters/artist_SEURAT.png', mechanic: 'TRACE_DOT', desc: '순서대로 점을 이으며 인내심과 시각-운동 협응력을 키워보세요.',
            masterpieceImage: '/images/artworks/seurat_grande_jatte.jpg', masterpieceTitle: '그랑드 자트 섬의 일요일 오후', masterpieceDesc: '수만 개의 작은 점들이 모여 만들어낸 평화로운 휴일의 풍경입니다.'
        },
        {
            id: 'DAVINCI', title: '탐구하는 다빈치', sub: '해독', gameTitle: '대칭 그리기', color: '#64748b', textColor: '#334155', artistEmoji: '👨‍🎨', gameEmoji: '✍️', artistImg: '/images/painters/artist_DAVINCI.png', mechanic: 'DRAW_MIRROR', desc: '반대쪽 그림을 유추하여 완성하며 공간 지각력을 훈련해보세요.',
            masterpieceImage: '/images/artworks/davinci_vitruvian.jpg', masterpieceTitle: '비트루비우스 인체도', masterpieceDesc: '인체의 완벽한 비례와 대칭에서 우주의 신비를 찾으려 했던 거장의 탐구심.'
        }
    ],
    SOCIAL: [
        {
            id: 'SAIMDANG', title: '섬세한 신사임당', sub: '교감', gameTitle: '초충도 꾸미기', color: '#16a34a', textColor: '#166534', artistEmoji: '👩‍🎨', gameEmoji: '🦋', artistImg: '/images/painters/artist_SAIMDANG.png', mechanic: 'STICKER_NATURE', desc: '풀벌레들의 조화로운 어울림을 표현하며 자연과의 교감을 느껴보세요.',
            masterpieceImage: '/images/artworks/saimdang_insects.jpg', masterpieceTitle: '초충도', masterpieceDesc: '작은 풀벌레 하나도 소중히 여겼던 마음이 섬세한 붓터치에 담겨있습니다.'
        },
        {
            id: 'TISSOT', title: '유쾌한 티소', sub: '기억', gameTitle: '소풍 준비', color: '#f43f5e', textColor: '#be123c', artistEmoji: '👨‍🎨', gameEmoji: '🧺', artistImg: '/images/painters/artist_TISSOT.png', mechanic: 'LIST_MEMO', desc: '친구들을 위한 준비물을 챙기며 배려심과 기억력을 함께 키워보세요.',
            masterpieceImage: '/images/artworks/tissot_picnic.jpg', masterpieceTitle: '휴일', masterpieceDesc: '화창한 날, 사랑하는 사람들과 함께하는 소풍의 설렘과 여유가 느껴지나요?'
        },
        {
            id: 'YUNBOK', title: '풍류의 신윤복', sub: '통찰', gameTitle: '숨은 연인 찾기', color: '#0891b2', textColor: '#155e75', artistEmoji: '👨‍🎨', gameEmoji: '💑', artistImg: '/images/painters/artist_YUNBOK.png', mechanic: 'FIND_HIDDEN', desc: '복잡한 상황 속에서 맥락을 파악하고 대상을 찾는 통찰력을 기르세요.',
            masterpieceImage: '/images/artworks/yunbok_lovers.jpg', masterpieceTitle: '월하정인', masterpieceDesc: '달빛 아래 두 사람, 그들만의 은밀하고 애틋한 이야기가 궁금해집니다.'
        },
        {
            id: 'BRUEGEL', title: '이야기꾼 브뤼겔', sub: '사회', gameTitle: '마을 축제', color: '#b45309', textColor: '#78350f', artistEmoji: '👨‍🎨', gameEmoji: '🎉', artistImg: '/images/painters/artist_BRUEGEL.png', mechanic: 'FIND_PERSON', desc: '다양한 사람들의 표정을 살피며 사회적 상황을 이해하는 눈을 기르세요.',
            masterpieceImage: '/images/artworks/bruegel_wedding.jpg', masterpieceTitle: '농민의 결혼식', masterpieceDesc: '왁자지껄한 마을 잔치, 사람 냄새 나는 정겨운 풍경 속에 빠져보세요.'
        },
        {
            id: 'BONNARD', title: '다정한 보나르', sub: '배려', gameTitle: '고양이 밥 주기', color: '#f97316', textColor: '#c2410c', artistEmoji: '👨‍🎨', gameEmoji: '🐱', artistImg: '/images/painters/artist_BONNARD.png', mechanic: 'TIMING_FISH', desc: '상대의 움직임을 살피고 타이밍을 맞추며 타인에 대한 관심을 표현하세요.',
            masterpieceImage: '/images/artworks/bonnard_cat.jpg', masterpieceTitle: '흰 고양이', masterpieceDesc: '다리를 쭉 뻗은 고양이의 귀여운 모습, 일상의 작은 행복을 포착했어요.'
        }
    ],
    SENSORY: [
        {
            id: 'MACKE', title: '색채의 마케', sub: '시각', gameTitle: '동물 색칠', color: '#38bdf8', textColor: '#0284c7', artistEmoji: '👨‍🎨', gameEmoji: '🦁', artistImg: '/images/painters/artist_MACKE.png', mechanic: 'COLORING_FILL', desc: '다채로운 색을 입히며 시각적 즐거움과 심리적 안정을 찾아보세요.',
            masterpieceImage: '/images/artworks/macke_zoological.jpg', masterpieceTitle: '동물원', masterpieceDesc: '단순화된 형태와 맑은 색채가 어우러진 동물원의 평화로운 풍경입니다.'
        },
        {
            id: 'MATISSE', title: '야수의 마티스', sub: '촉각', gameTitle: '종이 오리기', color: '#ef4444', textColor: '#b91c1c', artistEmoji: '👨‍🎨', gameEmoji: '✂️', artistImg: '/images/painters/artist_MATISSE.png', mechanic: 'COLLAGE_CUTOUT', desc: '손끝으로 형태를 만들고 배치하며 감각적인 즐거움을 느껴보세요.',
            masterpieceImage: '/images/artworks/matisse_cutouts.jpg', masterpieceTitle: '달팽이', masterpieceDesc: '가위로 오린 색종이들이 춤추듯 화면을 구성하며 리듬감을 만들어냅니다.'
        },
        {
            id: 'KANDINSKY', title: '선율의 칸딘스키', sub: '청각', gameTitle: '소리 드로잉', color: '#a855f7', textColor: '#7e22ce', artistEmoji: '👨‍🎨', gameEmoji: '🎵', artistImg: '/images/painters/artist_KANDINSKY.png', mechanic: 'SOUND_CANVAS', desc: '보이는 것과 들리는 것을 연결하며 공감각적 상상력을 자극해보세요.',
            masterpieceImage: '/images/artworks/kandinsky_composition.jpg', masterpieceTitle: '구성 VII', masterpieceDesc: '마치 교향곡이 들리는 듯, 다채로운 색과 선들이 웅장한 화음을 이룹니다.'
        },
        {
            id: 'KLIMT_SEN', title: '자연의 클림트', sub: '장식', gameTitle: '황금 정원', color: '#ca8a04', textColor: '#854d0e', artistEmoji: '👨‍🎨', gameEmoji: '✨', artistImg: '/images/painters/artist_KLIMT_SEN.png', mechanic: 'GOLDEN_BRUSH', desc: '화려한 황금빛으로 화면을 채우며 미적 만족감과 풍요로움을 느껴보세요.',
            masterpieceImage: '/images/artworks/klimt_garden.jpg', masterpieceTitle: '꽃이 있는 농장 정원', masterpieceDesc: '화면 가득 피어난 꽃들의 향연, 자연이 주는 최고의 아름다움입니다.'
        },
        {
            id: 'KLEE', title: '동심의 클레', sub: '공간', gameTitle: '선 따라가기', color: '#92400e', textColor: '#78350f', artistEmoji: '👨‍🎨', gameEmoji: '🏰', artistImg: '/images/painters/artist_KLEE.png', mechanic: 'MAZE_DRAG', desc: '길을 잃지 않고 나아가며 공간 지각력과 문제 해결력을 키워보세요.',
            masterpieceImage: '/images/artworks/klee_castle.jpg', masterpieceTitle: '성과 태양', masterpieceDesc: '아이의 눈으로 본 듯, 단순한 도형으로 쌓아 올린 상상의 세계입니다.'
        }
    ]
};

// 매칭 이유 데이터 (4단계 구조: 맥락 → 제안 → 화가소개 → 권유)
export const MATCH_REASONS = {
    YIAM: '선택하신 그림들을 보니, 따뜻한 위로가 필요해 보여요. 오늘은 사랑스러운 존재와의 연결을 느껴보세요. 이암은 반려견의 순수한 눈망울과 충성스러운 모습을 서정적으로 그려낸 화가입니다. 이암과 함께 퍼즐을 맞추며 마음에 안정과 애착을 채워보세요.',
    RENOIR: '선택하신 그림들을 보니, 밝은 웃음이 필요해 보여요. 오늘은 행복한 순간을 만들어보세요. 르누아르는 "행복을 그리고 싶다"고 말하며 사람들의 환한 미소를 화폭에 담았습니다. 르누아르와 함께 우울한 표정을 미소로 바꾸며 기쁨을 깨워보세요.',
    CHAGALL: '선택하신 그림들을 보니, 낭만적인 꿈꿔보기가 필요해 보여요. 오늘은 사랑의 설렘을 느껴보세요. 샤갈은 사랑하는 연인과 하늘을 나는 꿈같은 장면을 그려 "사랑의 화가"로 불립니다. 샤갈과 함께 하늘을 날며 마음속 낭만을 깨워보세요.',
    GOGH: '선택하신 그림들을 보니, 강렬한 열정이 필요해 보여요. 오늘은 생명력을 불태워보세요. 고흐는 해바라기에 "타오르는 태양"을 담아 삶에 대한 열정을 표현했습니다. 고흐과 함께 메마른 꽃에 물을 주며 내 안의 열정을 깨워보세요.',
    PAULA: '선택하신 그림들을 보니, 마음의 균형이 필요해 보여요. 오늘은 조화로운 순간을 만들어보세요. 파울라는 소박한 자연물을 통해 인간과 자연의 조화를 표현했습니다. 파울라와 함께 과일을 조심스레 쌓으며 내면의 균형을 찾아보세요.',
    ARCIMBOLDO: '선택하신 그림들을 보니, 창의적인 자극이 필요해 보여요. 오늘은 고정관념을 깨봐보세요. 아르침볼도는 과일과 채소로 사람의 얼굴을 구성하는 기발한 발상으로 유명합니다. 아르침볼도와 함께 얼굴을 꾸미며 나만의 창의력을 발휘해보세요.',
    MONET_COG: '선택하신 그림들을 보니, 깊은 집중력이 필요해 보여요. 오늘은 세상을 세심히 관찰해보세요. 모네는 같은 수련을 250번 넘게 그리며 빛의 미세한 차이를 포착했습니다. 모네와 함께 꽃의 작은 차이를 찾으며 관찰력을 길러보세요.',
    CAILLEBOTTE: '선택하신 그림들을 보니, 체계적인 정리가 필요해 보여요. 오늘은 질서의 즐거움을 느껴보세요. 카유보트는 과일 진열대의 정돈된 아름다움을 사실적으로 그려냈습니다. 카유보트와 함께 과일을 분류하며 논리적 사고를 키워보세요.',
    SEURAT: '선택하신 그림들을 보니, 치밀한 구성력이 필요해 보여요. 오늘은 인내심을 길러보세요. 쇠라는 수만 개의 점을 찍어 하나의 그림을 완성하는 점묘법을 창시했습니다. 쇠라와 함께 점을 하나씩 이으며 완성의 기쁨을 느껴보세요.',
    DAVINCI: '선택하신 그림들을 보니, 탐구하는 마음이 필요해 보여요. 오늘은 숨겨진 패턴을 찾아보세요. 다빈치는 거울 글씨로 노트를 작성하며 대칭과 패턴의 비밀을 탐구했습니다. 다빈치와 함께 대칭 그림을 그리며 공간 지각력을 깨워보세요.',
    SAIMDANG: '선택하신 그림들을 보니, 자연과의 교감이 필요해 보여요. 오늘은 생명의 아름다움을 느껴보세요. 신사임당은 풀볌레와 꽃의 조화를 이「초충도」에 섬세하게 담아냈습니다. 신사임당과 함께 자연을 꾸미며 마음의 평온함을 찾아보세요.',
    TISSOT: '선택하신 그림들을 보니, 두근거리는 기대감을 느낄 순간이 필요해 보여요. 오늘은 설레는 마음을 채워보세요. 티소는 아름다운 정원에서 열리는 파티와 사교 모임의 활기찬 분위기를 화폭에 담았습니다. 티소와 함께 즐거운 나들이를 준비하며 마음속 설렘을 깨워보세요.',
    YUNBOK: '선택하신 그림들을 보니, 세상을 통찰하는 눈이 필요해 보여요. 오늘은 숨겨진 관계를 발견해보세요. 신윤복은 조선시대 남녀의 은밀한 사랑과 풍속을 위트 있게 그려냈습니다. 신윤복과 함께 숨은 연인을 찾으며 통찰력을 길러보세요.',
    BRUEGEL: '선택하신 그림들을 보니, 사람들과 어울리는 즐거움이 필요해 보여요. 오늘은 축제의 들뜸을 느껴보세요. 브뤼겔은 마을 축제에서 즐기는 수백 명의 사람들을 생동감 있게 그려냈습니다. 브뤼겔과 함께 축제의 주인공을 찾으며 사회적 관찰력을 키워보세요.',
    BONNARD: '선택하신 그림들을 보니, 누군가를 돌보는 따뜻함이 필요해 보여요. 오늘은 사랑을 표현해보세요. 보나르는 사랑하는 고양이와 가족의 일상을 따스한 색채로 그려냈습니다. 보나르와 함께 고양이에게 밥을 주며 돌보는 기쁨을 느껴보세요.',
    MACKE: '선택하신 그림들을 보니, 시각적인 힐링이 필요해 보여요. 오늘은 색채로 마음을 채워보세요. 마케는 아프리카 여행에서 만난 색채의 향연을 화폭에 밝게 담아냈습니다. 마케와 함께 색을 칠하며 시각적 즐거움을 느껴보세요.',
    MATISSE: '선택하신 그림들을 보니, 손끝의 감각이 필요해 보여요. 오늘은 자유롭게 형태를 만들어보세요. 마티스는 말년에 종이를 오려 작품을 만들며 "가위로 그림을 그린다"고 말했습니다. 마티스와 함께 종이를 자르고 배치하며 창작의 기쁨을 느껴보세요.',
    KANDINSKY: '선택하신 그림들을 보니, 감각의 확장이 필요해 보여요. 오늘은 색과 소리를 연결해보세요. 칸딘스키는 "색채는 음악처럼 영혼을 울린다"고 믿으며 추상미술을 창시했습니다. 칸딘스키와 함께 소리로 그림을 그리며 공감각을 깨워보세요.',
    KLIMT_SEN: '선택하신 그림들을 보니, 화려한 아름다움이 필요해 보여요. 오늘은 황금빛 풍요를 느껴보세요. 클림트는 "황금의 화가"로 불리며 화려한 장식적 아름다움을 사랑했습니다. 클림트와 함께 황금빛으로 화면을 칠하며 미적 만족감을 얻어보세요.',
    KLEE: '선택하신 그림들을 보니, 동심의 모험이 필요해 보여요. 오늘은 상상의 세계로 떠나보세요. 클레는 "예술은 보이는 것을 재현하는 게 아니라 보이게 하는 것"이라고 말했습니다. 클레와 함께 선을 따라가며 상상력의 문을 열어보세요.'
};

// 매칭 이유를 아티스트 데이터에 연결
Object.values(ARTISTS_DB).flat().forEach(a => {
    a.matchReason = MATCH_REASONS[a.id] || `선택하신 그림들을 보니, ${a.sub} 에너지가 필요해 보여요. ${a.title}와 함께 채워보세요.`;
});
