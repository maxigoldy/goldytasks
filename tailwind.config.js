/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        gold: {
          50: '#FFFDF7',
          100: '#FFF9E6',
          200: '#FFF2CC',
          300: '#FFE699',
          400: '#FFD966',
          500: '#FFCC33',
          600: '#E6B800',
          700: '#CC9900',
          800: '#B38600',
          900: '#996600',
        },
        black: {
          50: '#F7F7F7',
          100: '#E3E3E3',
          200: '#C8C8C8',
          300: '#A4A4A4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#383838',
          900: '#000000',
        }
      }
    },
  },
  plugins: [],
};