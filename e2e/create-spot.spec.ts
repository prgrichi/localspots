import { test, expect } from '@playwright/test';

test('Nutzer kann einen Spot erstellen', async ({ page }) => {
  const spotName = `E2E Spot ${Date.now()}`;

  await page.goto('/add');

  await page.getByPlaceholder('Name').fill(spotName);
  await page.getByPlaceholder('Beschreibung').fill('Dieser Spot wurde durch Playwright erstellt.');

  await page.getByRole('button', { name: 'Speichern' }).click();

  await expect(page).toHaveURL(/\/spots\?highlight=/);

  await expect(page.getByText(spotName)).toBeVisible({
    timeout: 10_000,
  });
});
