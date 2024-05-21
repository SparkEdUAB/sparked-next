import flowbite from 'flowbite-react/tailwind';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', flowbite.content()],
  theme: {
    extend: {},
  },
  plugins: [flowbite.plugin()],

  //config for mobx
  assumptions: {
    setPublicClassFields: false,
  },
};
