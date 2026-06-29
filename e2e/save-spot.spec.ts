import { test, expect } from '@playwright/test';

test('Nutzer kann einen Spot zu den Favoriten hinzufügen', async ({ page }) => {
  // Arrange
  const spotName = `E2E Spot ${test.info().project.name} ${Date.now()}`;

  await page.goto('/add');

  await page.getByPlaceholder('Name').fill(spotName);
  await page.getByRole('button', { name: 'Speichern' }).click();

  await expect(page).toHaveURL(/\/spots\?highlight=/);

  const spotCard = page.getByRole('link', {
    name: new RegExp(spotName),
  });

  await expect(spotCard).toHaveCount(1);

  // Act
  await spotCard.getByRole('button', { name: 'Zu Favoriten hinzufügen' }).click();

  await expect(
    spotCard.getByRole('button', {
      name: 'Aus Favoriten entfernen',
    })
  ).toBeVisible();

  await page.getByRole('button', { name: /Menü|Navigation öffnen/i }).click();

  const drawer = page.getByRole('dialog').filter({ hasText: 'Favoriten' });

  await expect(drawer).toBeVisible();

  await drawer.getByRole('link', { name: 'Favoriten', exact: true }).click();

  // Assert
  await expect(page).toHaveURL(/\/favorites/);

  await expect(page.getByText(spotName, { exact: true })).toBeVisible({
    timeout: 10_000,
  });
});
