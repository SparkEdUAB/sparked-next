/** @type {import('tailwindcss').Config} */
const flowbite = require('flowbite-react/tailwind');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', flowbite.content()],
  theme: {
    extend: {
      animation: {
        appear: 'appear 0.5s ease-in-out',
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'loading-bar': 'loading-bar 1.2s ease-in-out infinite',
      },
      keyframes: {
        appear: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'loading-bar': {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(300%)' },
        },
      },
    },
  },
  plugins: [flowbite.plugin()],

  //config for mobx
  assumptions: {
    setPublicClassFields: false,
  },
};
