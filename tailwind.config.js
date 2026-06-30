/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif']
      },
      boxShadow: {
        glass: '0 18px 50px rgba(0, 0, 0, 0.35)'
      }
    }
  },
  plugins: []
};
