import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorBoundary } from "@dkb-cofa/app/ErrorBoundary";

/**
 * ErrorBoundary tests verify two user-facing behaviours:
 *
 * 1. When a child throws, the boundary catches it and renders a fallback UI
 *    with a clear heading and a reload button — never a blank screen.
 *
 * 2. The reload button calls window.location.reload(). Because the boundary
 *    uses a full page reload (not an internal state reset) for recovery,
 *    we verify the call is made rather than testing re-render behaviour.
 *
 * console.error is suppressed in all tests because React always logs caught
 * errors to the console regardless of the boundary, which pollutes output.
 */

const BrokenChild = (): React.ReactElement => {
  throw new Error("Intentional test explosion");
};

const HealthyChild = (): React.ReactElement => <div>All good</div>;

describe("ErrorBoundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders children normally when no error is thrown", () => {
    render(
      <ErrorBoundary>
        <HealthyChild />
      </ErrorBoundary>
    );

    expect(screen.getByText("All good")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders the fallback UI when a child throws", () => {
    render(
      <ErrorBoundary>
        <BrokenChild />
      </ErrorBoundary>
    );

    // role="alert" is on the ErrorWrapper — screen reader announces it immediately
    expect(screen.getByRole("alert")).toBeInTheDocument();
    // Heading must tell the user something went wrong — not a blank screen
    expect(
      screen.getByRole("heading", { name: /something went wrong/i })
    ).toBeInTheDocument();
    // Must offer a recovery action
    expect(
      screen.getByRole("button", { name: /reload page/i })
    ).toBeInTheDocument();
  });

  it("does not render children once an error has been caught", () => {
    render(
      <ErrorBoundary>
        <BrokenChild />
      </ErrorBoundary>
    );

    expect(screen.queryByText("All good")).not.toBeInTheDocument();
  });

  it("calls window.location.reload when the reload button is clicked", async () => {
    const user = userEvent.setup();

    // jsdom marks window.location as non-configurable, so vi.spyOn() throws.
    // vi.stubGlobal replaces the entire location object for the duration of
    // this test and is cleaned up by vi.unstubAllGlobals() in afterEach.
    const reloadMock = vi.fn();
    vi.stubGlobal("location", { reload: reloadMock });

    render(
      <ErrorBoundary>
        <BrokenChild />
      </ErrorBoundary>
    );

    await user.click(screen.getByRole("button", { name: /reload page/i }));

    expect(reloadMock).toHaveBeenCalledOnce();
  });
});
