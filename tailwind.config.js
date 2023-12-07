/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors:{
        'bunker': {
          '50': '#f6f8f9',
          '100': '#eceff2',
          '200': '#d4dce3',
          '300': '#afbdca',
          '400': '#8399ad',
          '500': '#637d94',
          '600': '#4f647a',
          '700': '#415263',
          '800': '#384654',
          '900': '#323d48',
          '950': '#15191e',
        },
        'anzac': {
          '50': '#fbf9eb',
          '100': '#f6f1cb',
          '200': '#efe099',
          '300': '#e5ca5f',
          '400': '#deb841',
          '500': '#cc9d26',
          '600': '#b07b1e',
          '700': '#8d591b',
          '800': '#75481e',
          '900': '#643d1f',
          '950': '#3a1f0e',
        },

      }
    },
  },
  plugins: [require('daisyui')],
}

