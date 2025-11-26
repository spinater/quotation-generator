/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Sarabun", "sans-serif"],
        thai: ["Sarabun", "Noto Sans Thai", "sans-serif"],
      },
      colors: {
        // Add custom colors if needed
      },
    },
  },
  plugins: [],
};
