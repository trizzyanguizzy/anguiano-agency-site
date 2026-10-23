import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Colors come from CSS variables (app/globals.css) so the family app can swap in its own
        // light and dark palettes while the portfolio keeps its original values.
        background: {
          primary: 'rgb(var(--c-bg-1) / <alpha-value>)',
          secondary: 'rgb(var(--c-bg-2) / <alpha-value>)',
          tertiary: 'rgb(var(--c-bg-3) / <alpha-value>)',
        },
        foreground: {
          primary: 'rgb(var(--c-fg-1) / <alpha-value>)',
          secondary: 'rgb(var(--c-fg-2) / <alpha-value>)',
          tertiary: 'rgb(var(--c-fg-3) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--c-accent) / <alpha-value>)',
          hover: 'rgb(var(--c-accent-hover) / <alpha-value>)',
          light: 'rgb(var(--c-accent-text) / <alpha-value>)',
          // Portfolio accent (named orange, actually green); unchanged.
          orange: {
            DEFAULT: '#10B981',
            hover: '#059669',
            light: '#34D399',
            dark: '#047857',
          },
        },
        brass: 'rgb(var(--c-brass) / <alpha-value>)',
        border: {
          subtle: 'rgb(var(--c-line) / 0.1)',
          DEFAULT: 'rgb(var(--c-line) / 0.15)',
          emphasis: 'rgb(var(--c-line) / 0.25)',
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'word-fade': 'wordFade 0.8s ease-out forwards',
        'subtle-float': 'subtleFloat 3s ease-in-out infinite',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        wordFade: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        subtleFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
