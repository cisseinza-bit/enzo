/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0A',        // fond principal
        surface: '#141414',     // cartes
        surface2: '#1E1E1E',    // cartes secondaires / borders
        lime: '#C8F135',        // accent vert
        flame: '#FF6B35',       // accent orange
        muted: '#8A8A8A',       // texte secondaire
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        app: '390px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'flame': {
          '0%,100%': { transform: 'scale(1) rotate(-2deg)' },
          '50%': { transform: 'scale(1.12) rotate(2deg)' },
        },
        'ring': {
          '0%': { strokeDashoffset: 'var(--circ)' },
          '100%': { strokeDashoffset: 'var(--offset)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'pop': 'pop 0.4s ease-out both',
        'flame': 'flame 1.6s ease-in-out infinite',
        'ring': 'ring 1s ease-out forwards',
        'shimmer': 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
}
