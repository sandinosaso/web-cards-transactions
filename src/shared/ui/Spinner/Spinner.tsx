import styled, { keyframes } from "styled-components";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const SpinnerCircle = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.focus};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export function Spinner(): React.ReactElement {
  return (
    <SpinnerWrapper role="status" aria-label="Loading">
      <SpinnerCircle />
    </SpinnerWrapper>
  );
}
