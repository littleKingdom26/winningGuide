# [개발 가이드] 축구 응원법 아카이브 '필승 가이드'

제공해주신 기획서와 디자인 가이드를 바탕으로, 프론트엔드 개발자가 즉시 작업에 착수할 수 있도록 설계된 **[개발 가이드라인]**입니다. 기획서의 Next.js + Tailwind CSS 스택과 디자인 가이드의 컬러 시스템을 반영하여 프로젝트 구조, 컴포넌트 설계, UI 구현 레시피, 그리고 MVP 개발 프로세스를 체계적으로 정리했습니다.

---

## 1. 개발 환경 및 기술 스택 (Tech Stack)

* **Framework:** `Next.js 14+ (App Router)`
* **Styling:** `Tailwind CSS v3+`
* **Language:** `TypeScript`
* **Icons:** `lucide-react` 또는 `react-icons`
* **Hosting & Deployment:** `Vercel`
* **Data Fetching/CMS:** `Notion API` 또는 `Strapi` (초기 인프라 비용 절감용 SDK 활용)

---

## 2. 디렉토리 구조 (Directory Structure)
Next.js App Router 표준 아키텍처를 따르며, 모듈화와 유지보수를 위해 기능별로 분리합니다.

```text
src/
├── app/                  # App Router 페이지 레이아웃
│   ├── page.tsx          # 메인 대시보드 (Home)
│   ├── layout.tsx        # 글로벌 레이아웃 (네비게이션, 헤더, 테마 적용)
│   ├── situation/        # 상황별 응원 메뉴
│   │   ├── page.tsx      # 상황별 카테고리/목록
│   │   └── [id]/         # 상황별 응원 상세 페이지
│   ├── player/           # 선수별 응원 메뉴
│   │   ├── page.tsx      # 선수 목록 (가나다/등번호 필터)
│   │   └── [id]/         # 선수 개별 응원 상세 페이지
│   └── search/           # 통합 검색 페이지
├── components/           # 공통 UI 컴포넌트
│   ├── common/           # Button, Card, Badge 등 공용 아토믹 컴포넌트
│   ├── layout/           # Header, BottomNav, FixedBottomBar
│   └── Shared/           # VideoPlayer, LyricBox, ShareButton
├── constants/            # 응원 데이터 타입 정의 및 static 상수
├── hooks/                # useCopyClipboard, useInfiniteScroll 등 커스텀 훅
└── styles/               # globals.css (Tailwind 설정 포함)
3. Tailwind CSS 글로벌 테마 설정 (tailwind.config.js)
디자인 가이드의 컬러 시스템과 타이포그래피 사양을 명확하게 정의합니다. 다크 모드가 기본(class 또는 고정 다크)으로 작동하도록 구성합니다.

JavaScript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        suwon: {
          // 메인 컬러
          navy: '#00396f',
          red: '#EB0028',
          // 서브 컬러
          blue: '#0070cd',
          yellow: '#ffc627',
          // 시스템 컬러 (다크모드 전용)
          bgDark: '#0a1424',
          cardDark: '#12233f',
          textPrimary: '#FFFFFF',
          textSecondary: '#A0AEC0',
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
      }
    },
  },
  plugins: [],
};
4. 핵심 UI 컴포넌트 구현 명세
4.1 공통 레이아웃 구조 (src/app/layout.tsx)
모바일 퍼스트 환경을 위해 최대 가로 너비를 max-w-md (또는 max-w-lg)로 제한하고 중앙 정렬합니다.

TypeScript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="bg-black text-suwon-textPrimary">
      <body className="max-w-md mx-auto min-h-screen bg-suwon-bgDark flex flex-col pb-24 shadow-2xl border-x border-gray-800">
        <header className="sticky top-0 z-50 bg-suwon-navy/90 backdrop-blur px-4 py-3 border-b border-suwon-blue/20">
          <h1 className="text-h1 text-suwon-textPrimary font-bold">필승 가이드</h1>
        </header>
        
        <main className="flex-1 p-4">{children}</main>
        
        {/* 모바일 하단 탭 네비게이션 */}
        <nav className="fixed bottom-0 max-w-md w-full bg-suwon-cardDark border-t border-suwon-blue/20 h-16 flex justify-around items-center z-40">
          {/* 하단 탭 메뉴 아이콘 배치 (Home, 상황별, 선수별, 검색) */}
        </nav>
      </body>
    </html>
  );
}
4.2 외부 미디어 임베드 컴포넌트 (components/Shared/VideoPlayer.tsx)
유튜브 등 외부 미디어가 모바일 화면 안에서 16:9 비율을 유지하며 Full-width로 동작하도록 구현합니다.

TypeScript
interface VideoPlayerProps {
  videoUrl: string;
}

export default function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  // 유튜브 URL 파싱 로직 포함 권장 (Embed ID 추출)
  return (
    <div className="w-full aspect-video rounded-card overflow-hidden bg-black border border-suwon-blue/10">
      <iframe
        src={videoUrl}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="응원법 안내 영상"
      />
    </div>
  );
}
4.3 가사 복사 및 하단 고정 바 (components/Shared/FixedBottomBar.tsx)
상세 페이지 하단에 고정되어 한 손 조작을 지원하는 CTA 버튼 컴포넌트입니다.

TypeScript
'use client';

interface FixedBottomBarProps {
  lyrics: string;
  songTitle: string;
}

export default function FixedBottomBar({ lyrics, songTitle }: FixedBottomBarProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lyrics);
      alert('가사가 클립보드에 복사되었습니다. 현장에 공유해보세요!');
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `[필승 가이드] \${songTitle}`,
        text: lyrics,
        url: window.location.href,
      });
    } else {
      alert('공유하기를 지원하지 않는 브라우저입니다. 링크를 복사해주세요.');
    }
  };

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 max-w-md w-full bg-suwon-bgDark/90 backdrop-blur p-3 flex gap-3 border-t border-suwon-blue/10 z-50">
      <button 
        onClick={handleCopy}
        className="flex-1 h-12 bg-suwon-red text-suwon-textPrimary font-semibold rounded-button text-body2 active:scale-95 transition-transform"
      >
        가사 복사하기
      </button>
      <button 
        onClick={handleShare}
        className="flex-1 h-12 bg-suwon-cardDark text-suwon-textPrimary font-semibold rounded-button text-body2 border border-suwon-blue active:scale-95 transition-transform"
      >
        카카오톡 공유
      </button>
    </div>
  );
}
5. 데이터 구조 정의 (TypeScript Interface)
CMS 및 API 연동을 위한 핵심 데이터 모델 구조입니다.

TypeScript
// types/archive.ts

export type CheerCategory = 'ATTACK' | 'DEFENSE' | 'SUBSTITUTE' | 'CEREMONY';

export interface CheerSong {
  id: string;
  title: string;
  category: CheerCategory;
  lyrics: string;          // 강조 구간은 <span class="text-suwon-yellow"></span> 형태로 CMS 저장 권장
  videoUrl: string;        // YouTube Embed URL
  targetPlayerId?: string; // 선수별 응원가일 경우 매핑
  tags: string[];          // ['박자주의', '신곡', '쉬움']
  createdAt: string;
}

export interface PlayerProfile {
  id: string;
  backNumber: number;
  name: string;
  position: 'GK' | 'DF' | 'MF' | 'FW';
  thumbnailUrl: string;
  cheerSongId?: string;    // 선수의 메인 응원가 ID
}
6. MVP 개발 및 최적화 핵심 체크리스트
6.1 SEO 및 성능 최적화
Static Site Generation (SSG): 변경 주기가 길고 로딩 속도가 중요한 응원 상세 페이지는 Next.js의 generateStaticParams를 활용해 빌드 타임에 미리 정적 페이지로 생성하여 현장 접속 속도를 극대화합니다.

Image Optimization: 외부 이미지나 선수 프로필 조회 시 Next.js의 <Image /> 컴포넌트를 필수로 사용하여 Layout Shift 방지 및 WebP 포맷 최적화를 적용합니다.

6.2 1단계(MVP) 프론트엔드 작업 스케줄 구체화
UI 뼈대 구축 (1~2일 차): 테마 설정 및 공통 레이아웃(헤더/하단 탭), 공통 버튼 컴포넌트 개발.

Mock Data 기반 화면 구현 (3~4일 차): 메인 큐레이션 대시보드, 상황별/선수별 리스트 및 상세 페이지 구현. 가사 복사 기능 활성화.

CMS 데이터 연동 (5~6일 차): Notion/Strapi API 연동 및 Next.js fetch 캐싱 정책 구성.

배포 및 현장 테스트 (7일 차): Vercel 실배포 후 모바일 기기(실제 환경) 크롬/사파리 브라우저에서의 고대비 가독성 및 미디어 재생 능력 검증.