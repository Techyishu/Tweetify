export const MESSAGES = {
  GENERATING: '🤖 Generating your tweet...',
  GENERATING_THREAD: '🧵 Crafting your thread...',
  ERROR: 'Sorry, I couldn\'t generate the content. Please try again!',
  WELCOME: 'Welcome to the Tweet Generator! 🤖\n\nShare your thoughts with me, and I\'ll create an engaging tweet for you.\n\nCommands:\n/start - Generate a single tweet\n/thread - Generate a thread\n/regenerate - Get a different version',
  TWEET_RESPONSE: (tweet) => `✨ Here's your generated tweet:\n\n${tweet}\n\nSend /start to generate another tweet, /regenerate to get a different version, or /thread to create a thread!`,
  NO_PREVIOUS_THOUGHTS: 'Please share your thoughts first before using /regenerate!',
  THREAD_PROMPT: '📝 What topic would you like the thread to be about?',
  THREAD_INTRO: '🧵 Here\'s your generated thread:',
  THREAD_END: '\nUse /start for a single tweet or /thread for another thread!'
};
