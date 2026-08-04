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
        "on-background": "#1a1c1e",
        surface: {
          DEFAULT: "#f9f9fc",
          bright: "#f9f9fc",
          dim: "#dadadc",
          gray: "#F8F9FA",
          tint: "#006b5e",
          variant: "#e2e2e5",
          container: "#eeeef0",
          low: "#f3f3f6",
          lowest: "#ffffff",
          high: "#e8e8ea",
          highest: "#e2e2e5"
        },
        "on-surface": "#1a1c1e",
        "on-surface-variant": "#3e4946",
        primary: {
          DEFAULT: "#005147",
          foreground: "#ffffff",
          container: "#006b5e",
          fixed: "#9ff2e1"
        },
        "on-primary": "#ffffff",
        "on-primary-container": "#95e8d8",
        "on-primary-fixed": "#00201b",
        "on-primary-fixed-variant": "#005046",
        "primary-fixed-dim": "#83d5c5",
        "growth-green": "#006B5E",
        secondary: {
          DEFAULT: "#006d2f",
          foreground: "#ffffff",
          container: "#5dfd8a",
          fixed: "#66ff8e",
          "fixed-dim": "#3de273"
        },
        "on-secondary": "#ffffff",
        "on-secondary-container": "#007232",
        "on-secondary-fixed": "#002109",
        "on-secondary-fixed-variant": "#005322",
        tertiary: {
          DEFAULT: "#003fa3",
          container: "#0055d4",
          fixed: "#dae2ff",
          "fixed-dim": "#b2c5ff"
        },
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#ccd8ff",
        "on-tertiary-fixed": "#001848",
        "on-tertiary-fixed-variant": "#003fa3",
        "trust-blue": "#0055D4",
        error: {
          DEFAULT: "#ba1a1a",
          foreground: "#ffffff",
          container: "#ffdad6",
          red: "#BA1A1A"
        },
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
        border: {
          DEFAULT: "#e2e2e5",
          subtle: "#E1E3E5"
        },
        muted: {
          DEFAULT: "#6e7976",
          foreground: "#3e4946"
        },
        outline: "#6e7976",
        "outline-variant": "#bec9c5",
        "inverse-surface": "#2f3133",
        "inverse-on-surface": "#f0f0f3",
        "inverse-primary": "#83d5c5",
        "status-pending": "#FEF7FF",
        "status-shipped": "#F0FDF4"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        "stack-sm": "0.5rem",
        "stack-md": "1rem",
        "stack-lg": "2rem",
        "margin-mobile": "1.25rem",
        "gutter-mobile": "1rem",
        "touch-target-min": "3rem"
      },
      fontFamily: {
        sans: ["Be Vietnam Pro", "sans-serif"],
        "headline-lg": ["Be Vietnam Pro"],
        "headline-lg-mobile": ["Be Vietnam Pro"],
        "headline-md": ["Be Vietnam Pro"],
        "body-lg": ["Be Vietnam Pro"],
        "body-md": ["Be Vietnam Pro"],
        "label-lg": ["Be Vietnam Pro"],
        "label-sm": ["Be Vietnam Pro"]
      },
      fontSize: {
        "headline-lg": ["32px", { lineHeight: "44px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg-mobile": ["28px", { lineHeight: "36px", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-lg": ["14px", { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "600" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "500" }]
      }
    }
  },
  plugins: [],
};
