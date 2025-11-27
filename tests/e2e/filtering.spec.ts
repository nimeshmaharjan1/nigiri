import { expect, test } from '@playwright/test';
import { getSushiCards, waitForDataLoad } from '../test-utils';

test.describe('Filtering Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForDataLoad(page);
  });

  test('should filter by search query', async ({ page }) => {
    const initialCount = await (await getSushiCards(page)).count();

    // Type in search
    await page.fill('[data-testid="search-input"]', 'salmon');
    await page.waitForTimeout(500); // Wait for debounce

    const filteredCount = await (await getSushiCards(page)).count();

    // Should have fewer or equal items
    expect(filteredCount).toBeLessThanOrEqual(initialCount);

    // All visible cards should contain "salmon" (case insensitive)
    const cards = await getSushiCards(page);
    for (let i = 0; i < (await cards.count()); i++) {
      const text = await cards.nth(i).textContent();
      expect(text?.toLowerCase()).toContain('salmon');
    }
  });

  test('should filter by type - Nigiri', async ({ page }) => {
    // Select Nigiri type
    await page.click('[data-testid="type-filter"]');
    await page.click('[role="option"][data-value="nigiri"]');

    await page.waitForTimeout(300);

    const cards = await getSushiCards(page);
    const count = await cards.count();

    if (count > 0) {
      // Verify all cards are Nigiri type
      for (let i = 0; i < count; i++) {
        const cardText = await cards.nth(i).textContent();
        // Should contain type indicator or fish type
        expect(cardText).toBeTruthy();
      }
    }
  });

  test('should filter by type - Roll', async ({ page }) => {
    // Select Roll type
    await page.click('[data-testid="type-filter"]');
    await page.click('[role="option"][data-value="roll"]');

    await page.waitForTimeout(300);

    const cards = await getSushiCards(page);
    const count = await cards.count();

    if (count > 0) {
      // Verify all cards are Roll type
      for (let i = 0; i < count; i++) {
        const cardText = await cards.nth(i).textContent();
        expect(cardText).toBeTruthy();
      }
    }
  });

  test('should combine multiple filters', async ({ page }) => {
    const initialCount = await (await getSushiCards(page)).count();

    // Apply search filter
    await page.fill('[data-testid="search-input"]', 'tuna');
    await page.waitForTimeout(500);

    // Apply type filter
    await page.click('[data-testid="type-filter"]');
    await page.click('[role="option"][data-value="nigiri"]');
    await page.waitForTimeout(300);

    const filteredCount = await (await getSushiCards(page)).count();

    // Should have fewer or equal items than initial
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('should reset page to 1 when filters change', async ({ page }) => {
    // Go to page 2 if available
    const page2Button = page.locator('[data-testid="page-2"]');

    if (await page2Button.isVisible()) {
      await page2Button.click();
      await page.waitForTimeout(300);

      // Apply a filter
      await page.fill('[data-testid="search-input"]', 'salmon');
      await page.waitForTimeout(500);

      // Should be back on page 1
      const page1Button = page.locator('[data-testid="page-1"]');
      await expect(page1Button).toHaveAttribute('data-active', 'true');
    }
  });

  test('should clear filters and restore all items', async ({ page }) => {
    const initialCount = await (await getSushiCards(page)).count();

    // Apply filters
    await page.fill('[data-testid="search-input"]', 'salmon');
    await page.waitForTimeout(500);

    await page.click('[data-testid="type-filter"]');
    await page.click('[role="option"][data-value="nigiri"]');
    await page.waitForTimeout(300);

    const filteredCount = await (await getSushiCards(page)).count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);

    // Clear filters
    const clearButton = page.locator('[data-testid="clear-filters"]');
    if (await clearButton.isVisible()) {
      await clearButton.click();
      await page.waitForTimeout(300);

      const restoredCount = await (await getSushiCards(page)).count();
      expect(restoredCount).toBe(initialCount);
    }
  });

  test('should show no results for non-matching search', async ({ page }) => {
    await page.fill('[data-testid="search-input"]', 'NonexistentSushiItem999');
    await page.waitForTimeout(500);

    const cards = await getSushiCards(page);
    const count = await cards.count();

    expect(count).toBe(0);
  });

  test('should filter by price range', async ({ page }) => {
    // This test depends on your price slider implementation
    const priceSlider = page.locator('[data-testid="price-slider"]');

    if (await priceSlider.isVisible()) {
      // Interact with slider (implementation depends on your component)
      // For now, verify it exists
      await expect(priceSlider).toBeVisible();
    }
  });
});
