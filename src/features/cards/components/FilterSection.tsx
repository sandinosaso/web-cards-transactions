import { AmountFilter } from "@dkb-cofa/shared/ui";
import { useCardFilter } from "../context/CardsStateContext";

/**
 * Subscribes only to CardFilterContext.
 * Card selection changes do not cause this component to re-render.
 */
export function FilterSection(): React.ReactElement {
  const { minAmount, setMinAmount } = useCardFilter();
  return <AmountFilter value={minAmount} onChange={setMinAmount} />;
}
