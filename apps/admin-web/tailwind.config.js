/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
    'node_modules/flowbite/**/*.{js,jsx,ts,tsx}'
  ],
  plugins: [
    require('flowbite/plugin')
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4B5EFC',
        'light-blue': '#4A90E2',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
}
