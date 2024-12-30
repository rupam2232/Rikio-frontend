/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '450px', // Define custom breakpoint
      },
      colors: {
        background: "rgba(var(--background))",
        text: "rgba(var(--text))",
        border: "rgba(var(--border))",
        shadow: "rgba(var(--shadow))",
        secondary: "rgba(var(--secondary))"
      }
    },
  },
  plugins: [],
}

