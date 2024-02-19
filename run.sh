#!/bin/bash

echo "УСТАНОВКА ЗАВИСИМОСТЕЙ"
npm i -g wait-port@1.0.4 2>/dev/null
npm ci 2>/dev/null
npm ci --prefix /tmp/tests-stellar-burger 2>/dev/null
npx playwright install --with-deps 2>/dev/null

echo "ЗАПУСК ПРОЕКТА"
# npm run build
cp .env.example .env
npm run start & wait-port -t 30000 localhost:4000

echo "ЗАПУСК ТЕСТОВ"
cd /tmp/tests-stellar-burger || exit
node ./prepare.js
npm run test
