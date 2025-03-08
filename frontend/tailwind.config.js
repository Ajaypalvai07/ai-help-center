/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        'gray-750': '#2D3748', // Custom gray color for dark mode gradients
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        scale: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        }
      },
      animation: {
        'blob': 'blob 7s infinite',
        'gradient-slow': 'gradient 15s ease infinite',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'scale-slow': 'scale 2s ease-in-out infinite',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid': '20px 20px',
      },
      transitionDelay: {
        '2000': '2000ms',
        '4000': '4000ms',
        '6000': '6000ms',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}