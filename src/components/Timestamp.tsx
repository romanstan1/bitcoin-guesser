import styled from "styled-components";

const TimestampContainer = styled.div`
  font-family:
    "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Consolas",
    "Courier New", monospace;
  font-size: 0.875rem;
  color: #94a3b8;
  margin-top: 0.5rem;
  letter-spacing: 0.025em;
`;

interface TimestampProps {
  date: Date | string;
  prefix?: string;
  className?: string;
}

function Timestamp({ date, prefix = "", className }: TimestampProps) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const formattedDate = dateObj.toLocaleString();

  return (
    <TimestampContainer className={className}>
      {prefix && `${prefix} `}
      {formattedDate}
    </TimestampContainer>
  );
}

export default Timestamp;
