import { test, expect } from '@playwright/test';

const BURGER_API_URL = 'https://norma.nomoreparties.space/api';

test.describe('Страница оформления заказа авторизованным пользователем', () => {
  let buns;
  let sauces;
  let main;

  test.beforeAll(async ({ request }) => {
    const response = await request.get(`${BURGER_API_URL}/ingredients`);
    const res = await response.json();
    buns = res.data.filter(({type}) => type === 'bun');
    sauces = res.data.filter(({type}) => type === 'sauce');
    main = res.data.filter(({type}) => type === 'main');
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4000/');
    await page.waitForTimeout(300);
  });

  test('При клике по ингредиенту происходит переход на маршрут /ingredients/:id', async ({ page }) => {
    const ingredient = await page.locator('a[href^="/ingredients/"]').first();
    const href = await ingredient.getAttribute('href');
    const id = href.split('/').pop();
    await ingredient.click();
    await page.waitForURL(`**/ingredients/${id}`);
  });

  test('При клике по ингредиенту открывается модальное окно с описанием ингредиента', async ({ page }) => {
    await page.locator('a[href^="/ingredients/"]').first().click();
    await page.waitForSelector('#modals img');
    const modalText = await page.locator('#modals').first().textContent();
    expect(modalText).toMatch(/Калории/);
    expect(modalText).toMatch(/Белки/);
    expect(modalText).toMatch(/Жиры/);
    expect(modalText).toMatch(/Углеводы/);
  });

//   test('При прямом переходе по маршруту /ingredients/:id открывается страница с информацией об ингредиенте', async ({ page }) => {
//     const ingredient = await page.locator('a[href^="/ingredients/"]').first();
//     const href = await ingredient.getAttribute('href');
//     await page.goto(`http://localhost:4000/${href}`);
//     await page.waitForSelector('#modals img');
//     const modalText = await page.locator('#modals').first().textContent();
//     expect(modalText).toMatch(/Калории/);
//     expect(modalText).toMatch(/Белки/);
//     expect(modalText).toMatch(/Жиры/);
//     expect(modalText).toMatch(/Углеводы/);
//   });

  test('Ингредиенты добавляются в конструктор', async ({ page }) => {
    const [bunItem] = buns;
    const [sauceItem] = sauces;
    const [mainItem] = main;
    
    await page.locator(`a[href="/ingredients/${bunItem._id}"] + button`).click();
    await page.locator(`a[href="/ingredients/${sauceItem._id}"] + button`).click();
    await page.locator(`a[href="/ingredients/${mainItem._id}"] + button`).click();
    await expect(page.locator('.constructor-element').first()).toContainText(bunItem.name);
    await expect(page.locator('.constructor-element').last()).toContainText(bunItem.name);
    await expect(page.locator('.constructor-element').nth(1)).toContainText(sauceItem.name);
    await expect(page.locator('.constructor-element').nth(2)).toContainText(mainItem.name);
  });

  test('Считается общая стоимость добавленных ингредиентов', async ({ page }) => {
    const [bunItem] = buns;
    const [sauceItem] = sauces;
    const [mainItem] = main;
    await page.locator(`a[href="/ingredients/${bunItem._id}"] + button`).click();
    await page.locator(`a[href="/ingredients/${sauceItem._id}"] + button`).click();
    await page.locator(`a[href="/ingredients/${mainItem._id}"] + button`).click();
    const total = bunItem.price * 2 + sauceItem.price + mainItem.price;
    await expect(page.locator('body')).toContainText(String(total));
  });

  // test('Оформление заказа', async ({ page }) => {
  //   test.slow();
  //   const responsePromise = page.waitForResponse(response =>
  //     response.url().includes('/orders') && response.status() === 200,
  //   { timeout: 0 });
  //   const [bunItem] = buns;
  //   const [sauceItem] = sauces;
  //   const [mainItem] = main;
  //   await page.locator(`a[href="/ingredients/${bunItem._id}"] + button`).click();
  //   await page.locator(`a[href="/ingredients/${sauceItem._id}"] + button`).click();
  //   await page.locator(`a[href="/ingredients/${mainItem._id}"] + button`).click();
  //   await page.getByRole('button', { name: 'Оформить заказ' }).click();
  //   const response = await responsePromise;
  //   const res = await response.json();
  //   await page.waitForSelector('#modals img');
  //   await expect(page.locator('#modals')).toContainText(String(res.order.number));
  // });
});

