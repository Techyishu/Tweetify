import OpenAI from 'openai';
import { getEnvVars } from './config/env.js';

const { OPENAI_API_KEY } = getEnvVars();

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

export async function generateTweet(thoughts) {
  try {
    const prompt = `Generate a casual and engaging tweet that feels natural and easy to understand.

Topic/Context: ${thoughts}

Requirements:
	•	Write in simple, everyday language.
	•	Start with a hook or an interesting idea.
	•	End with a question or call-to-action to get people talking.
	•	Keep it under 300 characters.
	•	Make it relatable and honest.
	•	Use emojis only if they fit (max 2-3).

Focus on creating a tweet that starts a fun or thoughtful conversation.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo",
      max_tokens: 400,
      temperature: 0.85
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate tweet');
  }
}

export async function generateThread(topic, numTweets = 5) {
  try {
    const prompt = `Generate an engaging Twitter thread about: ${topic}

Requirements:
• Create ${numTweets} connected tweets that tell a cohesive story
• First tweet should hook readers
• Each tweet should be under 280 characters
• Use simple, conversational language
• Include relevant emojis naturally (1-2 per tweet)
• End with a call-to-action or thought-provoking question
• Make it informative yet engaging
• Number each tweet (1/x format)

Format each tweet on a new line with the tweet number.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo",
      max_tokens: 1000,
      temperature: 0.85
    });

    return completion.choices[0].message.content.split('\n').filter(tweet => tweet.trim());
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate thread');
  }
}
