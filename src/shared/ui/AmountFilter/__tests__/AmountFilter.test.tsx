import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@dkb-cofa/test/renderWithProviders";
import { AmountFilter } from "@dkb-cofa/shared/ui/AmountFilter/AmountFilter";

describe("AmountFilter", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockReset();
  });

  // Restore real timers after each test in case a test enables fake timers.
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the label and input", () => {
    renderWithProviders(<AmountFilter value="" onChange={mockOnChange} />);
    expect(
      screen.getByLabelText("Filter by minimum amount")
    ).toBeInTheDocument();
  });

  it("calls onChange with the typed value", () => {
    // The component debounces onChange by 400 ms. Use fake timers so we can
    // flush on demand. Use fireEvent (synchronous) instead of userEvent.type,
    // because userEvent schedules its own async delays via timers — mixing the
    // two causes a deadlock where user.type() never resolves.
    vi.useFakeTimers();
    renderWithProviders(<AmountFilter value="" onChange={mockOnChange} />);

    const input = screen.getByLabelText("Filter by minimum amount");
    fireEvent.change(input, { target: { value: "50" } });
    act(() => { vi.runAllTimers(); }); // flush the 400 ms debounce

    expect(mockOnChange).toHaveBeenCalledWith("50");
  });

  it("does not call onChange for non-numeric characters", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AmountFilter value="" onChange={mockOnChange} />);

    const input = screen.getByLabelText("Filter by minimum amount");
    // Attempt typing a letter
    await user.type(input, "a");

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("shows hint text when a valid filter value is set", () => {
    renderWithProviders(<AmountFilter value="50" onChange={mockOnChange} />);
    expect(screen.getByText(/50/)).toBeInTheDocument();
  });

  it("does not show hint when value is empty", () => {
    renderWithProviders(<AmountFilter value="" onChange={mockOnChange} />);
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });

  it("is accessible with a visible label associated to the input", () => {
    renderWithProviders(<AmountFilter value="" onChange={mockOnChange} />);
    const input = screen.getByRole("spinbutton", {
      name: "Filter by minimum amount",
    });
    expect(input).toBeInTheDocument();
  });

  it("does not call onChange when the value resets externally (cancel guard)", () => {
    // Simulates a card switch: the parent sets value="" (URL param cleared).
    // The external-sync effect calls cancelPendingChange() before setInputValue,
    // so any in-flight debounced write is discarded — onChange never fires.
    vi.useFakeTimers();
    const { rerender } = renderWithProviders(
      <AmountFilter value="50" onChange={mockOnChange} />
    );

    // Simulate external reset (card switch clears minAmount from URL)
    rerender(<AmountFilter value="" onChange={mockOnChange} />);

    // Advance past the full debounce window
    act(() => {
      vi.runAllTimers();
    });

    // onChange must NOT have been called — the reset was external, not user-typed
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("calls onChange exactly once after rapid keystrokes (debounce consolidation)", () => {
    // Three fireEvent.change calls in quick succession should produce only one
    // onChange("100") after the debounce window elapses — not three separate calls.
    vi.useFakeTimers();
    renderWithProviders(<AmountFilter value="" onChange={mockOnChange} />);

    const input = screen.getByLabelText("Filter by minimum amount");

    // Simulate typing "1", "10", "100" in rapid succession (no timer advance)
    fireEvent.change(input, { target: { value: "1" } });
    fireEvent.change(input, { target: { value: "10" } });
    fireEvent.change(input, { target: { value: "100" } });

    // No calls yet — still within the debounce window
    expect(mockOnChange).not.toHaveBeenCalled();

    // Flush the debounce — only the final value should be written
    act(() => {
      vi.runAllTimers();
    });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith("100");
  });
});
