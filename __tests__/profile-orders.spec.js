import { test, expect } from '@playwright/test';

test.describe('Страница истории заказов', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4000/profile/orders');
    await page.waitForTimeout(300);
  });

  test('В панели навигации активна ссылка «История заказов»', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'История заказов' })).toHaveCSS('color', 'rgb(242, 242, 243)');
    await expect(page.getByRole('link', { name: 'Профиль' })).not.toHaveCSS('color', 'rgb(242, 242, 243)');
  });
});

