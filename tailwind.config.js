/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"], // You can import a google font later
      },
      colors: {
        dark: "#0a0a0a",
        primary: "#6366f1", // Indigo 500
        secondary: "#a855f7", // Purple 500
      },
    },
  },
  plugins: [],
};
