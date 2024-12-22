import { getEnvVars } from './config/env.js';
import { initBot } from './bot.js';

try {
  getEnvVars();
  initBot();
  console.log('Tweet Generator Bot is running...');
} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', error.message);
  process.exit(1);
}
