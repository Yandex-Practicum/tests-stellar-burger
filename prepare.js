import fs from 'fs';
import { acquireAccount } from './src/utils.js';

(async () => {
  const users = await Promise.all([
    acquireAccount(),
    acquireAccount(),
  ]);
  fs.writeFileSync('./users.json', JSON.stringify(users));
})();

