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
          // Blue, Black, White & Red luxury palette
          blue: '#0F2C59',
          'dark-blue': '#0A192F',
          'midnight-blue': '#070B14',
          'royal-blue': '#1D4ED8',
          'sapphire': '#2563EB',
          'ice-blue': '#DBEAFE',
          black: '#0A0A0A',
          charcoal: '#111827',
          white: '#FFFFFF',
          'off-white': '#F8FAFC',
          red: '#DC2626',
          'red-dark': '#B91C1C',
          'red-hover': '#EF4444',
          'red-light': '#FEE2E2',

          // Compatibility mappings to smoothly transition all existing components
          emerald: '#0A192F', // Now Deep Midnight Navy Blue
          'dark-forest': '#070B14', // Now Jet Black / Deep Midnight
          gold: '#2563EB', // Now Sapphire Royal Blue Accent
          'soft-gold': '#DBEAFE', // Now Soft Ice Blue Accent
          ivory: '#F8FAFC', // Now Crisp Off-white
          'muted-grey': '#64748B',
        },
        royal: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#0F2C59',
          950: '#0A192F',
        },
        crimson: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#450A0A',
        }
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(10, 25, 47, 0.25)',
        'luxury-hover': '0 20px 40px -15px rgba(37, 99, 235, 0.3)',
        'blue-glow': '0 0 25px rgba(37, 99, 235, 0.4)',
        'red-glow': '0 0 25px rgba(220, 38, 38, 0.45)',
      },
      backgroundImage: {
        'blue-gradient': 'linear-gradient(135deg, #1D4ED8 0%, #0F2C59 50%, #0A192F 100%)',
        'black-gradient': 'linear-gradient(180deg, #0A0A0A 0%, #070B14 100%)',
        'red-gradient': 'linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)',
        'luxury-dark': 'linear-gradient(180deg, #0A192F 0%, #070B14 100%)',
      }
    },
  },
  plugins: [],
}
