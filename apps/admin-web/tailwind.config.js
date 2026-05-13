const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    join(__dirname, 'src/**/*.{html,ts}'),
    join(__dirname, '../../node_modules/flowbite/**/*.js')
  ],
  plugins: [
    require('flowbite/plugin')
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4B5EFC',
        'light-blue': '#4A90E2',
        stu: {
          bg: 'rgb(var(--color-stu-bg) / <alpha-value>)',
          panel: 'rgb(var(--color-stu-panel) / <alpha-value>)',
          accent: 'rgb(var(--color-stu-accent) / <alpha-value>)',
          text: 'rgb(var(--color-stu-text) / <alpha-value>)',
          input: 'rgb(var(--color-stu-input) / <alpha-value>)',
          border: 'rgb(var(--color-stu-border) / <alpha-value>)',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
}
