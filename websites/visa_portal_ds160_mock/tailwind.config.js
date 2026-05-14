/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dsBlue: {
          DEFAULT: '#003366', // Primary header blue
          headerTop: '#002244',
          headerBottom: '#003366',
          light: '#E8F0F8',   // Light blue backgrounds
          border: '#6688AA',
          text: '#003366',
        },
        dsRed: {
          DEFAULT: '#CC0000', // Start button
          dark: '#800000',    // Retrieve button
          text: '#990000',    // App ID red
          alert: '#FF0000',
        },
        dsGray: {
          bg: '#F5F5F5',      // Sidebar/Page bg
          border: '#CCCCCC',
          text: '#000000',
          navActive: '#666666',
          navInactive: '#F0F0F0',
        }
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
        serif: ['Times New Roman', 'Times', 'serif'],
      },
      fontSize: {
        'xxs': '10px',
        'xs': '11px',
        'sm': '12px',
        'base': '13px', // DS-160 uses small text
        'lg': '16px',
        'xl': '18px',
        '2xl': '24px',
      },
      boxShadow: {
        'btn': '2px 2px 2px 0px rgba(0,0,0,0.3)',
      }
    },
  },
  plugins: [],
}