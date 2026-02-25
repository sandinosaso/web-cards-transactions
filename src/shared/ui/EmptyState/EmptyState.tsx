import styled from "styled-components";

const EmptyWrapper = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

interface Props {
  message: string;
}

export function EmptyState({ message }: Props): React.ReactElement {
  return <EmptyWrapper>{message}</EmptyWrapper>;
}
