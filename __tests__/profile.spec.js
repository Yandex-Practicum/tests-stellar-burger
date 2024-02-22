import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Страница профиля', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4000/profile');
    await page.waitForTimeout(300);
  });

  test('В панели навигации активна ссылка «Профиль»', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Профиль' })).toHaveCSS('color', 'rgb(242, 242, 243)');
    await expect(page.getByRole('link', { name: 'История заказов' })).not.toHaveCSS('color', 'rgb(242, 242, 243)');
  });

  test('Отображение формы изменения профиля', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('При редактировании данных в форме появляются кнопки «Отменить» и «Сохранить»', async ({ page }) => {
    await page.locator('input[name="name"]').fill(faker.person.firstName());
    await page.locator('input[name="email"]').fill(faker.internet.email());
    await page.locator('input[name="password"]').fill(faker.internet.password({ length: 8 }));
    await expect(page.getByRole('button', { name: 'Отменить' })).not.toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Сохранить' })).not.toHaveCount(0);
  });

  test('При нажатии кнопки «Отмена» значения полей формы возвращаются в состояние до редактирования, а кнопки «Отмена» и «Сохранить» скрываются', async ({ page }) => {
    const name = await page.locator('input[name="name"]').inputValue();
    const email = await page.locator('input[name="email"]').inputValue();
    await page.locator('input[name="name"]').fill(faker.person.firstName());
    await page.locator('input[name="email"]').fill(faker.internet.email());
    await page.locator('input[name="password"]').fill(faker.internet.password({ length: 8 }));
    await page.getByRole('button', { name: 'Отменить' }).click();
    await expect(page.locator('input[name="name"]')).toHaveValue(name);
    await expect(page.locator('input[name="email"]')).toHaveValue(email);
    await expect(page.locator('input[name="password"]')).toHaveValue('');
    await expect(page.getByRole('button', { name: 'Отменить' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Сохранить' })).toHaveCount(0);
  });

  test('Пользователь может изменить свои данные', async ({ page }) => {
    await page.waitForTimeout(3000);
    const newName = faker.person.firstName();
    await page.locator('input[name="name"]').fill(newName);
    await page.getByRole('button', { name: 'Сохранить' }).click();
    expect(page.locator('input[name="name"]')).toHaveValue(newName);
  });
});

