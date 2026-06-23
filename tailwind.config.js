/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      wide: '1320px',
      xl: '1400px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Brand + neutrals pulled from the Figma variable definitions.
        wyze: {
          purple: '#4E2FD2',
          'purple-dark': '#3F25B0',
        },
        obsidian: '#0B0D10',
        // Product title / body text in the Figma (#1f1f1f, 75% for descriptions).
        ink: '#1F1F1F',
        // Card active price renders in this neutral gray.
        priceink: '#575757',
        // Active variant chip border (teal-green) from the Figma.
        chip: '#0AA288',
        gray: {
          200: '#F0F4F7',
          300: '#E6EBF0',
          400: '#CED6DE',
          500: '#A8B2BD',
          600: '#6F7882',
          700: '#525963',
        },
        // Strike-through compare price on product cards reads red.
        compare: '#D8392B',
        panel: '#EDF4FF',
        surface: '#FFFFFF',
      },
      fontFamily: {
        // Figma uses Gilroy (commercial). Poppins is a close free geometric
        // substitute; drop Gilroy first in this list if you have a license.
        sans: ['Gilroy', 'Poppins', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(11, 13, 16, 0.04)',
      },
    },
  },
  plugins: [],
};
