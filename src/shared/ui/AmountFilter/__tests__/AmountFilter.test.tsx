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
});
