import fs from 'fs';
import fetch from 'node-fetch';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

const BURGER_API_URL = 'https://norma.nomoreparties.space/api';

const acquireAccount = async () => {
  const name = faker.person.firstName();
  const email = faker.internet.email();
  const password = faker.internet.password({ length: 8 });

  const response = await fetch(`${BURGER_API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error('Ошибка при регистрации во время подготовки к тестам');
  }

  const res = await response.json();

  return {
    name,
    email,
    password,
  };
};

const generateOrders = async (count) => {
  const response = await fetch(`${BURGER_API_URL}/ingredients`);
  const res = await response.json();
  const buns = res.data.filter(({type}) => type === 'bun');
  const sauces = res.data.filter(({type}) => type === 'sauce');
  const main = res.data.filter(({type}) => type === 'main');

  return Array.from({ length: count }, (v, i) => {
    const bun = buns[getRndInteger(0, buns.length)];
    const sauce = sauces[getRndInteger(0, sauces.length)];
    const mainItem = main[getRndInteger(0, main.length)];
    const date = (new Date()).toISOString();
    return {
      _id: uuidv4(),
      ingredients: [
        bun._id,
        mainItem._id,
        sauce._id,
        bun._id,
      ],
      status: "done",
      name: "Тестовый заказ",
      createdAt: date,
      updatedAt: date,
      number: getRndInteger(100000, 999999)
    };
  });
};

const getRndInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min) ) + min;
};

export {
  acquireAccount,
  getRndInteger,
  generateOrders,
};
