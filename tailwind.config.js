/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0D0D0D',
        gold: {
          50: '#FBF8F3',
          100: '#F5EFE3',
          200: '#EBD9BE',
          300: '#DFBF94',
          400: '#D4A56B',
          500: '#C5A059',
          600: '#A88545',
          700: '#8B6B38',
          800: '#6F542D',
          900: '#524024',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["luxury", "business"],
    darkTheme: "luxury",
  },
}
