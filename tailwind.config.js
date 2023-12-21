import defaultTheme from 'tailwindcss/defaultTheme'
import forms from '@tailwindcss/forms'
import opentype from 'tailwindcss-opentype'
import aspect from '@tailwindcss/aspect-ratio'
import typography from '@tailwindcss/typography'
import scrollbar from 'tailwind-scrollbar'
const animate = require('tailwindcss-animate')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],

  content: [
    './pages/**/*.{ts,tsx,vue}',
    './components/**/*.{ts,tsx,vue}',
    './app/**/*.{ts,tsx,vue}',
    './src/**/*.{ts,tsx,vue}'
  ],

  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        },
        'collapsible-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-collapsible-content-height)' }
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: 0 }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-in-out',
        'collapsible-up': 'collapsible-up 0.2s ease-in-out'
      },
      fontFamily: {
        sans: ['Clear Sans', ...defaultTheme.fontFamily.sans]
      },
      data: {
        active: 'ui~="active"'
      },
      screens: {
        xs: { max: '425px' },
        sm: { max: '600px' },
        container: {
          center: true,
          padding: '2rem',
          screens: {
            '2xl': '1400px'
          }
        }
      },
      maxWidth: {
        8: '2rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        32: '8rem',
        40: '10rem',
        64: '16rem',
        72: '18rem'
      },
      width: {
        8: '2rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        32: '8rem',
        40: '10rem',
        64: '16rem',
        72: '18rem',
        100: '24rem'
      },
      minWidth: {
        8: '2rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        32: '8rem',
        40: '10rem',
        64: '16rem',
        72: '18rem'
      },
      minHeight: {
        8: '2rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        32: '8rem',
        34: '9rem',
        40: '10rem',
        64: '16rem',
        72: '18rem'
      },
      maxHeight: {
        8: '2rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        32: '8rem',
        34: '9rem',
        40: '10rem',
        64: '16rem',
        72: '18rem'
      },
      height: {
        8: '2rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        32: '8rem',
        34: '9rem',
        40: '10rem',
        64: '16rem',
        72: '18rem'
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        6: 'repeat(6, minmax(0, 1fr))',
        16: 'repeat(16, minmax(0, 1fr))',
        24: 'repeat(24, minmax(0, 1fr))'
      },
      gridColumn: {
        'span-13': 'span 13 / span 13',
        'span-14': 'span 14 / span 14',
        'span-15': 'span 15 / span 15',
        'span-16': 'span 16 / span 16',
        'span-17': 'span 17 / span 17',
        'span-18': 'span 18 / span 18',
        'span-19': 'span 19 / span 19',
        'span-20': 'span 20 / span 20',
        'span-21': 'span 21 / span 21',
        'span-22': 'span 22 / span 22',
        'span-23': 'span 23 / span 23',
        'span-24': 'span 24 / span 24',
        'span-25': 'span 25 / span 25',
        'span-26': 'span 26 / span 26'
      },
      gridColumnStart: {
        13: '13',
        14: '14',
        15: '15',
        16: '16',
        17: '17',
        18: '18',
        19: '19',
        20: '20',
        21: '21',
        22: '22',
        23: '23',
        24: '24'
      },
      fontWeight: {
        hairline: 100,
        'extra-light': 100,
        thin: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 700,
        bold: 700,
        extrabold: 800,
        'extra-bold': 800,
        black: 900
      },
      fontSize: {
        xxs: ['0.67rem', '0.6rem'],
        xs: ['0.75rem', '0.95rem'],
        sm: ['0.925rem', '1.025rem'],
        base: ['1rem', '1.2rem'],
        lg: ['1.1rem', '1.30rem'],
        xl: ['1.2rem', '1.4rem'],
        xxl: ['24px', '32px']
      },
      fill: (theme) => theme('colors')
    },
    strokeWidth: {
      1.5: '1.2'
    },
    zIndex: {
      10: 10,
      20: 20,
      30: 30,
      40: 40,
      50: 50,
      100: 100,
      500: 500
    }
  },
  plugins: [
    animate,
    aspect,
    forms,
    opentype,
    scrollbar,
    typography
  ]
}
