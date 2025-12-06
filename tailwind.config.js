/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        resume: {
          sidebar: '#333333', // Dark grey from image
          header: '#d4ded4', // Light sage green estimate
          accent: '#000000',
        }
      }
    },
  },
  plugins: [],
}

