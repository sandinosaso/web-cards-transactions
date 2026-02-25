import React from "react";
import styled, { css } from "styled-components";
import type { CardType } from "@dkb-cofa/ApiClient";
import { getCardGradient } from "@dkb-cofa/shared/utils/cardColors";

// ─── Styled primitives ────────────────────────────────────────────────────────

interface CardContainerProps {
  $type: CardType;
  $isSelected: boolean;
}

/**
 * Sized to the ISO 7810 ID-1 standard (85.60 × 53.98 mm → aspect-ratio 1.586).
 * Decorative circles are pure CSS, no extra DOM nodes.
 */
const CardContainer = styled.article<CardContainerProps>`
  /* ISO 7810 ID-1 proportions */
  width: 340px;
  aspect-ratio: 1.586;
  border-radius: 16px;
  padding: 20px 24px;
  background: ${({ $type }) => getCardGradient($type)};
  color: white;
  cursor: pointer;
  user-select: none;
  position: relative;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.card};
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  /* Top-right decorative circle */
  &::before {
    content: "";
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.09);
    top: -70px;
    right: -50px;
    pointer-events: none;
  }

  /* Bottom-right decorative circle */
  &::after {
    content: "";
    position: absolute;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
    bottom: -40px;
    right: 16px;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadow.cardSelected};
  }

  &:focus-visible {
    outline: 3px solid rgba(255, 255, 255, 0.9);
    outline-offset: 4px;
  }

  ${({ $isSelected, theme }) =>
    $isSelected &&
    css`
      transform: translateY(-4px);
      /* White ring via box-shadow — no extra DOM node needed */
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.85),
        ${theme.shadow.cardSelected};
    `}
`;

// ─── Top row: brand + network ─────────────────────────────────────────────────

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  z-index: 1;
`;

const DKBBrand = styled.span`
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: white;
`;

const NetworkBadge = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  font-style: italic;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.9);
`;

// ─── Middle row: chip + card type label ───────────────────────────────────────

const ChipRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  position: relative;
  z-index: 1;
`;

/** EMV chip — golden rectangle with etched contact lines */
const Chip = styled.div`
  width: 38px;
  height: 28px;
  border-radius: 4px;
  background: linear-gradient(
    135deg,
    #e8c84a 0%,
    #f5e06e 40%,
    #c9a227 100%
  );
  flex-shrink: 0;
  position: relative;

  /* Horizontal contact line */
  &::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background: rgba(160, 120, 10, 0.5);
    transform: translateY(-50%);
  }

  /* Vertical contact line */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 1px;
    background: rgba(160, 120, 10, 0.5);
    transform: translateX(-50%);
  }
`;

const CardTypeLabel = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
`;

// ─── Card number ──────────────────────────────────────────────────────────────

const CardNumber = styled.p`
  margin: 0;
  font-size: 1.1rem;
  letter-spacing: 0.2em;
  font-family: "Courier New", Courier, monospace;
  color: white;
  position: relative;
  z-index: 1;
`;

// ─── Bottom row: holder + expiry ──────────────────────────────────────────────

const CardBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  position: relative;
  z-index: 1;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const FieldLabel = styled.span`
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
`;

const FieldValue = styled.span`
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: white;
`;

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  id: string;
  description: string;
  type: CardType;
  cardHolder: string;
  maskedCardNumber: string;
  expiryDate: string;
  network: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const CardTileComponent = React.memo(function CardTileComponent({
  id,
  description,
  type,
  cardHolder,
  maskedCardNumber,
  expiryDate,
  network,
  isSelected,
  onSelect,
}: Props): React.ReactElement {
  function handleClick(): void {
    onSelect(id);
  }

  function handleKeyDown(e: React.KeyboardEvent): void {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(id);
    }
  }

  return (
    <CardContainer
      $type={type}
      $isSelected={isSelected}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={description}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <CardTop>
        <DKBBrand>DKB</DKBBrand>
        <NetworkBadge>{network}</NetworkBadge>
      </CardTop>

      <ChipRow>
        <Chip aria-hidden="true" />
        <CardTypeLabel>{description}</CardTypeLabel>
      </ChipRow>

      <CardNumber aria-label={`Card ending in ${maskedCardNumber}`}>
        •••• •••• •••• {maskedCardNumber}
      </CardNumber>

      <CardBottom>
        <FieldGroup>
          <FieldLabel>Card Holder</FieldLabel>
          <FieldValue>{cardHolder}</FieldValue>
        </FieldGroup>
        <FieldGroup style={{ textAlign: "right" }}>
          <FieldLabel>Expires</FieldLabel>
          <FieldValue>{expiryDate}</FieldValue>
        </FieldGroup>
      </CardBottom>
    </CardContainer>
  );
});
