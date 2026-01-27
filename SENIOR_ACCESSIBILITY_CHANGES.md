# 시니어 타깃 터치 영역·폰트 크기 점검 요약

**기준**: 55~75세 액티브 시니어, 터치 최소 48px·본문 16px 권장

---

## 1. 터치 영역 (최소 48px)

| 대상 | 변경 전 | 변경 후 |
|------|---------|---------|
| 아이콘 버튼 (뒤로가기, 메뉴, X) | w-10 h-10 (40px) | w-12 h-12 + min-w-[48px] min-h-[48px] (48px) |
| Hub 탭 버튼 | px-4 py-2 | px-5 py-3 + min-h-[48px] |
| Result/GameResult 하단 버튼 | py-3 | py-4 + min-h-[48px] |
| Intro 메인 CTA | py-5 | py-5 + min-h-[56px] |
| Result 메인 CTA (화가와 세션 시작) | py-5 | py-5 + min-h-[56px] |
| MasterpieceClip "아트 게임 이어하기" | py-4 | py-4 + min-h-[52px] |
| GameResult "다시 도전하기" | py-3 | py-4 + min-h-[52px] |
| 체크박스 (명화 클립) | w-5 h-5 (20px) | w-6 h-6 + min 24px |
| 설정 모달 닫기 | 50x50 (기존 유지) | — |

**적용 화면**: TuningScreen, HubScreen, ResultScreen, GameResultScreen, IntroScreen, MasterpieceClipScreen, MasterpieceScreen, ActivityIntroScreen, MenuModal

---

## 2. 폰트 크기

| 대상 | 변경 전 | 변경 후 |
|------|---------|---------|
| body 기본 | (미지정) | 16px |
| CSS 변수 터치 최소 | 44px | 48px |
| 보조 문구·라벨 (text-xs) | 12px | text-sm (14px) |
| 설정 모달 .setting-label | 0.8rem | 0.875rem (14px) |

**text-xs → text-sm 변경 위치**
- HubScreen: 명화 클립 설명, 추천 카드 sub, 게임 그리드 sub
- TuningScreen: "✓ 내가 고른 것" 뱃지
- MenuModal: 설정/다시 테스트하기 서브텍스트
- GameResultScreen: 추천 게임 카드 제목
- IntroScreen: 버전 표시 (v3.1.1)

---

## 3. 아이콘 크기

아이콘 버튼 내부 루시드 아이콘: width 20 → 24 (48px 버튼에 맞춤)

---

## 4. 유지·참고 사항

- **설정 모달** 닫기 버튼은 이미 50x50으로 유지.
- **메인 CTA**는 기존에도 py-5 등으로 넉넉해 min-h만 추가.
- **게임 카드**·**튜닝 카드**는 전체가 터치 영역이므로 추가 조정 없음.
- **줌/글자 크기**: 브라우저 설정으로 사용자가 조절 가능하도록 viewport는 기존 유지.

위 변경만으로도 시니어 타깃의 터치·가독성 기준에는 맞출 수 있습니다. 추가로 줄간격·대비·포커스 링 등을 조정할 계획이 있으면 알려주세요.
