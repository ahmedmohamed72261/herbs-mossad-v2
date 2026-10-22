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
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Legacy brand tokens remapped onto the organic-cattle-farm palette,
        // so existing components adopt the new UI/UX without a rewrite.
        herba: {
          dark: '#0D1615',
          light: '#F6F4EC',
          yellow: '#D1F349',
          green: '#A5C232',
          darker: '#0A0F0E',
        },
        // Template design tokens
        leaf: {
          DEFAULT: '#A5C232',
          light: '#D1F349',
          neon: '#CCFF00',
        },
        ink: {
          DEFAULT: '#0D1615',
          soft: '#272320',
          muted: '#5E5E5E',
        },
        line: '#E2E2E2',
        cream: '#F6F4EC',
        dim: '#F8F8F8',
        gold: '#FECB0E',
        sale: '#FF003D',
      },
      fontFamily: {
        sans: ['Manrope', 'Cairo', 'Inter', 'sans-serif'],
        display: ['Anybody', 'Cairo', 'Manrope', 'sans-serif'],
        stat: ['Kanit', 'Cairo', 'Anybody', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
