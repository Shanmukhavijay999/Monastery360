import type { Config } from "tailwindcss";

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
        // Custom monastery theme colors
        saffron: "hsl(var(--saffron))",
        gold: "hsl(var(--gold))",
        'mountain-blue': "hsl(var(--mountain-blue))",
        'warm-stone': "hsl(var(--warm-stone))",
        'deep-earth': "hsl(var(--deep-earth))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      backgroundImage: {
        'gradient-sunset': 'var(--gradient-sunset)',
        'gradient-mountain': 'var(--gradient-mountain)',
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'monastery': 'var(--shadow-medium)',
        'card-soft': 'var(--shadow-soft)',
        'premium': 'var(--shadow-large)',
        'glow': 'var(--shadow-glow)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255,255,255,0.05)',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
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
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slow-zoom": {
          from: { transform: "scale(1)" },
          to: { transform: "scale(1.08)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(40px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(245,158,11,0.2)" },
          "50%": { boxShadow: "0 0 50px rgba(245,158,11,0.4)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "blur-in": {
          from: { opacity: "0", filter: "blur(10px)" },
          to: { opacity: "1", filter: "blur(0)" },
        },
        "text-reveal": {
          from: { opacity: "0", transform: "translateY(100%)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-right": "slide-in-right 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slow-zoom": "slow-zoom 25s ease-in-out infinite alternate",
        "shimmer": "shimmer 2.5s linear infinite",
        "slide-up": "slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "scale-in": "scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "blur-in": "blur-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "text-reveal": "text-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
      },
      fontSize: {
        'display': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.04em', fontWeight: '700' }],
        'display-sm': ['3.75rem', { lineHeight: '1.05', letterSpacing: '-0.035em', fontWeight: '700' }],
        'heading': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
        'heading-sm': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '600' }],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
