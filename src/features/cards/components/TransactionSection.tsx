import { useTranslation } from "react-i18next";
import { useGetCardsQuery } from "@dkb-cofa/shared/api/cardsApi";
import { useCardSelection, useCardFilter } from "../context/CardsStateContext";
import { TransactionListSection } from "./TransactionListSection";
import { EmptyState } from "@dkb-cofa/shared/ui/EmptyState";

/**
 * Subscribes to both contexts — correct, because both selectedCardId and
 * minAmount determine which transactions are shown.
 *
 * CardListSection is unaffected by re-renders here.
 */
export function TransactionSection(): React.ReactElement | null {
  const { t } = useTranslation();
  const { selectedCardId } = useCardSelection();
  const { minAmount } = useCardFilter();
  const { data: cards } = useGetCardsQuery();

  // No card chosen yet — prompt the user explicitly.
  if (!selectedCardId) {
    return <EmptyState message={t("cards.selectPrompt")} />;
  }

  const selectedCard = cards?.find((c) => c.id === selectedCardId) ?? null;

  // Cards are still loading or the cardId in the URL is stale — render nothing.
  if (selectedCard === null) {
    return null;
  }

  return (
    <TransactionListSection
      cardId={selectedCard.id}
      cardType={selectedCard.type}
      minAmount={minAmount}
    />
  );
}
