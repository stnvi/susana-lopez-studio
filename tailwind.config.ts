import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // RUTA UNIVERSAL
  ],
  theme: {
    extend: {
      colors: {
        // COLORES DE MARCA (HARDCODED)
        primary: "#C5A059",      // Dorado
        "primary-dark": "#A68545", // Dorado Oscuro
        secondary: "#1C1917",    // Negro
        background: "#FAFAF9",   // Crema suave
        foreground: "#1C1917",   // Negro texto base
        accent: "#F5F0E6",       // Beige claro
        "footer-bg": "#4A4036",
        "footer-text": "#EAEAEA",
      },
      fontFamily: {
        // Asegura que estas variables existan en layout.tsx o usa sans por defecto
        serif: ["var(--font-playfair-display)", "serif"],
        sans: ["var(--font-lato)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;