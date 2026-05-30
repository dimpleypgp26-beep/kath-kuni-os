/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  "#FDFAF5",
          100: "#F7F0E3",
          200: "#EFE1C8",
        },
        sand: {
          100: "#EDD9BC",
          200: "#DEC49E",
          300: "#CEAD82",
        },
        tan: {
          300: "#C4955A",
          400: "#B8823D",
          500: "#A47148",
          600: "#8A5C35",
        },
        walnut: {
          500: "#5C3D2E",
          600: "#4A3025",
          700: "#3A241B",
          800: "#2C1A12",
          900: "#1E100A",
        },
        mocha: {
          400: "#9C7B5C",
          500: "#7D6047",
        },
        moss: {
          500: "#5F8A5A",
        },
      },
      fontFamily: {
        fraunces: ["FrauncesVariable", "serif"],
        hanken:   ["HankenGroteskVariable", "sans-serif"],
      },
    },
  },
  plugins: [],
};
