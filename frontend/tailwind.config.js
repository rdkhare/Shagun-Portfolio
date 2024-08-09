/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F8F5F1', // Background color
        secondary: '#383838', // Text color
        accent: '#B4B4B4', // Accent color
        highlight: '#647236', // Highlight color (greenish for the left tile)
        link: '#007A7A', // Link color
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}
