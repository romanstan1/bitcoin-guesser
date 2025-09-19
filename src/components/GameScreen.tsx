import styled from "styled-components";
import Timestamp from "./Timestamp";
import { type User as AuthUser } from "firebase/auth";
import { type User, type BitcoinPriceData, type Guess } from "../services";
import { ChevronUp, ChevronDown } from "lucide-react";
import { SECONDS_TO_RESOLVE_GUESS } from "../App";

const Container = styled.div`
  position: relative;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.primary};
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
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

const UserEmail = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SignOutButton = styled.button`
  background: ${({ theme }) => theme.colors.primary[600]};
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[500]};
  }
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

const Card = styled.div<{ height?: number }>`
  background: ${({ theme }) => theme.colors.background.secondary};
  padding: 1.5rem 2rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.primary[800]};
  text-align: center;
  min-width: 400px;
  height: ${({ height }) => (height ? `${height}px` : "auto")};
`;

const LargeValue = styled.div<{ variant?: "orange" | "blue" | "white" }>`
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1.4;
  color: ${({ variant, theme }) => {
    switch (variant) {
      case "orange":
        return theme.colors.bitcoinOrange;
      case "blue":
        return theme.colors.primary[300];
      default:
        return theme.colors.white;
    }
  }};
  letter-spacing: normal;
`;

const Label = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.colors.primary[800]};
  margin: 1rem 0;
`;

const GameButton = styled.button`
  color: white;
  background: ${({ theme }) => theme.colors.primary[600]};
  border: none;
  padding: 1rem 1.5rem 1rem 1rem;
  border-radius: 8px;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[500]};
  }
`;

interface GuessStatusProps {
  guess: Guess;
  priceAtGuess: number;
  secondsElapsed: number;
}

function GuessStatus({
  guess,
  priceAtGuess,
  secondsElapsed,
}: GuessStatusProps) {
  return (
    <Card>
      <Label>Your Guess</Label>
      <LargeValue>{guess.charAt(0).toUpperCase() + guess.slice(1)}</LargeValue>

      <Divider />

      <Label>Price at Guess</Label>
      <LargeValue variant="orange">
        $
        {priceAtGuess.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </LargeValue>

      <Divider />

      {secondsElapsed < SECONDS_TO_RESOLVE_GUESS ? (
        <>
          <Label>Time Remaining</Label>
          <LargeValue variant="blue">
            {SECONDS_TO_RESOLVE_GUESS - secondsElapsed}s
          </LargeValue>
        </>
      ) : (
        <>
          <Label>Waiting for bitcoin price to change...</Label>
        </>
      )}
    </Card>
  );
}

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
    <Container>
      <Header>
        <UserEmail>{authedUser.email}</UserEmail>
        <SignOutButton onClick={onSignOut}>Sign Out</SignOutButton>
      </Header>

      <MainContent>
        <Card>
          <Label>Current Score</Label>
          <LargeValue>{user.score}</LargeValue>
        </Card>

        <Card>
          <Label>Bitcoin Price</Label>
          <LargeValue variant="orange">
            {bitcoinPrice
              ? `$${bitcoinPrice.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : "Loading..."}
          </LargeValue>
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
    </Container>
  );
}

export default GameScreen;
