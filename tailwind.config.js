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