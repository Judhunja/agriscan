/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',           // green-800
          foreground: 'var(--color-primary-foreground)', // white
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',          // lime-800
          foreground: 'var(--color-secondary-foreground)', // white
        },
        accent: {
          DEFAULT: 'var(--color-accent)',             // amber-700
          foreground: 'var(--color-accent-foreground)', // black
        },
        background: 'var(--color-background)',        // warm-gray-50
        foreground: 'var(--color-foreground)',        // gray-900
        card: {
          DEFAULT: 'var(--color-card)',               // white
          foreground: 'var(--color-card-foreground)', // gray-900
        },
        popover: {
          DEFAULT: 'var(--color-popover)',            // white
          foreground: 'var(--color-popover-foreground)', // gray-900
        },
        muted: {
          DEFAULT: 'var(--color-muted)',              // gray-100
          foreground: 'var(--color-muted-foreground)', // gray-600
        },
        border: 'var(--color-border)',                // primary/15
        input: 'var(--color-input)',                  // white
        ring: 'var(--color-ring)',                    // green-800
        success: {
          DEFAULT: 'var(--color-success)',            // green-700
          foreground: 'var(--color-success-foreground)', // white
        },
        warning: {
          DEFAULT: 'var(--color-warning)',            // orange-700
          foreground: 'var(--color-warning-foreground)', // black
        },
        error: {
          DEFAULT: 'var(--color-error)',              // red-700
          foreground: 'var(--color-error-foreground)', // white
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)',        // red-700
          foreground: 'var(--color-destructive-foreground)', // white
        },
      },
      fontFamily: {
        heading: ['Nunito Sans', 'sans-serif'],
        body: ['Source Sans 3', 'sans-serif'],
        caption: ['Inter', 'sans-serif'],
        data: ['JetBrains Mono', 'monospace'],
        sans: ['Source Sans 3', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-1': ['2.25rem', { lineHeight: '1.2', fontWeight: '800' }],
        'display-2': ['1.875rem', { lineHeight: '1.25', fontWeight: '700' }],
        'heading-1': ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-2': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-3': ['1.125rem', { lineHeight: '1.5', fontWeight: '600' }],
        'body-base': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.6' }],
        'caption': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.025em' }],
        'caption-sm': ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.025em' }],
        'data': ['0.875rem', { lineHeight: '1.4' }],
      },
      spacing: {
        '1.5': '6px',   // space-1
        '3': '12px',    // space-2
        '4.5': '18px',  // space-3
        '6': '24px',    // space-4
        '9': '36px',    // space-5
        '12': '48px',   // space-6
        '18': '72px',   // space-7
        '24': '96px',   // space-8
        '36': '144px',  // space-9
        '16': '64px',   // bottom nav height
      },
      borderRadius: {
        'sm': '6px',    // radius-sm
        'md': '12px',   // radius-md
        'lg': '18px',   // radius-lg
        'xl': '24px',   // radius-xl
        DEFAULT: '12px',
      },
      boxShadow: {
        'sm': '0 2px 4px rgba(139, 69, 19, 0.08)',
        'DEFAULT': '0 3px 6px rgba(139, 69, 19, 0.10)',
        'md': '0 3px 6px rgba(139, 69, 19, 0.10)',
        'lg': '0 6px 12px rgba(139, 69, 19, 0.12)',
        'xl': '0 12px 24px rgba(139, 69, 19, 0.14)',
        '2xl': '0 32px 64px -12px rgba(139, 69, 19, 0.16)',
        'none': 'none',
      },
      transitionDuration: {
        DEFAULT: '250ms',
        '250': '250ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'ease-out',
        'spring': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      maxWidth: {
        'prose': '70ch',
        'nav': '600px',
      },
      zIndex: {
        'navigation': '100',
        'modal': '200',
        'toast': '300',
        'camera': '400',
      },
      animation: {
        'skeleton-pulse': 'skeleton-pulse 1.5s ease-in-out infinite',
        'sync-spin': 'sync-spin 1s linear infinite',
        'fade-in': 'fadeIn 250ms ease-out',
        'slide-up': 'slideUp 250ms ease-out',
      },
      keyframes: {
        'skeleton-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'sync-spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
};