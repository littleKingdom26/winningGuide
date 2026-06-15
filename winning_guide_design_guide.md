# [디자인 가이드] 축구 응원법 아카이브 '필승 가이드'

## 1. 디자인 콘셉트 (Design Concept)
* **Stadium Energy (경기장의 열기):** 매인 색상인 강렬한 레드와 묵직한 네이비의 대비를 통해 경기장에서 느끼는 팬들의 열정과 역동성을 시각화합니다.
* **High Visibility (고대비 가독성):** 모바일 퍼스트 및 야간 환경(다크 모드 기본)을 고려하여, 어두운 배경 위에서 가사와 영상 썸네일이 눈에 띄도록 고대비 가이드라인을 준수합니다.

---

## 2. 컬러 팔레트 (Color Palette)

### 2.1 메인 컬러 (Main Primary Colors)
* **Primary Deep Navy:** `#00396f`
    * *활용:* 다크 모드의 기본 배경색, 대형 헤더, 카드로 구성된 레이아웃의 기본 바탕.
* **Primary Accent Red:** `#EB0028`
    * *활용:* 핵심 CTA 버튼(가사 복사, 공유), 핵심 아이콘, 활성화된 메뉴 상태.

### 2.2 서브 컬러 (Secondary & Accent Colors)
* **Sub Royal Blue:** `#0070cd`
    * *활용:* 일반 링크 텍스트, 수비/파울 상황의 태그, 보조 기능 버튼.
* **Sub Vivid Yellow:** `#ffc627`
    * *활용:* 하이라이트 가사 표기(박자나 강조 구간), 중요 알림 배너.

### 2.3 시스템 컬러 (System Neutral Colors)
* **Background (Surface):** `#0a1424` (눈의 피로를 최소화하는 메인 모바일 배경)
* **Card Background:** `#12233f` (배경 위에서 콘텐츠를 분리하기 위한 카드 레이아웃 색상)
* **Text Primary:** `#FFFFFF` (일반 타이틀, 가사 텍스트 - 순도 화이트)
* **Text Secondary:** `#A0AEC0` (설명글, 부가 정보 - 그레이 계열)

---

## 3. 타이포그래피 가이드 (Typography)

* **H1 (페이지 타이틀 / 메인 로고):** `24px` / Bold / Line-height: `1.3`
* **H2 (섹션 타이틀):** `20px` / Semi-Bold / Line-height: `1.4`
* **H3 (카드 및 선수 이름):** `16px` / Semi-Bold / Line-height: `1.4`
* **Body 1 (핵심 응원가 가사 영역):** `18px` / Medium / Line-height: `1.6`
* **Body 2 (일반 본문 및 요구사항 텍스트):** `14px` / Regular / Line-height: `1.5`
* **Caption (태그, 시간, 비고 등):** `12px` / Regular / Line-height: `1.4`

---

## 4. UI 구성 요소 스타일 (UI Components)

### 4.1 버튼 (Buttons)
* **주요 액션 버튼 (가사 복사, 카카오톡 공유):** * 배경색: `#EB0028` | 글자색: `#FFFFFF`
    * 반경(Border Radius): `12px`
    * 최소 크기: 모바일 터치 영역 확보를 위해 세로 높이 최소 `48px` 이상 필수.
* **보조 버튼 (필터 선택, 카테고리 전환):**
    * 테두리: `1px solid #0070cd` | 배경색: `#12233f` | 글자색: `#FFFFFF`

### 4.2 카드 레이아웃 (Card List)
* 배경색: `#12233f` | 모서리 라운드: `16px`
* 은은한 그림자(Shadow) 효과 또는 `#0070cd` 색상으로 투명도 효과(Opacity 0.2) 적용.

---

## 5. 화면별 디자인 레이아웃 가이드

### 5.1 메인 대시보드 (Home)
* 상단 배너 / 검색창: `#00396f` 배경 위에 그라데이션 래퍼 적용. 검색 돋보기 아이콘은 `#ffc627`로 포인트.
* 오늘의 경기/Hot 응원법: `#12233f` 카드 바탕에 `#EB0028` 컬러의 'HOT' 배지 라벨 부착.

### 5.2 상세 페이지 (Detail View - 핵심)
* **Upper (미디어 영역):** 유튜브 임베드 플레이어가 화면 가로를 꽉 채우도록(Full-width) 배치. 동영상 하단 슬라이드는 인디케이터 컬러를 `#EB0028`로 지정.
* **Lower (정보 영역):** 모바일 한 손 조작을 위해 '가사 복사하기'와 '공유하기' 버튼을 화면 하단에 고정 바(Fixed Bottom Bar) 형태로 배치 권장.

---

## 6. 테마 설정 예시 (Tailwind CSS)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        suwon: {
          navy: '#00396f',   // 메인 딥네이비
          red: '#EB0028',    // 메인 포인트 레드
          blue: '#0070cd',   // 서브 블루
          yellow: '#ffc627', // 하이라이트 옐로우
          bgDark: '#0a1424', // 다크모드 메인배경
          cardDark: '#12233f'// 카드 컴포넌트 배경
        },
      },
    },
  },
}
```
