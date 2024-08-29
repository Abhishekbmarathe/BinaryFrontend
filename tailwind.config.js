/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'customBlue': '#00c5ffd6 0px 0px 11px 1px',
      },
      colors: {
        'customColor': 'rgb(0 197 255)', 
        'cardcolor': '#ffffff',
      },
      backgroundImage: {
        'panel-gradient': 'linear-gradient(#f8fdff, #00c5ff9e, #00c5ff)',
        'page-gradient': 'linear-gradient(white, white, #00c5ff5e)',
        'bottom-gradient': 'linear-gradient(#f8fdff, #17caff59, #00c5ff91)',
      },
    },
  },
  plugins: [],
}

