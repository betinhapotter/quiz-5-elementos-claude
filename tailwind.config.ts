import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Jaya - cores da marca
        terra: {
          DEFAULT: '#8B7355',
          light: '#A89076',
          dark: '#6B5544',
        },
        agua: {
          DEFAULT: '#4A90A4',
          light: '#6BA8BC',
          dark: '#3A7286',
        },
        ar: {
          DEFAULT: '#87CEEB',
          light: '#B0E0F0',
          dark: '#5FAED1',
        },
        fogo: {
          DEFAULT: '#E25822',
          light: '#F07850',
          dark: '#C04010',
        },
        eter: {
          DEFAULT: '#9B59B6',
          light: '#B07CC6',
          dark: '#7D4694',
        },
        // Cores base
        cream: '#FDF8F3',
        warmGray: {
          50: '#FAF9F7',
          100: '#F5F3EF',
          200: '#E8E4DD',
          300: '#D4CEC3',
          400: '#B5ADA0',
          500: '#958B7B',
          600: '#766C5E',
          700: '#5A524A',
          800: '#3D3833',
          900: '#252220',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
