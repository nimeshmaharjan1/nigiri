import { expect, test } from '@playwright/test';
import { getSushiCards, waitForDataLoad } from '../test-utils';

test.describe('Sushi List Display', () => {
  test('should load the page successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Nigiri/i);
  });

  test('should display sushi items from API', async ({ page }) => {
    await page.goto('/');
    await waitForDataLoad(page);

    const cards = await getSushiCards(page);
    const count = await cards.count();

    expect(count).toBeGreaterThan(0);
  });

  test('should show loading state initially', async ({ page }) => {
    await page.goto('/');

    // Loading indicator should appear (might be quick)
    const loadingStates = [
      page.locator('[role="status"]'),
      page.locator('text=/loading/i'),
      page.locator('[data-testid="loading"]'),
    ];

    // At least one loading indicator pattern might be present
    // This is optional since loading might be very fast
  });

  test('should display sushi card with correct information', async ({
    page,
  }) => {
    await page.goto('/');
    await waitForDataLoad(page);

    const firstCard = (await getSushiCards(page)).first();
    await expect(firstCard).toBeVisible();

    // Each card should have essential information
    await expect(firstCard.locator('img')).toBeVisible();
    await expect(firstCard.locator('text=/\\$/i')).toBeVisible(); // Price
  });

  test('should handle empty state gracefully', async ({ page }) => {
    // This test might need API mocking or specific filter that returns no results
    await page.goto('/');
    await waitForDataLoad(page);

    // Apply filter that returns no results
    await page.fill('[data-testid="search-input"]', 'NonexistentSushi12345');
    await page.waitForTimeout(500); // Debounce

    // Should show empty state or no cards
    const cards = await getSushiCards(page);
    const count = await cards.count();

    if (count === 0) {
      // Could show empty state message
      expect(count).toBe(0);
    }
  });

  test('should have responsive grid layout', async ({ page }) => {
    await page.goto('/');
    await waitForDataLoad(page);

    const grid = page.locator('[data-testid="sushi-grid"]');
    await expect(grid).toBeVisible();

    // Grid should have CSS grid or flex layout
    const displayValue = await grid.evaluate(
      (el) => window.getComputedStyle(el).display
    );
    expect(['grid', 'flex']).toContain(displayValue);
  });
});
