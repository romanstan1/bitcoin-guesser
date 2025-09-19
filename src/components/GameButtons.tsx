import { ChevronDown, ChevronUp } from "lucide-react";
import styled from "styled-components";
import { Button } from "./styled";
import { type Guess } from "../services";
import { Label } from "./styled";

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const GameButton = styled(Button)<{ disabled?: boolean }>`
  padding: 1rem 1.5rem 1rem 1rem;
  gap: 0.5rem;
  font-size: 20px;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.8 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
`;

interface GameButtonsProps {
  onMakeGuess: (guess: Guess) => Promise<boolean>;
  disabled?: boolean;
}

const GameButtons = ({ onMakeGuess, disabled }: GameButtonsProps) => {
  return (
    <ButtonContainer>
      <GameButton onClick={() => onMakeGuess("higher")} disabled={disabled}>
        <ChevronUp size={20} strokeWidth={3} />
        Higher
      </GameButton>
      <Label>or</Label>
      <GameButton onClick={() => onMakeGuess("lower")} disabled={disabled}>
        <ChevronDown size={20} strokeWidth={3} />
        Lower
      </GameButton>
    </ButtonContainer>
  );
};

export default GameButtons;
