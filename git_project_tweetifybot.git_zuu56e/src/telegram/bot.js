import TelegramBot from 'node-telegram-bot-api';
import { getEnvVars } from '../config/env.js';
import { generateTweet, generateThread } from '../services/openai.js';
import { MESSAGES } from './messages.js';

const { TELEGRAM_BOT_TOKEN } = getEnvVars();

// Track users waiting for input
const waitingForThoughts = new Set();
const waitingForThreadTopic = new Set();
let lastUserThoughts = new Map();

export function initBot() {
  const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

  // Handle /start command
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    waitingForThoughts.add(chatId);
    waitingForThreadTopic.delete(chatId);
    
    await bot.sendMessage(chatId, MESSAGES.WELCOME);
  });

  // Handle /regenerate command
  bot.onText(/\/regenerate/, async (msg) => {
    const chatId = msg.chat.id;
    const thoughts = lastUserThoughts.get(chatId);
    
    if (!thoughts) {
      await bot.sendMessage(chatId, MESSAGES.NO_PREVIOUS_THOUGHTS);
      return;
    }

    try {
      await bot.sendMessage(chatId, MESSAGES.GENERATING);
      const tweet = await generateTweet(thoughts);
      await bot.sendMessage(chatId, MESSAGES.TWEET_RESPONSE(tweet));
    } catch (error) {
      await bot.sendMessage(chatId, MESSAGES.ERROR);
    }
  });

  // Handle /thread command
  bot.onText(/\/thread/, async (msg) => {
    const chatId = msg.chat.id;
    waitingForThreadTopic.add(chatId);
    waitingForThoughts.delete(chatId);
    await bot.sendMessage(chatId, MESSAGES.THREAD_PROMPT);
  });

  // Handle user messages
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    
    // Ignore commands
    if (!msg.text || msg.text.startsWith('/')) return;
    
    if (waitingForThreadTopic.has(chatId)) {
      try {
        await bot.sendMessage(chatId, MESSAGES.GENERATING_THREAD);
        const tweets = await generateThread(msg.text);
        waitingForThreadTopic.delete(chatId);
        
        // Send each tweet of the thread
        await bot.sendMessage(chatId, MESSAGES.THREAD_INTRO);
        for (const tweet of tweets) {
          await bot.sendMessage(chatId, tweet);
        }
        await bot.sendMessage(chatId, MESSAGES.THREAD_END);
      } catch (error) {
        await bot.sendMessage(chatId, MESSAGES.ERROR);
      }
      return;
    }
    
    // Handle regular tweet generation
    if (waitingForThoughts.has(chatId)) {
      try {
        lastUserThoughts.set(chatId, msg.text);
        await bot.sendMessage(chatId, MESSAGES.GENERATING);
        const tweet = await generateTweet(msg.text);
        waitingForThoughts.delete(chatId);
        await bot.sendMessage(chatId, MESSAGES.TWEET_RESPONSE(tweet));
      } catch (error) {
        await bot.sendMessage(chatId, MESSAGES.ERROR);
      }
    }
  });

  // Error handling
  bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
  });
}

export async function sendMessage(chatId, text, options = {}) {
  const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);
  return bot.sendMessage(chatId, text, options);
}
