import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
      },
      colors: {
        brand: {
          primary: "#6366f1",
          dark: "#4f46e5",
          light: "#a5b4fc",
        },
        accent: {
          amber: "#f59e0b",
          emerald: "#10b981",
        },
      },
      keyframes: {
        gradientMove: {
          "0%": { backgroundPosition: "0% 100%" },
          "25%": { backgroundPosition: "100% 100%" },
          "50%": { backgroundPosition: "100% 0%" },
          "75%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "0% 100%" },
        },
      },
      animation: {
        gradientMove: "gradientMove 10s ease-in-out infinite",
      },
      boxShadow: {
        glass:
          "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
        card: "0 5px 20px rgba(31,41,55,0.1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
