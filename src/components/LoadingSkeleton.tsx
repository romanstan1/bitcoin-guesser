import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
`;

const LoadingSkeleton = () => {
  return <Container>loading...</Container>;
};

export default LoadingSkeleton;
