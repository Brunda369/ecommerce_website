/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom palette from design
        primary: {
          DEFAULT: '#B77466', // warm terracotta
          600: '#A36155',
          700: '#7F4B40'
        },
        secondary: {
          DEFAULT: '#957C62', // earthy brown
          600: '#7E6650'
        },
        accent: {
          DEFAULT: '#FFE1AF', // soft cream highlight
          600: '#F5D79A'
        },
        warm: {
          DEFAULT: '#E2B59A' // warm accent / pale peach
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', ' -apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial']
      }
    },
  },
  plugins: [],
};
