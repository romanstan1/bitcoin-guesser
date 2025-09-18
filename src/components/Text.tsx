"use client";

import React from "react";
import styled, { css } from "styled-components";
import type { DefaultTheme } from "styled-components";

type TextVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "p1" | "p2";

interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  fontWeight?: number;
  fontFamily?: string;
  uppercase?: boolean;
  className?: string;
  color?: string;
  as?: React.ElementType;
}

interface StyleProps {
  $variant: TextVariant;
  $fontWeight?: number;
  $fontFamily?: string;
  $uppercase?: boolean;
  $color?: string;
}

const variantToTag: Record<TextVariant, "h1" | "h2" | "h3" | "h4" | "h5" | "p"> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  p1: "p",
  p2: "p",
};

const defaultWeightByVariant: Record<TextVariant, number> = {
  h1: 600,
  h2: 600,
  h3: 600,
  h4: 600,
  h5: 600,
  p1: 400,
  p2: 400,
};

const defaultFamilyByVariant = (theme: DefaultTheme, variant: TextVariant): string => {
  switch (variant) {
    case "h1":
    case "h2":
    case "h3":
      return theme.fontFamily.spaceGroteskSemibold;
    case "h4":
    case "h5":
      return theme.fontFamily.spaceGroteskMedium;
    case "p1":
    case "p2":
    default:
      return theme.fontFamily.inter;
  }
};

const StyledText = styled.div<StyleProps>`
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  outline: none;
  text-decoration: none;
  display: inline;
  color: ${({ $color, theme }) => $color || theme.colors.black};
  text-transform: ${({ $uppercase }) => ($uppercase ? "uppercase" : "none")};
  font-weight: ${({ $fontWeight, $variant }) => $fontWeight ?? defaultWeightByVariant[$variant]};
  font-family: ${({ $fontFamily, $variant, theme }) =>
    $fontFamily ?? defaultFamilyByVariant(theme, $variant)};

  ${({ $variant, theme }) => {
    switch ($variant) {
      case "h1":
        return css`
          font-family: ${theme.fontFamily.spaceGroteskMedium};
          font-size: ${theme.fontSize.h1};
          letter-spacing: 0.05em;
        `;
      case "h2":
        return css`
          font-family: ${theme.fontFamily.spaceGroteskMedium};
          font-size: ${theme.fontSize.h2};
          letter-spacing: 0.04em;
        `;
      case "h3":
        return css`
          font-family: ${theme.fontFamily.spaceGroteskMedium};
          font-size: ${theme.fontSize.h3};
          letter-spacing: 0.03em;
        `;
      case "h4":
        return css`
          font-family: ${theme.fontFamily.spaceGroteskMedium};
          font-size: ${theme.fontSize.h4};
          letter-spacing: 0.04em;
        `;
      case "h5":
        return css`
          font-family: ${theme.fontFamily.spaceGroteskRegular};
          font-size: ${theme.fontSize.h5};
          letter-spacing: 0.05em;
        `;
      case "p1":
        return css`
          font-family: ${theme.fontFamily.inter};
          font-size: ${theme.fontSize.body1};
          line-height: 1.5;
        `;
      case "p2":
      default:
        return css`
          font-family: ${theme.fontFamily.inter};
          font-size: ${theme.fontSize.body2};
          line-height: 1.4;
        `;
    }
  }}
`;

const Text = ({
  children,
  variant = "p1",
  fontWeight,
  fontFamily,
  uppercase,
  className,
  color,
  as,
}: TextProps) => {
  const asTag = as ? as : variantToTag[variant];
  return (
    <StyledText
      as={asTag}
      className={className}
      $variant={variant}
      $fontWeight={fontWeight}
      $fontFamily={fontFamily}
      $uppercase={uppercase}
      $color={color}
    >
      {children}
    </StyledText>
  );
};

export type { TextProps, TextVariant };
export default Text;
