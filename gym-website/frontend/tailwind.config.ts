import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        neon: {
          green: '#39ff14',
          blue: '#00f5ff',
          purple: '#bf00ff',
          yellow: '#ffff00',
        },
        dark: {
          100: '#1a1a1a',
          200: '#141414',
          300: '#0d0d0d',
          400: '#080808',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Rajdhani', 'Impact', 'sans-serif'],
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow': {
          from: { boxShadow: '0 0 5px #f59e0b, 0 0 10px #f59e0b, 0 0 15px #f59e0b' },
          to: { boxShadow: '0 0 10px #f59e0b, 0 0 20px #f59e0b, 0 0 30px #f59e0b' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #92400e 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
        'gradient-hero': 'radial-gradient(ellipse at center, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'gold': '0 0 20px rgba(245, 158, 11, 0.4)',
        'gold-lg': '0 0 40px rgba(245, 158, 11, 0.6)',
        'neon': '0 0 20px rgba(57, 255, 20, 0.4)',
      },
    },
  },
  plugins: [],
};

export default config;
