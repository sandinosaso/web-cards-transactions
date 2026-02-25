import { test, expect } from "@playwright/test";

test.describe("Cards and Transactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows all cards on initial load", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Private Card" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Business Card" })
    ).toBeVisible();
  });

  test("user can select a card and see its transactions", async ({ page }) => {
    await page.getByRole("button", { name: "Private Card" }).click();

    await expect(page.getByText("Food")).toBeVisible();
    await expect(page.getByText("Tickets")).toBeVisible();
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
    await filterInput.fill("100");

    // Only Tickets (288.38) should be visible; Food (123.88) should also be visible; Snack (33.48) gone
    await expect(page.getByText("Food")).toBeVisible();
    await expect(page.getByText("Snack")).not.toBeVisible();
  });

  test("filter resets when user switches cards", async ({ page }) => {
    await page.getByRole("button", { name: "Private Card" }).click();
    await expect(page.getByText("Food")).toBeVisible();

    const filterInput = page.getByLabel("Filter by minimum amount");
    await filterInput.fill("200");

    await expect(page.getByText("Snack")).not.toBeVisible();

    // Switch card
    await page.getByRole("button", { name: "Business Card" }).click();

    // Filter should be reset
    await expect(filterInput).toHaveValue("");

    // All Business Card transactions should be visible
    await expect(page.getByText("Smart Phone")).toBeVisible();
    await expect(page.getByText("Chocolate Bar")).toBeVisible();
  });

  test("cardId and minAmount are reflected in the URL", async ({ page }) => {
    await page.getByRole("button", { name: "Private Card" }).click();
    await expect(page).toHaveURL(/cardId=lkmfkl-mlfkm-dlkfm/);

    const filterInput = page.getByLabel("Filter by minimum amount");
    await filterInput.fill("50");
    await expect(page).toHaveURL(/minAmount=50/);
  });

  test("state is preserved on page reload", async ({ page }) => {
    await page.getByRole("button", { name: "Private Card" }).click();
    await expect(page.getByText("Food")).toBeVisible();

    const filterInput = page.getByLabel("Filter by minimum amount");
    await filterInput.fill("100");

    // Wait for the debounce to flush and the URL to reflect the filter state
    // before reloading — otherwise the reload happens before minAmount is persisted
    await expect(page).toHaveURL(/minAmount=100/);

    await page.reload();

    // Card still selected, filter still active
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
});
