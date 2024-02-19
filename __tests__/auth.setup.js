import fs from 'fs';
import { test as setup } from '@playwright/test';

const BURGER_API_URL = 'https://norma.nomoreparties.space/api';
const authFile = 'playwright/.auth/user.json';
const [user] = JSON.parse(fs.readFileSync('./users.json', 'utf8'));

setup('Авторизация', async ({ page, request }) => {
  const response = await request.post(`${BURGER_API_URL}/auth/login`, {
    data: {
      email: user.email,
      password: user.password,
    },
  });
  const res = await response.json();
  await page.goto('http://localhost:4000');
  await page.context().addCookies([{ name: 'accessToken', value: res.accessToken, domain: 'localhost', path: '/' }]);

  await page.evaluate((token) => {
    localStorage.setItem('refreshToken', token);
  }, res.refreshToken);
  await page.context().storageState({ path: authFile });
});