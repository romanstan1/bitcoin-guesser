export const theme = {
  breakpoints: {
    xs: "480px",
    sm: "768px",
    md: "992px",
    lg: "1200px",
    xl: "1400px",
  },
  colors: {
    // Core midnight blue palette
    primary: {
      50: "#F0F4FF",
      100: "#E0EAFF",
      200: "#C7D8FF",
      300: "#A3BFFF",
      400: "#7A9CFF",
      500: "#5577FF",
      600: "#3D4EDB",
      700: "#2A35B8",
      800: "#1A2294",
      900: "#0F1570",
      950: "#0A0E4A",
    },
    // Background variations
    background: {
      primary: "#0A0E2E",     // Main background
      secondary: "#0F1347",   // Card backgrounds
      tertiary: "#161B5C",    // Elevated surfaces
      quaternary: "#1D2371",  // Interactive elements
    },
    // Text colors
    text: {
      primary: "#FFFFFF",     // Main text
      secondary: "#E2E8F0",   // Secondary text
      muted: "#94A3B8",       // Muted text
      disabled: "#64748B",    // Disabled text
    },
    // Accent colors for crypto
    accent: {
      blue: "#00D2FF",        // Electric blue
      purple: "#8B5CF6",      // Purple accent
      green: "#00FFA3",       // Success green
      orange: "#FF8C00",      // Warning orange
      red: "#FF4757",         // Error red
    },
    // Legacy colors for compatibility
    black: "#0A0E2E",
    white: "#FFFFFF",
  },
  fontFamily: {
    spaceGroteskRegular: "'Space Grotesk', sans-serif",
    spaceGroteskMedium: "'Space Grotesk', sans-serif",
    spaceGroteskSemibold: "'Space Grotesk', sans-serif",
    inter: "'Inter', sans-serif",
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  fontSize: {
    body2: "14px",
    body1: "16px",
    h5: "16px",
    h4: "20px",
    h3: "24px",
    h2: "28px",
    h1: "36px",
  },
}