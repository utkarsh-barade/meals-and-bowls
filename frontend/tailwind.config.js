/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary — Emerald Green (DESIGN.md §3)
        primary: {
          DEFAULT: '#16A34A',
          hover:   '#15803D',
          light:   '#DCFCE7',
        },
        // Secondary — Amber
        secondary: {
          DEFAULT: '#F59E0B',
          light:   '#FEF3C7',
        },
        // Success
        success: {
          DEFAULT: '#22C55E',
          light:   '#DCFCE7',
        },
        // Danger
        danger: {
          DEFAULT: '#DC2626',
          light:   '#FEE2E2',
        },
        // Info
        info: {
          DEFAULT: '#2563EB',
          light:   '#DBEAFE',
        },
        // Warning — alias to amber/secondary for badge consistency
        warning: {
          DEFAULT: '#F59E0B',
          light:   '#FEF3C7',
        },
        // Neutral surface tokens
        surface: {
          bg:         '#F8FAFC',
          card:       '#FFFFFF',
          border:     '#E2E8F0',
          muted:      '#F1F5F9',
        },
        // Text tokens
        text: {
          primary:     '#0F172A',
          secondary:   '#475569',
          placeholder: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Arial', 'sans-serif'],
      },
      fontSize: {
        // DESIGN.md §5 type scale
        'page-title':    ['2rem',    { fontWeight: '700', lineHeight: '1.2' }],
        'section-title': ['1.5rem',  { fontWeight: '600', lineHeight: '1.3' }],
        'card-title':    ['1.25rem', { fontWeight: '600', lineHeight: '1.4' }],
        'h3':            ['1.25rem', { fontWeight: '600', lineHeight: '1.4' }],
        'h4':            ['1.1rem',  { fontWeight: '600', lineHeight: '1.4' }],
        'body':          ['1rem',    { fontWeight: '400', lineHeight: '1.6' }],
        'small':         ['0.875rem',{ fontWeight: '400', lineHeight: '1.5' }],
        'caption':       ['0.75rem', { fontWeight: '400', lineHeight: '1.4' }],
      },
      borderRadius: {
        btn: '10px',
        card: '12px',
      },
      minHeight: {
        btn: '44px',
      },
      spacing: {
        // 8-point grid (DESIGN.md §13)
        '2': '0.5rem',    // 8px
        '4': '1rem',      // 16px
        '6': '1.5rem',    // 24px
        '8': '2rem',      // 32px
        '12': '3rem',     // 48px
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.07)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}
