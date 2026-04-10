import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fdf8f0",
          100: "#faefd8",
          200: "#f5d9a8",
          300: "#efbf6d",
          400: "#e89f3d",
          500: "#e2841e",
          600: "#c96815",
          700: "#a74e14",
          800: "#883f18",
          900: "#703617",
        },
      },
    },
  },
  plugins: [],
};
export default config;
