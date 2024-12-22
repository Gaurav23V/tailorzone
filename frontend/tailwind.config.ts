import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        dark: {
          50: '#272727',
          100: '#414141',
          200: '#707070',
        },
        pink: '#C586A5',
        orange: '#FF8551',
        black: '#000000',
        white: '#FFFFFF',
      },
    },
  },
  plugins: [],
} satisfies Config;
