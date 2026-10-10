const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: v('bg'), surface: v('surface'), ink: v('ink'), muted: v('muted'), line: v('line'),
        brand: v('brand'), accent: v('accent'), navy: '#0a1330',
      },
      fontFamily: { sans: ['var(--font-body)', 'system-ui', 'sans-serif'], display: ['var(--font-display)', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
