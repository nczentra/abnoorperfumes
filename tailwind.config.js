/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          emerald: '#103B2D',
          'dark-forest': '#0B2119',
          gold: '#C6A15B',
          'soft-gold': '#E5D3A3',
          ivory: '#F8F5EF',
          charcoal: '#171717',
          'muted-grey': '#777777',
        },
        gold: {
          50: '#FDFBF7',
          100: '#FAF4E8',
          200: '#F3E4C6',
          300: '#E5D3A3',
          400: '#D5BC7C',
          500: '#C6A15B',
          600: '#B08845',
          700: '#8E6B32',
          800: '#6D5124',
          900: '#4D3818',
        },
        emerald: {
          950: '#071610',
          900: '#0B2119',
          850: '#103B2D',
          800: '#154E3C',
          700: '#1D6B53',
        }
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(16, 59, 45, 0.15)',
        'luxury-hover': '0 20px 40px -15px rgba(198, 161, 91, 0.25)',
        'gold-glow': '0 0 25px rgba(198, 161, 91, 0.35)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #E5D3A3 0%, #C6A15B 50%, #B08845 100%)',
        'emerald-gradient': 'linear-gradient(135deg, #154E3C 0%, #103B2D 50%, #0B2119 100%)',
        'luxury-dark': 'linear-gradient(180deg, #0B2119 0%, #071610 100%)',
      }
    },
  },
  plugins: [],
}
