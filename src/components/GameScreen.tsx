import styled from "styled-components";
import Timestamp from "./Timestamp";
import { type User as AuthUser } from "firebase/auth";
import { type User, type BitcoinPriceData, type Guess } from "../services";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Value, Label, Card, Button } from "./styled";
import GuessStatus from "./GuessStatus";
import { PageContainer } from "./styled";

const AuthHeader = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: ${({ theme }) => theme.colors.background.secondary};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary[800]};
`;

const SignOutButton = styled(Button)`
  font-size: 0.75rem;
  padding: 0.5rem 0.75rem;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const GameButton = styled(Button)`
  padding: 1rem 1.5rem 1rem 1rem;
  gap: 0.5rem;
  font-size: 20px;
  font-weight: 600;
`;

interface GameScreenProps {
  authedUser: AuthUser;
  user: User;
  onSignOut: () => void;
  bitcoinPrice: BitcoinPriceData | null;
  onMakeGuess: (guess: Guess) => Promise<boolean>;
  secondsElapsed: number;
}

function GameScreen({
  authedUser,
  user,
  onSignOut,
  bitcoinPrice,
  onMakeGuess,
  secondsElapsed,
}: GameScreenProps) {
  return (
    <PageContainer>
      <AuthHeader>
        <Label lowercase fontSize="small">
          {authedUser.email}
        </Label>
        <SignOutButton onClick={onSignOut}>Sign Out</SignOutButton>
      </AuthHeader>

      <MainContent>
        <Card>
          <Label>Your Score</Label>
          <Value>{user.score}</Value>
        </Card>

        <Card>
          <Label>Bitcoin Price</Label>
          <Value variant="orange">
            {bitcoinPrice
              ? `$${bitcoinPrice.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : "Loading..."}
          </Value>
          {bitcoinPrice && (
            <Timestamp date={bitcoinPrice.timestamp} prefix="Last updated:" />
          )}
        </Card>

        {user.guess && user.lastGuessTime && user.priceAtLastGuess ? (
          <GuessStatus
            guess={user.guess}
            priceAtGuess={user.priceAtLastGuess}
            secondsElapsed={secondsElapsed}
          />
        ) : (
          <ButtonContainer>
            <GameButton onClick={() => onMakeGuess("higher")}>
              <ChevronUp size={20} strokeWidth={3} />
              Higher
            </GameButton>
            <Label>or</Label>
            <GameButton onClick={() => onMakeGuess("lower")}>
              <ChevronDown size={20} strokeWidth={3} />
              Lower
            </GameButton>
          </ButtonContainer>
        )}
      </MainContent>
    </PageContainer>
  );
}

export default GameScreen;
