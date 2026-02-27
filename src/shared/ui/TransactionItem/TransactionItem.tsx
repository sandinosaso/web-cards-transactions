import styled from "styled-components";
import { formatCurrency } from "@dkb-cofa/i18n/formatCurrency";

interface TransactionRowProps {
  $backgroundColor: string;
}

const TransactionRow = styled.li<TransactionRowProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.onCard};
`;

const TransactionDescription = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const TransactionAmount = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  white-space: nowrap;
`;

interface Props {
  description: string;
  amount: number;
  backgroundColor: string;
}

export function TransactionItem({
  description,
  amount,
  backgroundColor,
}: Props): React.ReactElement {
  const formattedAmount = formatCurrency(amount);

  return (
    <TransactionRow $backgroundColor={backgroundColor}>
      <TransactionDescription>{description}</TransactionDescription>
      <TransactionAmount aria-label={`Amount: ${formattedAmount}`}>
        {formattedAmount}
      </TransactionAmount>
    </TransactionRow>
  );
}
