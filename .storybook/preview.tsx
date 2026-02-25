import type { Preview } from "@storybook/react";
import { ThemeProvider } from "styled-components";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import { theme } from "../src/app/theme";
import { GlobalStyles } from "../src/app/GlobalStyles";
import i18n from "../src/i18n";

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter>
            <GlobalStyles />
            <Story />
          </MemoryRouter>
        </I18nextProvider>
      </ThemeProvider>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
  },
};

export default preview;
