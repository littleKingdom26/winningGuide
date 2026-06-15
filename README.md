# 수원FC 현장 가이드

수원FC 축구 응원법 아카이브 웹사이트 - 실전에서 바로 쓸 수 있는 응원 도구

## 🎯 프로젝트 개요

현장 팬들과 입문 팬들이 경기장에서 막힘없이 하나의 목소리로 응원할 수 있는 환경을 조성하는 것을 목표로 합니다.

## ✨ 주요 기능

- **메인 대시보드**: 통합 검색, 카테고리 바로가기, 오늘의 Hot 응원법
- **상황별 응원**: 득점/공격, 수비/파울, 선수 교체, 경기 종료/세레머니 카테고리별 응원법
- **선수별 응원**: 선수 개별 응원가와 세레머니 (백번호순 정렬)
- **통합 검색**: 선수명, 응원가명, 가사 내용으로 빠른 검색
- **상세 페이지**: 동영상 임베드, 가사 표시, 가사 복사 및 공유 기능

## 🚀 기술 스택

- **프레임워크**: Next.js 14.2.5 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS v3+
- **아이콘**: lucide-react
- **배포**: Vercel

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary Navy**: `#00396f` - 메인 배경
- **Primary Red**: `#EB0028` - CTA 버튼, 강조 요소
- **Sub Blue**: `#0070cd` - 링크, 보조 버튼
- **Sub Yellow**: `#ffc627` - 하이라이트, 아이콘 포인트
- **Background Dark**: `#0a1424` - 다크 모드 배경
- **Card Dark**: `#12233f` - 카드 컴포넌트 배경

### 타이포그래피
- **H1**: 24px / Bold
- **H2**: 20px / Semi-Bold
- **H3**: 16px / Semi-Bold
- **Body 1**: 18px / Medium
- **Body 2**: 14px / Regular
- **Caption**: 12px / Regular

## 📁 프로젝트 구조

```
├── app/
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 메인 페이지
│   ├── situation/          # 상황별 응원
│   │   ├── page.tsx        # 상황별 목록
│   │   └── [id]/page.tsx   # 상황별 상세
│   ├── player/             # 선수별 응원
│   │   ├── page.tsx        # 선수 목록
│   │   └── [id]/page.tsx   # 선수 상세
│   └── search/             # 통합 검색
│       └── page.tsx
├── components/
│   ├── common/             # 공용 컴포넌트
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── layout/             # 레이아웃 컴포넌트
│   │   └── BottomNav.tsx
│   └── Shared/             # 공유 컴포넌트
│       ├── VideoPlayer.tsx
│       └── FixedBottomBar.tsx
├── constants/
│   ├── types.ts            # TypeScript 타입 정의
│   └── mockData.ts         # 모의 데이터
└── styles/
    └── globals.css         # 글로벌 스타일
```

## 🛠️ 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 빌드

```bash
npm run build
```

### 프로덕션 서버 실행

```bash
npm start
```

## 📱 모바일 최적화

- 모바일 퍼스트 디자인 (최대 너비 448px)
- 다크 모드 기본 지원
- 터치 영역 최적화 (버튼 높이 최소 48px)
- 하단 탭 네비게이션
- 한 손 조작 최적화 UI

## 🔄 데이터 연동 (향후 계획)

현재는 Mock Data를 사용하고 있으며, 추후 다음과 같은 CMS 연동이 예정되어 있습니다:
- Notion API
- Strapi Headless CMS
- Sanity CMS

## 📄 문서

- [기획서](./winning_guide_proposal.md)
- [디자인 가이드](./winning_guide_design_guide.md)
- [개발 가이드](./winning_guide_development_guide.md)

## 🎯 MVP 개발 완료

- ✅ 프로젝트 기본 구조
- ✅ Tailwind CSS 테마 설정
- ✅ 모든 페이지 구현
- ✅ 핵심 기능 구현
- ✅ 모바일 최적화
- ✅ JSON 기반 어드민 시스템

## 🔧 어드민 시스템

### 접속 정보
- **URL**: `http://localhost:3000/admin`
- **비밀번호**: `admin123` (기본값)
- **환경변수로 설정 가능**: `ADMIN_PASSWORD`

### 주요 기능
- **대시보드**: 통계 확인, 빠른 작업, 최근 업데이트 내역
- **응원가 관리**: 등록, 수정, 삭제, 검색, 카테고리 필터링
- **선수 관리**: 등록, 수정, 삭제, 검색, 백번호순 정렬
- **실시간 업데이트**: JSON 파일 수정 후 자동 페이지 리로드

### 데이터 관리
- **응원가 데이터**: `public/data/songs.json`
- **선수 데이터**: `public/data/players.json`
- **자동 백업**: Git을 통한 버전 관리
- **쉬운 마이그레이션**: 추후 CMS로 쉽게 이전 가능

## 🚀 향후 기능

- CMS 데이터 연동
- 실시간 검색 최적화
- 무한 스크롤
- 카카오톡 공유 개선
- 응원 용품 쇼핑몰 연동
- 커뮤니티 기능

## 📝 라이선스

MIT License

---

Made with ❤️ for football fans