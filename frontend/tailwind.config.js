/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F1419",
        surface: "#161B22",
        surfaceHover: "#1C232D",
        line: "#262D38",
        muted: "#8B96A5",
        text: "#E6EDF3",
        pulse: "#5EEAD4",
        amber: "#F5A623",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        blip: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.35 },
        },
      },
      animation: {
        blip: "blip 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
