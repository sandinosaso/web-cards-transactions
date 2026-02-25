export type CardType = "private" | "business";

export interface Card {
  id: string;
  description: string;
  type: CardType;
  cardHolder: string;
  maskedCardNumber: string;
  expiryDate: string;
  network: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
}

export class CardNotFoundError extends Error {
  constructor(cardId: string) {
    super(`No transactions found for card: ${cardId}`);
    this.name = "CardNotFoundError";
  }
}

export async function getCards(): Promise<Card[]> {
  // JSON imports widen 'type' to string; cast to the typed Card[] shape we own.
  const { default: cards } = await import("./data/cards.json");
  return cards as Card[];
}

export async function getTransactions(
  cardId: string
): Promise<Transaction[]> {
  const { default: transactions } = (await import(
    "./data/transactions.json"
  )) as { default: Record<string, Transaction[]> };

  const cardTransactions = transactions[cardId];
  if (!cardTransactions) {
    throw new CardNotFoundError(cardId);
  }

  return cardTransactions;
}

