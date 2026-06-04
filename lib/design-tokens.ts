/**
 * EloChurch Design System — tokens oficiais
 * Referência visual: splash screen e identidade premium dark
 */
export const colors = {
  navy: "#0B2D5C",
  navyDeep: "#071B38",
  gold: "#D4A537",
  white: "#FFFFFF",
  surface: "#F5F7FA",
  success: "#21C45D",
  warning: "#FF8C32",
} as const;

export const typography = {
  fontFamily: {
    sans: "var(--font-geist-sans), system-ui, sans-serif",
    mono: "var(--font-geist-mono), monospace",
  },
  scale: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
  },
} as const;

export const spacing = {
  sidebarWidth: "16.5rem",
  sidebarCollapsed: "4.5rem",
  headerHeight: "4rem",
} as const;

export const radii = {
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.25rem",
  full: "9999px",
} as const;

export const shadows = {
  card: "0 4px 24px rgba(0, 0, 0, 0.25)",
  cardHover: "0 8px 32px rgba(0, 0, 0, 0.35)",
  gold: "0 0 24px rgba(212, 165, 55, 0.15)",
  modal: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
} as const;
