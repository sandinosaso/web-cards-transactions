import { useGetCardsQuery } from "@dkb-cofa/shared/api/cardsApi";
import { useCardSelection, useCardFilter } from "../context/CardsStateContext";
import { TransactionListSection } from "./TransactionListSection";

/**
 * Subscribes to both contexts — correct, because both selectedCardId and
 * minAmount determine which transactions are shown.
 *
 * CardListSection is unaffected by re-renders here.
 */
export function TransactionSection(): React.ReactElement | null {
  const { selectedCardId } = useCardSelection();
  const { minAmount } = useCardFilter();
  const { data: cards } = useGetCardsQuery();

  const selectedCard = cards?.find((c) => c.id === selectedCardId) ?? null;

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
