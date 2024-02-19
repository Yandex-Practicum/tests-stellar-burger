#!/bin/bash

echo "УСТАНОВКА ЗАВИСИМОСТЕЙ"
npm i -g wait-port@1.0.4 > /dev/null
npm ci > /dev/null
npm ci --prefix /tmp/tests-stellar-burger > /dev/null
npx playwright install --with-deps > /dev/null

echo "ЗАПУСК ПРОЕКТА"
# npm run build
cp .env.example .env
npm run start & wait-port -t 30000 localhost:4000

echo "ЗАПУСК ТЕСТОВ"
cd /tmp/tests-stellar-burger || exit
node ./prepare.js
npm run test
