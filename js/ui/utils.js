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

// 게임별 조작 가이드
export const GAME_GUIDES = {
    'SHOOT_WATER': '💧 물방울을 터치해서 해바라기에 물을 주세요',
    'PUZZLE_JIGSAW': '🧩 빈 공간 옆의 조각을 터치해서 이동시켜 그림을 완성하세요',
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

// 게임 가이드 메시지 가져오기
export function getGameGuide(mechanic) {
    return GAME_GUIDES[mechanic] || '터치와 드래그로 게임을 즐겨보세요';
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
