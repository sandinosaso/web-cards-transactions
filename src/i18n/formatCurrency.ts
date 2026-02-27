import i18n from "./index";

/**
 * Formats a monetary amount using the active i18n language as the locale,
 * keeping text language and number presentation consistent.
 *
 * Example (lng: "en"): formatCurrency(1234.56) → "€1,234.56"
 *
 * Why not hardcode "de-DE"?
 * The i18n instance is initialised with `lng: "en"` — mixing "de-DE" number
 * formatting with English UI labels is inconsistent. Deriving the locale from
 * `i18n.language` ensures both layers change together when the language changes.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(i18n.language, {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
