import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Страница регистрации', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4000/register');
    await page.waitForTimeout(300);
  });

  test('Отображение формы регистрации', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Зарегистрироваться' })).toBeVisible();
  });

  test('При нажатии на ссылку «Войти» происходит переход на /login', async ({ page }) => {
    await page.getByRole('link', { name: 'Войти' }).click();
    await page.waitForURL('**/login');
  });

  test('Регистрация с невалидными данными не регистрирует пользователя', async ({ page }) => {
    await page.locator('input[name="email"]').fill('notanemail');
    await page.locator('input[name="password"]').fill(faker.internet.password({ length: 8 }));
    await page.locator('input[name="name"]').fill(faker.person.firstName());
    await page.getByRole('button', { name: 'Зарегистрироваться' }).click();
    await page.waitForTimeout(300);
    await expect(page.getByRole('button', { name: 'Зарегистрироваться' })).toBeVisible();
  });
  
  test('Регистрация с валидными данными', async ({ page }) => {
    const name = faker.person.firstName();
    await page.locator('input[name="email"]').fill(faker.internet.email());
    await page.locator('input[name="password"]').fill(faker.internet.password({ length: 8 }));
    await page.locator('input[name="name"]').fill(name);
    await page.getByRole('button', { name: 'Зарегистрироваться' }).click();
    await page.waitForURL('**/');
    await expect(page.getByRole('link', { name })).not.toHaveCount(0);
  });
});