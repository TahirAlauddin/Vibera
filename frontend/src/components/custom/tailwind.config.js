export default {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          primary: '#F6C531',
          'primary-hover': '#E0A800',
          'primary-active': '#F1DC9A',
          secondary: '#A7D9D4',
          'secondary-border': '#91B6A2',
          'secondary-hover': '#91B6A2',
          'secondary-active': '#D7E9B6',
          disabled: '#E0E6D9',
          'disabled-hover': '#E0E6D9',
          'disabled-active': '#E0E6D9',
        },
      },
    },
  },
}
