/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#000",
      white: "#fff",
      bg: "#000",
      card: "#0d0d0d",
      line: "#242424",
      ink: "#fff",
      muted: "#9b9b9b",
      accent: "#22d36b",
      danger: "#ff7a7a",
    },
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "sans-serif"],
        display: ['"Bricolage Grotesque"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
