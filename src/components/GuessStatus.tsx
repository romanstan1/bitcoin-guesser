import { Label, Value } from "./styled";
import { SECONDS_TO_RESOLVE_GUESS } from "../App";
import { Card, Divider } from "./styled";
import { type Guess } from "../services";
import styled from "styled-components";

const LabelContainer = styled.div`
  display: flex;
  height: 45px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

interface GuessStatusProps {
  guess: Guess;
  priceAtGuess: number;
  secondsElapsed: number;
}

const GuessStatus = ({
  guess,
  priceAtGuess,
  secondsElapsed,
}: GuessStatusProps) => {
  return (
    <Card height={340}>
      <Label>Your Guess</Label>
      <Value>{guess.charAt(0).toUpperCase() + guess.slice(1)}</Value>

      <Divider />

      <Label>Price at Guess</Label>
      <Value variant="orange">
        $
        {priceAtGuess.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Value>

      <Divider />

      <LabelContainer>
        {secondsElapsed < SECONDS_TO_RESOLVE_GUESS ? (
          <>
            <Label>Time Remaining</Label>
            <Value variant="blue" fontSize="small">
              {SECONDS_TO_RESOLVE_GUESS - secondsElapsed}s
            </Value>
          </>
        ) : (
          <Label lowercase fontSize="small">
            Resolving your guess...
          </Label>
        )}
      </LabelContainer>
    </Card>
  );
};

export default GuessStatus;
