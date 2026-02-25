import { describe, it, expect } from "vitest";
import { filterTransactionsByMinAmount } from "@dkb-cofa/features/cards/utils/filterTransactions";
import type { Transaction } from "@dkb-cofa/ApiClient";

const transactions: Transaction[] = [
  { id: "1", description: "Food", amount: 10.0 },
  { id: "2", description: "Snack", amount: 33.48 },
  { id: "3", description: "Tickets", amount: 288.38 },
  { id: "4", description: "Coffee", amount: 5.99 },
];

describe("filterTransactionsByMinAmount", () => {
  it("returns all transactions when minAmount is empty", () => {
    const result = filterTransactionsByMinAmount(transactions, "");
    expect(result).toHaveLength(4);
  });

  it("returns all transactions when minAmount is NaN", () => {
    const result = filterTransactionsByMinAmount(transactions, "abc");
    expect(result).toHaveLength(4);
  });

  it("returns all transactions when minAmount is negative", () => {
    const result = filterTransactionsByMinAmount(transactions, "-10");
    expect(result).toHaveLength(4);
  });

  it("returns transactions with amount >= minAmount", () => {
    const result = filterTransactionsByMinAmount(transactions, "10");
    // id:1 (10.00), id:2 (33.48), id:3 (288.38) all satisfy >= 10; id:4 (5.99) does not
    expect(result).toHaveLength(3);
    expect(result.map((t) => t.id)).toEqual(["1", "2", "3"]);
  });

  it("includes transactions that exactly match the minAmount", () => {
    const result = filterTransactionsByMinAmount(transactions, "10.00");
    expect(result.map((t) => t.id)).toContain("2");
  });

  it("returns empty array when no transactions meet the threshold", () => {
    const result = filterTransactionsByMinAmount(transactions, "1000");
    expect(result).toHaveLength(0);
  });

  it("returns all transactions when minAmount is 0", () => {
    const result = filterTransactionsByMinAmount(transactions, "0");
    expect(result).toHaveLength(4);
  });

  it("handles decimal filter values correctly", () => {
    const result = filterTransactionsByMinAmount(transactions, "33.48");
    expect(result.map((t) => t.id)).toEqual(["2", "3"]);
  });

  it("does not mutate the original transactions array", () => {
    const original = [...transactions];
    filterTransactionsByMinAmount(transactions, "10");
    expect(transactions).toEqual(original);
  });
});
