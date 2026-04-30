import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "ns-brown": "#6b4d36",
        "ns-brown-light": "#8b6b4d",
        "ns-gold": "#c9a962",
        "ns-cream": "#f5f0e8",
      },
      fontFamily: {
        sans: ["var(--font-tajawal)", "Tajawal", "system-ui", "sans-serif"],
        serif: ["Georgia", "Cambria", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
