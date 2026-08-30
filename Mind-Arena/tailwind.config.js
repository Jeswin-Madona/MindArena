/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],

  theme: {
    extend: {
      colors: {
        void: '#0B0E27',
        surface: '#151935',
        raised: '#1E2348',
        border: '#2A2F5C',

        ink: '#F3F2FA',
        muted: '#9092B8',

        violet: {
          DEFAULT: '#7C5CFC',
          soft: '#9B82FF',
          dim: '#3E2F8A',
        },

        amber: {
          DEFAULT: '#FFB84D',
          soft: '#FFD08A',
        },

        emerald: {
          DEFAULT: '#34D399',
        },

        rose: {
          DEFAULT: '#FB7185',
        },
      },

      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },

      backgroundImage: {
        'arena-glow':
          'radial-gradient(circle at 20% -10%, rgba(124,92,252,0.25), transparent 45%), radial-gradient(circle at 100% 0%, rgba(255,184,77,0.12), transparent 40%)',
      },
    },
  },

  plugins: [],
}