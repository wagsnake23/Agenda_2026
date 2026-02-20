import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme"; // Import defaultTheme

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'capture-it': ['"Capture It"', 'sans-serif'], // Mantido caso seja usado em outro lugar
        sans: ['Arial', ...defaultTheme.fontFamily.sans], // Prioriza Arial para a família sans-serif
        'arial-black': ['"Arial Black"', 'Arial Bold', 'sans-serif'], // Nova fonte para o título
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        calendar: {
          blue: "hsl(var(--calendar-blue))",
          blueText: "hsl(var(--calendar-blue-text))",
          green: "hsl(var(--calendar-green))",
          greenText: "hsl(var(--calendar-green-text))",
          yellow: "hsl(var(--calendar-yellow))",
          yellowText: "hsl(var(--calendar-yellow-text))",
          today: "hsl(var(--calendar-today))",
          todayText: "hsl(var(--calendar-today-text))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "bounce-twice": {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.08)' },
          '50%': { transform: 'scale(0.98)' },
          '75%': { transform: 'scale(1.05)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "bounce-twice": "bounce-twice 0.8s ease-in-out", // Duração ajustada aqui
      },
      boxShadow: { // Adicionado para o efeito 3D
        '3d-day': 'inset 0 1px 3px rgba(255, 255, 255, 0.4), inset 0 -1px 3px rgba(0, 0, 0, 0.1), 0 2px 5px rgba(0, 0, 0, 0.05)',
        '3d-day-pressed': 'inset 0 3px 6px rgba(0, 0, 0, 0.15)',
        'badge': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'neumorphic': '10px 10px 20px #d9d9d9, -10px -10px 20px #ffffff',
        'neumorphic-hover': '15px 15px 30px #d1d1d1, -15px -15px 30px #ffffff',
      },
      transitionDuration: {
        '450': '450ms',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;