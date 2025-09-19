import styled from "styled-components";

const LastUpdatedContainer = styled.div`
  font-family:
    "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Consolas",
    "Courier New", monospace;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.muted};
  margin-top: 0.5rem;
  letter-spacing: 0.025em;
`;

interface LastUpdatedProps {
  date: Date | string;
  prefix?: string;
  className?: string;
}

function LastUpdated({ date, prefix = "", className }: LastUpdatedProps) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return (
    <LastUpdatedContainer className={className}>
      {prefix && `${prefix} `}
      {dateObj.toLocaleTimeString()}
    </LastUpdatedContainer>
  );
}

export default LastUpdated;
