/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'egyptian-blue': '#1034A6',
        'gold-yellow': '#F3BE2B',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
