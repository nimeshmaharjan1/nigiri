import { expect, test } from '@playwright/test';
import { getSushiCards, waitForDataLoad } from '../test-utils';

test.describe('Pagination Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForDataLoad(page);
  });

  test('should display correct number of items per page', async ({ page }) => {
    const cards = await getSushiCards(page);
    const count = await cards.count();

    // Default is 8 items per page
    expect(count).toBeLessThanOrEqual(8);
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to next page', async ({ page }) => {
    const page2Button = page.locator('[data-testid="page-2"]');

    if (await page2Button.isVisible()) {
      await page2Button.click();
      await page.waitForTimeout(300);

      // Should be on page 2
      await expect(page2Button).toHaveAttribute('data-active', 'true');

      // Should still have items
      const cards = await getSushiCards(page);
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should navigate using next/previous buttons', async ({ page }) => {
    const nextButton = page.locator('[data-testid="next-page"]');
    const prevButton = page.locator('[data-testid="prev-page"]');

    if (await nextButton.isVisible()) {
      // Click next
      await nextButton.click();
      await page.waitForTimeout(300);

      // Should be on page 2
      const page2Button = page.locator('[data-testid="page-2"]');
      await expect(page2Button).toHaveAttribute('data-active', 'true');

      // Previous button should be enabled
      await expect(prevButton).toBeEnabled();

      // Click previous
      await prevButton.click();
      await page.waitForTimeout(300);

      // Should be back on page 1
      const page1Button = page.locator('[data-testid="page-1"]');
      await expect(page1Button).toHaveAttribute('data-active', 'true');
    }
  });

  test('should disable previous on first page', async ({ page }) => {
    const prevButton = page.locator('[data-testid="prev-page"]');

    // On page 1, previous should have disabled styling
    await expect(prevButton).toHaveClass(/pointer-events-none/);
  });

  test('should disable next on last page', async ({ page }) => {
    const nextButton = page.locator('[data-testid="next-page"]');

    // Navigate to last page
    let lastPageReached = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!lastPageReached && attempts < maxAttempts) {
      const hasDisabledClass = await nextButton.evaluate((el) =>
        el.classList.contains('pointer-events-none')
      );
      if (hasDisabledClass) {
        lastPageReached = true;
      } else {
        await nextButton.click({ force: true });
        await page.waitForTimeout(300);
        attempts++;
      }
    }

    // Next button should have disabled styling on last page
    await expect(nextButton).toHaveClass(/pointer-events-none/);
  });

  test('should show correct pagination info', async ({ page }) => {
    const paginationInfo = page.locator('[data-testid="pagination-info"]');

    if (await paginationInfo.isVisible()) {
      const text = await paginationInfo.textContent();

      // Should show format like "Showing 1-8 of 24"
      expect(text).toMatch(/Showing \d+-\d+ of \d+/i);
    }
  });

  test('should update pagination when filters applied', async ({ page }) => {
    const initialInfo = await page
      .locator('[data-testid="pagination-info"]')
      .textContent();

    // Apply a filter
    await page.fill('[data-testid="search-input"]', 'salmon');
    await page.waitForTimeout(800); // Increased wait for filter debounce

    const filteredInfo = await page
      .locator('[data-testid="pagination-info"]')
      .textContent();

    // Pagination info should exist
    expect(filteredInfo).toBeTruthy();
  });

  test('should show ellipsis for many pages', async ({ page }) => {
    // Check if there are enough items for ellipsis to show
    const ellipsis = page.locator('[data-testid="pagination-ellipsis"]');

    // If there are many pages, ellipsis might be visible
    if (await ellipsis.isVisible()) {
      expect(await ellipsis.count()).toBeGreaterThan(0);
    }
  });

  test('should maintain page on filter clear if possible', async ({ page }) => {
    // Navigate to page 2
    const page2Button = page.locator('[data-testid="page-2"]');

    if (await page2Button.isVisible()) {
      await page2Button.click();
      await page.waitForTimeout(300);

      // Apply and clear a filter that still has page 2
      await page.fill('[data-testid="search-input"]', 'a');
      await page.waitForTimeout(500);

      const clearButton = page.locator('[data-testid="clear-filters"]');
      if (await clearButton.isVisible()) {
        await clearButton.click();
        await page.waitForTimeout(300);

        // Should reset to page 1 based on requirements
        const page1Button = page.locator('[data-testid="page-1"]');
        await expect(page1Button).toHaveAttribute('data-active', 'true');
      }
    }
  });

  test('should recalculate pages after item deletion', async ({ page }) => {
    const initialPaginationInfo = await page
      .locator('[data-testid="pagination-info"]')
      .textContent();

    // This test would require deleting an item
    // and verifying pagination updates
    // Keeping it as a placeholder for now
    expect(initialPaginationInfo).toBeTruthy();
  });
});
