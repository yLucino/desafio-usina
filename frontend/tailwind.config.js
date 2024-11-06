/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        AntonSC: ['Anton SC', 'sans-serif'],
        OpenSans: ['Open Sans', 'sans-serif'],
      },
      colors: {
        tomato: '#ff6347',
      },
      height: {
        670: '670px'
      },
      width: {
        500: '500px'
      }
    },
  },
  plugins: [],
}