import { test, expect } from '@playwright/test';

test('Nutzer kann einen Spot bearbeiten', async ({ page }) => {
  const originalName = `E2E Spot ${Date.now()}`;
  const updatedName = `${originalName} bearbeitet`;

  // Arrange: Spot anlegen
  await page.goto('/add');

  await page.getByPlaceholder('Name').fill(originalName);
  await page.getByRole('button', { name: 'Speichern' }).click();

  await expect(page.getByText(originalName)).toBeVisible({
    timeout: 10_000,
  });

  // Act: Spot öffnen und bearbeiten
  await page.getByText(originalName).click();

  await page.getByRole('button', { name: 'Spot bearbeiten' }).click();

  const nameInput = page.getByPlaceholder('Name');
  await nameInput.fill(updatedName);

  await page.getByRole('button', { name: /Speichern/i }).click();

  // Assert
  await expect(page.getByText(updatedName)).toBeVisible();
  await expect(page.getByText(originalName, { exact: true })).not.toBeVisible();
});
