import { test, expect } from '@playwright/test';

const BURGER_API_URL = 'https://norma.nomoreparties.space/api';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Страница с информацией об ингредиенте', () => {
  let ingredient;

  test.beforeAll(async ({ request }) => {
    const response = await request.get(`${BURGER_API_URL}/ingredients`);
    const res = await response.json();
    ingredient = res.data[0];
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:4000/ingredients/${ingredient._id}`);
    await page.waitForTimeout(300);
  });

  test('При прямом переходе по маршруту /ingredients/:id открывается страница с информацией об ингредиенте', async ({ page }) => {
    await expect(page.locator('text=Детали ингредиента')).toBeVisible();
    await expect(page.locator(`text=${ingredient.name}`)).toBeVisible();
    await expect(page.locator(`text=/Калории/`)).toBeVisible();
    await expect(page.locator(`text=/Белки/`)).toBeVisible();
    await expect(page.locator(`text=/Жиры/`)).toBeVisible();
    await expect(page.locator(`text=/Углеводы/`)).toBeVisible();
  });
});

