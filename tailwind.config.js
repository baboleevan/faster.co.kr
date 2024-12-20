/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-noto-sans)', 'Noto Sans', 'Noto Sans KR', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans JP', 'Noto Sans Arabic', 'Noto Sans Thai', 'Noto Sans Devanagari', 'Noto Sans Bengali', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          from: '#3B82F6', // blue-500
          to: '#9333EA',   // purple-600
        },
      },
      animation: {
        'gradient-x': 'gradient-x 3s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
    },
  },
  plugins: [],
} 