import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        cvPrimary: 'var(--cv-primary)',
        cvSecondary: 'var(--cv-secondary)',
        cvforge: {
          bg: 'var(--cvforge-bg)',
          surface: 'var(--cvforge-surface)',
          raised: 'var(--cvforge-surface-raised)',
          border: 'var(--cvforge-border)',
          text: 'var(--cvforge-text)',
          muted: 'var(--cvforge-muted)',
          accent: 'var(--cvforge-accent)',
          blue: 'var(--cvforge-accent-blue)',
        },
      },
    },
  },
  plugins: [],
};

export default config;
