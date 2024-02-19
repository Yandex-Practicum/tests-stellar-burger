import fs from 'fs';
import { test, expect } from '@playwright/test';

const [, user] = JSON.parse(fs.readFileSync('./users.json', 'utf8'));

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Страница восстановления пароля', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4000/forgot-password');
    await page.waitForTimeout(300);
  });

  test('Отображение формы восстановления пароля', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Восстановить' })).toBeVisible();
  });

  test('При нажатии на ссылку «Войти» происходит переход на /login', async ({ page }) => {
    await page.getByRole('link', { name: 'Войти' }).click();
    await page.waitForURL('**/login');
  });
});

