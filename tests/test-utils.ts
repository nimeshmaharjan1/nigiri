import { Page, expect } from '@playwright/test';

/**
 * Wait for the page to finish loading and hydration
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  // Wait for React to hydrate
  await page.waitForSelector('[data-testid="sushi-grid"]', {
    state: 'visible',
    timeout: 10000,
  });
}

/**
 * Wait for API response and loading state to complete
 */
export async function waitForDataLoad(page: Page) {
  // Wait for loading spinner to disappear
  await page
    .waitForSelector('[role="status"]', { state: 'hidden' })
    .catch(() => {
      // Loading might be too fast, that's ok
    });
  // Ensure content is visible
  await expect(page.locator('[data-testid="sushi-grid"]')).toBeVisible();
}

/**
 * Get sushi cards on the page
 */
export async function getSushiCards(page: Page) {
  return page.locator('[data-testid="sushi-card"]');
}

/**
 * Open the add sushi dialog
 */
export async function openAddDialog(page: Page) {
  await page.click('[data-testid="add-sushi-button"]');
  await expect(page.locator('[data-testid="add-sushi-dialog"]')).toBeVisible();
}

/**
 * Fill sushi form with data
 */
export async function fillSushiForm(
  page: Page,
  data: {
    name: string;
    type: 'Nigiri' | 'Roll';
    price: string;
    fishType?: string;
    pieces?: string;
  }
) {
  await page.fill('[name="name"]', data.name);
  await page.click('[name="type"]');
  await page.click(`[role="option"]:has-text("${data.type}")`);
  await page.fill('[name="price"]', data.price);

  if (data.type === 'Nigiri' && data.fishType) {
    await page.fill('[name="fishType"]', data.fishType);
  }

  if (data.type === 'Roll' && data.pieces) {
    await page.fill('[name="pieces"]', data.pieces);
  }
}

/**
 * Submit the sushi form
 */
export async function submitSushiForm(page: Page) {
  await page.click('[type="submit"]');
}

/**
 * Wait for toast notification
 */
export async function waitForToast(page: Page, expectedText?: string) {
  const toast = page.locator('[data-sonner-toast]');
  await expect(toast).toBeVisible({ timeout: 5000 });

  if (expectedText) {
    await expect(toast).toContainText(expectedText);
  }

  return toast;
}

/**
 * Set filter values
 */
export async function setFilters(
  page: Page,
  filters: {
    search?: string;
    type?: 'all' | 'nigiri' | 'roll';
    priceRange?: [number, number];
  }
) {
  if (filters.search !== undefined) {
    await page.fill('[data-testid="search-input"]', filters.search);
  }

  if (filters.type) {
    await page.click('[data-testid="type-filter"]');
    await page.click(`[role="option"][data-value="${filters.type}"]`);
  }

  if (filters.priceRange) {
    // Price slider interaction - this might need adjustment based on your UI
    const slider = page.locator('[data-testid="price-slider"]');
    await slider.waitFor();
    // Note: Slider interaction is complex, might need to use keyboard or evaluate JS
  }
}

/**
 * Clear all filters
 */
export async function clearFilters(page: Page) {
  const clearButton = page.locator('[data-testid="clear-filters"]');
  if (await clearButton.isVisible()) {
    await clearButton.click();
  }
}

/**
 * Navigate to page number
 */
export async function goToPage(page: Page, pageNumber: number) {
  await page.click(`[data-testid="page-${pageNumber}"]`);
}

/**
 * Get pagination info text
 */
export async function getPaginationInfo(page: Page) {
  return page.locator('[data-testid="pagination-info"]').textContent();
}

/**
 * Delete a sushi item by name
 */
export async function deleteSushi(page: Page, sushiName: string) {
  // Find the sushi card
  const card = page.locator(
    `[data-testid="sushi-card"]:has-text("${sushiName}")`
  );
  await card.hover();

  // Click delete button
  await card.locator('[data-testid="delete-button"]').click();

  // Confirm in dialog
  await expect(page.locator('[data-testid="delete-dialog"]')).toBeVisible();
  await page.click('[data-testid="confirm-delete"]');
}

/**
 * Cancel deletion
 */
export async function cancelDelete(page: Page, sushiName: string) {
  const card = page.locator(
    `[data-testid="sushi-card"]:has-text("${sushiName}")`
  );
  await card.hover();
  await card.locator('[data-testid="delete-button"]').click();

  await expect(page.locator('[data-testid="delete-dialog"]')).toBeVisible();
  await page.click('[data-testid="cancel-delete"]');
}
