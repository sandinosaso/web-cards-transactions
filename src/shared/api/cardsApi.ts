import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCards, getTransactions } from "@dkb-cofa/ApiClient";
import type { Card, Transaction } from "@dkb-cofa/ApiClient";

export const cardsApi = createApi({
  reducerPath: "cardsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Card", "Transaction"] as const,
  endpoints: (builder) => ({
    getCards: builder.query<Card[], void>({
      queryFn: async () => {
        try {
          const data = await getCards();
          return { data };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : "Unknown error",
            },
          };
        }
      },
      providesTags: [{ type: "Card", id: "LIST" }],
    }),

    getTransactions: builder.query<Transaction[], string>({
      queryFn: async (cardId) => {
        try {
          const data = await getTransactions(cardId);
          return { data };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : "Unknown error",
            },
          };
        }
      },
      providesTags: (_result, _error, cardId) => [
        { type: "Transaction", id: cardId },
      ],
    }),
  }),
});

export const { useGetCardsQuery, useGetTransactionsQuery } = cardsApi;
