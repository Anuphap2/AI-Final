/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0a0a0c',
        surface: {
          50: '#1e1e24',
          100: '#17171c',
          200: '#121216',
          300: '#0e0e12',
          border: '#27272f',
          hover: '#32323c',
        },
        brand: {
          red: '#ef4444',
          'red-hover': '#dc2626',
          'red-glow': 'rgba(239, 68, 68, 0.15)',
          crimson: '#e11d48',
          amber: '#f59e0b',
          emerald: '#10b981',
          cyan: '#06b6d4',
          indigo: '#6366f1',
        }
      },
      fontFamily: {
        display: ['"Archivo Black"', 'sans-serif'],
        sans: ['"Work Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-red': '0 0 25px -5px rgba(239, 68, 68, 0.3)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'flat-box': '4px 4px 0px 0px #ef4444',
        'flat-card': '4px 4px 0px 0px #27272f',
      }
    },
  },
  plugins: [],
}
