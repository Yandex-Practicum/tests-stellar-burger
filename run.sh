#!/bin/bash

npm i -g wait-port@1.0.4
npm ci
npm ci --prefix /tmp/tests-stellar-burger
npx playwright install --with-deps

# npm run build
cp .env.example .env
npm run start & wait-port -t 30000 localhost:4000
cd /tmp/tests-stellar-burger || exit
node ./prepare.js
npm run test
