/* eslint-disable ts/no-require-imports */

import type { Config } from 'tailwindcss';

// Default font-family stacks inlined from Tailwind's `defaultTheme` —
// the legacy `tailwindcss/defaultTheme` export was removed in v4 and
// the project still loads this JS config via `@config` for backwards-compat.
const defaultSans = [
  'ui-sans-serif',
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  '"Noto Sans"',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
  '"Noto Color Emoji"',
];

const defaultSerif = [
  'ui-serif',
  'Georgia',
  'Cambria',
  '"Times New Roman"',
  'Times',
  'serif',
];

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: '#BC01FD',
        primaryLighter: '#E7B9F8',
        primaryLight: '#DA71FF',
        primaryDark: '#861AAB',
        primaryDarker: '#6A008F',
        // Refined near-black surfaces, tinted toward the brand violet.
        ink: '#07060A',
        inkSoft: '#0C0A12',
        inkCard: '#100D18',
        // Metallic accent — a whisper of champagne/platinum for high-ticket edges.
        champagne: '#E7CFA6',
        champagneLight: '#F5E6C8',
        // Cool rim light that pairs with the violet aurora.
        ice: '#8FB8FF',
        secondary: '#3c3c3c',
        secondaryLighter: '#B9B9B9',
        secondaryLight: '#595959',
        secondaryDark: '#252525',
        secondaryDarker: '#151515',
        secondaryEvenDarker: '#0A0A0A',
        text: '#3c3c3c',
        warning: '#FFA800',
        warningDark: '#CC8400',
        error: '#B3251E',
        errorDark: '#CC0000',
        light: '#F9FAFB',
        lightDark: '#E5E7EB',
        dark: '#1A202C',
        darkLight: '#2D3748',
      },
      maxHeight: {
        114: '440px',
      },
      maxWidth: {
        114: '440px',
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', ...defaultSans],
        display: ['var(--font-figtree)', 'var(--font-poppins)', ...defaultSans],
        figtree: ['var(--font-figtree)', ...defaultSans],
        serif: ['var(--font-sorts-mill-goudy)', ...defaultSerif],
      },
      fontSize: {
        base: ['16px', '24px'], // Default font size
        lg: ['18px', '28px'], // Larger font size for headings
        xl: ['24px', '32px'], // Extra-large for major headings
        xxs: ['10px', '14px'],
      },
      spacing: {
        72: '18rem', // Large padding/margin value
        84: '21rem',
        96: '24rem',
        128: '32rem',
        160: '40rem',
      },
      margin: {
        'fluid-xxs': 'calc((100vw - 512px)/2)', // Para telas pequenas
        'fluid-xs': 'calc((100vw - 614px)/2)', // Para telas pequenas
        'fluid-sm': 'calc((100vw - 640px)/2)', // Para telas pequenas
        'fluid-mdlg': 'calc((100vw - 819px)/2)', // Para telas médias
        'fluid-lg': 'auto', // Para telas grandes
      },
      screens: {
        xxs: '512px',
        xs: '614.4px',
        mdlg: '819.2px',
      },
      container: {
        center: true, // Center the container for a clean look
        padding: '2rem',
        screens: {
          'sm': '512px', // Default: 640px
          'md': '614.4px', // Default: 768px
          'lg': '819.2px', // Default: 1024px
          'xl': '1024px', // Default: 1280px
          '2xl': '1228.8px', // Default: 1536px
        },
      },
      smallContainer: {
        center: true,
        padding: '1rem',
      },
      borderRadius: {
        md: '8px', // Medium rounded corners for buttons, cards
        lg: '12px',
        xl: '16px',
        xxl: '32px',
        xxxl: '60px',
        full: '9999px', // Pill-shaped rounded corners
      },
      boxShadow: {
        soft: '0 4px 8px rgba(0, 0, 0, 0.05)', // Light shadow for depth
        strong: '0 8px 16px rgba(0, 0, 0, 0.1)', // Stronger shadow for focus elements
      },

      keyframes: {
        pulseShadow: {
          '0%': {
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
          },
          '25%': {
            boxShadow: '12px 12px 15px rgba(0, 0, 0, 0.3)',
          },
          '50%': {
            boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.5)',
          },
          '75%': {
            boxShadow: '-12px -12px 15px rgba(0, 0, 0, 0.3)',
          },
          '100%': {
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.333%)' },
        },
        auroraDrift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)', opacity: '0.9' },
          '50%': { transform: 'translate3d(2%,-3%,0) scale(1.08)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        pulseShadow: 'pulseShadow 10s infinite',
        auroraDrift: 'auroraDrift 18s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@designbycode/tailwindcss-text-stroke'),
  ],
} satisfies Config;
