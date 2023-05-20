/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      gridTemplateRows: {
        // Simple 8 row grid
        20: "repeat(20, minmax(0, 1fr))",
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#19418B",
          "primary-focus": "#0C9707",
          neutral: "#535a66",
          "neutral-content": "#ebecf0",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
