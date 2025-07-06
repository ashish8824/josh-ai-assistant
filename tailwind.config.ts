import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#1e3a8a", // Indigo
        background: "#F9FAFB", // Light BG
        card: "#FFFFFF",
        text: "#111827", // Dark text
        error: "#EF4444",
        accent: "#F59E0B",
      },
      borderRadius: {
        "2xl": "1rem",
      },
      corePlugins: {
        preflight: true,
      },
    },
  },
  plugins: [],
};

export default config;
