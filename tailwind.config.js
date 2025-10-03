/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
      },
      colors: {
        'memory-orange': '#FF9100',
        'memory-pink': '#FF5E5E',
      },
      backgroundImage: {
        'memory-gradient': 'linear-gradient(135deg, #FF9100 0%, #FF5E5E 100%)',
        'bg-gradient': 'linear-gradient(135deg, rgba(255, 145, 0, 0.1) 0%, rgba(255, 94, 94, 0.1) 50%, rgba(59, 130, 246, 0.1) 100%)',
      },
    },
  },
  plugins: [],
}
