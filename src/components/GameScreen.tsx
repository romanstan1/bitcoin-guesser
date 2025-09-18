import styled from "styled-components";
import Timestamp from "./Timestamp";
import { type User as AuthUser } from "firebase/auth";
import { type User, type BitcoinPriceData, type Guess } from "../services";
import { ChevronUp, ChevronDown } from "lucide-react";

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
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #c82333;
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

const Card = styled.div<{ size?: "small" | "medium" | "large" }>`
  background: ${({ theme }) => theme.colors.background.secondary};
  padding: ${({ size = "medium" }) =>
    size === "small" ? "1rem" : size === "large" ? "2rem" : "1.5rem 2rem"};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.primary[800]};
  text-align: center;
  min-width: 400px;
`;

interface ValueProps {
  size?: "small" | "medium" | "large";
  color?: "primary" | "bitcoin" | "secondary";
  mono?: boolean;
}

const Value = styled.div<ValueProps>`
  font-family: ${({ mono }) =>
    mono
      ? '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Consolas", "Courier New", monospace'
      : "inherit"};
  font-size: ${({ size = "medium" }) =>
    size === "small" ? "1.25rem" : size === "large" ? "3rem" : "2.5rem"};
  font-weight: ${({ mono }) => (mono ? "600" : "bold")};
  line-height: 1.4;
  color: ${({ theme, color = "primary" }) =>
    color === "bitcoin"
      ? "#f7931a"
      : color === "secondary"
        ? theme.colors.primary[300]
        : theme.colors.primary[400]};
  letter-spacing: ${({ mono }) => (mono ? "0.025em" : "normal")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const Label = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const OrText = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 2rem;
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
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
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
      <div>
        <Label>Your Guess</Label>
        <Value size="medium">
          {guess.charAt(0).toUpperCase() + guess.slice(1)}
        </Value>
      </div>

      <Card>
        <Value size="small" color="bitcoin" mono>
          $
          {priceAtGuess.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Value>
        <Label>Price at Guess</Label>
      </Card>

      <Card>
        {secondsElapsed < 60 ? (
          <>
            <Value size="small" color="secondary" mono>
              {60 - secondsElapsed}s
            </Value>
            <Label>Time Remaining</Label>
          </>
        ) : (
          <>
            <Value size="small" color="secondary">
              Waiting for bitcoin price to change...
            </Value>
          </>
        )}
      </Card>
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
          <Value size="large">{user.score}</Value>
          <Label>Current Score</Label>
        </Card>

        <Card>
          <Value size="medium" color="bitcoin">
            {bitcoinPrice
              ? `$${bitcoinPrice.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : "Loading..."}
          </Value>
          <Label>Bitcoin Price</Label>
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
              <ChevronUp size={20} />
              Higher
            </GameButton>
            <OrText>or</OrText>
            <GameButton onClick={() => onMakeGuess("lower")}>
              <ChevronDown size={20} />
              Lower
            </GameButton>
          </ButtonContainer>
        )}
      </MainContent>
    </Container>
  );
}

export default GameScreen;
