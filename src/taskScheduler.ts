import { OAuth2Client } from 'google-auth-library';
import { Queue } from 'bullmq';
import { classifyEmailContext, generateReply } from './emailContext';
import { google } from 'googleapis';

// Initialize BullMQ queue (in-memory for development)
const emailQueue = new Queue('email-processing');


// Function to send email using Gmail API
async function sendEmail(auth: OAuth2Client, recipient: string, subject: string, body: string) {
    const gmail = google.gmail({ version: 'v1', auth });

    try {
        const emailContent = `To: ${recipient}\nSubject: ${subject}\n\n${body}`;
        const encodedMessage = Buffer.from(emailContent)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        await gmail.users.messages.send({
            auth,
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });

        console.log(`Email sent successfully to ${recipient}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

// Function to schedule email processing task
export async function scheduleEmailProcessing(emailText: string, recipient: string, auth: OAuth2Client) {
    try {
        // Example: Classify email context and generate reply
        const classifiedCategory = await classifyEmailContext(emailText);
        const generatedReply = await generateReply(emailText);

        // Example: Send email with categorized label and generated reply
        await sendEmail(auth, recipient, `Re: ${classifiedCategory}`, generatedReply);
    } catch (error) {
        console.error('Error scheduling email processing:', error);
        throw error;
    }
}

// Example usage:
const sampleEmailText = 'Sample email content';
const recipientEmail = 'recipient@example.com';

// Replace with your OAuth2Client instance
const oauth2Client = new OAuth2Client({
    clientId: 'your_client_id',
    clientSecret: 'your_client_secret',
    redirectUri: 'your_redirect_uri',
});

scheduleEmailProcessing(sampleEmailText, recipientEmail, oauth2Client)
  .then(() => console.log('Email processing scheduled successfully'))
  .catch(err => console.error('Error scheduling email processing:', err));

export default emailQueue;
