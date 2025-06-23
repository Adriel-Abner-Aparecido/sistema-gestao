/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '128': '30.5rem',
        'a4': '3508px'
      },
      width: {
        'a4': '2480px',
        '80mm': '302px',
        '58mm': '219px',
        'graficoBarras': '40rem',
        '32%': '32%'
      },
      colors: {
        'apploja': '#19457A',
        'applojaDark': '#0C213B',
        'applojaDark2': '#133661',
        'applojaLight': '#286FC7',
        'applojaLight2': '#1B4C87',
      }
    },
    safelist: [
      'scrollbar-hide'
    ]
  },
  plugins: [],
}
