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
        navy: '#1e3a5f',
        red: '#EB0028',
        // 서브 컬러
        blue: '#0066cc',
        yellow: '#ffb300',
        // 시스템 컬러 (다크모드 전용)
        bgDark: '#16213e',
        cardDark: '#1a2f4f',
        textPrimary: '#FFFFFF',
        textSecondary: '#c0c5d0',
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