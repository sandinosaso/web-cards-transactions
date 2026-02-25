import styled from "styled-components";

const AlertBox = styled.div`
  background-color: ${({ theme }) => theme.colors.status.errorBackground};
  border: 1px solid ${({ theme }) => theme.colors.status.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.status.error};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AlertMessage = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const RetryButton = styled.button`
  align-self: flex-start;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.status.error};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.status.error};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};

  &:hover {
    background-color: ${({ theme }) => theme.colors.status.error};
    color: white;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }
`;

interface Props {
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export function ErrorMessage({
  message,
  retryLabel,
  onRetry,
}: Props): React.ReactElement {
  return (
    <AlertBox role="alert">
      <AlertMessage>{message}</AlertMessage>
      {onRetry !== undefined && retryLabel !== undefined && (
        <RetryButton type="button" onClick={onRetry}>
          {retryLabel}
        </RetryButton>
      )}
    </AlertBox>
  );
}
