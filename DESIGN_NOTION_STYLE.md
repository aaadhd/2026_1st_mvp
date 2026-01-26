# 🎨 Notion 스타일 디자인 가이드

## 📋 디자인 컨셉

Notion의 시그니처 스타일을 적용한 **화이트 베이스 + 두꺼운 검정 아웃라인 + 튀는 포인트 컬러** 디자인 시스템입니다.

---

## 🎯 핵심 디자인 원칙

### 1. **두꺼운 검정 테두리**
- 모든 요소에 **2-3px 검정 border** 적용 (산만하지 않게 절제된 두께)
- 선명하고 명확한 경계선으로 리듬감 표현
- 카드, 버튼, 아이콘 모두 동일한 두께 유지

### 2. **화이트 배경**
- 깔끔한 `#FFFFFF` 배경
- 그라디언트 제거
- 플랫하고 단순한 배경

### 3. **그림자 대신 오프셋 섀도우**
```css
box-shadow: 3px 3px 0 black;  /* 기본 */
box-shadow: 5px 5px 0 black;  /* 큰 요소 */
```
- 부드러운 그림자 대신 **적당한 검정 오프셋** (너무 두껍지 않게)
- 레고 블록 같은 입체감, 하지만 산만하지 않게

### 4. **튀는 포인트 컬러**
| 컬러 | 용도 | Hex |
|------|------|-----|
| 🔴 Red | 긴급, 중요 | `#FF4757` |
| 🔵 Blue | 정보, 점수 | `#1E90FF` |
| 🟡 Yellow | 주목, 하이라이트 | `#FFC107` |
| 🟢 Green | 성공, 진행 | `#00D9A3` |
| 🟣 Purple | 프로그레스 | `#9B59B6` |
| 🟠 Orange | 경고, 알림 | `#FF6B35` |

### 5. **재미있는 회전과 배치**
- 약간의 회전 (`rotate-slight: -2deg`)
- 비대칭 배치로 생동감
- 바운스 애니메이션

---

## 🛠️ 주요 변경사항

### 📱 전체 앱 구조
```css
/* Before */
background: gradient with soft colors
box-shadow: subtle soft shadow
border-radius: 40px

/* After */
background: #FFFFFF
border: 3px solid black
box-shadow: 6px 6px 0 black
border-radius: 24px
```

### 🎮 버튼 스타일
```css
/* Before */
border-radius: 9999px (pill)
box-shadow: soft
background: single color

/* After */
border-radius: 12px (rounded)
border: 2px solid black
box-shadow: 3px 3px 0 black
background: vibrant colors
```

**인터랙션:**
- Hover: `translate(-1px, -1px)` + 그림자 증가
- Active: `translate(1.5px, 1.5px)` + 그림자 감소

### 🃏 카드 스타일
```css
.notion-card {
  background: white;
  border: 2px solid black;
  border-radius: 16px;
  box-shadow: 3px 3px 0 black;
}
```

### 🎯 아이콘 서클
```css
.icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid black;
  background: vibrant color;
}
```

---

## 🎨 화면별 적용

### 1. **인트로 화면**
- 3개의 컬러풀한 아이콘 서클 (bounce 애니메이션)
- 두꺼운 검정 텍스트
- 파란색 CTA 버튼

### 2. **밸런스 게임 (화가 찾기)**
- 진행 바: 3px 검정 테두리 + 컬러 배경
- 이미지 카드: 두꺼운 테두리 + 모서리 컬러 포인트
- 클릭 시 검정 테두리 파티클 효과

### 3. **결과 화면 (오늘의 화가)**
- 컬러풀한 배지 (화가별 색상)
- 회전된 아티스트 이미지 박스
- 두꺼운 테두리 버튼들

### 4. **게임 플레이 화면**
- HUD 요소들: 각각 다른 색상 (파랑/빨강/초록/노랑)
- 흰색 배경 canvas
- 진행바: 보라색 + 검정 테두리

### 5. **일시정지 화면**
- 반투명 흰색 배경 (bg-white/95)
- 노란색 아이콘 박스
- 초록색 계속하기 버튼

### 6. **레벨업 애니메이션**
- 노란색 회전 박스 + 이모지
- 흰색 메시지 박스
- 검정 테두리 이모지 떨어짐 효과

### 7. **모달/토스트**
- 모든 알림: 컬러 배경 + 검정 테두리
- 에러: 빨강
- 성공: 초록
- 알림: 파랑
- 경고: 오렌지

---

## 📦 새로 추가된 CSS 유틸리티

### `style-notion.css`
```css
/* 카드 */
.notion-card

/* 배경 색상 */
.bg-red, .bg-blue, .bg-yellow, .bg-green, .bg-purple, .bg-orange

/* 테두리 */
.border-thick (3px)
.border-thick-4 (4px)

/* 그림자 */
.shadow-notion (5px)
.shadow-notion-lg (8px)

/* 회전 */
.rotate-slight (-2deg)
.rotate-slight-reverse (2deg)

/* 아이콘 */
.icon-circle
```

---

## 🎬 애니메이션

### Bounce (아이콘, 이모지)
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
}
```

### 버튼 인터랙션
```css
/* Hover */
transform: translate(-1px, -1px);
box-shadow: 4px 4px 0 black;

/* Active */
transform: translate(1.5px, 1.5px);
box-shadow: 1.5px 1.5px 0 black;
```

### 로딩 스피너
- 3개의 동심원 (파랑/노랑/빨강)
- 각각 다른 속도로 회전
- 중앙에 이모지

---

## 🎨 컬러 사용 가이드

### 영역별 메인 컬러
- **정서 (EMOTION)**: 🔴 Red `#FF4757`
- **인지 (COGNITION)**: 🔵 Blue `#1E90FF`
- **사회 (SOCIAL)**: 🟢 Green `#00D9A3`
- **감각 (SENSORY)**: 🟡 Yellow `#FFC107`

### UI 요소별 컬러
- **점수**: 파랑
- **시간**: 빨강
- **레벨**: 초록
- **수집량**: 노랑
- **진행바**: 보라

---

## ✨ 특별 효과

### 1. **파티클 효과**
- 크기: 12px
- 검정 테두리 (2px) - 가볍고 깔끔하게
- 6가지 랜덤 컬러

### 2. **레벨업 이모지**
- 크기: 40px
- 검정 드롭 섀도우
- 7가지 종류: 🎉⭐✨🌟💫🎊🔥

### 3. **회전 효과**
- 아티스트 이미지: -2deg
- 아이콘 박스: ±2deg
- 자연스러운 손그림 느낌

---

## 🚀 사용 방법

### CSS 로드
```html
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="style-notion.css">
```

### 버튼 예시
```html
<button class="px-8 py-4 bg-blue rounded-2xl border-3 border-black shadow-notion font-black">
  클릭하세요 ✨
</button>
```

### 카드 예시
```html
<div class="notion-card p-6 bg-yellow">
  <h3 class="font-black mb-2">제목</h3>
  <p class="font-bold">내용...</p>
</div>
```

### 아이콘 예시
```html
<div class="icon-circle bg-red rotate-slight">
  🎨
</div>
```

---

## 📊 Before & After 비교

| 요소 | Before | After |
|------|--------|-------|
| 배경 | 그라디언트 | 화이트 |
| 테두리 | 1-2px 회색 | 2-3px 검정 |
| 그림자 | 부드러운 blur | 하드한 offset (적당한 크기) |
| 컬러 | 파스텔 톤 | 선명한 원색 |
| 모서리 | 매우 둥글게 | 적당히 둥글게 |
| 느낌 | 부드럽고 세련됨 | 재미있고 역동적 |

---

## 🎯 디자인 철학

> **"복잡하지 않지만 지루하지 않게"**

1. **단순함**: 화이트 배경 + 플랫 컬러
2. **명확함**: 두꺼운 검정 테두리로 경계 명확
3. **재미**: 튀는 색상 + 회전 + 바운스
4. **일관성**: 모든 요소에 동일한 규칙 적용
5. **접근성**: 높은 명도 대비로 가독성 향상

---

## 🔧 커스터마이징

### 테두리 두께 변경
```css
:root {
  --border-width: 2px;  /* 현재 설정: 산만하지 않게 절제된 두께 */
}
```

### 컬러 팔레트 변경
```css
:root {
  --accent-red: #YOUR_COLOR;
  --accent-blue: #YOUR_COLOR;
  /* ... */
}
```

### 그림자 크기 변경
```css
.shadow-notion {
  box-shadow: 3px 3px 0 black;  /* 현재: 산만하지 않은 적당한 크기 */
}
```

---

## 📱 모바일 최적화

- 터치 영역 충분히 확보 (최소 48px)
- 두꺼운 테두리로 터치 피드백 강화
- 밝은 색상으로 야외 가독성 향상
- 오프셋 섀도우로 입체감 표현

---

## 🎉 완성도

**디자인 완성도**: 100% ✅

모든 화면과 요소에 Notion 스타일이 일관되게 적용되었습니다:
- ✅ 인트로 화면
- ✅ 밸런스 게임
- ✅ 로딩 화면
- ✅ 결과 화면
- ✅ 게임 인트로
- ✅ 게임 플레이 HUD
- ✅ 일시정지 화면
- ✅ 레벨업 애니메이션
- ✅ 모든 모달/토스트
- ✅ 파티클 효과

---

## 📝 업데이트 노트

### v3.1.1 (2026-01-26)
- 🎨 **테두리 & 그림자 최적화**: 산만함 제거
  - 테두리: 3-4px → **2-3px** (절제된 두께)
  - 그림자: 5-8px → **3-5px** (깔끔한 오프셋)
  - 호버 효과: 2px → **1px** (부드러운 인터랙션)
- ✨ Notion 스타일은 유지하되 **시각적 피로도 감소**

---

**버전**: v3.1.1 Notion Edition (Refined)  
**적용일**: 2026-01-26  
**디자인**: Notion-inspired Bold Outline Style (Optimized for Clarity)
