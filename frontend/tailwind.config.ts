import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Ocean theme colors
        ocean: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // Navy theme for ships and UI
        navy: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Game state colors
        hit: '#ef4444',      // Red for hits
        miss: '#3b82f6',     // Blue for misses
        ship: '#6b7280',     // Gray for ships
        sunk: '#7c2d12',     // Dark red for sunk ships
        water: '#0ea5e9',    // Ocean blue for water
        hover: '#0284c7',    // Darker blue for hover states
        // Status colors
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
        display: ['Orbitron', 'system-ui', 'sans-serif'], // Futuristic font for headings
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'ocean': '0 4px 14px 0 rgba(14, 165, 233, 0.15)',
        'ocean-lg': '0 10px 25px -3px rgba(14, 165, 233, 0.1), 0 4px 6px -2px rgba(14, 165, 233, 0.05)',
        'navy': '0 4px 14px 0 rgba(15, 23, 42, 0.15)',
        'inner-ocean': 'inset 0 2px 4px 0 rgba(14, 165, 233, 0.1)',
        'game-board': '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave': 'wave 2s ease-in-out infinite',
        'hit-flash': 'hitFlash 0.6s ease-out',
        'ship-sink': 'shipSink 1s ease-in-out',
        'celebration': 'celebration 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        hitFlash: {
          '0%': { backgroundColor: 'rgb(239, 68, 68)', transform: 'scale(1)' },
          '50%': { backgroundColor: 'rgb(220, 38, 38)', transform: 'scale(1.1)' },
          '100%': { backgroundColor: 'rgb(239, 68, 68)', transform: 'scale(1)' },
        },
        shipSink: {
          '0%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(0.9) rotate(-5deg)', opacity: '0.7' },
          '100%': { transform: 'scale(0.8) rotate(-10deg)', opacity: '0.5' },
        },
        celebration: {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(1.1) rotate(5deg)' },
          '50%': { transform: 'scale(1.2) rotate(-5deg)' },
          '75%': { transform: 'scale(1.1) rotate(3deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      gridTemplateColumns: {
        'battleship': 'repeat(10, minmax(0, 1fr))',
      },
      gridTemplateRows: {
        'battleship': 'repeat(10, minmax(0, 1fr))',
      },
    },
  },
  plugins: [
    // Custom plugin for game-specific utilities
    function({ addUtilities }: any) {
      const newUtilities = {
        '.game-cell': {
          '@apply aspect-square border-2 border-ocean-300 bg-ocean-50 hover:bg-ocean-100 transition-all duration-200 cursor-pointer flex items-center justify-center text-lg font-bold': {},
        },
        '.game-cell-water': {
          '@apply bg-ocean-100 border-ocean-200': {},
        },
        '.game-cell-ship': {
          '@apply bg-navy-200 border-navy-300 text-navy-700': {},
        },
        '.game-cell-hit': {
          '@apply bg-red-200 border-red-400 text-red-700 animate-hit-flash': {},
        },
        '.game-cell-miss': {
          '@apply bg-blue-200 border-blue-400 text-blue-700': {},
        },
        '.game-cell-sunk': {
          '@apply bg-red-800 border-red-900 text-red-100 animate-ship-sink': {},
        },
        '.game-cell-hover': {
          '@apply bg-ocean-200 border-ocean-400 shadow-inner-ocean': {},
        },
        '.game-board': {
          '@apply grid grid-cols-battleship grid-rows-battleship gap-1 p-4 bg-ocean-500 rounded-2xl shadow-game-board': {},
        },
        '.ship-horizontal': {
          '@apply flex flex-row': {},
        },
        '.ship-vertical': {
          '@apply flex flex-col': {},
        },
        '.btn-ocean': {
          '@apply bg-ocean-500 hover:bg-ocean-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-ocean': {},
        },
        '.btn-navy': {
          '@apply bg-navy-700 hover:bg-navy-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-navy': {},
        },
        '.btn-disabled': {
          '@apply bg-gray-300 text-gray-500 cursor-not-allowed': {},
        },
        '.card-ocean': {
          '@apply bg-white rounded-xl shadow-ocean-lg border border-ocean-100 p-6': {},
        },
        '.text-gradient-ocean': {
          '@apply bg-gradient-to-r from-ocean-600 to-ocean-400 bg-clip-text text-transparent': {},
        },
        '.bg-gradient-ocean': {
          '@apply bg-gradient-to-br from-ocean-400 via-ocean-500 to-ocean-600': {},
        },
        '.notification-success': {
          '@apply bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg': {},
        },
        '.notification-error': {
          '@apply bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg': {},
        },
        '.notification-info': {
          '@apply bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-r-lg': {},
        },
        '.loading-spinner': {
          '@apply animate-spin rounded-full border-4 border-ocean-200 border-t-ocean-600': {},
        },
      }
      addUtilities(newUtilities)
    },
  ],
}

export default config 