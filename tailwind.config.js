module.exports = {
  content: ['./src/renderer/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        dark: {
          light: '#333333',
          DEFAULT: '#252526',
          dark: '#1c1c1c',
        },
        gray: {
          dark: '#aaaaaa',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
