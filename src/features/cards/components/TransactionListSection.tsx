import { useMemo } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useGetTransactionsQuery } from "@dkb-cofa/shared/api/cardsApi";
import {
  TransactionItem,
  Spinner,
  ErrorMessage,
  EmptyState,
} from "@dkb-cofa/shared/ui";
import { filterTransactionsByMinAmount } from "../utils/filterTransactions";
import { getCardColor } from "@dkb-cofa/shared/utils/cardColors";
import type { Transaction, CardType } from "@dkb-cofa/ApiClient";

const SectionHeading = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TransactionList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

interface Props {
  cardId: string;
  cardType: CardType;
  minAmount: string;
}

export function TransactionListSection({
  cardId,
  cardType,
  minAmount,
}: Props): React.ReactElement {
  const cardColor = getCardColor(cardType);
  const { t } = useTranslation();
  const {
    data: transactions,
    isLoading,
    isError,
    refetch,
  } = useGetTransactionsQuery(cardId);

  const filtered = useMemo(
    () =>
      transactions
        ? filterTransactionsByMinAmount(transactions, minAmount)
        : undefined,
    [transactions, minAmount]
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !filtered) {
    return (
      <ErrorMessage
        message={t("transactions.error")}
        retryLabel={t("transactions.retry")}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <section aria-label={t("transactions.heading")} aria-live="polite">
      <SectionHeading>{t("transactions.heading")}</SectionHeading>
      {filtered.length === 0 ? (
        <EmptyState
          message={
            minAmount !== ""
              ? t("transactions.empty")
              : t("transactions.emptyCard")
          }
        />
      ) : (
        <TransactionList>
          {filtered.map((tx: Transaction) => (
            <TransactionItem
              key={tx.id}
              description={tx.description}
              amount={tx.amount}
              backgroundColor={cardColor}
            />
          ))}
        </TransactionList>
      )}
    </section>
  );
}
