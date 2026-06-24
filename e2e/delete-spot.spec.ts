import { test, expect } from '@playwright/test';

test('Nutzer kann einen Spot löschen', async ({ page }) => {
  const originalName = `E2E Spot ${Date.now()}`;

  // Arrange: Spot anlegen
  await page.goto('/add');

  await page.getByPlaceholder('Name').fill(originalName);
  await page.getByRole('button', { name: 'Speichern' }).click();

  await expect(page.getByText(originalName)).toBeVisible({
    timeout: 10_000,
  });

  // Act: Spot öffnen und bearbeiten
  await page.getByText(originalName, { exact: true }).click();

  await page.getByRole('button', { name: 'Spot bearbeiten' }).click();

  await page.getByRole('button', { name: 'Spot löschen' }).click();

  const deleteDialog = page
    .getByRole('dialog')
    .filter({ hasText: `Möchtest du "${originalName}" wirklich löschen?` });

  await expect(deleteDialog).toBeVisible();

  await deleteDialog.getByRole('button', { name: 'Löschen', exact: true }).click();

  // Assert
  await expect(page.getByText(originalName, { exact: true })).not.toBeVisible();
});
