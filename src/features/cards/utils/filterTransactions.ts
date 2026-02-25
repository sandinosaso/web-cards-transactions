import type { Transaction } from "@dkb-cofa/ApiClient";

/**
 * Filters transactions to only those with amount >= minAmount.
 * Returns all transactions if minAmount is empty or invalid.
 */
export function filterTransactionsByMinAmount(
  transactions: readonly Transaction[],
  minAmount: string
): Transaction[] {
  const parsed = parseFloat(minAmount);

  if (minAmount === "" || isNaN(parsed) || parsed < 0) {
    return [...transactions];
  }

  return transactions.filter((tx) => tx.amount >= parsed);
}
