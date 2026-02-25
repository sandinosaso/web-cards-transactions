import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { cardsApi } from "@dkb-cofa/shared/api/cardsApi";
import { theme } from "@dkb-cofa/app/theme";
import i18n from "@dkb-cofa/i18n";

export function createTestStore() {
  return configureStore({
    reducer: {
      [cardsApi.reducerPath]: cardsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(cardsApi.middleware),
  });
}

interface RenderOptions {
  initialEntries?: string[];
  store?: ReturnType<typeof createTestStore>;
}

export function renderWithProviders(
  ui: ReactNode,
  { initialEntries = ["/"], store = createTestStore() }: RenderOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <I18nextProvider i18n={i18n}>
            <MemoryRouter
              initialEntries={initialEntries}
              future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
            >
              {children}
            </MemoryRouter>
          </I18nextProvider>
        </ThemeProvider>
      </Provider>
    );
  }

  return render(ui, { wrapper: Wrapper });
}
