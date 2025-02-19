/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1034A6',    // Egyptian Blue
        secondary: '#F3BE2B',  // Gold Yellow
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
