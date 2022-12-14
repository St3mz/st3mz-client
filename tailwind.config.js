/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#c7ad1c",
        secondary: "#e88605",
        "prim-bg": "#0b152c",
        "sec-bg": "#0a0832",
        "sec-text": "#a8a29e",
      },
      animation: {
        rotate: "rotation 4s infinite ease-in-out",
      },
      keyframes: {
        rotation: {
          "0%": { transform: "rotate(0deg)" },
          "5%": { transform: "rotate(-20deg)" },
          "45%": { transform: "rotate(200deg)" },
          "55%": { transform: "rotate(160deg)" },
          "95%": { transform: "rotate(380deg)" },
          "100%": { transform: "rotate(359deg)" },
        },
      },
    },
    fontFamily: {
      sans: [
        "Nunito",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "sans-serif",
      ],
    },
    colors: {
      yellow: {
        50: "#fefce8",
        100: "#fef9c3",
        200: "#fef08a",
        300: "#fde047",
        400: "#facc15",
        500: "#c7ad1c",
        600: "#ca8a04",
        700: "#a16207",
        800: "#854d0e",
        900: "#713f12",
      },
      orange: {
        50: "#fff7ed",
        100: "#ffedd5",
        200: "#fed7aa",
        300: "#fdba74",
        400: "#fb923c",
        500: "#e88605",
        600: "#ea580c",
        700: "#c2410c",
        800: "#9a3412",
        900: "#7c2d12",
      },
    },
  },
  plugins: [],
});
