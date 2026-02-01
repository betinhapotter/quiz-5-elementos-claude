/**
 * Design Tokens - Quiz 5 Elementos
 * Generated: 2026-01-31
 * Workflow: brownfield-complete Step 3 - Tokenize
 * Format: Tailwind CSS Configuration
 * 
 * Usage: Import into tailwind.config.ts
 * import tokens from './outputs/design-system/quiz-5-elementos/tokens/tokens.tailwind.js'
 */

module.exports = {
    colors: {
        // 5 Elements Palette
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

        // Base Colors
        cream: '#FDF8F3',

        // Warm Gray Scale
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

    fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
    },

    fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },

    spacing: {
        0: '0',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
    },

    borderRadius: {
        none: '0',
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
    },

    boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
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

    transitionDuration: {
        fast: '150ms',
        DEFAULT: '200ms',
        slow: '300ms',
        slower: '500ms',
    },

    transitionTimingFunction: {
        linear: 'linear',
        ease: 'ease',
        'ease-in': 'ease-in',
        'ease-out': 'ease-out',
        'ease-in-out': 'ease-in-out',
    },

    zIndex: {
        0: '0',
        10: '10',
        20: '20',
        30: '30',
        40: '40',
        50: '50',
    },
};
