/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'teal-blue': '#2C7DA0',
        'vibrant-purple': '#7B2CBF',
        'coral-orange': '#F77F00',
        'soft-off-white': '#F8F9FA',
        'fresh-green': '#52B788',
      },
    },
  },
  plugins: [],
}