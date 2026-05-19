/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        primary: '#3b82f6',
        secondary: '#64748b',
        success: '#22c55e',
        danger: '#ef4444',
      }
    },
  },
  plugins: [],
}
