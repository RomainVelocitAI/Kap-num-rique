import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Charte graphique Digiqo adaptée
        primary: {
          DEFAULT: "#8B1431", // Bordeaux principal Digiqo
          50: "#FBE8EC",
          100: "#F5D1D9",
          200: "#EBA4B3",
          300: "#E0768D",
          400: "#D64967",
          500: "#8B1431",
          600: "#6B0F26",
          700: "#520B1D",
          800: "#390814",
          900: "#1F040A",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#199CB7", // Bleu clair Digiqo
          50: "#E8F5F8",
          100: "#D1EBF1",
          200: "#A3D7E3",
          300: "#74C3D5",
          400: "#46AFC7",
          500: "#199CB7",
          600: "#127387",
          700: "#0E5866",
          800: "#093C44",
          900: "#052122",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#DA6530", // Orange vif Digiqo
          50: "#FEF2EC",
          100: "#FCE5D9",
          200: "#F9CBB3",
          300: "#F6B18D",
          400: "#F39767",
          500: "#DA6530",
          600: "#C5521F",
          700: "#943E17",
          800: "#632A10",
          900: "#311508",
          foreground: "#FFFFFF",
        },
        // Conserver les couleurs pour le comparatif
        gold: {
          DEFAULT: "#FFD700",
          50: "#FFFEF5",
          100: "#FFFCE6",
          200: "#FFF9CC",
          300: "#FFF3A3",
          400: "#FFED7A",
          500: "#FFD700",
          600: "#E6C200",
          700: "#CCAC00",
          800: "#B39700",
          900: "#998100",
        },
        // Rouge pour le comparatif (reste inchangé)
        red: {
          DEFAULT: "#FF6B6B",
          50: "#FFE8E8",
          100: "#FFD1D1",
          200: "#FFA3A3",
          300: "#FF7575",
          400: "#FF6B6B",
          500: "#FF4747",
          600: "#FF1F1F",
          700: "#E60000",
          800: "#B80000",
          900: "#8A0000",
        },
        // Neutres Digiqo
        gray: {
          50: "#F8F9FA",
          100: "#E9E9E9",
          200: "#D3D3D3",
          300: "#BDBDBD",
          400: "#A7A7A7",
          500: "#6C757D",
          600: "#5A5A5A",
          700: "#434343",
          800: "#2C2C2C",
          900: "#212529",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-lora)', 'Georgia', 'serif'],
        display: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #8B1431 0%, #6B0F26 100%)',
        'gradient-primary-reverse': 'linear-gradient(135deg, #6B0F26 0%, #8B1431 100%)',
        'gradient-accent': 'linear-gradient(135deg, #DA6530 0%, #C5521F 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #199CB7 0%, #127387 100%)',
        'gradient-overlay': 'linear-gradient(180deg, transparent 0%, rgba(139, 20, 49, 0.1) 100%)',
      },
      boxShadow: {
        'primary': '0 8px 24px rgba(139, 20, 49, 0.15)',
        'primary-lg': '0 12px 32px rgba(139, 20, 49, 0.2)',
        'accent': '0 8px 24px rgba(218, 101, 48, 0.3)',
        'accent-lg': '0 12px 32px rgba(218, 101, 48, 0.4)',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-up": "fade-up 0.5s ease-out",
        "scale-in": "scale-in 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.5s ease-out",
        "slide-in-left": "slide-in-left 0.5s ease-out",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "glow-primary": "glow-primary 2s ease-in-out infinite alternate",
        "glow-accent": "glow-accent 2s ease-in-out infinite alternate",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "shimmer": {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        "glow-primary": {
          from: { boxShadow: '0 0 10px -10px #8B1431' },
          to: { boxShadow: '0 0 20px 10px #8B1431' },
        },
        "glow-accent": {
          from: { boxShadow: '0 0 10px -10px #DA6530' },
          to: { boxShadow: '0 0 30px 15px rgba(218, 101, 48, 0.3)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config