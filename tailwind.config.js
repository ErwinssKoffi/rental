/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: { DEFAULT: "#0a0a0a", 600: "#1a1a1a", 700: "#111111", 800: "#0d0d0d", 900: "#0a0a0a", 950: "#050505" },
        graphite: { DEFAULT: "#1c1c1e", 400: "#6e6e73", 500: "#3a3a3c", 600: "#2c2c2e", 700: "#1c1c1e", 800: "#141416" },
        gold: { DEFAULT: "#c9a84c", 300: "#e9c15f", 400: "#dca83a", 500: "#c9a84c", 600: "#b08a2e", 700: "#8a6a22" },
        platinum: { DEFAULT: "#e8e8e8", 100: "#f5f5f5", 200: "#e8e8e8", 300: "#d4d4d4", 400: "#a3a3a3", 500: "#737373" },
        success: { DEFAULT: "#00FF99" },
        error: { DEFAULT: "#FF4D4D" },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        body: ["var(--font-barlow)", "sans-serif"],
        condensed: ["var(--font-barlow)", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #c9a84c 0%, #e9c15f 50%, #b08a2e 100%)",
        "card-gradient": "linear-gradient(180deg, transparent 0%, rgba(10,10,10,0.97) 100%)",
        "hero-gradient": "linear-gradient(135deg, #050505 0%, #1c1c1e 100%)",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)",
        "card-hover": "0 24px 60px rgba(0,0,0,0.7), 0 4px 20px rgba(201,168,76,0.15)",
        gold: "0 0 30px rgba(201,168,76,0.3)",
        nav: "0 1px 0 rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.5)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.5s ease forwards",
        float: "float 6s ease-in-out infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(24px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        pulseGold: { "0%, 100%": { boxShadow: "0 0 20px rgba(201,168,76,0.2)" }, "50%": { boxShadow: "0 0 40px rgba(201,168,76,0.5)" } },
      },
    },
  },
  plugins: [],
};
