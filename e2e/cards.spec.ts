import { test, expect } from "@playwright/test";

test.describe("Cards and Transactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for cards to finish loading (simulated latency in dev mode)
    await expect(
      page.getByRole("button", { name: "Private Card" })
    ).toBeVisible();
  });

  test("shows all cards on initial load", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Private Card" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Business Card" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Shared Expense Card" })
    ).toBeVisible();
  });

  test("user can select a card and see its transactions", async ({ page }) => {
    await page.getByRole("button", { name: "Private Card" }).click();

    await expect(page.getByText("Food")).toBeVisible();
    await expect(page.getByText("Electronics")).toBeVisible();
  });

  test("selected card is marked as pressed", async ({ page }) => {
    await page.getByRole("button", { name: "Private Card" }).click();

    await expect(
      page.getByRole("button", { name: "Private Card" })
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByRole("button", { name: "Business Card" })
    ).toHaveAttribute("aria-pressed", "false");
  });

  test("user can filter transactions by minimum amount", async ({ page }) => {
    await page.getByRole("button", { name: "Private Card" }).click();
    await expect(page.getByText("Food")).toBeVisible();

    const filterInput = page.getByLabel("Filter by minimum amount");
    await filterInput.fill("30");

    // Wait for debounce to flush
    await expect(page).toHaveURL(/minAmount=30/);

    // Food (42.50) and Electronics (299.99) visible; Snack (3.80) and Coffee (4.20) filtered out
    await expect(page.getByText("Food")).toBeVisible();
    await expect(page.getByText("Electronics")).toBeVisible();
    await expect(page.getByText("Snack")).not.toBeVisible();
    await expect(page.getByText("Coffee")).not.toBeVisible();
  });

  test("filter resets when user switches cards", async ({ page }) => {
    await page.getByRole("button", { name: "Private Card" }).click();
    await expect(page.getByText("Food")).toBeVisible();

    const filterInput = page.getByLabel("Filter by minimum amount");
    await filterInput.fill("200");

    // Wait for debounce flush
    await expect(page).toHaveURL(/minAmount=200/);

    await expect(page.getByText("Snack")).not.toBeVisible();

    // Switch card
    await page.getByRole("button", { name: "Business Card" }).click();

    // Filter should be reset
    await expect(filterInput).toHaveValue("");

    // All Business Card transactions should be visible
    await expect(page.getByText("Office Supplies")).toBeVisible();
    await expect(page.getByText("Client Dinner")).toBeVisible();
  });

  test("cardId and minAmount are reflected in the URL", async ({ page }) => {
    await page.getByRole("button", { name: "Private Card" }).click();
    await expect(page).toHaveURL(/cardId=card-1/);

    const filterInput = page.getByLabel("Filter by minimum amount");
    await filterInput.fill("50");
    await expect(page).toHaveURL(/minAmount=50/);
  });

  test("state is preserved on page reload", async ({ page }) => {
    await page.getByRole("button", { name: "Private Card" }).click();
    await expect(page.getByText("Food")).toBeVisible();

    const filterInput = page.getByLabel("Filter by minimum amount");
    await filterInput.fill("30");

    // Wait for the debounce to flush and the URL to reflect the filter state
    await expect(page).toHaveURL(/minAmount=30/);

    await page.reload();

    // Wait for data to load after reload (simulated latency)
    await expect(
      page.getByRole("button", { name: "Private Card" })
    ).toBeVisible();

    // Card still selected, filter still active
    await expect(filterInput).toHaveValue("30");
    await expect(page.getByText("Food")).toBeVisible();
    await expect(page.getByText("Snack")).not.toBeVisible();
  });

  test("empty state is shown when filter has no matches", async ({ page }) => {
    await page.getByRole("button", { name: "Private Card" }).click();
    await expect(page.getByText("Food")).toBeVisible();

    const filterInput = page.getByLabel("Filter by minimum amount");
    await filterInput.fill("9999");

    await expect(
      page.getByText("No transactions match your filter.")
    ).toBeVisible();
  });

  test("card is keyboard accessible via Tab and Enter", async ({ page }) => {
    const privateCard = page.getByRole("button", { name: "Private Card" });
    await privateCard.focus();
    await page.keyboard.press("Enter");

    await expect(page.getByText("Food")).toBeVisible();
    await expect(privateCard).toHaveAttribute("aria-pressed", "true");
  });

  test("RTK Query caching: second visit to same card is instant", async ({
    page,
  }) => {
    // Select card 1 → transactions load
    await page.getByRole("button", { name: "Private Card" }).click();
    await expect(page.getByText("Food")).toBeVisible();

    // Switch to card 2 → new transactions load
    await page.getByRole("button", { name: "Business Card" }).click();
    await expect(page.getByText("Office Supplies")).toBeVisible();

    // Switch BACK to card 1 → should be instant (cached by RTK Query)
    await page.getByRole("button", { name: "Private Card" }).click();
    // No spinner expected — data is served from cache
    await expect(page.getByText("Food")).toBeVisible();
  });
});
