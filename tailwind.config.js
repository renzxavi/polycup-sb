/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#e8c94a',
        'gold-dark': '#d4b535',
        coffee: '#5a7a9f',
        rust: '#c94a35',
        ink: '#111111',
      },
      fontFamily: {
        display: ['"Black Han Sans"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
    }
  },
  plugins: [],
}