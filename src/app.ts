// src/app.ts

import { createOAuthClient, getAuthUrl, getToken, loadToken, setCredentials } from './googleAuth';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import OpenAI from 'openai';
import fs from 'fs';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = 'token.json';

interface EmailData {
  emailText: string;
  recipient: string;
  auth: OAuth2Client;
}

// Function to send email using Gmail API.
async function sendEmail(auth: OAuth2Client, recipient: string, subject: string, body: string) {
  const gmail = google.gmail({ version: 'v1', auth });
  const emailContent = `To: ${recipient}\nSubject: ${subject}\n\n${body}`;
  const encodedMessage = Buffer.from(emailContent).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  await gmail.users.messages.send({
    auth,
    userId: 'me',
    requestBody: { raw: encodedMessage },
  });
}

// Initialize OpenAI client.
const apiKey = 'sk-proj-uV0uyEKgCNIJsqPnjcIHT3BlbkFJfHzYLeQc6DVim4NfJ6J4';
if (!apiKey) {
  throw new Error("The OPENAI_API_KEY environment variable is missing or empty");
}
const openai = new OpenAI({ apiKey });

// Function to classify email context.
async function classifyEmailContext(emailText: string): Promise<string> {
  try {
    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo',
      prompt: `Classify the email: ${emailText}`,
      max_tokens: 60,
    });

    return response.choices[0].text.trim();
  } catch (error) {
    console.error('Error classifying email context:', error);
    throw error;
  }
}

// Function to generate a reply to the email.
async function generateReply(emailText: string): Promise<string> {
  try {
    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo',
      prompt: `Generate a reply to the email: ${emailText}`,
      max_tokens: 150,
    });

    return response.choices[0].text.trim();
  } catch (error) {
    console.error('Error generating reply:', error);
    throw error;
  }
}

// Function to schedule email processing task.
async function scheduleEmailProcessing(emailText: string, recipient: string, auth: OAuth2Client) {
  try {
    const classifiedCategory = await classifyEmailContext(emailText);
    const generatedReply = await generateReply(emailText);

    await sendEmail(auth, recipient, `Re: ${classifiedCategory}`, generatedReply);
  } catch (error) {
    console.error('Error scheduling email processing:', error);
    throw error;
  }
}

// Main function to initialize the OAuth client and process an email.
async function main() {
  const oAuth2Client = createOAuthClient();
  const tokens = loadToken();

  if (tokens) {
    setCredentials(oAuth2Client, tokens);
  } else {
    const authUrl = getAuthUrl(oAuth2Client);
    console.log('Authorize this app by visiting this url:', authUrl);
    // After getting the code from the URL, call getToken with the code
    // Example: await getToken(oAuth2Client, 'AUTH_CODE_HERE');
  }

  // Example usage
  const emailText = "Your email content here";
  const recipient = "chiragpareta9460@gmail.com";
  await scheduleEmailProcessing(emailText, recipient, oAuth2Client);
}

main().catch(console.error);
