import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

// This file is just a sample configuration file for Tailwind CSS
// TODO: Replace this with our own AGILITY configuration

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#BC01FD',
        secondary: '#3c3c3c',
        text: '#3c3c3c',
      },
      fontFamily: {
        sans: ['Muli', ...fontFamily.sans], // Add Inter as the primary font
      },
      fontSize: {
        base: ['16px', '24px'], // Default font size
        lg: ['18px', '28px'], // Larger font size for headings
        xl: ['24px', '32px'], // Extra-large for major headings
      },
      spacing: {
        72: '18rem', // Large padding/margin value
        84: '21rem',
        96: '24rem',
      },
      container: {
        center: true, // Center the container for a clean look
        padding: '2rem',
      },
      borderRadius: {
        md: '8px', // Medium rounded corners for buttons, cards
        lg: '12px',
        xl: '16px',
        xxl: '32px',
        full: '100%', // Full border radius for circles
      },
      boxShadow: {
        soft: '0 4px 8px rgba(0, 0, 0, 0.05)', // Light shadow for depth
        strong: '0 8px 16px rgba(0, 0, 0, 0.1)', // Stronger shadow for focus elements
      },
    },
  },
  plugins: [
    // eslint-disable-next-line ts/no-require-imports
    require('@tailwindcss/typography'),
  ],
} satisfies Config;