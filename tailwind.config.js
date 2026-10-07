/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
      colors: {
        deep: { 950: '#07020d', 900: '#0f051d', 850: '#15092a', 800: '#1d0c38', 700: '#2d1354' },
        electric: { 400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce' },
        growth: { 300: '#6ee7b7', 400: '#34d399', 500: '#10b981', 600: '#059669' }
      }
    }
  },
  plugins: [],
}