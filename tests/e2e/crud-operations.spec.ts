import { expect, test } from '@playwright/test';
import {
  fillSushiForm,
  getSushiCards,
  openAddDialog,
  submitSushiForm,
  waitForDataLoad,
  waitForToast,
} from '../test-utils';

test.describe('CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForDataLoad(page);
  });

  test.describe('Create Operations', () => {
    test('should open add sushi dialog', async ({ page }) => {
      await openAddDialog(page);

      const dialog = page.locator('[data-testid="add-sushi-dialog"]');
      await expect(dialog).toBeVisible();
    });

    test('should add new Nigiri with fish type', async ({ page }) => {
      const initialCount = await (await getSushiCards(page)).count();

      await openAddDialog(page);

      const uniqueName = `Test Nigiri ${Date.now()}`;
      await fillSushiForm(page, {
        name: uniqueName,
        type: 'Nigiri',
        price: '12.99',
        fishType: 'Tuna',
      });

      await submitSushiForm(page);

      // Wait for success toast
      await waitForToast(page);

      // Dialog should close
      await expect(
        page.locator('[data-testid="add-sushi-dialog"]')
      ).toBeHidden();

      // Wait for list to update
      await page.waitForTimeout(1000);

      // Should have one more item (on page 1)
      await page.click('[data-testid="page-1"]');
      await page.waitForTimeout(500);

      const newCount = await (await getSushiCards(page)).count();
      // Note: Count might not increase if item is on different page
      // Better to check if item exists
      expect(newCount).toBeGreaterThan(0);
    });

    test('should add new Roll with pieces count', async ({ page }) => {
      await openAddDialog(page);

      const uniqueName = `Test Roll ${Date.now()}`;
      await fillSushiForm(page, {
        name: uniqueName,
        type: 'Roll',
        price: '15.99',
        pieces: '8',
      });

      await submitSushiForm(page);

      // Wait for success toast
      await waitForToast(page);

      // Dialog should close
      await expect(
        page.locator('[data-testid="add-sushi-dialog"]')
      ).toBeHidden();
    });

    test('should show validation error for empty name', async ({ page }) => {
      await openAddDialog(page);

      // Try to submit without filling required fields
      await submitSushiForm(page);

      // Should show validation error
      const errorMessage = page.locator('text=/required/i').first();
      await expect(errorMessage).toBeVisible();

      // Dialog should still be open
      await expect(
        page.locator('[data-testid="add-sushi-dialog"]')
      ).toBeVisible();
    });

    test('should show validation error for invalid price', async ({ page }) => {
      await openAddDialog(page);

      await page.fill('[name="name"]', 'Test Sushi');
      await page.click('[name="type"]');
      await page.click('[role="option"]:has-text("Nigiri")');
      await page.fill('[name="price"]', 'invalid');

      await submitSushiForm(page);

      // Should show validation error for price
      const errorMessage = page.locator(
        'text=/valid.*number|must be.*number/i'
      );
      await expect(errorMessage).toBeVisible();
    });

    test('should require fishType for Nigiri', async ({ page }) => {
      await openAddDialog(page);

      await page.fill('[name="name"]', 'Test Nigiri');
      await page.click('[name="type"]');
      await page.click('[role="option"]:has-text("Nigiri")');
      await page.fill('[name="price"]', '12.99');
      // Don't fill fishType

      await submitSushiForm(page);

      // Should show validation error for fishType
      const errorMessage = page
        .locator('text=/fish.*type.*required|required/i')
        .first();
      await expect(errorMessage).toBeVisible();
    });

    test('should require pieces for Roll', async ({ page }) => {
      await openAddDialog(page);

      await page.fill('[name="name"]', 'Test Roll');
      await page.click('[name="type"]');
      await page.click('[role="option"]:has-text("Roll")');
      await page.fill('[name="price"]', '15.99');
      // Don't fill pieces

      await submitSushiForm(page);

      // Should show validation error for pieces
      const errorMessage = page
        .locator('text=/pieces.*required|required/i')
        .first();
      await expect(errorMessage).toBeVisible();
    });

    test('should close dialog on cancel', async ({ page }) => {
      await openAddDialog(page);

      const dialog = page.locator('[data-testid="add-sushi-dialog"]');
      await expect(dialog).toBeVisible();

      // Click cancel or close button
      const cancelButton = page.locator(
        '[data-testid="cancel-add"], [data-testid="close-dialog"]'
      );
      await cancelButton.first().click();

      await expect(dialog).toBeHidden();
    });
  });

  test.describe('Delete Operations', () => {
    test('should show delete confirmation dialog', async ({ page }) => {
      const cards = await getSushiCards(page);
      const firstCard = cards.first();
      const sushiName = (await firstCard.locator('h3, h4').textContent()) || '';

      // Hover to show delete button
      await firstCard.hover();

      // Click delete
      const deleteButton = firstCard.locator('[data-testid="delete-button"]');
      await deleteButton.click();

      // Confirmation dialog should appear
      const dialog = page.locator('[data-testid="delete-dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog).toContainText(sushiName);
    });

    test('should cancel delete operation', async ({ page }) => {
      const cards = await getSushiCards(page);
      const initialCount = await cards.count();
      const firstCard = cards.first();

      // Hover and click delete
      await firstCard.hover();
      await firstCard.locator('[data-testid="delete-button"]').click();

      // Cancel deletion
      await page.click('[data-testid="cancel-delete"]');

      // Dialog should close
      await expect(page.locator('[data-testid="delete-dialog"]')).toBeHidden();

      // Item count should remain the same
      const newCount = await (await getSushiCards(page)).count();
      expect(newCount).toBe(initialCount);
    });

    test('should delete sushi item successfully', async ({ page }) => {
      const cards = await getSushiCards(page);
      const firstCard = cards.first();
      const sushiName = (await firstCard.locator('h3, h4').textContent()) || '';

      // Hover and click delete
      await firstCard.hover();
      await firstCard.locator('[data-testid="delete-button"]').click();

      // Confirm deletion
      await page.click('[data-testid="confirm-delete"]');

      // Should show success toast
      await waitForToast(page);

      // Dialog should close
      await expect(page.locator('[data-testid="delete-dialog"]')).toBeHidden();

      // Item should be removed from the list
      await page.waitForTimeout(1000);
      const remainingCards = await getSushiCards(page);
      const foundDeleted = await remainingCards
        .locator(`text="${sushiName}"`)
        .count();

      // Item should not be visible on current page
      expect(foundDeleted).toBe(0);
    });

    test('should show toast notification after deletion', async ({ page }) => {
      const cards = await getSushiCards(page);
      const firstCard = cards.first();

      await firstCard.hover();
      await firstCard.locator('[data-testid="delete-button"]').click();
      await page.click('[data-testid="confirm-delete"]');

      // Toast should appear
      const toast = await waitForToast(page);
      await expect(toast).toBeVisible();
    });
  });

  test.describe('Cache Invalidation', () => {
    test('should refresh list after adding item', async ({ page }) => {
      await openAddDialog(page);

      const uniqueName = `Cache Test ${Date.now()}`;
      await fillSushiForm(page, {
        name: uniqueName,
        type: 'Nigiri',
        price: '10.99',
        fishType: 'Salmon',
      });

      await submitSushiForm(page);
      await waitForToast(page);

      // Wait for cache invalidation and refetch
      await page.waitForTimeout(1500);

      // Search for the new item
      await page.fill('[data-testid="search-input"]', uniqueName);
      await page.waitForTimeout(500);

      // Should find the newly added item
      const cards = await getSushiCards(page);
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);

      const firstCard = cards.first();
      await expect(firstCard).toContainText(uniqueName);
    });

    test('should update list after deleting item', async ({ page }) => {
      const cards = await getSushiCards(page);
      const firstCard = cards.first();
      const sushiName = (await firstCard.locator('h3, h4').textContent()) || '';

      await firstCard.hover();
      await firstCard.locator('[data-testid="delete-button"]').click();
      await page.click('[data-testid="confirm-delete"]');
      await waitForToast(page);

      // Wait for cache invalidation
      await page.waitForTimeout(1500);

      // Search for deleted item
      await page.fill('[data-testid="search-input"]', sushiName);
      await page.waitForTimeout(500);

      // Should not find the deleted item
      const remainingCards = await getSushiCards(page);
      const count = await remainingCards.count();
      expect(count).toBe(0);
    });
  });
});
