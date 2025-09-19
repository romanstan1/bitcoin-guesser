import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { X } from "lucide-react";
import { Value, Label } from "./styled";
import { type Guess } from "../services";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.primary[800]};
  padding: 2rem;
  min-width: 400px;
  text-align: center;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ResultMessage = styled.div<{ $isCorrect: boolean }>`
  font-size: 1.5rem;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ $isCorrect, theme }) =>
    $isCorrect ? theme.colors.primary[300] : theme.colors.error};
  margin-bottom: 1rem;
`;

const PriceInfo = styled.div`
  margin: 1.5rem 0;
`;

const PointsChange = styled.div<{ $isPositive: boolean }>`
  font-size: 2rem;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ $isPositive, theme }) =>
    $isPositive ? theme.colors.primary[300] : theme.colors.error};
  margin-top: 1rem;
`;

export interface ModalData {
  isOpen: boolean;
  guess: Guess;
  pointsChange: number;
}

interface SuccessModalProps extends ModalData {
  onClose: () => void;
}

function SuccessModal({
  isOpen,
  onClose,
  guess,
  pointsChange,
}: SuccessModalProps) {
  const isCorrect = pointsChange > 0;
  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContainer
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>
              <X size={20} />
            </CloseButton>

            <ResultMessage $isCorrect={isCorrect}>
              {isCorrect ? "Your guess was correct!" : "Your guess was wrong!"}
            </ResultMessage>

            <PriceInfo>
              <Label>The price was</Label>
              <Value>{guess.charAt(0).toUpperCase() + guess.slice(1)}</Value>
            </PriceInfo>

            <PointsChange $isPositive={pointsChange > 0}>
              {pointsChange > 0 ? "+" : ""}
              {pointsChange} point{Math.abs(pointsChange) !== 1 ? "s" : ""}
            </PointsChange>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
}

export default SuccessModal;
