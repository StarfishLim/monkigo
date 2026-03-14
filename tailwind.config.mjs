/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.css"
  ],
  theme: {
    extend: {
      colors: {
        banana: {
          light: "#FFF7CC",
          DEFAULT: "#FFE066",
          dark: "#E3B341"
        },
        jungle: {
          light: "#D9F5E5",
          DEFAULT: "#58CC02",
          dark: "#46A302"
        },
        sky: {
          light: "#E5F5FA",
          DEFAULT: "#1CB0F6",
          dark: "#1899D6"
        },
        cream: {
          light: "#FFFBF7",
          DEFAULT: "#F7F2E8",
          dark: "#EDE6D9"
        },
        coral: { DEFAULT: "#FF9600" },
        pink: { light: "#FFE5E5", DEFAULT: "#FF4B4B" }
      },
      fontFamily: {
        display: ["Nunito", "system-ui", "sans-serif"]
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
        "4xl": "1.5rem",
        "5xl": "2rem"
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.06)",
        "soft-lg": "0 4px 16px rgba(0,0,0,0.08)",
        "duo": "0 4px 0 0 #46A302",
        "duo-sm": "0 3px 0 0 #46A302"
      }
    }
  },
  plugins: []
};

export default config;

