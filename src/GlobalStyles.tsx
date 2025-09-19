import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background: linear-gradient(135deg,
      ${({ theme }) => theme.colors.background.primary} 0%,
      ${({ theme }) => theme.colors.background.secondary} 100%
    );
    color: ${({ theme }) => theme.colors.text.primary};
    font-family: "'Inter', sans-serif";
    font-size: 16px;
    line-height: 1.6;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  html {
    scroll-behavior: smooth;
  }

  /* Selection styling */
  ::selection {
    background: ${({ theme }) => theme.colors.primary[500]}40;
    color: ${({ theme }) => theme.colors.text.primary};
  }

  /* Scrollbar styling for webkit browsers */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.secondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary[700]};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
  }
`;
