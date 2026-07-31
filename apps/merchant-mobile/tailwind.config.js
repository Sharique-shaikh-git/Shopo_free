/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f9f9fc",
        foreground: "#1a1c1e",
        surface: {
          DEFAULT: "#f9f9fc",
          dim: "#dadadc",
          container: "#eeeef0",
          low: "#f3f3f6",
          lowest: "#ffffff",
          high: "#e8e8ea",
          highest: "#e2e2e5"
        },
        primary: {
          DEFAULT: "#006b5e",
          foreground: "#ffffff",
          container: "#006b5e",
          fixed: "#9ff2e1"
        },
        secondary: {
          DEFAULT: "#006d2f",
          foreground: "#ffffff",
          container: "#5dfd8a",
        },
        error: {
          DEFAULT: "#ba1a1a",
          foreground: "#ffffff",
        },
        border: {
          DEFAULT: "#e2e2e5",
          subtle: "#E1E3E5"
        },
        muted: {
          DEFAULT: "#6e7976",
          foreground: "#3e4946",
        },
      },
    },
  },
  plugins: [],
};
