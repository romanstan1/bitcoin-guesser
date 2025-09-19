import styled from "styled-components";
import LastUpdated from "./LastUpdated";
import { type User as AuthUser } from "firebase/auth";
import { type User, type BitcoinPriceData, type Guess } from "../services";
import { Value, Label, Card, Button } from "./styled";
import GuessStatus from "./GuessStatus";
import { PageContainer, MainContent } from "./styled";
import GameButtons from "./GameButtons";

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
            <LastUpdated date={bitcoinPrice.timestamp} prefix="Last updated:" />
          )}
        </Card>

        {user.guess && user.lastGuessTime && user.priceAtLastGuess ? (
          <GuessStatus
            guess={user.guess}
            priceAtGuess={user.priceAtLastGuess}
            secondsElapsed={secondsElapsed}
          />
        ) : (
          <GameButtons onMakeGuess={onMakeGuess} />
        )}
      </MainContent>
    </PageContainer>
  );
}

export default GameScreen;
