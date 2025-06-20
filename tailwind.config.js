/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xl: "1920px", // Setting 1920px as the xl breakpoint
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"], // Add Poppins font
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
      colors: {
        "custom-green": "#0F1A1C",
        "custom-dark": "#051E1C",
        "custom-green-image": "#083A35",
        "custom-dark-image": "#061715",
      },
    },
  },
  plugins: [],
};
