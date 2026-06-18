/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        night: '#020716',
        ink: '#050b20',
        neon: '#ff2d70',
        roseglow: '#ff5d92',
        violetglow: '#7c3cff',
        azureglow: '#1d75ff',
      },
      boxShadow: {
        neon: '0 0 34px rgba(255, 45, 112, 0.28)',
        card: 'inset 0 0 24px rgba(65, 105, 255, 0.08), 0 16px 42px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
};
