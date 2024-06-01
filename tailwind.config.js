import flowbite from 'flowbite-react/tailwind';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', flowbite.content()],
  theme: {
    extend: {
      animation: {
        appear: 'appear 0.5s ease-in-out',
      },
      keyframes: {
        appear: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
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
