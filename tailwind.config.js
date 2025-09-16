export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        neon: {
          purple: '#8B5CF6',
          pink: '#EC4899',
          violet: '#7C3AED',
          magenta: '#DB2777',
          cyan: '#06B6D4',
          blue: '#3B82F6',
          brightPurple: '#A855F7',
          electricPurple: '#9333EA',
        },
        aurora: {
          glass: 'rgba(139, 92, 246, 0.15)',
          purple: 'rgba(139, 92, 246, 0.4)',
          pink: 'rgba(236, 72, 153, 0.3)',
          violet: 'rgba(124, 58, 237, 0.3)',
          cyan: 'rgba(6, 182, 212, 0.2)',
          magenta: 'rgba(219, 39, 119, 0.3)',
        }
      },
      animation: {
        'aurora-float': 'aurora-float 8s ease-in-out infinite',
        'aurora-glow': 'aurora-glow 6s ease-in-out infinite',
        'aurora-shift': 'aurora-shift 10s ease-in-out infinite',
        'text-3d': 'text-3d 4s ease-in-out infinite',
        'aurora-wave': 'aurora-wave 8s ease-in-out infinite',
        'aurora-sparkle': 'aurora-sparkle 3s ease-in-out infinite',
        'aurora-breathe': 'aurora-breathe 12s ease-in-out infinite',
        'aurora-ripple': 'aurora-ripple 6s ease-in-out infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite alternate',
        'neon-flicker': 'neon-flicker 3s ease-in-out infinite',
      },
      keyframes: {
        'aurora-float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(1deg)' },
          '66%': { transform: 'translateY(5px) rotate(-1deg)' },
        },
        'aurora-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(236, 72, 153, 0.4), 0 0 60px rgba(124, 58, 237, 0.3)' 
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.7), 0 0 60px rgba(236, 72, 153, 0.5), 0 0 90px rgba(124, 58, 237, 0.4)' 
          },
        },
        'aurora-shift': {
          '0%, 100%': { 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.3) 25%, rgba(255, 255, 255, 0.2) 50%, rgba(124, 58, 237, 0.3) 75%, rgba(6, 182, 212, 0.2) 100%)' 
          },
          '25%': { 
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(6, 182, 212, 0.2) 25%, rgba(139, 92, 246, 0.15) 50%, rgba(236, 72, 153, 0.3) 75%, rgba(255, 255, 255, 0.2) 100%)' 
          },
          '50%': { 
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(139, 92, 246, 0.15) 25%, rgba(124, 58, 237, 0.3) 50%, rgba(6, 182, 212, 0.2) 75%, rgba(236, 72, 153, 0.3) 100%)' 
          },
          '75%': { 
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(255, 255, 255, 0.2) 25%, rgba(6, 182, 212, 0.2) 50%, rgba(139, 92, 246, 0.15) 75%, rgba(124, 58, 237, 0.3) 100%)' 
          },
        },
        'text-3d': {
          '0%, 100%': { 
            transform: 'translateZ(0px) rotateX(0deg) rotateY(0deg)',
            textShadow: '0 0 0 rgba(0,0,0,0), 0 0 0 rgba(0,0,0,0), 0 0 0 rgba(0,0,0,0)'
          },
          '50%': { 
            transform: 'translateZ(10px) rotateX(2deg) rotateY(1deg)',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3), 4px 4px 8px rgba(0,0,0,0.2), 6px 6px 12px rgba(0,0,0,0.1)'
          },
        },
        'aurora-wave': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'aurora-sparkle': {
          '0%, 100%': { 
            transform: 'scale(1) rotate(0deg)',
            opacity: 0.8
          },
          '50%': { 
            transform: 'scale(1.5) rotate(180deg)',
            opacity: 1
          },
        },
        'aurora-breathe': {
          '0%, 100%': { 
            transform: 'scale(1)',
            filter: 'brightness(1)'
          },
          '50%': { 
            transform: 'scale(1.02)',
            filter: 'brightness(1.1)'
          },
        },
        'aurora-ripple': {
          '0%': { 
            transform: 'scale(0.8)',
            opacity: 1
          },
          '100%': { 
            transform: 'scale(2)',
            opacity: 0
          },
        },
        'neon-pulse': {
          '0%': { 
            textShadow: '0 0 5px rgba(191, 0, 255, 0.8), 0 0 10px rgba(191, 0, 255, 0.6), 0 0 15px rgba(191, 0, 255, 0.4), 0 0 20px rgba(255, 0, 255, 0.3)'
          },
          '100%': { 
            textShadow: '0 0 10px rgba(191, 0, 255, 1), 0 0 20px rgba(191, 0, 255, 0.8), 0 0 30px rgba(191, 0, 255, 0.6), 0 0 40px rgba(255, 0, 255, 0.5)'
          },
        },
        'neon-flicker': {
          '0%, 100%': { 
            opacity: 1,
            filter: 'brightness(1)'
          },
          '50%': { 
            opacity: 0.8,
            filter: 'brightness(1.2)'
          },
        }
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
}