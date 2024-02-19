import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';
import { generateOrders, getRndInteger } from '../src/utils.js';

const BURGER_API_URL = 'https://norma.nomoreparties.space/api';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Страница ленты заказов', () => {
  let genOrders;
  let orders;

  test.beforeAll(async () => {
    genOrders = await generateOrders(5);
  });

  test.beforeEach(async ({ page }) => {
    await page.route(`${BURGER_API_URL}/orders/all`, async route => {
      const response = await route.fetch();
      const json = await response.json();
      genOrders.forEach((item) => json.orders.push(item));
      orders = {
        ...json,
        total: json.total + genOrders.length,
        totalToday: json.totalToday + genOrders.length,
      };

      await route.fulfill({
        response,
        json: orders,
      });
    });
    await page.goto('http://localhost:4000/feed');
    await page.waitForTimeout(3000);
  });

  test('Лента заказов отображает список заказов', async ({ page }) => {
    const count = await page.locator('a[href^="/feed/"]').count();
    await expect(count).toBeGreaterThanOrEqual(orders.orders.length);
    await expect(page.locator('.text_type_digits-large').first()).toContainText(String(orders.total));
    await expect(page.locator('.text_type_digits-large').last()).toContainText(String(orders.totalToday));
  });
});

