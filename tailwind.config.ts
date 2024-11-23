import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

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
      maxWidth: {
        114: '440px',
      },
      fontFamily: {
        poppins: ['Poppins', ...fontFamily.sans],
        serif: ['Sorts Mill Goudy', ...fontFamily.serif],

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
        full: '100%', // Full border radius for circles
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
      },
      animation: {
        pulseShadow: 'pulseShadow 10s infinite',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line ts/no-require-imports
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
