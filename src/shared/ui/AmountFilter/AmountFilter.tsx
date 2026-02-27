import { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@dkb-cofa/i18n/formatCurrency";
import { useDebouncedCallback } from "@dkb-cofa/shared/utils/useDebouncedCallback";

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  width: 100%;
  max-width: 280px;
  box-sizing: border-box;
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.surface};

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 0;
    border-color: transparent;
  }

  /* Remove browser number spinners */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

const Hint = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const DEBOUNCE_MS = 400;

export function AmountFilter({ value, onChange }: Props): React.ReactElement {
  const { t } = useTranslation();

  // Local state drives the input for instant visual feedback.
  // debouncedChange writes to the URL only after DEBOUNCE_MS of quiet.
  const [inputValue, setInputValue] = useState(value);
  const { call: debouncedChange, cancel: cancelPendingChange } =
    useDebouncedCallback(onChange, DEBOUNCE_MS);

  // Sync when the external value resets (e.g. card switch wipes minAmount).
  // Cancelling the pending debounce first prevents a stale write from landing
  // after the parent has already cleared the value.
  useEffect(() => {
    if (value !== inputValue) {
      cancelPendingChange();
      setInputValue(value);
    }
    // Intentionally omit inputValue: we only react to external changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, cancelPendingChange]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const raw = e.target.value;
    if (raw === "" || /^\d*\.?\d*$/.test(raw)) {
      setInputValue(raw);
      debouncedChange(raw);
    }
  }

  // Reflect local value immediately so the hint updates while typing
  const parsedAmount = parseFloat(inputValue);
  const hasFilter = inputValue !== "" && !isNaN(parsedAmount);

  return (
    <FilterWrapper>
      <Label htmlFor="amount-filter">{t("filter.label")}</Label>
      <Input
        id="amount-filter"
        type="number"
        min="0"
        step="0.01"
        value={inputValue}
        onChange={handleChange}
        placeholder={t("filter.placeholder")}
        aria-describedby={hasFilter ? "filter-hint" : undefined}
      />
      {hasFilter && (
        <Hint id="filter-hint" aria-live="polite">
          {t("filter.hint", { amount: formatCurrency(parsedAmount) })}
        </Hint>
      )}
    </FilterWrapper>
  );
}
