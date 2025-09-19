import { PageContainer, MainContent, Label, Card } from "./styled";
import Timestamp from "./Timestamp";
import GameButtons from "./GameButtons";
import styled from "styled-components";

const SkeletonValue = styled.div`
  height: 56px;
  width: 100px;
  margin: 0px auto;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.background.secondary} 25%,
    ${({ theme }) => theme.colors.primary[800]} 50%,
    ${({ theme }) => theme.colors.background.secondary} 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.8s ease-in-out infinite;

  @keyframes skeleton-loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const LoadingSkeleton = () => {
  return (
    <PageContainer>
      <MainContent>
        <Card>
          <Label>Your Score</Label>
          <SkeletonValue />
        </Card>
        <Card>
          <Label>Bitcoin Price</Label>
          <SkeletonValue />
          <Timestamp date={new Date()} prefix="Last updated:" />
        </Card>
        <GameButtons onMakeGuess={() => Promise.resolve(false)} disabled />
      </MainContent>
    </PageContainer>
  );
};

export default LoadingSkeleton;
