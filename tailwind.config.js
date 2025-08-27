export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        aurora: {
          glass: 'rgba(173, 216, 230, 0.1)',
          blue: 'rgba(100, 149, 237, 0.3)',
          white: 'rgba(255, 255, 255, 0.2)',
          purple: 'rgba(147, 112, 219, 0.2)',
          cyan: 'rgba(0, 255, 255, 0.15)',
          lightBlue: 'rgba(135, 206, 250, 0.25)',
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
      },
      keyframes: {
        'aurora-float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(1deg)' },
          '66%': { transform: 'translateY(5px) rotate(-1deg)' },
        },
        'aurora-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(173, 216, 230, 0.3), 0 0 40px rgba(100, 149, 237, 0.2), 0 0 60px rgba(147, 112, 219, 0.1)' 
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(173, 216, 230, 0.5), 0 0 60px rgba(100, 149, 237, 0.3), 0 0 90px rgba(147, 112, 219, 0.2)' 
          },
        },
        'aurora-shift': {
          '0%, 100%': { 
            background: 'linear-gradient(135deg, rgba(173, 216, 230, 0.1) 0%, rgba(100, 149, 237, 0.3) 25%, rgba(255, 255, 255, 0.2) 50%, rgba(147, 112, 219, 0.2) 75%, rgba(0, 255, 255, 0.15) 100%)' 
          },
          '25%': { 
            background: 'linear-gradient(135deg, rgba(147, 112, 219, 0.2) 0%, rgba(0, 255, 255, 0.15) 25%, rgba(173, 216, 230, 0.1) 50%, rgba(100, 149, 237, 0.3) 75%, rgba(255, 255, 255, 0.2) 100%)' 
          },
          '50%': { 
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(173, 216, 230, 0.1) 25%, rgba(147, 112, 219, 0.2) 50%, rgba(0, 255, 255, 0.15) 75%, rgba(100, 149, 237, 0.3) 100%)' 
          },
          '75%': { 
            background: 'linear-gradient(135deg, rgba(100, 149, 237, 0.3) 0%, rgba(255, 255, 255, 0.2) 25%, rgba(0, 255, 255, 0.15) 50%, rgba(173, 216, 230, 0.1) 75%, rgba(147, 112, 219, 0.2) 100%)' 
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
        }
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
}