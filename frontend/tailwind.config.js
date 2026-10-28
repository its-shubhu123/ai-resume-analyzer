/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cabinet Grotesk"', '"Syne"', "sans-serif"],
        body: ['"DM Sans"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      colors: {
        ink: {
          50: "#f0f0f5",
          100: "#e0e0eb",
          200: "#c2c2d6",
          300: "#9090b8",
          400: "#6b6b9a",
          500: "#4d4d7c",
          600: "#3a3a5e",
          700: "#272740",
          800: "#181826",
          900: "#0d0d18",
        },
        volt: {
          300: "#d4ff5e",
          400: "#c8ff3a",
          500: "#b8f400",
          600: "#96cc00",
        },
        coral: {
          400: "#ff7b61",
          500: "#ff5c3a",
        },
        sky: {
          400: "#60d0f0",
          500: "#38b8e0",
        },
      },
      backgroundImage: {
        "grid-ink": `linear-gradient(rgba(144,144,184,0.06) 1px, transparent 1px),
                     linear-gradient(90deg, rgba(144,144,184,0.06) 1px, transparent 1px)`,
      },
      backgroundSize: {
        grid: "32px 32px",
      },
    },
  },
  plugins: [],
};
