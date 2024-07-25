/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom-red': 'red 0px 0px 4px 3px',
      },
      colors: {
        'customColor': 'rgb(0 197 255)', // Green color
        'cardcolor': '#ffffff',
      },
      backgroundImage: {
        'panel-gradient': 'linear-gradient(#f8fdff, #00c5ff9e, #00c5ff)',
      },
    },
  },
  plugins: [],
}

