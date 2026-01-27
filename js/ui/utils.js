// 화면 컴포넌트에서 사용하는 유틸리티 함수들
import { ARTISTS_DB } from '../data/artists.js';

// === 공통 상수 ===

// 도메인별 배경색 클래스
export const DOMAIN_COLORS = {
    'EMOTION': 'bg-red',
    'COGNITION': 'bg-blue',
    'SOCIAL': 'bg-green',
    'SENSORY': 'bg-yellow'
};

// 도메인별 한글 라벨
export const DOMAIN_LABELS = {
    'EMOTION': '정서',
    'COGNITION': '인지',
    'SOCIAL': '사회',
    'SENSORY': '감각'
};

// 도메인별 이모지
export const DOMAIN_EMOJIS = {
    'EMOTION': '❤️',
    'COGNITION': '🧠',
    'SOCIAL': '🤝',
    'SENSORY': '✨'
};

// 게임별 조작 가이드 (명화의 여운을 이어주는 감성적인 가이드)
export const GAME_GUIDES = {
    'SHOOT_WATER': '💧 명화 속 생명력을 기억하며, 해바라기에 맑은 물방울을 건네주세요',
    'PUZZLE_JIGSAW': '🧩 흩어진 기억의 조각을 하나씩 맞춰, 아름다운 작품을 완성해보세요',
    'TOUCH_SMILE': '😊 작품이 주는 행복을 담아, 웃는 얼굴들을 부드럽게 터치해주세요',
    'TIMING_FISH': '🐟 고양이가 기다리는 곳에, 맛있는 생선을 기분 좋게 건네주세요',
    'BALANCE_STACK': '🍎 흔들리는 마음의 균형을 잡듯, 과일을 차곡차곡 쌓아 올려보세요',
    'RUN_FLOWER': '🌸 꽃길을 걷는 상상을 하며, 향기로운 꽃들을 가득 모아보세요',
    'OBSERVE_MATCH': '🪷 수련의 고요한 흔들림 속에서, 서로 닮은 짝을 찾아 연결해주세요',
    'SWIPE_SORT': '🧺 풍성한 수확의 기쁨을 느끼며, 과일들을 바구니에 정성껏 담아주세요',
    'TRACE_DOT': '✏️ 영감의 선을 따라 천천히 점들을 이어, 새로운 흐름을 만들어보세요',
    'MAZE_DRAG': '🏰 성으로 향하는 신비로운 길을 따라, 조심스럽게 마음의 여정을 떠나보세요',
    'FIND_HIDDEN': '🔍 명화의 따뜻한 시선으로, 숨어있는 연인들을 찾아 축복해주세요',
    'FIND_PERSON': '👥 소중한 사람을 찾는 마음으로, 그림 속 주인공을 찾아 터치해주세요',
    'STICKER_FACE': '🍇 예술가의 시선이 되어, 과일들로 나만의 개성 있는 얼굴을 꾸며보세요',
    'STICKER_NATURE': '🦋 살아있는 자연의 숨결을 느끼며, 꽃과 나비들을 자유롭게 배치해보세요',
    'DRAW_MIRROR': '✍️ 거울을 보듯 섬세한 손길로, 반대편의 아름다움을 그대로 그려보세요',
    'COLLAGE_CUTOUT': '✂️ 선을 따라 부드럽게 드래그하여, 나만의 종이 예술을 완성해보세요',
    'SOUND_CANVAS': '🎵 캔버스 위에 손을 얹고, 명화가 들려주는 아름다운 소리를 만들어보세요',
    'COLORING_FILL': '🎨 나만의 색채로 명화에 새로운 생명을 불어넣어 보세요',
    'GOLDEN_BRUSH': '✨ 황금빛 붓터치를 따라, 화면을 찬란한 빛으로 가득 채워보세요',
    'LIST_MEMO': '📝 명화 속 소중한 사물들을 기억의 상자에 차분히 담아보세요',
    'MEMORY_MATCH': '🃏 뒤집힌 카드 속에 숨겨진 명화의 짝을 찾아, 기억의 연결고리를 완성하세요',
    'RHYTHM_TAP': '🎵 들려오는 리듬에 맞춰, 명화의 선율을 손끝으로 가볍게 터치하세요',
    'QUIZ_FRUIT': '❓ 깊어진 시선으로, 정답이 있는 곳을 조용히 선택해주세요'
};

// === 공통 유틸리티 함수 ===

// 아티스트 ID로 도메인 찾기
export function getArtistDomain(artistId) {
    for (const [domain, artists] of Object.entries(ARTISTS_DB)) {
        if (artists.some(a => a.id === artistId)) {
            return domain;
        }
    }
    return 'EMOTION'; // 기본값
}

// 아티스트 ID로 배경색 클래스 가져오기
export function getArtistColor(artistId) {
    const domain = getArtistDomain(artistId);
    return DOMAIN_COLORS[domain] || 'bg-blue';
}

// 게임 가이드 메시지 가져오기 (화가 이름을 포함하여 화제 전환)
export function getGameGuide(mechanic, artistName = '') {
    const guide = GAME_GUIDES[mechanic] || '명화의 여운을 느끼며 게임을 시작해보세요';
    if (artistName) {
        return `<strong>${artistName}</strong>의 시선을 따라,<br/>${guide}`;
    }
    return guide;
}

// 매칭 이유 포맷팅: 화가 설명 앞에 줄바꿈 추가
export function formatMatchReason(text) {
    if (!text) return '';

    // "오늘은" 다음 문장이 끝나는 부분(마침표)을 찾아서 그 뒤에 줄바꿈 추가
    // 패턴: "오늘은 ..." 다음에 오는 첫 번째 마침표 뒤에 줄바꿈
    const pattern = /(오늘은[^。.]*[。.])/;
    const match = text.match(pattern);

    if (match) {
        const index = match.index + match[0].length;
        return text.slice(0, index) + '<br/><br/>' + text.slice(index).trim();
    }

    // 패턴이 매치되지 않으면 원본 반환
    return text;
}

// 한국어 조사 선택: 받침 유무에 따라 "와"/"과" 반환
export function getKoreanParticle(name) {
    if (!name || name.length === 0) return '와';

    // 마지막 글자 가져오기
    const lastChar = name[name.length - 1];
    const charCode = lastChar.charCodeAt(0);

    // 한글 유니코드 범위: AC00-D7AF
    if (charCode >= 0xAC00 && charCode <= 0xD7AF) {
        // 한글 유니코드 = (초성 * 588 + 중성 * 28 + 종성) + 0xAC00
        // 종성(받침) = (charCode - 0xAC00) % 28
        const hasBatchim = (charCode - 0xAC00) % 28 !== 0;
        return hasBatchim ? '과' : '와';
    }

    // 한글이 아니면 기본값 "와" 반환
    return '와';
}

// 화가 이름에서 수식어 제거 (예: "자연의 클림트" → "클림트")
export function getArtistNameOnly(title) {
    if (!title) return '';

    // 수식어 패턴 제거: "~의", "~는", "~한" 등으로 시작하는 수식어 제거
    // 패턴: 한글 1글자 이상 + (의|는|한|하는|꾼) + 공백 + 화가 이름
    const pattern = /^[가-힣]+(의|는|한|하는|꾼)\s+(.+)$/;

    const match = title.match(pattern);
    if (match && match[2]) {
        return match[2].trim();
    }

    // 패턴이 매치되지 않으면 원본 반환
    return title;
}
