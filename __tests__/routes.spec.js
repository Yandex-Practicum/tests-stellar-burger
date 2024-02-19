import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Роуты', () => {
  test('Роут /profile недоступен неавторизованным пользователям', async ({ page }) => {
    await page.goto('http://localhost:4000/profile');
    await page.waitForURL('**/login');
  });

  test('Роут /profile/orders недоступен неавторизованным пользователям', async ({ page }) => {
    await page.goto('http://localhost:4000/profile/orders');
    await page.waitForURL('**/login');
  });

  test('Роут /profile/orders/:number недоступен неавторизованным пользователям', async ({ page }) => {
    await page.goto('http://localhost:4000/profile/orders/1');
    await page.waitForURL('**/');
  });
});

