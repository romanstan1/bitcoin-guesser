import { styled } from "styled-components";

export const PageContainer = styled.div`
  position: relative;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.primary};
  display: flex;
  flex-direction: column;
`;

export const Button = styled.button`
  background: ${({ theme }) => theme.colors.primary[600]};
  color: ${({ theme }) => theme.colors.text.primary};
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background-color 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[500]};
  }
`;

interface ValueProps {
  variant?: "orange" | "blue" | "white";
  fontSize?: "large" | "small";
}

export const Value = styled.div<ValueProps>`
  font-size: ${({ fontSize }) => (fontSize === "small" ? "1.5rem" : "2.5rem")};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  line-height: 1.4;
  color: ${({ variant, theme }) => {
    switch (variant) {
      case "orange":
        return theme.colors.bitcoinOrange;
      case "blue":
        return theme.colors.primary[300];
      default:
        return theme.colors.text.primary;
    }
  }};
  letter-spacing: normal;
`;

interface LabelProps {
  lowercase?: boolean;
  fontSize?: "normal" | "small";
}

export const Label = styled.div<LabelProps>`
  font-size: ${({ fontSize }) => (fontSize === "small" ? "0.875rem" : "1rem")};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: ${({ lowercase }) => (lowercase ? "none" : "uppercase")};
  letter-spacing: ${({ lowercase }) => (lowercase ? "0" : "0.05em")};

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.colors.primary[800]};
  margin: 1rem 0;
`;

export const Card = styled.div<{ height?: number }>`
  background: ${({ theme }) => theme.colors.background.secondary};
  padding: 1.5rem 2rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.primary[800]};
  text-align: center;
  min-width: 400px;
  height: ${({ height }) => (height ? `${height}px` : "auto")};
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
`;
