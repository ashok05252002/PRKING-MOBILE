/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9', // Sky blue for accents
          600: '#0284c7',
          800: '#075985',
          900: '#0c4a6e', // Deep Blue
          950: '#082f49', // Darkest Blue
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // We'll rely on system fonts but Inter is a good default mental model
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(14, 165, 233, 0.3)',
      }
    },
  },
  plugins: [],
}
