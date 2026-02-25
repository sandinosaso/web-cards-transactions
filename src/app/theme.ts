import type { DefaultTheme } from "styled-components";

export const theme = {
  colors: {
    background: "#F3F9FE",   // Light blue-gray — DKB's clean page feel
    surface: "#ffffff",
    surfaceHover: "#F4F7FB",
    border: "#D0D9E4",
    primary: "#138DEA",      // DKB Blue — business / interactive
    accent: "#28D1CA",       // DKB Teal — private / highlight
    text: {
      primary: "#0B1825",    // Very dark navy
      secondary: "#6B7C93",
      onCard: "#ffffff",
    },
    status: {
      error: "#D4281A",
      errorBackground: "#FFF2F0",
    },
    focus: "#138DEA",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: {
      sm: "0.875rem",
      md: "1rem",
      lg: "1.125rem",
      xl: "1.5rem",
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "16px",
  },
  shadow: {
    card: "0 4px 16px rgba(19, 141, 234, 0.15)",
    cardSelected: "0 8px 32px rgba(19, 141, 234, 0.28)",
  },
} satisfies DefaultTheme;
