/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ftb: {
          blue: '#003688',
          'blue-hover': '#002a5c',
          gold: '#FDB81E',
          error: '#cd2026',
          success: '#0f6d38',
          warning: '#dcba00',
          light: '#fafafa',
        },
        ca: {
          gray: {
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#eeeeee',
            300: '#e0e0e0',
            400: '#bdbdbd',
            500: '#9e9e9e',
            600: '#757575',
            700: '#616161',
            800: '#3b3a48',
          }
        }
      },
      fontFamily: {
        sans: ['"Public Sans"', 'Arial', 'Helvetica', 'sans-serif'],
      },
      maxWidth: {
        ca: '1176px',
      }
    },
  },
  plugins: [],
}
