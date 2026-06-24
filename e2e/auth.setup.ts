import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel(/E-Mail/i).fill('test@test.de');
  await page.getByLabel(/Passwort/i).fill('testtest');
  await page.getByRole('button', { name: /Einloggen/i }).click();

  await expect(page).toHaveURL('/');

  await page.context().storageState({
    path: authFile,
  });
});
