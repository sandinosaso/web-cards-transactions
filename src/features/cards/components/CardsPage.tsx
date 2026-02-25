import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { CardsStateProvider } from "../context/CardsStateContext";
import { CardListSection } from "./CardListSection";
import { FilterSection } from "./FilterSection";
import { TransactionSection } from "./TransactionSection";

const PageWrapper = styled.main`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.xl};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  box-sizing: border-box;
`;

const PageTitle = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

/**
 * Pure layout shell — never calls useSearchParams() itself.
 *
 * CardsStateProvider (below) is the sole subscriber to useSearchParams().
 * It distributes URL state via two independently-memoized contexts so that
 * filter keystrokes never cause CardListSection or this component to re-render.
 */
export function CardsPage(): React.ReactElement {
  const { t } = useTranslation();

  return (
    <CardsStateProvider>
      <PageWrapper>
        <PageTitle>{t("app.title")}</PageTitle>

        <CardListSection />

        <Divider />

        <FilterSection />

        <Divider />

        <TransactionSection />
      </PageWrapper>
    </CardsStateProvider>
  );
}
