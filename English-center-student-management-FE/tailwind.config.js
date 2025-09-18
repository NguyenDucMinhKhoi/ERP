// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E6FFFA",
          100: "#CCFBF1",
          200: "#99F6E4",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
          800: "#115E59",
          900: "#134E4A",
          main: "#14B8A6",
          dark: "#0F766E",
          light: "#2DD4BF",
          lighter: "#5EEAD4",
          lightest: "#E6FFFA",
          contrastText: "#FFFFFF",
        },
        success: {
          100: "#C6F6D5",
          500: "#38A169",
          700: "#276749",
          900: "#1C4532",
        },
        warning: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          500: "#D97706",
          700: "#92400E",
          900: "#451A03",
        },
        error: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          500: "#EF4444",
          700: "#B91C1C",
          900: "#7F1D1D",
        },
        info: {
          50: "#ECFEFF",
          100: "#CFFAFE",
          500: "#06B6D4",
          700: "#0E7490",
          900: "#164E63",
        },
        // thêm 2 màu nền hệ thống
        background: "#F8F9FA", // app background
        surface: "#FFFFFF", // thẻ, card, content background
      },
      boxShadow: {
        card: "0 8px 24px -12px rgba(15, 23, 42, 0.2)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};
