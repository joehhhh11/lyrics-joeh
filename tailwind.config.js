/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/theme");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "grays-50":"#F8F8F8",
        "sipro": "#E9DFCE",
        "sipro-50": "#F0F7FA",
        "sipro-30": "#B9B9BB",
        "sipro-150": "#CAE2EB",
        "sipro-200": "#F0F7FA",
        "bravvo": "#006389",
        "sipro-400": "#014764",
        "sipro-70": "#EFFBFF",
        "bravvo": "#1E2125",
        "bravvo-50": "#28007B",
        "bravvo2": "#FF8400",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        orbitron: ["Orbitron", "sans-serif"],
        grand: ['grand', 'sans-serif'],
      },
      transform: {
        "rotate-z-45": "rotateZ(45deg)",
        "rotate-z-90": "rotateZ(90deg)",
        "rotate-z-180": "rotateZ(180deg)",
        'flip-horizontal': 'scaleX(-1)',
      },
      keyframes: {
        'border-slide': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'border-slide': 'border-slide 0.3s ease-out',
        'spin-slow': 'spin 20s linear infinite',
        'spin-reverse': 'spin 20s linear infinite reverse',
      },
    
    },
  },

  plugins: [nextui(), require("tailwindcss-animated")],
};
