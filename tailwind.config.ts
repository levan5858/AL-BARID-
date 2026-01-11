import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#1E3A8A',
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
        },
        accent: {
          DEFAULT: '#FBBF24',
        },
      },
    },
  },
  plugins: [],
}
export default config