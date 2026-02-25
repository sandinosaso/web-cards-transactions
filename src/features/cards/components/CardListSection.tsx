import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useGetCardsQuery } from "@dkb-cofa/shared/api/cardsApi";
import {
  CardTileComponent,
  Spinner,
  ErrorMessage,
} from "@dkb-cofa/shared/ui";
import { useCardSelection } from "../context/CardsStateContext";
// import { useWhyDidYouRender } from "@dkb-cofa/shared/utils/useWhyDidYouRender";
import type { Card } from "@dkb-cofa/ApiClient";

const SectionHeading = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CardList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

/**
 * Subscribes only to CardSelectionContext.
 * React.memo ensures that when CardFilterContext.Provider reconciles its
 * subtree on filter changes, React bails out here immediately (no props
 * to compare → always equal). The only remaining re-render triggers are:
 *   - CardSelectionContext value changes (card switch)
 *   - useGetCardsQuery() returns new data
 */
export const CardListSection = React.memo(function CardListSection(): React.ReactElement {
  const { t } = useTranslation();
  const { selectedCardId, selectCard } = useCardSelection();
  const { data: cards, isLoading, isError, refetch } = useGetCardsQuery();

  /*
   * DEV: uncomment to debug re-renders — see src/shared/utils/useWhyDidYouRender.ts
   * for the full case-study on why this was needed (React Router setSearchParams
   * instability causing selectCard to get a new reference on every render).
   *
   * useWhyDidYouRender("CardListSection", {
   *   selectedCardId,
   *   selectCard,
   *   cards,
   *   isLoading,
   *   isError,
   *   refetch,
   *   t,
   * });
   */

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !cards) {
    return (
      <ErrorMessage
        message={t("cards.error")}
        retryLabel={t("cards.retry")}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <section aria-label={t("cards.heading")}>
      <SectionHeading>{t("cards.heading")}</SectionHeading>
      <CardList>
        {cards.map((card: Card) => (
          <li key={card.id}>
            <CardTileComponent
              id={card.id}
              description={card.description}
              type={card.type}
              cardHolder={card.cardHolder}
              maskedCardNumber={card.maskedCardNumber}
              expiryDate={card.expiryDate}
              network={card.network}
              isSelected={selectedCardId === card.id}
              onSelect={selectCard}
            />
          </li>
        ))}
      </CardList>
    </section>
  );
});
