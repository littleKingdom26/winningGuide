# [수원FC 현장 가이드] 디자인 가이드 v2.0

## 📌 개요 (Overview)
**필승 가이드**는 수원FC 팬들을 위한 응원법 현장 가이드입니다. 수원FC의 브랜드 아이덴티티를 기반으로, 경기장의 열기를 모바일 환경에서 체험할 수 있는 디자인을 목표로 합니다.

---

## 1. 디자인 콘셉트 (Design Concept)

### 1.1 핵심 컨셉: **"Fortress of Suwon" (수원의 요새)**
- **수원화성 영감:** 수원화성의 장안문, 팔달문을 모티브로 한 요소 활용
- **역사적 깊이:** 수원의 역사와 문화유산을 현대적으로 재해석
- **팬과의 연결:** 구단-팬-지역기업의 화합을 상징하는 디자인 언어

### 1.2 감각적 키워드
- ** 역동성 (Dynamic):** 경기장의 활기와 팬들의 열정
- ** 근원성 (Rooted):** 수원시의 역사적 정체성
- ** 통합성 (Unified):** 4개 구와 팬들의 결속
- ** 현대성 (Modern):** 전통적인 요소를 현대적으로 표현

---

## 2. 컬러 팔레트 (Color Palette)

### 2.1 메인 컬러 (Primary Colors)
| 컬러 이름 | Hex 코드 | 용도 | 상징 |
|---------|---------|-----|-----|
| **Suwon Navy** | `#1E3A5F` | 기본 배경, 헤더, 대형 컨테이너 | 수원화성의 견고함, 신뢰, 수원 4개 구 |
| **Suwon Red** | `#EB0028` | CTA 버튼, 하이라이트, 활성 상태 | 패션, 열정, 공격성 |

### 2.2 서브 컬러 (Secondary Colors)
| 컬러 이름 | Hex 코드 | 용도 | 상징 |
|---------|---------|-----|-----|
| **Royal Blue** | `#0066CC` | 링크, 보조 버튼, 정보 아이콘 | 왕실, 귀족, 품격 |
| **Highlight Yellow** | `#FFB300` | 박자 강조, 알림 배너, 중요 텍스트 | 에너지, 주목, 희망 |

### 2.3 다크 모드 컬러 (Dark Mode Colors)
| 컬러 이름 | Hex 코드 | 용도 |
|---------|---------|-----|
| **Background Dark** | `#0F1F3A` | 메인 배경 |
| **Card Surface** | `#1A3054` | 카드 컨테이너 |
| **Text Primary** | `#FFFFFF` | 주요 텍스트 |
| **Text Secondary** | `#D0D5E0` | 부가 정보 |

### 2.4 기능 컬러 (Functional Colors)
| 상태 | Hex 코드 | 용도 |
|-----|---------|-----|
| **Success** | `#22C55E` | 성공, 완료 상태 |
| **Warning** | `#FFB300` | 경고, 주의 상태 |
| **Error** | `#EF4444` | 에러, 실패 상태 |

---

## 3. 타이포그래피 (Typography)

### 3.1 폰트 스택 (Font Stack)
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

### 3.2 타이포그래피 체계 (Type Scale)
| 요소 | 크기 | 두께 | 라인높이 | 용도 |
|-----|------|------|---------|-----|
| **H1** | 24px | 700 (Bold) | 1.3 | 페이지 타이틀, 메인 로고 |
| **H2** | 20px | 600 (Semi-Bold) | 1.4 | 섹션 타이틀, 네비게이션 |
| **H3** | 16px | 600 (Semi-Bold) | 1.4 | 카드 제목, 선수 이름 |
| **Body 1** | 18px | 500 (Medium) | 1.6 | 핵심 가사, 중요 본문 |
| **Body 2** | 14px | 400 (Regular) | 1.5 | 일반 본문, 설명 |
| **Caption** | 12px | 400 (Regular) | 1.4 | 태그, 시간, 메타 정보 |

### 3.3 강조 스타일 (Emphasis Styles)
```css
/* 강조 텍스트 - 노란색 박스 */
.text-highlight {
  background: linear-gradient(180deg, transparent 60%, #FFB300 60%);
  padding: 0 4px;
}

/* 강조 텍스트 - 빨간색 텍스트 */
.text-accent {
  color: #EB0028;
  font-weight: 600;
}

/* 캡션 - 텍스트 */
.text-caption {
  color: #D0D5E0;
  font-size: 12px;
  line-height: 1.4;
}
```

---

## 4. UI 컴포넌트 가이드 (UI Components)

### 4.1 버튼 (Buttons)

#### 4.1.1 프라이머리 버튼 (Primary Button)
```css
.button-primary {
  background-color: #EB0028;
  color: #FFFFFF;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 16px;
  min-height: 48px;
  transition: all 0.2s ease;
}

.button-primary:hover {
  background-color: #C4001F;
  transform: translateY(-2px);
}

.button-primary:active {
  transform: translateY(0);
}
```
**용도:** 가사 복사, 공유하기, 저장하기 등 핵심 액션

#### 4.1.2 세컨더리 버튼 (Secondary Button)
```css
.button-secondary {
  background-color: transparent;
  color: #FFFFFF;
  border: 1px solid #0066CC;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 500;
  font-size: 16px;
  min-height: 48px;
  transition: all 0.2s ease;
}

.button-secondary:hover {
  background-color: rgba(0, 102, 204, 0.1);
}
```
**용도:** 필터 선택, 카테고리 전환, 취소

#### 4.1.3 고정 바 버튼 (Fixed Bottom Bar)
```css
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, transparent, #0F1F3A 20%, #0F1F3A);
  padding: 16px 20px;
  display: flex;
  gap: 12px;
  z-index: 100;
}
```
**용도:** 한 손 조작을 위한 하단 고정 액션 바

### 4.2 카드 (Cards)

#### 4.2.1 기본 카드 (Base Card)
```css
.card {
  background-color: #1A3054;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 57, 111, 0.15);
  border: 1px solid rgba(0, 102, 204, 0.1);
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 57, 111, 0.25);
}
```

#### 4.2.2 HOT 배지 (Hot Badge)
```css
.badge-hot {
  background: linear-gradient(135deg, #EB0028, #FF3333);
  color: #FFFFFF;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(235, 0, 40, 0.4);
}
```

### 4.3 네비게이션 (Navigation)

#### 4.3.1 상단 헤더 (Top Header)
```css
.header {
  background: linear-gradient(180deg, #1E3A5F 0%, #0F1F3A 100%);
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: sticky;
  top: 0;
  z-index: 50;
}
```

#### 4.3.2 검색 바 (Search Bar)
```css
.search-bar {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-bar input {
  background: transparent;
  border: none;
  color: #FFFFFF;
  font-size: 16px;
  flex: 1;
}

.search-bar input::placeholder {
  color: #D0D5E0;
}
```

---

## 5. 화면별 레이아웃 가이드 (Screen Layouts)

### 5.1 홈 (Home)
- **상단 배너:** 그라데이션 배경 (네이비 → 다크 네이비)
- **검색 바:** 아이콘은 옐로우 포인트
- **오늘의 경기:** 카드 형태로 표시
- **HOT 응원법:** HOT 배지 부착

### 5.2 상세 (Detail)
- **상단:** 유튜브 플레이어 (Full-width)
- **중간:** 선수 정보, 경기 상황
- **하단:** 가사 영역 + 고정 바 버튼

### 5.3 선수 (Player)
- **프로필 헤더:** 네이비 배경 + 선수 이미지
- **전적 카드:** 카드 그리드 레이아웃
- **응원가 리스트:** 간소화된 카드 형태

---

## 6. Tailwind CSS 설정 (Tailwind Config)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        suwon: {
          // 메인 컬러
          navy: '#1E3A5F',      // 기본 네이비 - 수원화성의 견고함
          red: '#EB0028',       // 포인트 레드 - 열정과 공격성

          // 서브 컬러
          blue: '#0066CC',      // 로열 블루 - 품격
          yellow: '#FFB300',    // 하이라이트 옐로우 - 에너지

          // 다크 모드
          bgDark: '#0F1F3A',    // 메인 배경
          cardDark: '#1A3054',  // 카드 컴포넌트
          textPrimary: '#FFFFFF',
          textSecondary: '#D0D5E0',

          // 기능 컬러
          success: '#22C55E',
          warning: '#FFB300',
          error: '#EF4444',
        },
      },
      fontSize: {
        'h1': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'h2': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'h3': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
        'body1': ['18px', { lineHeight: '1.6', fontWeight: '500' }],
        'body2': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      borderRadius: {
        'button': '12px',
        'card': '16px',
        'badge': '20px',
      },
      boxShadow: {
        'card': '0 4px 16px rgba(30, 58, 95, 0.15)',
        'card-hover': '0 8px 24px rgba(30, 58, 95, 0.25)',
        'hot-badge': '0 2px 8px rgba(235, 0, 40, 0.4)',
      },
      backgroundImage: {
        'gradient-header': 'linear-gradient(180deg, #1E3A5F 0%, #0F1F3A 100%)',
        'gradient-hot': 'linear-gradient(135deg, #EB0028, #FF3333)',
        'gradient-bottom': 'linear-gradient(180deg, transparent, #0F1F3A 20%, #0F1F3A)',
      },
    },
  },
  plugins: [],
};
```

---

## 7. 접근성 가이드 (Accessibility)

### 7.1 색상 대비 (Color Contrast)
- 모든 텍스트는 WCAG AA 기준 (4.5:1) 이상의 대비 유지
- 빨간색/옐로우 하이라이트는 다크 배경 위에서만 사용

### 7.2 터치 타겟 (Touch Targets)
- 버튼 최소 크기: 44px × 44px
- 클릭 가능 영역 간 간격: 최소 8px

### 7.3 모바일 최적화
- 한 손 조작을 고려한 하단 고정 버튼
- 16px 이상의 텍스트 크기로 가독성 확보
- 명확한 상태 표시 (로딩, 성공, 실패)

---

## 8. 브랜드 요소 적용 (Brand Elements)

### 8.1 수원화성 패턴 (Suwon Fortress Pattern)
- 전통적인 성벽 패턴을 현대적으로 재해석
- 구분선, 배경, 데코레이션 요소로 활용
- 네이비 + 블루의 그라데이션으로 표현

### 8.2 4개 구 스트라이프 (4 Districts Stripes)
- 4개의 네이비 스트라이프 = 수원 4개 구
- 디바이더, 라인, 보더 요소로 활용
- 길이와 간격을 일정하게 유지

### 8.3 로고 앰블럼 (Logo Emblem)
- 방패 형태의 로고를 헤더나 프로필에 활용
- 장안문, 팔달문 모티브의 아이콘 요소

---

## 9. 예시 (Examples)

### 9.1 HOT 응원가 카드 예시
```jsx
<div className="card group hover:translate-y-[-2px] transition-all">
  <div className="flex justify-between items-start mb-4">
    <div>
      <span className="badge-hot inline-block">HOT</span>
      <h3 className="text-h3 text-white mt-2">승리의 노래</h3>
    </div>
    <span className="text-caption text-suwon-textSecondary">12.3K 조회</span>
  </div>
  <p className="text-body2 text-suwon-textSecondary mb-4">
    수원FC의 전설적인 응원가로, 승리 직후에 함께 부르는 노래입니다.
  </p>
  <div className="flex gap-2">
    <button className="button-primary flex-1">가사 복사</button>
    <button className="button-secondary flex-1">공유하기</button>
  </div>
</div>
```

### 9.2 하단 고정 바 예시
```jsx
<div className="bottom-bar">
  <button className="button-primary flex-1">가사 복사하기</button>
  <button className="button-secondary flex-1">공유하기</button>
</div>
```

---

## 10. 참고 자료 (References)

### 10.1 브랜드 소스
- 수원FC 공식 홈페이지: https://www.suwonfc.com
- 수원화성: 수원시를 상징하는 역사적 유산

### 10.2 디자인 원칙
- 모바일 퍼스트 (Mobile First)
- 다크 모드 기본 (Dark Mode Default)
- 한 손 조작 최적화 (One-Handed Operation)
- 고대비 가독성 (High Contrast)

---

**버전:** v2.0
**마지막 업데이트:** 2026-06-18
**작성자:** 수엪 ⚽