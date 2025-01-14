const colors = require("tailwindcss/colors");
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/component/**/*.{js,ts,jsx,tsx}",
    "./src/layout/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    // fontFamily: {
    //   sans: ["Assistant", "sans-serif"],
    //   serif: ["Assistant", "sans-serif"],
    //   DejaVu: ["Assistant", "Arial", "sans-serif"],
    // },
    extend: {
      height: {
        header: "560px",
      },
      backgroundImage: {
        "page-header": "url('/page-header-bg.jpg')",
        "contact-header": "url('/page-header-bg-2.jpg')",
        subscribe: "url('/subscribe-bg.jpg')",
        "app-download": "url('/app-download.jpg')",
        cta: "url('/cta-bg.png')",
        "cta-1": "url('/cta/cta-bg-1.png')",
        "cta-2": "url('/cta/cta-bg-2.png')",
        "cta-3": "url('/cta/cta-bg-3.png')",
      },
      colors: {
        customBrown: {
          light: 'rgb(243, 244, 246)',
          DEFAULT: '#845333',
          dark: '#845333',
        },
        customGreen: {
          superLight: 'rgb(252, 255, 244)',
          light: 'rgb(244, 252, 223)',
          DEFAULT: '#3c6d16',
          dark: '#2c510f',
          leaf: '#afdc34'
        },
        customRed: {
          superLight: '#ffd6d6',
          light: '#ffa1a1',
          DEFAULT: '#ff4d4d',
          darker: '#e04646',
          dark: '#470000',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-in forwards',
        fadeOut: 'fadeOut 1s ease-out forwards',
      },
      boxShadow: {
        popup: "#3c6d16 0 3px 0, #3c6d16 3px 0px 0, #3c6d16 3px 3px 0, rgba(0, 0, 0, 0.432) 3px 3px 3px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
