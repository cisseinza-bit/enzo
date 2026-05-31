/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Échelle de gris froids, plus maîtrisée qu'un simple #141414.
        ink: {
          DEFAULT: '#080809',   // fond le plus profond
          900: '#0A0A0B',
          800: '#101012',
          700: '#16161A',
          600: '#1D1D22',
          500: '#26262D',       // bordures
        },
        surface: '#0F0F11',
        surface2: '#16161A',
        lime: {
          DEFAULT: '#C8F135',
          soft: '#D7F86A',
          dim: '#9DBE2A',
        },
        flame: {
          DEFAULT: '#FF6B35',
          soft: '#FF8A5E',
        },
        muted: '#7A7A85',
        faint: '#4A4A52',
      },
      fontFamily: {
        // Display condensée et massive pour les titres / chiffres (vibe Nike).
        display: ['"Archivo"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      maxWidth: {
        app: '420px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        // Ombres dures et profondes, pas de flou diffus générique.
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -8px rgba(0,0,0,0.7)',
        lift: '0 16px 40px -12px rgba(0,0,0,0.8)',
        glow: '0 0 0 1px rgba(200,241,53,0.2), 0 8px 32px -4px rgba(200,241,53,0.35)',
        'glow-flame': '0 8px 32px -4px rgba(255,107,53,0.4)',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '70%,100%': { transform: 'scale(1.25)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both',
        shimmer: 'shimmer 1.6s infinite',
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.4,0,0.6,1) infinite',
      },
    },
  },
  plugins: [],
}
