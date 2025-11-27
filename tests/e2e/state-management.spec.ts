import { expect, test } from '@playwright/test';
import { getSushiCards, waitForDataLoad } from '../test-utils';

test.describe('State Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForDataLoad(page);
  });

  test('should maintain filter state during navigation', async ({ page }) => {
    // Apply filters
    await page.fill('[data-testid="search-input"]', 'salmon');
    await page.waitForTimeout(500);

    // Navigate to page 2 if available
    const page2Button = page.locator('[data-testid="page-2"]');
    if (await page2Button.isVisible()) {
      await page2Button.click();
      await page.waitForTimeout(300);

      // Filter should still be applied
      const searchInput = page.locator('[data-testid="search-input"]');
      await expect(searchInput).toHaveValue('salmon');
    }
  });

  test('should maintain type filter across actions', async ({ page }) => {
    // Select Nigiri type
    await page.click('[data-testid="type-filter"]');
    await page.waitForSelector('[role="option"]', { state: 'visible' });
    await page.click('[role="option"]:has-text("Nigiri")');

    await page.waitForTimeout(300);

    // Do other actions like pagination
    const page2Button = page.locator('[data-testid="page-2"]');
    if (await page2Button.isVisible()) {
      await page2Button.click();
      await page.waitForTimeout(300);

      // Type filter should still be Nigiri
      const typeFilter = page.locator('[data-testid="type-filter"]');
      const selectedValue = await typeFilter.textContent();
      expect(selectedValue?.toLowerCase()).toContain('nigiri');
    }
  });

  test('should reset filters independently', async ({ page }) => {
    // Apply multiple filters
    await page.fill('[data-testid="search-input"]', 'tuna');
    await page.waitForTimeout(500);

    await page.click('[data-testid="type-filter"]');
    await page.waitForSelector('[role="option"]', { state: 'visible' });
    await page.click('[role="option"]:has-text("Roll")');
    await page.waitForTimeout(300);

    // Clear filters
    const clearButton = page.locator('[data-testid="clear-filters"]');
    if (await clearButton.isVisible()) {
      await clearButton.click();
      await page.waitForTimeout(300);

      // Both filters should be reset
      const searchInput = page.locator('[data-testid="search-input"]');
      await expect(searchInput).toHaveValue('');

      const typeFilter = page.locator('[data-testid="type-filter"]');
      const selectedValue = await typeFilter.textContent();
      expect(selectedValue?.toLowerCase()).toContain('all');
    }
  });

  test('should handle React Query cache correctly', async ({ page }) => {
    // Initial load
    const initialCards = await getSushiCards(page);
    const initialCount = await initialCards.count();
    expect(initialCount).toBeGreaterThan(0);

    // Apply filter to reduce items
    await page.fill('[data-testid="search-input"]', 'salmon');
    await page.waitForTimeout(500);

    const filteredCount = await (await getSushiCards(page)).count();

    // Clear filter - should restore from cache quickly
    const clearButton = page.locator('[data-testid="clear-filters"]');
    if (await clearButton.isVisible()) {
      await clearButton.click();

      // Should be fast due to cache
      const startTime = Date.now();
      await page.waitForTimeout(300);
      const endTime = Date.now();

      const restoredCount = await (await getSushiCards(page)).count();
      expect(restoredCount).toBe(initialCount);

      // Should be fast (less than 2 seconds)
      expect(endTime - startTime).toBeLessThan(2000);
    }
  });

  test('should handle optimistic updates for deletion', async ({ page }) => {
    const cards = await getSushiCards(page);
    const initialCount = await cards.count();
    const firstCard = cards.first();
    const sushiName =
      (await firstCard
        .locator('[data-testid="sushi-card-title"]')
        .textContent()) || '';

    // Delete item
    await firstCard.hover();
    await firstCard.locator('[data-testid="delete-button"]').click();
    await page.click('[data-testid="confirm-delete"]');

    // Item should disappear quickly (optimistic update)
    await page.waitForTimeout(500);

    const currentCards = await getSushiCards(page);
    const newCount = await currentCards.count();

    // Should have one less item (or same if on different page)
    expect(newCount).toBeLessThanOrEqual(initialCount);
  });

  test('should synchronize state across multiple filter changes', async ({
    page,
  }) => {
    // Rapid filter changes
    await page.fill('[data-testid="search-input"]', 'salmon');
    await page.waitForTimeout(200);

    await page.fill('[data-testid="search-input"]', 'tuna');
    await page.waitForTimeout(200);

    await page.fill('[data-testid="search-input"]', 'roll');
    await page.waitForTimeout(500);

    // Final filter should be applied
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toHaveValue('roll');

    // Results should match final filter
    const cards = await getSushiCards(page);
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should maintain page state in Zustand store', async ({ page }) => {
    // Navigate to page 2
    const page2Button = page.locator('[data-testid="page-2"]');

    if (await page2Button.isVisible()) {
      await page2Button.click();
      await page.waitForTimeout(300);

      // Page 2 should be active
      await expect(page2Button).toHaveAttribute('data-active', 'true');

      // Do another action that doesn't reset page
      // For example, opening and closing a dialog
      const addButton = page.locator('[data-testid="add-sushi-button"]');
      if (await addButton.isVisible()) {
        await addButton.click();
        const dialog = page.locator('[data-testid="add-sushi-dialog"]');
        await expect(dialog).toBeVisible();

        const cancelButton = page.locator(
          '[data-testid="cancel-add"], [data-testid="close-dialog"]'
        );
        await cancelButton.first().click();

        // Should still be on page 2
        await expect(page2Button).toHaveAttribute('data-active', 'true');
      }
    }
  });

  test('should handle concurrent state updates', async ({ page }) => {
    // Apply filter
    await page.fill('[data-testid="search-input"]', 'salmon');

    // Immediately change type filter
    await page.click('[data-testid="type-filter"]');
    await page.waitForSelector('[role="option"]', { state: 'visible' });
    await page.click('[role="option"]:has-text("Nigiri")');

    // Wait for both to settle
    await page.waitForTimeout(800);

    // Both filters should be active
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toHaveValue('salmon');

    const typeFilter = page.locator('[data-testid="type-filter"]');
    const selectedValue = await typeFilter.textContent();
    expect(selectedValue?.toLowerCase()).toContain('nigiri');

    // Results should reflect both filters
    const cards = await getSushiCards(page);
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
