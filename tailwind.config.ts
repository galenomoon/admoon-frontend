import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "320px",
      md: "768px",
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2B3162",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        }, 
        "fade": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "left-to-right": {
          "0%": {
            transform: "translateX(-20px)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 1.6s ease-out",
        "fade": "fade 0.3s ease-out",
        "left-to-right": "left-to-right 0.3s ease-out",
      },
    },
  },
  plugins: [],
}
export default config
