/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom colors matching the legacy project
        "primary-bg": "#090d18",
        "secondary-bg": "#191b2c",
        "background-secondary": "#090d18",
        "accent-purple": "#a8b1ff",
        "accent-dark": "#777dc7",
        "border-color": "#161f30",
        "text-primary": "#f7f7f7",
        "text-secondary": "#e0e0e0",
        "text-muted": "#e1e2e9",
      },
    },
  },
  plugins: [],
};
