import styled from "styled-components";
import Text from "./Text";
import { type User as AuthUser } from "firebase/auth";
import { type User, type BitcoinPriceData } from "../services";
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
  gap: 3rem;
`;

const GameStats = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.background.secondary};
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.primary[800]};
  min-width: 400px;
`;

const StatValue = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary[400]};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const BitcoinPrice = styled.div`
  background: ${({ theme }) => theme.colors.background.secondary};
  padding: 1.5rem 2rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.primary[800]};
  text-align: center;
  margin-bottom: 1rem;
  min-width: 400px;
`;

const PriceValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #f7931a;
  margin-bottom: 0.5rem;
`;

const PriceLabel = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TimestampText = styled.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #94a3b8;
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

const formatTimestamp = (timestamp: string | null) => {
  if (!timestamp) return "No previous guess";
  return new Date(timestamp).toLocaleString();
};

interface GameScreenProps {
  authedUser: AuthUser;
  user: User;
  onSignOut: () => void;
  bitcoinPrice: BitcoinPriceData | null;
}

function GameScreen({
  authedUser,
  user,
  onSignOut,
  bitcoinPrice,
}: GameScreenProps) {
  return (
    <Container>
      <Header>
        <UserEmail>{authedUser.email}</UserEmail>
        <SignOutButton onClick={onSignOut}>Sign Out</SignOutButton>
      </Header>

      <MainContent>
        <GameStats>
          <StatCard>
            <StatValue>{user.score}</StatValue>
            <StatLabel>Current Score</StatLabel>
          </StatCard>

          <StatCard>
            <Text variant="p1" color="#E2E8F0">
              {formatTimestamp(user.lastGuess)}
            </Text>
            <StatLabel>Last Guess Time</StatLabel>
          </StatCard>
        </GameStats>

        <BitcoinPrice>
          <PriceValue>
            {bitcoinPrice
              ? `$${bitcoinPrice.price.toLocaleString()}`
              : "Loading..."}
          </PriceValue>
          <PriceLabel>Bitcoin Price</PriceLabel>
          {bitcoinPrice && (
            <TimestampText>
              Last updated: {new Date(bitcoinPrice.timestamp).toLocaleString()}
            </TimestampText>
          )}
        </BitcoinPrice>

        <ButtonContainer>
          <GameButton>
            <ChevronDown size={20} />
            Lower
          </GameButton>
          <GameButton>
            <ChevronUp size={20} />
            Higher
          </GameButton>
        </ButtonContainer>
      </MainContent>
    </Container>
  );
}

export default GameScreen;
