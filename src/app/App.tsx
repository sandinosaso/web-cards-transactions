import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "./store";
import { theme } from "./theme";
import { ErrorBoundary } from "./ErrorBoundary";
import { CardsPage } from "@dkb-cofa/features/cards";
import i18n from "@dkb-cofa/i18n";
import { GlobalStyles } from "./GlobalStyles";

export function App(): React.ReactElement {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <I18nextProvider i18n={i18n}>
            <GlobalStyles />
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <Routes>
                <Route path="/" element={<CardsPage />} />
              </Routes>
            </BrowserRouter>
          </I18nextProvider>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}
