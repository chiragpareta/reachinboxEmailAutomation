import OpenAI from 'openai';
import dotenv from 'dotenv';

const apiKey = 'sk-proj-uV0uyEKgCNIJsqPnjcIHT3BlbkFJfHzYLeQc6DVim4NfJ6J4';



const openai = new OpenAI({
  apiKey: apiKey,
});

/**
 * Classify email context based on its content.
 */
export async function classifyEmailContext(emailText: string): Promise<string> {
  try {
    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt: `Classify the following email content into categories: Interested, Not Interested, More information. Email content: ${emailText}`,
      max_tokens: 50,
    });
    return response.choices[0].text.trim();
  } catch (error) {
    console.error('Error classifying email context:', error);
    throw error;
  }
}

/**
 * Generate an automated reply based on email context.
 */
export async function generateReply(emailText: string): Promise<string> {
  try {
    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt: `Generate an appropriate response for the following email content: ${emailText}`,
      max_tokens: 150,
    });
    return response.choices[0].text.trim();
  } catch (error) {
    console.error('Error generating reply:', error);
    throw error;
  }
}
