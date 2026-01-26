// 화면 컴포넌트에서 사용하는 유틸리티 함수들

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
