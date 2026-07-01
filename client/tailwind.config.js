/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F3D35', // Deep Forest Green
        secondary: '#1A5A4F', // Lighter Green Accent
        accent: '#E6A95B', // Warm gold/yellow accent if needed
        background: '#F9F6F0', // Soft Cream
        surface: '#FFFFFF', // Pure White for cards
        surfaceAlt: '#F0EBE0', // Slightly darker cream for card alternatives
        text: '#111827', // Gray-900
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
