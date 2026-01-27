# MVP 관점 전체 점검 (최신)

**검토일**: 2026-01-27  
**대상**: 신나는 그림약방 1차 MVP  
**기준**: PRD v0.4 검증 가설 및 Success Criteria, **현재 구현 반영**

---

## 1. 현재 앱 플로우 맵 (갱신)

```
INTRO (인트로)
   ↓ [오늘의 아트 세션 시작]
TUNING (밸런스 게임 7단계) ← 뒤로가기 시 이전 단계 (✓ 내가 고른 것 표시)
   ↓ 7번째 선택 후
LOADING (매칭 중…)
   ↓ 자동 또는 스킵
RESULT (오늘의 아트 메이트)
   ├─ [화가와 아트 세션 시작하기] → showMasterpieceClip ? CLIP_INTRO : PLAYING
   │   (showMasterpieceClip: localStorage 기본 true, UI 토글 없음)
   ├─ [선택 다시하기] → TUNING
   └─ [아트 게임 모아보기] → HUB

CLIP_INTRO (명화 클립) → [아트 게임 시작하기] → PLAYING
MASTERPIECE (작품 감상 전체화면) ← CLIP_INTRO에서 이미지 터치 시

HUB (아트 게임 모아보기)
   ├─ "명화 클립 같이 보기" 체크박스 없음 (제거됨)
   ├─ 오늘의 추천 아트 게임 (노란 카드) → startLevelIntro() → 바로 PLAYING
   ├─ 전체 / 정서 / 인지 / 사회 / 감각 탭
   └─ 게임 카드 클릭 → playNext(id) → startLevelIntro() → 바로 PLAYING (명화 보기 건너뜀)

PLAYING (게임) → 완료/실패 시
   ↓
GAME_RESULT (게임 종료!)
   ├─ [다시 도전하기] → PLAYING
   ├─ [아트 게임 모아보기] → HUB
   └─ {도메인} 추천 게임 가로 스크롤 → playNext(id) → PLAYING
```

---

## 2. MVP 관점 체크리스트

### 2.1 검증 가설 대비 (PRD 2.2)

| 가설 | 내용 | 현재 구현 상태 |
|------|------|-----------------|
| 가설 1 | 밸런스 게임 형태 스크리닝 → 거부감 없이 다음 단계 진입 | ✅ 7단계 VS 선택, 뒤로가기·선택 표시, 프로그레스 바 |
| 가설 2 | 결과 기반 추천 → 이유 이해 + 액티비티 전환 | ✅ 매칭 이유 문구, "화가와 아트 세션 시작하기" CTA |
| 가설 3 | 디지털 아트 액티비티 → 기본 몰입·성취감·완료 유도 | ✅ 레벨업, 제한시간, 점수, 게임 종료, "다시 도전하기" 등 |

### 2.2 Success Criteria 측정 가능 여부

| 지표 | 정의 | 데이터 소스 |
|------|------|-------------|
| 스크리닝 완료율 ≥ 70% | 7번째 선택 후 LOADING 진입 | `screening_start` vs `screening_complete` |
| 스크리닝→피드백 전환 ≥ 60% | LOADING 이후 RESULT 노출 | `view` (to: RESULT) |
| 피드백→활동 진입 ≥ 40% | RESULT에서 세션/게임 진입 | `game_intro` / `game_start` (from RESULT or CLIP_INTRO) |
| 활동 1회 이상 ≥ 70% | 한 세션 내 게임 1회 이상 수행 | `game_start` / `game_complete` or `game_over` |

→ **구현**: `analytics.log('screening_start' | 'screening_complete' | 'game_intro' | 'game_start' | 'view' | …)` 로 위 4개 지표 계산 가능.

### 2.3 MVP Non-Goals 준수

- 계정/로그인, 결제/구독, 추천 AI, 히스토리/진도, 가족 시나리오, 알림, 백엔드 필수, 스토어 정식 배포 → **코드·기능 없음** ✅

---

## 3. 코드·플로우 정합성

### 3.1 렌더 분기 (script.js)

**사용 중인 step**: `INTRO` | `TUNING` | `LOADING` | `RESULT` | `PLAYING` | `HUB` | `GAME_RESULT` | `MASTERPIECE` | `CLIP_INTRO`

- ✅ **감정 일기/비디오 갤러리**: `EMOTION_DIARY`, `DIARY_LIST`, `VIDEO_GALLERY` 분기 없음. 화면 export도 없음.
- ✅ **데드 스텝**: 없음.

### 3.2 미사용·고아 화면

| 항목 | 위치 | 상태 | 권장 |
|------|------|------|------|
| **ActivityIntroScreen** | `js/ui/screens/ActivityIntroScreen.js` | script.js에서 import·렌더 안 함. index.js에서도 export 안 함. | MVP 범위에서 사용하지 않으면 제거 또는 “추후 단계용” 주석 처리 |

### 3.3 명화 클립 옵션

- **Hub**: "명화 클립 같이 보기" 체크박스 제거됨 → 사용자에게 노출되는 토글 UI 없음.
- **Result → 세션 시작**: `state.showMasterpieceClip`에 의해 CLIP_INTRO 진입 여부 결정.
  - `showMasterpieceClip`: localStorage 기반, 기본 `true`.
  - 토글 경로가 없어, **현재는 Result에서 “세션 시작” 시 항상 localStorage 값(기본: 감상 후 게임)** 만 사용됨.
- **Hub → 게임**: `state.currentStep === 'HUB'`일 때 `startLevelIntro()` 내부에서 곧바로 `actions.startGame()` 호출 → 명화 보기 없이 PLAYING으로 직행 ✅

---

## 4. UI/UX·문구 현황 (MVP 기준)

### 4.1 PRD와 다른 점 (구현 우선)

- **Result 하단**: PRD “공유하기 / 다른 세션 보기” → 실제: **선택 다시하기 / 아트 게임 모아보기**
- **Game Result**: PRD “감정 일기 / 한 판 더 / 아트 게임 목록” → 실제: **다시 도전하기 / 아트 게임 모아보기** + 추천 게임 가로 스크롤
- **Hub**: PRD “다른 화가들”, “정서 Care” 등 → 실제: **아트 게임 모아보기**, **정서·인지·사회·감각** (Care 없음)

→ MVP 검증에는 문제 없고, 문구만 PRD와 차이 있음. 필요 시 PRD를 “현재 UI 명세”로 정리하는 것을 권장.

### 4.2 접근성·시니어 대응

- `SENIOR_ACCESSIBILITY_CHANGES.md`에 터치 영역(48px), 폰트(16px), safe-area 등 반영됨.
- iPhone 노치/다이나믹 아일랜드: `screen-header-actions`, `scroll-safe-bottom` 등으로 보정됨.

---

## 5. 권장 액션 (우선순위)

### 필수 (MVP 정리)

1. **ActivityIntroScreen 처리**
   - 사용 예정 없음: 파일·참조 제거 또는 “미사용(추후 확장용)” 주석.
   - 사용 예정 있음: 플로우 상 어디에서 렌더할지 정의 후 연결.

2. **showMasterpieceClip 노출 정책 결정**
   - Result에서 “이번만 감상 건너뛰기” 등 한 번만 쓰는 옵션을 둘지,
   - 또는 “명화 감상 후 게임”을 기본으로 두고 토글을 아예 두지 않을지 결정 후, 그에 맞게 문구·플로우만 맞추면 됨.

### 선택 (문서·일관성)

3. **PRD 화면별 문구**: 현재 UI(Result/Hub/GameResult 등)에 맞게 4.2.6 등 문구 갱신.
4. **용어 통일**: “아트 세션 / 아트 게임 / 추천 게임” 등 한 화면 내에서는 동일 개념을 같은 단어로 통일 검토.
5. **MVP_FLOW_REVIEW.md**: 이 문서(MVP_REVIEW_LATEST.md)의 “현재 플로우 맵”과 “명화 클립·Hub” 설명으로 덮어쓰거나, “최신은 MVP_REVIEW_LATEST 참고”로 링크 정리.

---

## 6. 요약

- **가설 1~3**: 구현으로 충족 가능.
- **Success Criteria**: 이벤트 로그 기반으로 4개 지표 모두 측정 가능.
- **Non-Goals**: 유지됨.
- **데드 코드**: 감정 일기/비디오 갤러리 관련 렌더 분기는 없음. ActivityIntroScreen만 미사용.
- **플로우**: Screening → Feedback → Activity가 끊김 없이 동작하며, Hub에서의 진입은 “명화 보기 없이 바로 게임”으로 단순화된 상태.

**결론**: MVP 관점에서 “한 번에 검증하고 싶은 흐름”은 갖춰져 있으며, 위 필수 액션(ActivityIntroScreen, showMasterpieceClip 정책)만 정리하면 현재 구현과 문서가 잘 맞습니다.
