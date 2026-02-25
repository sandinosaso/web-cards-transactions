import type { CardType } from "@dkb-cofa/ApiClient";

/**
 * Maps card type to its DKB brand color.
 * Private  → DKB Teal   (#28D1CA)
 * Business → DKB Blue   (#138DEA)
 * Shared   → DKB Purple (#7C5CFC)
 */
export const CARD_COLORS = {
  private: "#28D1CA",
  business: "#138DEA",
  shared: "#7C5CFC",
} as const satisfies Record<CardType, string>;

export const CARD_GRADIENTS = {
  private: "linear-gradient(135deg, #28D1CA 0%, #17A89F 100%)",
  business: "linear-gradient(135deg, #3BA5EE 0%, #0D6CB5 100%)",
  shared: "linear-gradient(135deg, #9B7DFF 0%, #5A3FD6 100%)",
} as const satisfies Record<CardType, string>;

export function getCardColor(type: CardType): string {
  return CARD_COLORS[type];
}

export function getCardGradient(type: CardType): string {
  return CARD_GRADIENTS[type];
}
