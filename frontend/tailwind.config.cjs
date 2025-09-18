// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // 👈 importante
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#f0f4f8",   // fondo claro
          DEFAULT: "#005F73", // azul oscuro
          accent: "#0A9396",  // verde azulado
          danger: "#BB3E03",  // rojo
          dark: "#0d1b2a",    // fondo dark
        },
      },
    },
  },
  plugins: [],
};
