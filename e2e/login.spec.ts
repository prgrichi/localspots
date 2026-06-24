import { test, expect } from '@playwright/test';

test.use({
  storageState: {
    cookies: [],
    origins: [],
  },
});

test('Nutzer kann sich einloggen', async ({ page }, testInfo) => {
  await page.goto('/login');

  await page.getByLabel('E-Mail').fill('test@test.de');
  await page.getByLabel('Passwort').fill('testtest');
  await page.getByRole('button', { name: /Einloggen/i }).click();

  await expect(page).toHaveURL('/');

  const heading =
    testInfo.project.name === 'mobile' ? 'Neueste Spots' : 'Deine Orte auf einen Blick';

  await expect(page.getByRole('heading', { name: heading })).toBeVisible();
});
