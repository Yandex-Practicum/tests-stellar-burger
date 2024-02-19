import fs from 'fs';
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

const [, user] = JSON.parse(fs.readFileSync('./users.json', 'utf8'));

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Страница авторизации', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4000/login');
    await page.waitForTimeout(300);
  });

  test('Отображение формы авторизации', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Войти' })).toBeVisible();
  });

  test('При нажатии на ссылку «Зарегистрироваться» происходит переход на /register', async ({ page }) => {
    await page.getByRole('link', { name: 'Зарегистрироваться' }).click();
    await page.waitForURL('**/register');
  });

  test('При нажатии на ссылку «Восстановить пароль» происходит переход на /forgot-password', async ({ page }) => {
    await page.getByRole('link', { name: 'Восстановить пароль' }).click();
    await page.waitForURL('**/forgot-password');
  });

  test('Авторизация с невалидными данными', async ({ page }) => {
    await page.locator('input[name="email"]').fill(faker.internet.email());
    await page.locator('input[name="password"]').fill(faker.internet.password({ length: 8 }));
    await page.getByRole('button', { name: 'Войти' }).click();
    await expect(page.getByText('email or password are incorrect')).not.toHaveCount(0);
  });

  test('Авторизация с валидными данными', async ({ page }) => {
    await page.locator('input[name="email"]').fill(user.email);
    await page.locator('input[name="password"]').fill(user.password);
    await page.getByRole('button', { name: 'Войти' }).click();
    await page.waitForURL('**/');
    await expect(page.getByRole('link', { name: user.name })).not.toHaveCount(0);
  });
});

