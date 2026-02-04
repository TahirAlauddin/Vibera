export default {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          primary: 'var(--color-accent-primary)',
          'primary-hover': 'var(--color-accent-primary-hover)',
          'primary-active': 'var(--color-accent-primary-active)',

          'secondary-default': 'var(--color-accent-secondary-default)',
          'secondary-border': 'var(--color-accent-secondary-border)',
          'secondary-hover': 'var(--color-accent-secondary-hover)',
          'secondary-active': 'var(--color-accent-secondary-active)',

          'disabled-hover': 'var(--color-accent-disabled-hover)',
          'disabled-active': 'var(--color-accent-disabled-active)',

          'ghost-default': 'var(--color-accent-ghost-default)',
          'ghost-hover': 'var(--color-accent-ghost-hover)',
          'ghost-active': 'var(--color-accent-ghost-active)',
        },
        input: {
          DEFAULT: 'var(--input-bg-default)',
          active: 'var(--input-bg-active)',
          border: 'var(--input-border-default)',
          error: 'var(--input-border-error)',
          disabledText: 'var(--input-disabled-text)',
        },
      },
    },
  },
}
