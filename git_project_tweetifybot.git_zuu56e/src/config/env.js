import { config } from 'dotenv';

config();

const requiredEnvVars = [
  'TELEGRAM_BOT_TOKEN',
  'OPENAI_API_KEY'
];

function validateEnv() {
  const missingVars = requiredEnvVars.filter(
    varName => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
}

export function getEnvVars() {
  validateEnv();
  return {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
  };
}
